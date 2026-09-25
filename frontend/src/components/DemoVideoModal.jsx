import React, { useEffect } from 'react';
import { DEMO_VIDEO_URL } from '../config/constants';

/**
 * Normalizes video URLs to ensure proper playback:
 * - Detects direct video files (.mp4, .webm, .ogg)
 * - Auto-converts Google Drive file/view links to /preview embed format
 * - Converts YouTube watch links (youtube.com/watch?v=ID or youtu.be/ID) into embed URLs with autoplay
 */
function resolveVideoSource(rawUrl) {
  if (!rawUrl) return { isDirectVideo: false, url: '' };

  const trimmed = rawUrl.trim();

  // Direct video file extensions
  if (/\.(mp4|webm|ogg|mov)($|\?)/i.test(trimmed)) {
    return { isDirectVideo: true, url: trimmed };
  }

  // Auto-convert Google Drive view or open links to preview embed format
  if (trimmed.includes('drive.google.com')) {
    const fileIdMatch =
      trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      return {
        isDirectVideo: false,
        url: `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`
      };
    }
  }

  // YouTube watch URLs or short URLs
  const ytWatchMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|v\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (ytWatchMatch && ytWatchMatch[1]) {
    const videoId = ytWatchMatch[1];
    return {
      isDirectVideo: false,
      url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    };
  }

  return { isDirectVideo: false, url: trimmed };
}

export default function DemoVideoModal({
  isOpen,
  onClose,
  videoUrl = DEMO_VIDEO_URL,
  title = "Nexxus Intelligence Platform — Walkthrough & Demonstration"
}) {
  // Close on Escape key press and manage body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // When closed, unmount the player completely so all audio/video playback immediately halts
  if (!isOpen) return null;

  const { isDirectVideo, url: resolvedUrl } = resolveVideoSource(videoUrl);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-video-modal-title"
    >
      {/* Enterprise Light Intelligence Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col transition-all transform scale-100"
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-cyan-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2
                  id="demo-video-modal-title"
                  className="text-base font-semibold text-slate-900 tracking-tight truncate"
                >
                  {title}
                </h2>
                <span className="hidden sm:inline-flex bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full">
                  Interactive Demo
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 truncate">
                Nexxus Defense Intelligence // Automated Walkthrough
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Close demo video modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* 16:9 Aspect Ratio Video Player Container */}
        <div className="relative aspect-video w-full bg-slate-950 border-y border-slate-200 flex items-center justify-center overflow-hidden">
          {isDirectVideo ? (
            <video
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              src={resolvedUrl}
            >
              <source src={resolvedUrl} type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            <iframe
              src={resolvedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            />
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-700">Walkthrough Module</span>
            <span className="text-xs text-slate-500 hidden sm:inline">• Knowledge Graph, FIR Telemetry & Entity Resolution</span>
          </div>

          <div className="flex items-center gap-3">
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-cyan-600 hover:text-cyan-700 hover:underline flex items-center gap-1 transition-colors"
              >
                <span>Open in new tab</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
