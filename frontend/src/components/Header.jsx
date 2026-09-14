import React, { useState } from 'react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  backendStatus, 
  refreshData, 
  caseInfo, 
  kpiStats = { totalNodes: 31 },
  pendingReviewCount = 3,
  onOpenIngest,
  officerRole = 'LEAD_INVESTIGATOR',
  onRoleChange
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const tabs = [
    { id: 'graph', label: 'Graph Canvas', count: kpiStats?.totalNodes || 31 },
    { id: 'agent', label: 'AI Investigation', badge: 'AI', badgeColor: 'bg-ai-purple/25 text-ai-purple-light shadow-[0_0_8px_rgba(139,92,246,0.3)]' },
    { id: 'resolution', label: 'Entity Resolution', badge: `${pendingReviewCount} Pending`, badgeColor: 'bg-risk-amber/20 text-risk-amber' },
    { id: 'financial', label: 'Money Trail' },
    { id: 'cdr', label: 'Call Matrix' },
    { id: 'fir', label: 'FIR Corpus' },
    { id: 'audit', label: 'Legal Vault' },
  ];

  const roleLabels = {
    LEAD_INVESTIGATOR: { short: 'LEAD', sub: 'Unmasked PII' },
    INVESTIGATOR: { short: 'INVESTIGATOR', sub: 'Masked' },
    ANALYST: { short: 'ANALYST', sub: 'Full Masked' },
    AUDITOR: { short: 'AUDITOR', sub: 'Read-Only' }
  };

  const currentRoleInfo = roleLabels[officerRole] || { short: 'LEAD', sub: 'Unmasked PII' };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface-secondary/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] border-b border-white/[0.08]">
      <div className="h-16 w-full px-4 flex items-center justify-between gap-3">
        {/* Left Brand Identity & Active Case */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container shadow-[0_0_12px_rgba(6,182,212,0.35)] border border-primary/30 flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-verified-emerald ring-2 ring-surface-base animate-pulse"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-primary via-tertiary-fixed to-primary-container bg-clip-text text-transparent truncate">
                  NEXXUS.INTELLIGENCE
                </span>
                <span className="px-1 py-0.2 rounded bg-surface-container-high text-primary text-[10px] font-mono uppercase tracking-wider border border-primary/20 flex-shrink-0">
                  v2.6
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 text-[11px]">
                <span className="font-mono text-risk-amber tracking-wider font-semibold flex-shrink-0">
                  {caseInfo?.id || 'CASE-KOL-2026-088'}
                </span>
                <span className="text-outline-variant flex-shrink-0">•</span>
                <span 
                  className="text-on-surface-variant truncate max-w-[130px] md:max-w-[200px] 2xl:max-w-[280px]" 
                  title={caseInfo?.title || "Operation Kolkata Synergy: Cyber Extortion & Multi-Tier Money Laundering"}
                >
                  {caseInfo?.title || 'Operation Kolkata Synergy: Cyber Extortion & Multi-Tier Money Laundering'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Top Segmented Navigation Tabs */}
        <nav className="hidden xl:flex items-center bg-surface-container-lowest/90 p-0.5 rounded-xl shadow-inner border border-white/[0.04] overflow-x-auto no-scrollbar flex-shrink min-w-0 max-w-fit">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-left whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-black/20 text-white' : 'bg-primary/20 text-primary'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-black/20 text-white' : tab.badgeColor
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tactical Telemetry & RBAC Tier */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Neo4j Live Connection Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-white/[0.06] text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verified-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-verified-emerald"></span>
            </span>
            <span className="text-on-surface-variant font-medium">Neo4j:</span>
            <span className="text-verified-emerald font-bold tracking-wide">
              {backendStatus?.isLive ? 'CONNECTED' : 'LOCAL DEMO'}
            </span>
          </div>

          {/* Law Enforcement RBAC Clearance Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface text-xs hover:bg-surface-bright transition-colors border border-white/[0.06]"
              title="Switch Law Enforcement RBAC Clearance Tier"
            >
              <span className="material-symbols-outlined text-primary text-[15px]">admin_panel_settings</span>
              <div className="flex flex-col text-left">
                <span className="font-bold text-on-surface leading-tight text-xs">
                  {currentRoleInfo.short}
                </span>
                <span className="text-[8.5px] text-on-surface-variant uppercase tracking-tighter leading-none">
                  {currentRoleInfo.sub}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline text-[14px]">arrow_drop_down</span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface-container-low rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] py-1.5 border border-white/[0.08] z-50">
                <div className="px-3 py-1.5 text-on-surface-variant font-mono text-[11px] uppercase font-semibold border-b border-white/[0.06]">
                  Switch RBAC Tier
                </div>
                {Object.entries(roleLabels).map(([roleKey, roleMeta]) => (
                  <button
                    key={roleKey}
                    onClick={() => {
                      onRoleChange?.(roleKey);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors ${
                      officerRole === roleKey 
                        ? 'bg-surface-container-high text-primary font-bold' 
                        : 'text-on-surface hover:bg-surface-container hover:text-white'
                    }`}
                  >
                    <span>{roleMeta.short}</span>
                    <span className="text-[10px] text-on-surface-variant">{roleMeta.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BSA §65B Certified Seal */}
          <div 
            className="hidden 2xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-container-lowest text-verified-emerald text-xs border border-verified-emerald/20 font-mono" 
            title="Bharatiya Sakshya Adhiniyam, 2023 Electronic Evidence Seal"
          >
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            <span className="font-bold tracking-tight">§65B CERTIFIED</span>
          </div>

          {/* Ingest NLP Button */}
          <button 
            onClick={onOpenIngest}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-surface-base text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] hover:bg-tertiary-fixed transition-all active:scale-95"
            title="Ingest FIR document / unstructured OCR text into Neo4j"
          >
            <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
            <span className="hidden sm:inline">Ingest NLP</span>
          </button>

          {/* Officer Avatar */}
          <div 
            className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform"
            title="Logged in as Sub-Inspector B. Banerjee (CID West Bengal)"
          >
            <span className="material-symbols-outlined text-on-primary text-[16px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
