import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  nodeCount = 31,
  pendingReviewCount = 3,
  backendStatus = { isLive: true },
  onGoHome
}) {
  const navItems = [
    {
      id: 'graph',
      label: 'Knowledge Graph',
      icon: 'hub',
      badge: nodeCount,
      badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200'
    },
    {
      id: 'agent',
      label: 'Agent Swarm',
      icon: 'psychology',
      badge: 'ACTIVE',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200'
    },
    {
      id: 'resolution',
      label: 'Mule Detection',
      icon: 'fingerprint',
      badge: pendingReviewCount,
      badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200'
    },
    {
      id: 'financial',
      label: 'Layering & Hawala',
      icon: 'account_balance',
      badge: null
    },
    {
      id: 'cdr',
      label: 'CDR Geo Tower',
      icon: 'phone_in_talk',
      badge: null
    },
    {
      id: 'fir',
      label: 'FIR Evidence Vault',
      icon: 'policy',
      badge: null
    },
    {
      id: 'audit',
      label: 'BSA Legal Audit',
      icon: 'gavel',
      badge: '§65B',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    }
  ];

  return (
    <aside className="w-64 h-full flex-shrink-0 bg-white z-30 flex flex-col justify-between p-3.5 shadow-xs border-r border-slate-200 overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-3">
        {/* Tactical Ops Live Indicator & Home shortcut */}
        <div className="flex flex-col gap-1.5">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-200 shadow-xs">
            <span className="font-mono text-[10px] uppercase text-slate-500 font-bold tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              Tactical Operations
            </span>
            <span className="px-2 py-0.2 rounded-full bg-red-50 text-red-700 border border-red-200 font-mono text-[9px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              LIVE
            </span>
          </div>

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-slate-700 hover:text-sky-700 hover:bg-slate-50 border border-slate-200 shadow-xs font-semibold text-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-sky-600">home</span>
              <span>Portal Home / Overview</span>
            </button>
          )}
        </div>

        {/* Tactical Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left group cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-800 font-bold border-l-2 border-sky-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-105 ${
                      isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[13px] truncate font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      isActive ? 'bg-sky-600 text-white shadow-xs' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry Card */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500 font-bold uppercase">System Telemetry</span>
          <span className="text-emerald-700 font-bold">NOMINAL</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-700 font-mono">
          <span>Active Knowledge Nodes</span>
          <span className="text-slate-900 font-bold">{nodeCount} Live</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Inference Latency</span>
            <span className="text-sky-700 font-semibold">42ms p99</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-600 h-full w-2/3"></div>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>SHA-256 Tip Block</span>
          <span className="text-sky-700 font-bold select-all">a9f3…e41</span>
        </div>
      </div>
    </aside>
  );
}
