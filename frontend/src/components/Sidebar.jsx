import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  nodeCount = 31,
  pendingReviewCount = 3,
  backendStatus = { isLive: true }
}) {
  const navItems = [
    {
      id: 'graph',
      label: 'Knowledge Graph',
      icon: 'hub',
      badge: nodeCount,
      badgeColor: 'bg-surface-container-high text-primary'
    },
    {
      id: 'agent',
      label: 'Agent Swarm',
      icon: 'psychology',
      badge: 'RUNNING',
      badgeColor: 'bg-ai-purple/20 text-ai-purple-light'
    },
    {
      id: 'resolution',
      label: 'Mule Detection',
      icon: 'fingerprint',
      badge: pendingReviewCount,
      badgeColor: 'bg-risk-amber/20 text-risk-amber'
    },
    {
      id: 'financial',
      label: 'Layering & Havala',
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
      badge: null
    }
  ];

  return (
    <aside className="w-60 h-full flex-shrink-0 bg-white z-30 flex flex-col justify-between p-3 shadow-sm border-r border-slate-200/80 overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-2.5">
        {/* Tactical Ops Live Indicator */}
        <div className="px-2.5 py-1 rounded-lg bg-slate-50 flex items-center justify-between border border-slate-200">
          <span className="font-mono text-[11px] uppercase text-slate-600 font-bold tracking-wider">
            Tactical Ops
          </span>
          <span className="px-2 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-mono text-[10px] font-bold animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            LIVE RUN
          </span>
        </div>

        {/* Tactical Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all text-left group ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold border-l-2 border-sky-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[19px] transition-transform group-hover:scale-110 ${
                      isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-xs truncate font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ${
                      isActive ? 'bg-sky-200/60 text-sky-800' : item.badgeColor
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

      {/* Bottom System Telemetry Card */}
      <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner mt-2">
        <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
          <span className="tracking-wider">SYSTEM TELEMETRY</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            NOMINAL
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between font-mono text-[10px] text-slate-500">
            <span>Graph Nodes</span>
            <span className="text-slate-800 font-semibold">{nodeCount} Live</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[72%] shadow-[0_0_8px_rgba(2,132,199,0.4)]"></div>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex justify-between font-mono text-[10px] text-slate-500">
            <span>Inference Unit</span>
            <span className="text-slate-800 font-semibold">42ms p99</span>
          </div>
          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
            <div className="bg-ai-purple h-full w-[44%] shadow-[0_0_8px_rgba(124,58,237,0.4)]"></div>
          </div>
        </div>

        <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-slate-400 font-mono text-[10px]">
          <span>SHA-256 Chain</span>
          <span className="text-primary font-bold tracking-wider">a9f3…e41</span>
        </div>
      </div>
    </aside>
  );
}
