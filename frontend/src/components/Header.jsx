import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ 
  activeTab, 
  backendStatus, 
  refreshData, 
  caseInfo, 
  kpiStats = { totalNodes: 0 },
  pendingReviewCount = 0,
  onOpenIngest,
  officerRole = 'LEAD_INVESTIGATOR',
  onRoleChange,
  onGoHome,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenFieldGuide,
  onOpenDossier,
  onLaunchWorkspace
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const roleDropdownRef = useRef(null);
  const profileMenuRef = useRef(null);

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

  const roleLabels = {
    LEAD_INVESTIGATOR: { short: 'LEAD', sub: 'Unmasked PII', color: 'text-slate-900' },
    INVESTIGATOR: { short: 'INVESTIGATOR', sub: 'Masked', color: 'text-slate-600' },
    ANALYST: { short: 'ANALYST', sub: 'Full Masked', color: 'text-amber-700' },
    AUDITOR: { short: 'AUDITOR', sub: 'Read-Only', color: 'text-purple-700' }
  };

  const currentRoleInfo = roleLabels[officerRole] || { short: 'LEAD', sub: 'Unmasked PII', color: 'text-slate-900' };

  return (
    <header className="w-full max-w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs flex-shrink-0 z-40 text-slate-800">
      <div className="w-full max-w-full h-16 px-4 flex items-center justify-between gap-2 overflow-x-hidden">
        
        {/* Left Group (Brand & Case): Logo, version badge, and active Case pill */}
        <div className="flex items-center gap-2.5 min-w-0 shrink-0">
          <Link 
            to="/"
            onClick={onGoHome}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group shrink-0"
            title="Go to Homepage / Overview"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-900 text-white shadow-xs flex-shrink-0 transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[19px]">shield</span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-display font-bold text-sm sm:text-base tracking-tight text-slate-900 whitespace-nowrap">
                NEXXUS<span className="text-sky-600 font-semibold">.INTEL</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-medium border border-slate-200/80 shrink-0 whitespace-nowrap">
                v2.6
              </span>
            </div>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0"></div>

          {/* Active Case Tag */}
          <div 
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 max-w-[190px] md:max-w-[240px] shrink-0"
            title={caseInfo?.title || "Operation Kolkata Synergy"}
          >
            <span className="px-1.5 py-0.5 rounded bg-slate-200/90 font-mono text-[10px] text-slate-800 font-semibold whitespace-nowrap shrink-0">
              {caseInfo?.id || 'CASE-088'}
            </span>
            <span className="truncate text-xs font-medium text-slate-700 whitespace-nowrap">
              {caseInfo?.title || 'Operation Kolkata Synergy'}
            </span>
          </div>
        </div>

        {/* Center Group (Status Indicators): Compact system status indicator */}
        <div className="flex items-center justify-center shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-mono shrink-0">
            <span className={`w-2 h-2 rounded-full ${backendStatus?.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className="text-slate-500">DB:</span>
            <span className={`font-semibold ${backendStatus?.isLive ? 'text-emerald-700' : 'text-slate-500'}`}>
              {backendStatus?.isLive ? 'LIVE' : (backendStatus?.status === 'CHECKING' ? 'CONNECTING...' : 'OFFLINE')}
            </span>
          </div>
        </div>

        {/* Right Group (Actions & User Session): Compact flex items-center gap-1.5 shrink-0 */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!currentUser ? (
            /* UNAUTHENTICATED HEADER VIEW */
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => onOpenAuth?.('login')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              >
                <span className="material-symbols-outlined text-[16px] text-slate-500">login</span>
                <span>Sign In</span>
              </button>

              <button
                onClick={() => {
                  if (onLaunchWorkspace) onLaunchWorkspace();
                  else onOpenAuth?.('login');
                }}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Launch Workspace</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            /* AUTHENTICATED HEADER VIEW */
            <>
              {/* Role Switcher Dropdown (LEAD ▾ / Clearance selector) */}
              <div className="relative shrink-0" ref={roleDropdownRef}>
                <button 
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs transition-colors border border-slate-200/80 shadow-2xs cursor-pointer shrink-0"
                  title="Switch Law Enforcement RBAC Clearance Tier"
                  aria-label="Switch Clearance Tier"
                >
                  <span className="material-symbols-outlined text-slate-500 text-[16px]">admin_panel_settings</span>
                  <span className="font-semibold text-slate-900 text-xs">
                    {currentRoleInfo.short}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-[14px]">expand_more</span>
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl py-1.5 border border-slate-200 z-50 animate-fade-in">
                    <div className="px-3.5 py-1 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
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

              {/* Secondary action buttons: Field Guide (icon-only on medium, label on xl) */}
              <button 
                onClick={onOpenFieldGuide}
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200/80 shadow-2xs transition-colors cursor-pointer shrink-0"
                title="Field Guide & Operational Manual"
              >
                <span className="material-symbols-outlined text-slate-500 text-[16px]">menu_book</span>
                <span className="hidden xl:inline">Field Guide</span>
              </button>

              {/* Export Case Dossier (icon-only on medium, label on xl) */}
              <button 
                onClick={onOpenDossier}
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200/80 shadow-2xs transition-colors cursor-pointer shrink-0"
                title="Export Court-Certified Evidence Dossier"
              >
                <span className="material-symbols-outlined text-slate-500 text-[16px]">description</span>
                <span className="hidden xl:inline">Export</span>
              </button>

              {/* Upload Evidence Button */}
              <button 
                onClick={onOpenIngest}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
                title="Upload case documents, FIRs, and files"
              >
                <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                <span className="hidden lg:inline">Upload</span>
              </button>

              {/* User profile / Sign Out avatar button (shrink-0, never cut off or pushed off-screen) */}
              <div className="relative shrink-0" ref={profileMenuRef}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 cursor-pointer transition-colors shadow-2xs group shrink-0"
                  title={`Signed in as ${currentUser?.name || 'Officer'} (${currentRoleInfo.short}) - Click for profile & Sign Out`}
                  aria-label="User Profile and Session Menu"
                >
                  <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white font-mono text-[11px] font-bold shrink-0">
                    {currentUser?.name?.charAt(0) || 'O'}
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                  </div>
                  <div className="hidden lg:flex flex-col text-left min-w-0 max-w-[120px]">
                    <span className="font-semibold text-slate-900 text-xs truncate leading-tight">
                      {currentUser?.name || 'Officer on Duty'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono truncate leading-tight">
                      {currentUser?.department || currentUser?.jurisdiction || 'State Cyber Directorate'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 text-[15px] shrink-0">
                    {showProfileMenu ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-xl p-3 border border-slate-200 z-50 animate-fade-in text-xs">
                    <div className="pb-2.5 border-b border-slate-100 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs truncate max-w-[140px]">{currentUser?.name || 'Officer on Duty'}</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[9px] font-bold border border-emerald-200 shrink-0">
                          Active
                        </span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">Badge: {currentUser?.badgeNumber || 'WB-CID-0941'}</span>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-medium border border-slate-200">
                          {officerRole?.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-medium border border-blue-200">
                          {currentUser?.clearanceLevel || 'Tier 1 Top Secret'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenAuth?.('login');
                        }}
                        className="w-full py-1.5 px-2 text-left rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <span className="material-symbols-outlined text-[16px] text-slate-500">switch_account</span>
                        <span>Switch Clearance Account</span>
                      </button>
                      {onGoHome && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onGoHome();
                          }}
                          className="w-full py-1.5 px-2 text-left rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer font-medium"
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
                        className="w-full py-1.5 px-2 text-left rounded-xl hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer font-medium border-t border-slate-100 mt-1 pt-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px] text-rose-600">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
