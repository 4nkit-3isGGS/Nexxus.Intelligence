/**
 * googleDriveService.js
 * 
 * Dynamic loader and integration for Google Picker API and Google Identity Services (GIS).
 * Allows law enforcement officers to browse and import case documents directly from Google Drive.
 */

const GOOGLE_API_SCRIPT_URL = 'https://apis.google.com/js/api.js';
const GOOGLE_GSI_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

// Load credentials from Vite environment variables
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

// Document MIME types allowed for criminal intelligence ingestion
export const ALLOWED_DRIVE_MIME_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/json',
  'text/markdown',
  'text/csv',
  'application/vnd.google-apps.document' // Google Docs (auto-exported as text/plain)
].join(',');

let scriptsLoadingPromise = null;
let pickerApiLoaded = false;

/**
 * Dynamically injects an external script tag if not already present.
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Ensures both Google API (gapi) and Google Identity Services (GIS) are loaded.
 */
export async function loadGoogleScripts() {
  if (scriptsLoadingPromise) {
    return scriptsLoadingPromise;
  }

  scriptsLoadingPromise = Promise.all([
    loadScript(GOOGLE_API_SCRIPT_URL),
    loadScript(GOOGLE_GSI_SCRIPT_URL)
  ]).then(() => {
    return new Promise((resolve, reject) => {
      if (!window.gapi) {
        reject(new Error('Google API (gapi) failed to initialize.'));
        return;
      }
      window.gapi.load('picker', {
        callback: () => {
          pickerApiLoaded = true;
          resolve();
        },
        onerror: () => {
          reject(new Error('Failed to load Google Picker component.'));
        }
      });
    });
  }).catch((err) => {
    scriptsLoadingPromise = null; // reset to allow retry
    throw err;
  });

  return scriptsLoadingPromise;
}

/**
 * Checks whether Google Drive credentials are configured in the environment.
 */
export function isGoogleDriveConfigured() {
  return Boolean(CLIENT_ID && CLIENT_ID.trim() && API_KEY && API_KEY.trim());
}

/**
 * Launches the Google Drive Document Picker.
 * 
 * @param {Object} options
 * @param {Function} options.onFilePicked - Callback when a File is successfully fetched: (file: File) => void
 * @param {Function} options.onError - Callback on error: (err: Error) => void
 * @param {Function} options.onCancel - Callback when user cancels: () => void
 * @param {Function} options.onStatusChange - Status notification callback: (status: string) => void
 */
export async function openGoogleDrivePicker({
  onFilePicked,
  onError,
  onCancel,
  onStatusChange
}) {
  if (!isGoogleDriveConfigured()) {
    const error = new Error('CREDENTIALS_MISSING');
    error.code = 'CREDENTIALS_MISSING';
    error.message = 'Google Drive API credentials not configured. Please set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY in frontend/.env.';
    onError?.(error);
    return;
  }

  try {
    onStatusChange?.('Loading Google Drive service...');
    await loadGoogleScripts();

    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google Identity Services client is not available.');
    }

    onStatusChange?.('Requesting Google Drive authorization...');

    // Initialize GIS Token Client
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file',
      error_callback: (error) => {
        onStatusChange?.('');
        if (error.type === 'popup_closed') {
          onCancel?.();
        } else {
          onError?.(new Error(error.message || 'Google authentication was cancelled or encountered an error.'));
        }
      },
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          onStatusChange?.('');
          onError?.(new Error(tokenResponse.error_description || tokenResponse.error));
          return;
        }

        const accessToken = tokenResponse.access_token;
        onStatusChange?.('Opening Google Drive document picker...');

        try {
          createAndShowPicker(accessToken, { onFilePicked, onError, onCancel, onStatusChange });
        } catch (err) {
          onStatusChange?.('');
          onError?.(err);
        }
      }
    });

    // Request Access Token via GIS popup
    tokenClient.requestAccessToken({ prompt: '' });

  } catch (err) {
    onStatusChange?.('');
    onError?.(err);
  }
}

/**
 * Builds and displays the Google Picker modal dialog restricted to case documents.
 */
function createAndShowPicker(accessToken, { onFilePicked, onError, onCancel, onStatusChange }) {
  if (!window.google?.picker) {
    throw new Error('Google Picker library is not loaded.');
  }

  // Restrict to document files
  const docsView = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
    .setMimeTypes(ALLOWED_DRIVE_MIME_TYPES)
    .setMode(window.google.picker.DocsViewMode.LIST)
    .setIncludeFolders(true);

  const picker = new window.google.picker.PickerBuilder()
    .addView(docsView)
    .setOAuthToken(accessToken)
    .setDeveloperKey(API_KEY)
    .setTitle('Select Case Document / FIR / Evidence')
    .setCallback(async (data) => {
      const action = data[window.google.picker.Response.ACTION];
      
      if (action === window.google.picker.Action.CANCEL) {
        onStatusChange?.('');
        onCancel?.();
        return;
      }

      if (action === window.google.picker.Action.PICKED) {
        const documents = data[window.google.picker.Response.DOCUMENTS];
        if (!documents || documents.length === 0) {
          onStatusChange?.('');
          return;
        }

        const doc = documents[0];
        const fileId = doc[window.google.picker.Document.ID];
        let fileName = doc[window.google.picker.Document.NAME] || 'google_drive_document.txt';
        const mimeType = doc[window.google.picker.Document.MIME_TYPE] || 'text/plain';

        onStatusChange?.(`Downloading "${fileName}" from Google Drive...`);

        try {
          // Check if it's a native Google Doc (export as text/plain) or standard uploaded file (alt=media)
          const isGoogleDoc = mimeType === 'application/vnd.google-apps.document';
          const downloadUrl = isGoogleDoc
            ? `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`
            : `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

          if (isGoogleDoc && !fileName.endsWith('.txt')) {
            fileName = `${fileName}.txt`;
          }

          const response = await fetch(downloadUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          if (!response.ok) {
            throw new Error(`Google Drive download failed (HTTP ${response.status}): ${response.statusText}`);
          }

          const blob = await response.blob();
          const targetMime = isGoogleDoc ? 'text/plain' : (mimeType || 'application/octet-stream');
          const file = new File([blob], fileName, { type: targetMime });

          onStatusChange?.('');
          onFilePicked?.(file);
        } catch (fetchErr) {
          onStatusChange?.('');
          onError?.(new Error(`Failed to fetch document from Google Drive: ${fetchErr.message}`));
        }
      }
    })
    .build();

  picker.setVisible(true);
}
