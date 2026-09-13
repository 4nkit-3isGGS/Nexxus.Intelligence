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
    <aside className="fixed left-0 top-20 bottom-0 w-64 bg-surface-secondary z-40 flex flex-col justify-between p-space-md shadow-[4px_0_24px_rgba(0,0,0,0.5)] border-r border-white/[0.06]">
      <div className="flex flex-col gap-space-md">
        {/* Tactical Ops Live Indicator */}
        <div className="px-2.5 py-1.5 rounded-lg bg-surface-container-lowest flex items-center justify-between border border-white/[0.04]">
          <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold tracking-wider">
            Tactical Ops
          </span>
          <span className="px-2 py-0.5 rounded-full bg-threat-crimson/20 text-threat-crimson font-label-sm text-label-sm font-bold animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-threat-crimson"></span>
            LIVE RUN
          </span>
        </div>

        {/* Tactical Navigation Items */}
        <nav className="flex flex-col gap-space-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left group ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-bold shadow-[0_0_14px_rgba(6,182,212,0.4)]'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <span
                    className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${
                      isActive ? 'text-on-primary' : 'text-primary'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-body-md text-body-md truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      isActive ? 'bg-black/20 text-white' : item.badgeColor
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
      <div className="flex flex-col gap-space-sm p-3.5 rounded-xl bg-surface-container-lowest/90 border border-white/[0.06] shadow-inner">
        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
          <span className="tracking-wider">SYSTEM TELEMETRY</span>
          <span className="text-verified-emerald font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-verified-emerald animate-ping"></span>
            NOMINAL
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>Graph Nodes</span>
            <span className="text-on-surface font-semibold">{nodeCount} Live</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[72%] shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>Inference Unit</span>
            <span className="text-on-surface font-semibold">42ms p99</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-ai-purple h-full w-[44%] shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-outline font-label-sm text-label-sm">
          <span>SHA-256 Chain</span>
          <span className="text-primary font-mono font-bold tracking-wider">a9f3…e41</span>
        </div>
      </div>
    </aside>
  );
}
