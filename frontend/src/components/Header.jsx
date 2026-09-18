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
  onLogout,
  onOpenFieldGuide,
  onOpenDossier
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
    <header className="w-full h-13 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs flex-shrink-0 z-40 text-slate-800">
      <div className="h-13 w-full px-4 flex items-center justify-between gap-3">
        {/* Left Brand Identity & Portal Home Link */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          <Link 
            to="/"
            onClick={onGoHome}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            title="Go to Homepage / Overview"
          >
            <div className="relative flex items-center justify-center w-7.5 h-7.5 rounded-lg bg-slate-900 text-white shadow-2xs flex-shrink-0 transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[17px]">shield</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-[13px] tracking-tight text-slate-900">
                  NEXXUS<span className="text-sky-600 font-medium">.INTEL</span>
                </span>
                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-medium border border-slate-200/70 flex-shrink-0">
                  v2.6
                </span>
              </div>
            </div>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          {/* Active Case Tag */}
          <div 
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-medium truncate max-w-[200px] lg:max-w-xs"
            title={caseInfo?.title || "Operation Kolkata Synergy"}
          >
            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-700 font-semibold border border-slate-200">
              {caseInfo?.id || 'CASE-088'}
            </span>
            <span className="truncate text-[11px] text-slate-600">
              {caseInfo?.title || 'Operation Kolkata Synergy'}
            </span>
          </div>
        </div>

        {/* Center: Active View Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <span className="material-symbols-outlined text-slate-500 text-[16px]">
            {activeTabMeta.icon}
          </span>
          <span className="font-semibold text-slate-900 text-[12px]">
            {activeTabMeta.label}
          </span>
          {activeTabMeta.badge && (
            <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-semibold ${activeTabMeta.badgeColor}`}>
              {activeTabMeta.badge}
            </span>
          )}
        </div>

        {/* Right Actions & RBAC Clearance */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-500">DB:</span>
            <span className="text-emerald-700 font-semibold">
              {backendStatus?.isLive ? 'LIVE' : 'DEMO'}
            </span>
          </div>

          {/* RBAC Clearance Tier Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs transition-colors border border-slate-200 shadow-2xs cursor-pointer"
              title="Switch Law Enforcement RBAC Clearance Tier"
            >
              <span className="material-symbols-outlined text-slate-500 text-[15px]">admin_panel_settings</span>
              <span className="font-semibold text-slate-800 text-[11px]">
                {currentRoleInfo.short}
              </span>
              <span className="material-symbols-outlined text-slate-400 text-[13px]">expand_more</span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-lg py-1.5 border border-slate-200 z-50 animate-fade-in">
                <div className="px-3 py-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                  Clearance Tier
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
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-sky-50 text-sky-900 font-semibold' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{roleMeta.short}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{roleMeta.sub}</span>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-sky-600 text-[15px]">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Field Guide Help */}
          <button 
            onClick={onOpenFieldGuide}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="Field Guide & Operational Manual"
          >
            <span className="material-symbols-outlined text-slate-500 text-[15px]">menu_book</span>
            <span>Field Guide</span>
          </button>

          {/* Export Case Dossier */}
          <button 
            onClick={onOpenDossier}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="Export Court-Certified Evidence Dossier"
          >
            <span className="material-symbols-outlined text-slate-500 text-[15px]">description</span>
            <span>Export</span>
          </button>

          {/* Import Evidence Button */}
          <button 
            onClick={onOpenIngest}
            className="flex items-center gap-1.5 px-3 py-1.2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-2xs transition-all cursor-pointer"
            title="Import case documents, FIRs, and files"
          >
            <span className="material-symbols-outlined text-[15px]">cloud_upload</span>
            <span className="hidden sm:inline">Import</span>
          </button>

          {/* User Profile Avatar */}
          <div className="relative ml-1">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-7.5 h-7.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
              title={`Logged in as ${currentUser?.name || 'Officer'}`}
            >
              <span className="material-symbols-outlined text-slate-600 text-[16px]">person</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl p-2.5 border border-slate-200 z-50 animate-fade-in text-xs">
                <div className="pb-2 border-b border-slate-100 flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-900 text-xs">{currentUser?.name || 'Officer on Duty'}</span>
                  <span className="text-slate-400 font-mono text-[10px]">Badge: {currentUser?.badgeNumber || 'WB-CID-0941'}</span>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-medium border border-slate-200">
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
                    className="w-full py-1.5 px-2 text-left rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-[15px] text-slate-500">switch_account</span>
                    <span>Switch Account</span>
                  </button>
                  {onGoHome && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onGoHome();
                      }}
                      className="w-full py-1.5 px-2 text-left rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-[15px] text-slate-500">home</span>
                      <span>Portal Home</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout?.();
                    }}
                    className="w-full py-1.5 px-2 text-left rounded-lg hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer font-medium border-t border-slate-100 mt-1 pt-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px] text-rose-600">logout</span>
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
