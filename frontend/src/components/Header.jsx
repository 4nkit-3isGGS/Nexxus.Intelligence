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
    { id: 'graph', label: 'Graph', count: kpiStats?.totalNodes || 31 },
    { id: 'agent', label: 'AI Swarm', badge: 'AI', badgeColor: 'bg-ai-purple/25 text-ai-purple-light shadow-[0_0_8px_rgba(139,92,246,0.3)]' },
    { id: 'resolution', label: 'Mule Det.', badge: `${pendingReviewCount}`, badgeColor: 'bg-risk-amber/20 text-risk-amber' },
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
    <header className="w-full h-14 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 flex-shrink-0 z-40">
      <div className="h-14 w-full px-3.5 flex items-center justify-between gap-2.5">
        {/* Left Brand Identity & Active Case */}
        <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-sky-50 shadow-sm border border-sky-300 flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-verified-emerald ring-2 ring-surface-base animate-pulse"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-700 bg-clip-text text-transparent">
                  NEXXUS.INTELLIGENCE
                </span>
                <span className="px-1 py-0.2 rounded bg-sky-100/70 text-sky-700 text-[9px] font-mono uppercase tracking-wider border border-sky-200 flex-shrink-0">
                  v2.6
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 text-[10px]">
                <span className="font-mono text-risk-amber tracking-wider font-semibold flex-shrink-0">
                  {caseInfo?.id || 'CASE-KOL-2026-088'}
                </span>
                <span className="text-outline-variant flex-shrink-0">•</span>
                <span 
                  className="text-on-surface-variant truncate max-w-[120px] md:max-w-[180px] 2xl:max-w-[260px]" 
                  title={caseInfo?.title || "Operation Kolkata Synergy: Cyber Extortion & Multi-Tier Money Laundering"}
                >
                  {caseInfo?.title || 'Operation Kolkata Synergy: Cyber Extortion & Multi-Tier Money Laundering'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Top Segmented Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded-xl shadow-inner border border-slate-200/80 flex-shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-left whitespace-nowrap text-xs flex-shrink-0 ${
                  isActive
                    ? 'bg-primary-container text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary/15 text-primary'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tactical Telemetry & RBAC Tier */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Neo4j Live Connection Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
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
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs hover:bg-slate-200 transition-colors border border-slate-200"
              title="Switch Law Enforcement RBAC Clearance Tier"
            >
              <span className="material-symbols-outlined text-primary text-[15px]">admin_panel_settings</span>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-800 leading-tight text-xs">
                  {currentRoleInfo.short}
                </span>
                <span className="text-[8px] text-slate-500 uppercase tracking-tighter leading-none">
                  {currentRoleInfo.sub}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline text-[13px]">arrow_drop_down</span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl py-1.5 border border-slate-200 z-50">
                <div className="px-3 py-1.5 text-slate-500 font-mono text-[11px] uppercase font-semibold border-b border-slate-100">
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
                        ? 'bg-sky-50 text-sky-700 font-bold' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{roleMeta.short}</span>
                    <span className="text-[10px] text-slate-500">{roleMeta.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BSA §65B Certified Seal */}
          <div 
            className="hidden 2xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs border border-emerald-200 font-mono" 
            title="Bharatiya Sakshya Adhiniyam, 2023 Electronic Evidence Seal"
          >
            <span className="material-symbols-outlined text-[13px]">verified_user</span>
            <span className="font-bold tracking-tight">§65B CERTIFIED</span>
          </div>

          {/* Ingest NLP Button */}
          <button 
            onClick={onOpenIngest}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-bold shadow-sm hover:bg-sky-700 transition-all active:scale-95"
            title="Ingest FIR document / unstructured OCR text into Neo4j"
          >
            <span className="material-symbols-outlined text-[15px]">cloud_upload</span>
            <span className="hidden sm:inline">Ingest NLP</span>
          </button>

          {/* Officer Avatar */}
          <div 
            className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center flex-shrink-0 cursor-pointer shadow-sm hover:scale-105 transition-transform"
            title="Logged in as Sub-Inspector B. Banerjee (CID West Bengal)"
          >
            <span className="material-symbols-outlined text-white text-[15px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
