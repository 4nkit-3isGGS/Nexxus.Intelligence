import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Sidebar({
  nodeCount = 0,
  pendingReviewCount = 0, // always passed from App.jsx — scoped to active investigation subgraph
  backendStatus = { isLive: true },
  officerRole = 'LEAD_INVESTIGATOR',
  onGoHome
}) {
  const isAuditRestricted = officerRole === 'INVESTIGATOR' || officerRole === 'ANALYST';

  const resolvedReviewCount = pendingReviewCount;

  const navItems = [
    {
      id: 'graph',
      path: '/workspace/graph',
      label: 'Knowledge Graph',
      icon: 'hub',
      badge: nodeCount,
      badgeClassName: 'px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-medium',
    },
    {
      id: 'agent',
      path: '/workspace/investigation',
      label: 'AI Investigation',
      icon: 'psychology',
      badge: 'AI',
      badgeHighlight: true
    },
    {
      id: 'resolution',
      path: '/workspace/resolution',
      label: 'Entity Resolution',
      icon: 'fingerprint',
      badge: resolvedReviewCount ? `${resolvedReviewCount}` : null,
    },
    {
      id: 'financial',
      path: '/workspace/financial',
      label: 'Money Trail & Hawala',
      icon: 'account_balance',
      badge: null
    },
    {
      id: 'cdr',
      path: '/workspace/cdr',
      label: 'Call Records & Towers',
      icon: 'phone_in_talk',
      badge: null
    },
    {
      id: 'fir',
      path: '/workspace/fir',
      label: 'FIR Documents',
      icon: 'policy',
      badge: null
    },
    {
      id: 'audit',
      path: '/workspace/audit',
      label: 'Legal Audit Vault',
      icon: 'gavel',
      badge: isAuditRestricted ? 'Locked' : '§65B',
      badgeRestricted: isAuditRestricted
    }
  ];

  return (
    <aside className="w-60 h-full flex-shrink-0 bg-white z-30 flex flex-col justify-between p-3 border-r border-slate-200/80 overflow-y-auto no-scrollbar">
      <div className="flex flex-col gap-3">
        {/* Navigation Category Header */}
        <div className="px-2 pt-1 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
            Workspace
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Online</span>
          </div>
        </div>

        {/* Tactical Navigation Items */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all text-left group cursor-pointer ${isActive
                  ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`material-symbols-outlined text-[18px] transition-colors ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[13px] truncate">{item.label}</span>
                  </div>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`shrink-0 ${item.badgeClassName
                          ? item.badgeClassName
                          : item.id === 'graph'
                            ? 'px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-medium'
                            : item.badgeHighlight
                              ? 'text-[10px] font-mono px-1.5 py-0.2 rounded font-medium bg-purple-50 text-purple-700 border border-purple-200/60'
                              : item.badgeRestricted
                                ? 'text-[10px] font-mono px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-500'
                                : isActive
                                  ? 'text-[10px] font-mono px-1.5 py-0.2 rounded font-medium bg-white text-slate-700 shadow-2xs border border-slate-200/60'
                                  : 'text-[10px] font-mono px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-500'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Compact Telemetry Footer */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 px-2 text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Active Nodes</span>
          <span className="text-slate-800 font-semibold">{nodeCount} Verified</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Integrity Check</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            Valid
          </span>
        </div>
      </div>
    </aside>
  );
}