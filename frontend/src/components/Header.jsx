import React, { useState, useRef, useEffect } from 'react';
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
  const roleDropdownRef = useRef(null);
  const profileMenuRef = useRef(null);
  const location = useLocation();

  // Close dropdowns on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowRoleDropdown(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    graph: { label: 'Knowledge Graph', icon: 'hub', badge: `${kpiStats?.totalNodes || 31} Nodes`, badgeColor: 'bg-slate-100 text-slate-700 border border-slate-200' },
    agent: { label: 'AI Investigation Team', icon: 'psychology', badge: 'ACTIVE', badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200' },
    resolution: { label: 'Duplicate & Mule Detection', icon: 'fingerprint', badge: `${pendingReviewCount} Pending`, badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200' },
    financial: { label: 'Money Trail & Hawala Ledger', icon: 'account_balance' },
    cdr: { label: 'Call Records & Cell Towers', icon: 'phone_in_talk' },
    fir: { label: 'FIR Case Documents', icon: 'policy' },
    audit: { label: 'Court Evidence & Audit Vault', icon: 'gavel', badge: 'Tamper-Proof', badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
  };

  const activeTabMeta = tabMetadata[currentTab] || tabMetadata.graph;

  const roleLabels = {
    LEAD_INVESTIGATOR: { short: 'LEAD', sub: 'Unmasked PII', color: 'text-slate-900' },
    INVESTIGATOR: { short: 'INVESTIGATOR', sub: 'Masked', color: 'text-slate-600' },
    ANALYST: { short: 'ANALYST', sub: 'Full Masked', color: 'text-amber-700' },
    AUDITOR: { short: 'AUDITOR', sub: 'Read-Only', color: 'text-purple-700' }
  };

  const currentRoleInfo = roleLabels[officerRole] || { short: 'LEAD', sub: 'Unmasked PII', color: 'text-slate-900' };

  return (
    <header className="w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs flex-shrink-0 z-40 text-slate-800">
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left Brand Identity & Portal Home Link */}
        <div className="flex items-center gap-3.5 min-w-0 flex-shrink-0">
          <Link 
            to="/"
            onClick={onGoHome}
            className="flex items-center gap-3 min-w-0 cursor-pointer group shrink-0"
            title="Go to Homepage / Overview"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white shadow-xs flex-shrink-0 transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base tracking-tight text-slate-900 whitespace-nowrap">
                  NEXXUS<span className="text-sky-600 font-semibold">.INTEL</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-mono font-medium border border-slate-200/80 flex-shrink-0 whitespace-nowrap">
                  v2.6
                </span>
              </div>
            </div>
          </Link>

          <div className="h-5 w-px bg-slate-200 hidden md:block shrink-0"></div>

          {/* Active Case Tag */}
          <div 
            className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 max-w-[260px] lg:max-w-xs shrink-0"
            title={caseInfo?.title || "Operation Kolkata Synergy"}
          >
            <span className="px-2 py-0.5 rounded-md bg-slate-200/90 font-mono text-[11px] text-slate-800 font-semibold whitespace-nowrap shrink-0">
              {caseInfo?.id || 'CASE-088'}
            </span>
            <span className="truncate text-xs font-medium text-slate-700 whitespace-nowrap">
              {caseInfo?.title || 'Operation Kolkata Synergy'}
            </span>
          </div>
        </div>

        {/* Center: Active View Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs text-xs text-slate-600 shrink-0">
          <span className="material-symbols-outlined text-slate-600 text-[18px]">
            {activeTabMeta.icon}
          </span>
          <span className="font-semibold text-slate-900 text-[13px] whitespace-nowrap">
            {activeTabMeta.label}
          </span>
          {activeTabMeta.badge && (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold whitespace-nowrap ${activeTabMeta.badgeColor}`}>
              {activeTabMeta.badge}
            </span>
          )}
        </div>

        {/* Right Actions & RBAC Clearance */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {/* Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-500">DB:</span>
            <span className="text-emerald-700 font-semibold">
              {backendStatus?.isLive ? 'LIVE' : 'DEMO'}
            </span>
          </div>

          {/* RBAC Clearance Tier Selector */}
          <div className="relative" ref={roleDropdownRef}>
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs transition-colors border border-slate-200/80 shadow-2xs cursor-pointer"
              title="Switch Law Enforcement RBAC Clearance Tier"
            >
              <span className="material-symbols-outlined text-slate-500 text-[17px]">admin_panel_settings</span>
              <span className="font-semibold text-slate-900 text-xs">
                {currentRoleInfo.short}
              </span>
              <span className="material-symbols-outlined text-slate-400 text-[15px]">expand_more</span>
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl py-2 border border-slate-200 z-50 animate-fade-in">
                <div className="px-3.5 py-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
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
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-100 text-slate-900 font-semibold' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{roleMeta.short}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{roleMeta.sub}</span>
                      </div>
                      {isSelected && (
                        <span className="material-symbols-outlined text-slate-900 text-[16px]">check</span>
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
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
            title="Field Guide & Operational Manual"
          >
            <span className="material-symbols-outlined text-slate-500 text-[17px]">menu_book</span>
            <span>Field Guide</span>
          </button>

          {/* Export Case Dossier */}
          <button 
            onClick={onOpenDossier}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
            title="Export Court-Certified Evidence Dossier"
          >
            <span className="material-symbols-outlined text-slate-500 text-[17px]">description</span>
            <span>Export</span>
          </button>

          {/* Upload Evidence Button */}
          <button 
            onClick={onOpenIngest}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            title="Upload case documents, FIRs, and files"
          >
            <span className="material-symbols-outlined text-[17px]">cloud_upload</span>
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* User Profile Avatar */}
          <div className="relative ml-1" ref={profileMenuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors shadow-2xs"
              title={`Logged in as ${currentUser?.name || 'Officer'}`}
            >
              <span className="material-symbols-outlined text-slate-700 text-[18px]">person</span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl p-3 border border-slate-200 z-50 animate-fade-in text-xs">
                <div className="pb-2.5 border-b border-slate-100 flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-900 text-xs">{currentUser?.name || 'Officer on Duty'}</span>
                  <span className="text-slate-400 font-mono text-[10px]">Badge: {currentUser?.badgeNumber || 'WB-CID-0941'}</span>
                  <div className="mt-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-medium border border-slate-200">
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
                    className="w-full py-2 px-2.5 text-left rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px] text-slate-500">switch_account</span>
                    <span>Switch Account</span>
                  </button>
                  {onGoHome && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onGoHome();
                      }}
                      className="w-full py-2 px-2.5 text-left rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <span className="material-symbols-outlined text-[16px] text-slate-500">home</span>
                      <span>Portal Home</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout?.();
                    }}
                    className="w-full py-2 px-2.5 text-left rounded-xl hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer font-medium border-t border-slate-100 mt-1 pt-2"
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
