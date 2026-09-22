import React from 'react';

/**
 * Unified "Awaiting Directive" empty-state placeholder.
 * Displayed across all workspace tabs before any investigation query is executed.
 */
export default function AwaitingDirective({ 
  icon = 'radar', 
  title = 'Awaiting Directive',
  subtitle,
  context 
}) {
  const defaultSubtitle = 'No active investigation query. Enter an investigation objective, case ID, or suspect directive above to run graph analysis.';

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="flex flex-col items-center text-center max-w-lg gap-5">
        {/* Animated Radar Icon */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-slate-200/60 animate-ping opacity-30" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-2 rounded-full bg-slate-200/40 animate-ping opacity-20" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/60 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[28px] text-slate-400">{icon}</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-semibold text-slate-600 tracking-tight font-display">{title}</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed font-mono max-w-md">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        {/* Context-specific hint */}
        {context && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100/80 border border-slate-200/70">
            <span className="material-symbols-outlined text-[14px] text-slate-400">info</span>
            <span className="text-[10px] font-mono text-slate-500">{context}</span>
          </div>
        )}

        {/* Keyboard shortcut hint */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-2">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-200/80 border border-slate-300/60 text-slate-500 font-semibold">Ctrl+K</kbd>
          <span>to focus the investigation query bar</span>
        </div>
      </div>
    </div>
  );
}
