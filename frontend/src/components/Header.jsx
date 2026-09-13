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
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-surface-secondary/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)] border-b border-white/[0.08]">
      <div className="h-20 w-full px-margin flex items-center justify-between gap-space-md">
        {/* Left Brand Identity & Active Case */}
        <div className="flex items-center gap-space-lg flex-shrink-0">
          <div className="flex items-center gap-space-sm">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container shadow-[0_0_16px_rgba(6,182,212,0.35)] border border-primary/30">
              <span className="material-symbols-outlined text-primary text-[24px]">shield</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-verified-emerald ring-2 ring-surface-base animate-pulse"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm font-bold tracking-tight bg-gradient-to-r from-primary via-tertiary-fixed to-primary-container bg-clip-text text-transparent">
                  NEXXUS.INTELLIGENCE
                </span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider border border-primary/20">
                  SIH 2026
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-risk-amber tracking-widest font-semibold">
                  {caseInfo?.id || 'CASE-KOL-2026-088'}
                </span>
                <span className="text-outline-variant font-label-sm text-label-sm">•</span>
                <span 
                  className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-[240px] lg:max-w-xs" 
                  title={caseInfo?.title || "Operation Kolkata Synergy: Cyber Extortion & Multi-Tier Money Laundering"}
                >
                  {caseInfo?.title || 'Operation Kolkata Synergy: Cyber Extortion & Multi-Tier Money Laundering'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Top Segmented Navigation Tabs (for XL viewports) */}
        <nav className="hidden xl:flex items-center bg-surface-container-lowest/80 p-1 rounded-xl shadow-inner border border-white/[0.04]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-space-xs px-3.5 py-2 rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-[0_0_14px_rgba(6,182,212,0.4)]'
                    : 'font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full font-label-sm text-label-sm font-bold ${
                    isActive ? 'bg-black/20 text-white' : 'bg-primary/20 text-primary'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full font-label-sm text-label-sm font-bold ${
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
        <div className="flex items-center gap-space-md flex-shrink-0">
          {/* Neo4j Live Connection Pill */}
          <div className="hidden md:flex items-center gap-space-xs px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-white/[0.06] font-label-sm text-label-sm">
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
              className="flex items-center gap-space-xs px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-bright transition-colors border border-white/[0.06]"
              title="Switch Law Enforcement RBAC Clearance Tier"
            >
              <span className="material-symbols-outlined text-primary text-[16px]">admin_panel_settings</span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm text-label-sm font-bold text-on-surface leading-tight">
                  {currentRoleInfo.short}
                </span>
                <span className="text-[9px] text-on-surface-variant uppercase tracking-tighter leading-none">
                  {currentRoleInfo.sub}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline text-[16px]">arrow_drop_down</span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface-container-low rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.7)] py-1.5 border border-white/[0.08] z-50">
                <div className="px-3 py-1.5 text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold border-b border-white/[0.06]">
                  Switch RBAC Tier
                </div>
                {Object.entries(roleLabels).map(([roleKey, roleMeta]) => (
                  <button
                    key={roleKey}
                    onClick={() => {
                      onRoleChange?.(roleKey);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left font-label-sm text-label-sm transition-colors ${
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
            className="hidden lg:flex items-center gap-space-xs px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-verified-emerald font-label-sm text-label-sm border border-verified-emerald/20" 
            title="Bharatiya Sakshya Adhiniyam, 2023 Electronic Evidence Seal"
          >
            <span className="material-symbols-outlined text-[15px]">verified_user</span>
            <span className="font-bold tracking-tight">BSA §65B CERTIFIED</span>
          </div>

          {/* Ingest NLP Button */}
          <button 
            onClick={onOpenIngest}
            className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-primary text-surface-base font-label-md text-label-md font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:bg-tertiary-fixed transition-all active:scale-95"
            title="Ingest FIR document / unstructured OCR text into Neo4j"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            <span className="hidden sm:inline">Ingest NLP</span>
          </button>

          {/* Officer Avatar */}
          <div 
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform"
            title="Logged in as Sub-Inspector B. Banerjee (CID West Bengal)"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
