import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Header({ 
  activeTab, 
  backendStatus, 
  refreshData, 
  caseInfo, 
  kpiStats = { totalNodes: 31 },
  pendingReviewCount = 3,
  onOpenIngest,
  officerRole = 'LEAD_INVESTIGATOR',
  onRoleChange,
  onGoHome,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();

  // Infer active view from URL pathname if activeTab is not passed
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/investigation')) return 'agent';
    if (path.includes('/resolution')) return 'resolution';
    if (path.includes('/financial')) return 'financial';
    if (path.includes('/cdr')) return 'cdr';
    if (path.includes('/fir')) return 'fir';
    if (path.includes('/audit')) return 'audit';
    return 'graph';
  };

  const currentTab = activeTab || getTabFromPath();

  const tabMetadata = {
    graph: { label: 'Knowledge Graph', icon: 'hub', badge: `${kpiStats?.totalNodes || 31} Nodes`, badgeColor: 'bg-sky-50 text-sky-700 border border-sky-200' },
    agent: { label: 'AI Investigation Team', icon: 'psychology', badge: 'ACTIVE', badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200' },
    resolution: { label: 'Duplicate & Mule Detection', icon: 'fingerprint', badge: `${pendingReviewCount} Pending`, badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200' },
    financial: { label: 'Money Trail & Hawala Ledger', icon: 'account_balance' },
    cdr: { label: 'Call Records & Cell Towers', icon: 'phone_in_talk' },
    fir: { label: 'FIR Case Documents', icon: 'policy' },
    audit: { label: 'Court Evidence & Audit Vault', icon: 'gavel', badge: 'Tamper-Proof', badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  };

  const activeTabMeta = tabMetadata[currentTab] || tabMetadata.graph;

  const roleLabels = {
    LEAD_INVESTIGATOR: { short: 'LEAD', sub: 'Unmasked PII', color: 'text-sky-700' },
    INVESTIGATOR: { short: 'INVESTIGATOR', sub: 'Masked', color: 'text-slate-600' },
    ANALYST: { short: 'ANALYST', sub: 'Full Masked', color: 'text-amber-700' },
    AUDITOR: { short: 'AUDITOR', sub: 'Read-Only', color: 'text-purple-700' }
  };

  const currentRoleInfo = roleLabels[officerRole] || { short: 'LEAD', sub: 'Unmasked PII', color: 'text-sky-700' };

  return (
    <header className="w-full h-14 bg-white border-b border-slate-200 shadow-xs flex-shrink-0 z-40 text-slate-800">
      <div className="h-14 w-full px-4 flex items-center justify-between gap-3">
        {/* Left Brand Identity & Portal Home Link */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          <Link 
            to="/"
            onClick={onGoHome}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
            title="Go to Homepage / Overview"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 shadow-xs flex-shrink-0">
              <span className="material-symbols-outlined text-sky-600 text-[19px]">shield</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-[13px] tracking-tight text-slate-900">
                  NEXXUS<span className="text-sky-600 font-semibold">.INTELLIGENCE</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-sky-50 text-sky-700 text-[10px] font-mono font-bold tracking-wider border border-sky-200 flex-shrink-0">
                  DEFENSE v2.6
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 text-[11px]">
                <span className="font-mono text-amber-800 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 tracking-wider font-bold flex-shrink-0 text-[10px]">
                  {caseInfo?.id || 'CASE-KOL-2026-088'}
                </span>
                <span className="text-slate-400 flex-shrink-0">•</span>
                <span 
                  className="text-slate-600 font-medium truncate max-w-[130px] md:max-w-[180px] 2xl:max-w-[280px]" 
                  title={caseInfo?.title || "Operation Kolkata Synergy: Cyber Extortion & Multi-Tier Money Laundering"}
                >
                  {caseInfo?.title || 'Operation Kolkata Synergy: Cyber Extortion & Multi-Tier Money Laundering'}
                </span>
              </div>
            </div>
          </Link>

          {/* Portal Home Button */}
          <Link
            to="/"
            onClick={onGoHome}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs cursor-pointer ml-1"
            title="Return to Public Homepage"
          >
            <span className="material-symbols-outlined text-[15px] text-sky-600">home</span>
            <span>Portal Home</span>
          </Link>
        </div>

        {/* Center: Active View Breadcrumb Context */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 shadow-xs">
          <span className="material-symbols-outlined text-sky-600 text-[17px]">
            {activeTabMeta.icon}
          </span>
          <span className="text-slate-400">/</span>
          <span className="font-bold text-slate-900 tracking-tight font-sans text-[12px]">
            {activeTabMeta.label}
          </span>
          {activeTabMeta.badge && (
            <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${activeTabMeta.badgeColor}`}>
              {activeTabMeta.badge}
            </span>
          )}
        </div>

        {/* Right Tactical Telemetry & RBAC Tier */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Database Live Connection Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-500 font-medium text-[11px]">Database:</span>
            <span className="text-emerald-700 font-bold tracking-wide text-[11px]">
              {backendStatus?.isLive ? '12ms LIVE' : 'LOCAL DEMO'}
            </span>
          </div>

          {/* Law Enforcement RBAC Clearance Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs transition-colors border border-slate-200 shadow-xs cursor-pointer"
              title="Switch Law Enforcement RBAC Clearance Tier"
            >
              <span className="material-symbols-outlined text-sky-600 text-[16px]">admin_panel_settings</span>
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-900 leading-tight text-[11px]">
                  {currentRoleInfo.short}
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-tight leading-none font-mono font-semibold">
                  {currentRoleInfo.sub}
                </span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[14px]">expand_more</span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl py-1.5 border border-slate-200 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                  Select RBAC Clearance Tier
                </div>
                {Object.entries(roleLabels).map(([roleKey, roleMeta]) => {
                  const isSelected = officerRole === roleKey;
                  return (
                    <button
                      key={roleKey}
                      onClick={() => {
                        onRoleChange?.(roleKey);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-sky-50 text-sky-800 font-bold border-l-2 border-sky-600' 
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{roleMeta.short}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{roleMeta.sub}</span>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-sky-600 text-[16px]">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* BSA §65B Certified Seal */}
          <div 
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 font-mono font-bold" 
            title="Bharatiya Sakshya Adhiniyam, 2023 Electronic Evidence Seal"
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-700">verified_user</span>
            <span className="tracking-tight text-[11px]">§65B CERTIFIED</span>
          </div>

          {/* Import Evidence Button */}
          <button 
            onClick={onOpenIngest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Import case documents, FIRs, and files"
          >
            <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
            <span className="hidden sm:inline font-sans">Import Evidence</span>
          </button>

          {/* Officer Profile Avatar & Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center flex-shrink-0 cursor-pointer shadow-xs transition-all"
              title={`Logged in as ${currentUser?.name || 'Officer'} (${currentUser?.badgeNumber || 'DL-IPS-2026'})`}
            >
              <span className="material-symbols-outlined text-white text-[17px]">person</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl p-3 border border-slate-200 z-50 animate-fade-in text-xs">
                <div className="pb-2 border-b border-slate-100 flex flex-col gap-0.5">
                  <span className="font-bold text-slate-900 text-sm">{currentUser?.name || 'Officer on Duty'}</span>
                  <span className="text-slate-500 font-mono text-[11px]">Badge: {currentUser?.badgeNumber || 'WB-CID-0941'}</span>
                  <span className="text-[10px] text-slate-600 line-clamp-1">{currentUser?.department || 'CID Cyber Crime Directorate'}</span>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-mono text-[10px] font-bold border border-sky-200">
                      {officerRole?.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuth?.('login');
                    }}
                    className="w-full py-1.5 px-2.5 text-left rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-sky-600">switch_account</span>
                    <span>Switch Officer Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuth?.('register');
                    }}
                    className="w-full py-1.5 px-2.5 text-left rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-sky-600">person_add</span>
                    <span>Register New Clearance</span>
                  </button>
                  {onGoHome && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onGoHome();
                      }}
                      className="w-full py-1.5 px-2.5 text-left rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-500">home</span>
                      <span>Return to Portal Home</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout?.();
                    }}
                    className="w-full py-1.5 px-2.5 text-left rounded-lg hover:bg-rose-50 text-rose-700 flex items-center gap-2 font-medium cursor-pointer border-t border-slate-100 mt-1 pt-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-rose-600">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
