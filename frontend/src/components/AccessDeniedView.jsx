import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccessDeniedView({
  requiredRoles = ['LEAD_INVESTIGATOR', 'AUDITOR'],
  currentRole = 'INVESTIGATOR',
  currentUser,
  onRoleChange,
  pageTitle = 'Legal Audit Vault (BSA §65B)'
}) {
  const navigate = useNavigate();

  const roleNameMap = {
    LEAD_INVESTIGATOR: 'Lead Investigator (Tier 1)',
    INVESTIGATOR: 'Field Investigator (Tier 2)',
    ANALYST: 'Intelligence Analyst (Tier 2)',
    AUDITOR: 'Judicial Auditor (Tier 3)',
    ADMIN: 'System Administrator'
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-900 bg-slate-50/70 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-xl bg-white border border-rose-200 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center animate-fade-in relative overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-purple-600"></div>

        {/* Shield / Lock Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs mb-4">
          <span className="material-symbols-outlined text-[36px]">gavel</span>
        </div>

        {/* Security Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold mb-3">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
          <span>HTTP 403 // CLEARANCE RESTRICTED</span>
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Access Restricted: Statutory Clearance Required
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-xs text-slate-600 max-w-md leading-relaxed">
          Access to <span className="font-bold text-slate-900">{pageTitle}</span> is guarded under the
          <strong> Bharatiya Sakshya Adhiniyam, 2023</strong> electronic evidence admissibility framework.
        </p>

        {/* Role Diagnostic Card */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 my-5 text-left flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-medium">Logged in Officer:</span>
            <span className="font-bold text-slate-900 font-sans">
              {currentUser?.name || 'Officer on Duty'}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-medium">Active Clearance Role:</span>
            <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
              {currentRole} ({roleNameMap[currentRole] || currentRole})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Authorized Roles:</span>
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {requiredRoles.map((r) => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Elevation Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
          {onRoleChange && (
            <>
              <button
                onClick={() => onRoleChange('AUDITOR')}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Switch to Auditor</span>
              </button>
              <button
                onClick={() => onRoleChange('LEAD_INVESTIGATOR')}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">shield_person</span>
                <span>Switch to Lead</span>
              </button>
            </>
          )}
        </div>

        {/* Back to Graph Navigation */}
        <button
          onClick={() => navigate('/workspace/graph')}
          className="mt-3 text-xs text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_back</span>
          <span>Return to Knowledge Graph</span>
        </button>
      </div>
    </div>
  );
}
