import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';
import { openGoogleDrivePicker, isGoogleDriveConfigured, loadGoogleScripts } from '../services/googleDriveService';
import { useToast } from '../context/ToastContext';

const PIPELINE_STAGES = [
  {
    step: 1,
    key: 'READ',
    label: '1. READ',
    sublabel: 'Document Text',
    title: 'Reading & Normalizing Document Text...',
    subtitle: 'Parsing raw evidentiary text, OCR sanitization, and character encoding validation',
  },
  {
    step: 2,
    key: 'HASH',
    label: '2. HASH',
    sublabel: 'BSA §65B SHA-256',
    title: 'Generating BSA §65B SHA-256 Tamper-Proof Cryptographic Hash...',
    subtitle: 'Computing cryptographic evidence certificate and logging immutable audit ledger',
  },
  {
    step: 3,
    key: 'EXTRACT',
    label: '3. EXTRACT',
    sublabel: 'Entities & Edges',
    title: 'Extracting Case Entities & Deduplicating Intelligence Nodes...',
    subtitle: 'Executing NLP entity recognition, phone/vehicle parsing, and resolving identity links',
  },
  {
    step: 4,
    key: 'INGEST',
    label: '4. INGEST',
    sublabel: 'Knowledge Graph',
    title: 'Committing Graph Topology & Ingesting into Knowledge Graph...',
    subtitle: 'Persisting network graph nodes, relational edges, and spatial-temporal associations',
  }
];

export default function IngestModal({ isOpen, onClose, onIngestSuccess }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [driveNotice, setDriveNotice] = useState(null);
  const [driveLoading, setDriveLoading] = useState(false);
  // Compact credential-missing tooltip (replaces the intrusive amber banner)
  const [driveMissingCreds, setDriveMissingCreds] = useState(false);
  const fileInputRef = useRef(null);
  const stageTimersRef = useRef([]);

  const clearStageTimers = () => {
    stageTimersRef.current.forEach((t) => clearTimeout(t));
    stageTimersRef.current = [];
  };

  useEffect(() => {
    return () => clearStageTimers();
  }, []);

  // Dynamically load Google Picker and GIS scripts on mount if not already loaded
  useEffect(() => {
    if (!window.google?.accounts?.oauth2 || !window.gapi) {
      loadGoogleScripts().catch(() => {});
    }
  }, []);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setError(null);
      setResult(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);
      setResult(null);
    }
  };

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBrowseGoogleDrive = () => {
    if (!isGoogleDriveConfigured()) {
      // Show compact credential badge & dismissible warning toast
      setDriveMissingCreds(true);
      toast?.warning?.('Google Drive', 'Google Drive API credentials not configured.');
      setTimeout(() => setDriveMissingCreds(false), 3500);
      return;
    }

    setDriveNotice(null);
    setDriveMissingCreds(false);
    setError(null);
    setDriveLoading(true);

    openGoogleDrivePicker({
      onFilePicked: (file) => {
        setDriveLoading(false);
        setDriveNotice(null);
        // Stage file only — activates "Upload Case Evidence" button
        setSelectedFile(file);
        setError(null);
        setResult(null);
      },
      onError: (err) => {
        setDriveLoading(false);
        if (err.code === 'CREDENTIALS_MISSING') {
          setDriveMissingCreds(true);
          toast?.warning?.('Google Drive', 'Google Drive API credentials not configured.');
          setTimeout(() => setDriveMissingCreds(false), 3500);
        } else {
          setError(`Google Drive error: ${err.message}`);
        }
      },
      onCancel: () => {
        setDriveLoading(false);
        setDriveNotice(null);
      },
      onStatusChange: (status) => {
        setDriveNotice(status ? { type: 'info', message: status } : null);
      }
    });
  };

  const handleUpload = async (fileToUpload) => {
    const file = fileToUpload || selectedFile;
    if (!file) {
      triggerFilePicker();
      return;
    }

    setLoading(true);
    setPipelineStage(1);
    setError(null);
    setResult(null);
    clearStageTimers();

    // Dynamically advance through pipeline stages to visually mirror real processing
    stageTimersRef.current.push(setTimeout(() => setPipelineStage(2), 650));
    stageTimersRef.current.push(setTimeout(() => setPipelineStage(3), 1400));
    stageTimersRef.current.push(setTimeout(() => setPipelineStage(4), 2300));

    try {
      const res = await apiService.uploadDocument(file);
      clearStageTimers();
      if (res.success && res.data) {
        setPipelineStage(4);
        setResult(res.data);
        if (onIngestSuccess) {
          onIngestSuccess();
        }
      } else {
        setError(res.error || 'Document ingestion failed');
      }
    } catch (e) {
      clearStageTimers();
      setError(e.message || 'An unexpected error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  // Quick helper for loading built-in FIR sample files
  // Selection-only: stages the file without triggering upload
  const handleLoadSampleFIR = (firNum) => {
    let sampleContent = '';
    if (firNum === 101) {
      sampleContent = `FIRST INFORMATION REPORT\n\nFIR No: 101/2026\nDate: 12/03/2026\nPolice Station: Bidhannagar (Salt Lake) PS, Kolkata\nDistrict: North 24 Parganas\nComplainant: Manoj Tiwari, S/o Ram Tiwari, R/o Salt Lake Sector V, Kolkata, Mobile: 9434567123\n\nSTATEMENT OF THE COMPLAINANT:\n1. I, Manoj Tiwari, state that I had taken a personal loan of Rs. 2,00,000 from "Shubh Laxmi Finance" in January 2026.\n2. I state that one Rajesh Kumar Sharma, representing himself as a recovery agent of Shubh Laxmi Finance, began calling me repeatedly on my mobile number 9434567123 from his number 9832145678, threatening dire consequences if I did not repay the amount immediately.\n3. I state that on 05/03/2026 I received a large number of such threatening calls from Rajesh Kumar Sharma throughout the day.\n4. I further state that on the same date, Rajesh Kumar Sharma, along with an associate identified as Bimal Das (mobile number 9748123456), came to my residence at Salt Lake Sector V in a white Maruti Swift bearing registration number WB02CD5678 and threatened me in person.\n5. I state that Bimal Das works for Shubh Laxmi Finance as a field collection agent in the Salt Lake area.\n6. I state that under duress, I was forced to transfer Rs. 45,000 from my account to an account bearing number 30123456789, which I later learned belongs to Rajesh Kumar Sharma.\n7. I state that Rajesh Kumar Sharma warned me that further "installments" would need to be transferred in the same manner.\n8. I identify Bimal Das as a known associate of Rajesh Kumar Sharma who frequently accompanies him during collection visits.\n9. I request the police to register a case and take strict action against Rajesh Kumar Sharma and Bimal Das for extortion and criminal intimidation.`;
    } else {
      sampleContent = `FIRST INFORMATION REPORT\n\nFIR No: ${firNum}/2026\nDate: 15/03/2026\nPolice Station: Bidhannagar Cyber PS, Kolkata\nComplainant: Debjani Sen, Mobile: 9007123456\nAccused: Sunita Roy, Bimal Das\nAssociated Phone: 8967234561\nVehicle: WB01EF9988\nOrganization: Shubh Laxmi Finance\n\nExtortion and intimidation case regarding cyber recovery fraud.`;
    }
    const sampleBlob = new Blob([sampleContent], { type: 'text/plain' });
    const sampleFile = new File([sampleBlob], `fir_${firNum}.txt`, { type: 'text/plain' });
    // Stage file only — ingestion fires when user clicks "Upload Case Evidence"
    setSelectedFile(sampleFile);
    setError(null);
    setResult(null);
  };

  const copyHashToClipboard = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const activeStageData = PIPELINE_STAGES.find((s) => s.step === pipelineStage) || PIPELINE_STAGES[0];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in text-slate-900 flex flex-col max-h-[92vh] cursor-default"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".txt,.pdf,.docx,.json,.md,.csv"
          className="hidden"
          id="evidence-file-input"
        />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Upload Case Evidence & Files
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Automated Evidence Extraction & BSA §65B Chain of Custody
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
          {/* Information & Statutory Admissibility Notice */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-[13px]">
                <span className="material-symbols-outlined text-[17px] text-slate-700">policy</span>
                <span>Automated Evidence Intelligence Parser</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold border border-emerald-200">
                BSA §65B Ready
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Upload local FIR records, interrogation transcripts, bank transfer summaries, or CDR logs (.txt, .pdf, .docx, .json). Nexxus automatically parses suspects, phone numbers, vehicle registrations, and money trails, generating a tamper-proof cryptographic audit hash before inserting into the Knowledge Graph.
            </p>
          </div>

          {/* Interactive File Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFilePicker}
            className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-slate-900 bg-slate-100/80 scale-[1.01]'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/40'
                : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/60'
            }`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs transition-colors ${
              selectedFile ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              <span className="material-symbols-outlined text-[24px]">
                {selectedFile ? 'description' : 'upload_file'}
              </span>
            </div>

            {selectedFile ? (
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-slate-900 text-xs truncate max-w-sm">
                  {selectedFile.name}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Click to choose a different file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-slate-800 text-xs">
                  Drag & drop case document here, or <span className="text-slate-900 underline underline-offset-2">browse</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Supported: .txt, .pdf, .docx, .json, .md (Max: 25MB)
                </span>
              </div>
            )}
          </div>

          {/* Quick Upload Source Actions (Local + Google Drive) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={triggerFilePicker}
              disabled={loading || driveLoading}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors cursor-pointer text-xs"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-600">upload_file</span>
              <span>Local File Upload</span>
            </button>
            <button
              type="button"
              id="browse-google-drive-action-btn"
              onClick={handleBrowseGoogleDrive}
              disabled={loading || driveLoading}
              className="relative flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100/70 text-sky-800 font-semibold border border-sky-200/80 transition-colors cursor-pointer text-xs"
              title={driveMissingCreds ? 'Google Drive API credentials not configured' : 'Import case document from Google Drive'}
            >
              <span className="material-symbols-outlined text-[18px] text-sky-600">add_to_drive</span>
              <span>Browse Google Drive</span>
              {driveMissingCreds && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-slate-800 text-white text-[9px] font-mono font-medium whitespace-nowrap shadow-md">
                  Credentials not configured
                </span>
              )}
            </button>
          </div>

          {/* Inline tooltip message if Google Drive clicked without credentials */}
          {driveMissingCreds && (
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 text-xs flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-slate-500">info</span>
                <span className="text-[11px] font-medium">Google Drive API credentials not configured</span>
              </div>
              <button
                type="button"
                onClick={() => setDriveMissingCreds(false)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Google Drive status: info spinner only (no amber warning banner) */}
          {driveNotice && driveNotice.type === 'info' && (
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 flex items-center gap-2.5 animate-pulse">
              <span className="material-symbols-outlined text-[18px] text-sky-600 animate-spin">sync</span>
              <span className="text-xs font-medium">{driveNotice.message}</span>
            </div>
          )}

          {/* Quick Demo Pre-load FIR Buttons */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="font-medium whitespace-nowrap">Sample Evidence:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleLoadSampleFIR(101); }}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200/80 cursor-pointer transition-colors"
                title="Load FIR 101/2026 (Extortion & Threat Visit)"
              >
                FIR_101.txt
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleLoadSampleFIR(102); }}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200/80 cursor-pointer transition-colors"
                title="Load FIR 102/2026 (Debjani Sen Complaint)"
              >
                FIR_102.txt
              </button>
            </div>
          </div>

          {/* Pipeline Stepper Indicators */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {PIPELINE_STAGES.map((s) => {
              const isCurrentActive = loading && pipelineStage === s.step;
              const isCompleted = Boolean(result) || (loading && pipelineStage > s.step);

              let pillStyle = 'bg-slate-50 border-slate-200/80 text-slate-500';
              if (isCurrentActive) {
                pillStyle = 'border-cyan-500 bg-cyan-50 text-cyan-900 font-semibold ring-2 ring-cyan-400/20 shadow-xs animate-pulse';
              } else if (isCompleted) {
                pillStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold shadow-2xs';
              }

              return (
                <div
                  key={s.step}
                  className={`p-2 rounded-xl border text-center transition-all ${pillStyle}`}
                >
                  <div className="text-[10px] font-mono font-bold flex items-center justify-center gap-1">
                    <span>{s.label}</span>
                    {isCompleted && (
                      <span className="material-symbols-outlined text-[12px] text-emerald-600 font-bold leading-none">
                        check
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] truncate">{s.sublabel}</div>
                </div>
              );
            })}
          </div>

          {/* Loading Indicator - Refined Dark Slate Intelligence Theme */}
          {loading && (
            <div className="bg-slate-900 border border-slate-800 shadow-xl rounded-xl p-4 text-slate-100 flex items-center gap-3.5 transition-all animate-fade-in relative overflow-hidden">
              {/* Subtle ambient cyan glow backdrop */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>

              <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-cyan-400 animate-spin w-5 h-5 text-[20px] flex items-center justify-center">
                  progress_activity
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                  <span>{activeStageData?.title || 'Extracting Case Entities & Building Network...'}</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
                </div>
                <div className="text-xs font-mono text-cyan-300/80 mt-1 truncate">
                  {activeStageData?.subtitle || 'Executing NLP parsing, deduplication, and BSA §65B cryptographic hashing'}
                </div>
              </div>
            </div>
          )}

          {/* Success Banner with Evidence Hash and Node Counts */}
          {result && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-emerald-700">verified</span>
                  <span className="font-bold text-xs">Document Uploaded Successfully & Court Certified</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 text-[10px] font-mono font-bold">
                  BSA §65B
                </span>
              </div>

              {/* SHA-256 Hash Display (Masked: showing dots + last 10 digits) */}
              {result.evidence_hash && (
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200/80 flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400">
                      SHA-256 Hash (Section 65B Admissibility Ledger)
                    </span>
                    <span 
                      className="text-[11px] font-mono text-slate-800 truncate select-all tracking-wider"
                      title={`Full SHA-256: ${result.evidence_hash}`}
                    >
                      {'•'.repeat(28)}...{result.evidence_hash.slice(-10)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyHashToClipboard(result.evidence_hash)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 shrink-0 cursor-pointer transition-colors"
                    title="Copy full unmasked SHA-256 Hash"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedHash ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              )}

              {/* Extracted Counts Breakdown */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium shadow-2xs">
                  <strong>{result.node_counts?.persons ?? 0}</strong> Suspects / Persons
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium shadow-2xs">
                  <strong>{result.node_counts?.phones ?? 0}</strong> Phones
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium shadow-2xs">
                  <strong>{result.node_counts?.vehicles ?? 0}</strong> Vehicles
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium shadow-2xs">
                  <strong>{result.node_counts?.organizations ?? 0}</strong> Orgs
                </span>
                <span className="px-2 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 text-[11px] font-medium shadow-2xs">
                  <strong>{result.node_counts?.relationships ?? 0}</strong> Relationships
                </span>
              </div>

              <div className="text-[11px] text-emerald-800 font-medium">
                ✓ Knowledge Graph canvas has been refreshed with new evidence connections.
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-rose-600 shrink-0">error</span>
              <div className="flex flex-col">
                <span className="font-semibold text-xs">Ingestion Error</span>
                <span className="text-[11px] text-rose-700">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
          >
            {result ? 'Done' : 'Cancel'}
          </button>
          <button
            type="button"
            id="upload-case-evidence-btn"
            onClick={() => handleUpload()}
            disabled={loading || !selectedFile}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[16px]">
              {loading ? 'autorenew' : 'cloud_upload'}
            </span>
            <span>{loading ? 'Uploading Evidence...' : 'Upload Case Evidence'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
