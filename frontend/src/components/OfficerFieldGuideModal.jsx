import React, { useState } from 'react';

export default function OfficerFieldGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('legend'); // 'legend' | 'signals' | 'roles' | 'shortcuts'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-slate-900">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">menu_book</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-slate-900">
                  Officer Field Guide & Operational Manual
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold border border-slate-200/80">
                  DEFENSE GUIDE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Nexxus Intelligence // Standard Operating Procedures
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200/80 bg-white flex items-center gap-4">
          <button
            onClick={() => setActiveTab('legend')}
            className={`py-3 px-1 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'legend'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">palette</span>
            <span>Entity Visual Key</span>
          </button>
          <button
            onClick={() => setActiveTab('signals')}
            className={`py-3 px-1 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'signals'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">radar</span>
            <span>Forensic Signals</span>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-3 px-1 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roles'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">shield_person</span>
            <span>Clearance Roles</span>
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`py-3 px-1 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'shortcuts'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">keyboard</span>
            <span>Shortcuts</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-slate-700">
          
          {/* TAB 1: ENTITY VISUAL KEY */}
          {activeTab === 'legend' && (
            <div className="space-y-3">
              <p className="text-slate-600 leading-relaxed">
                The Crime Knowledge Graph categorizes entities using specialized color-coded rings, icons, and size metrics:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Suspect (Person)</span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Primary targets, syndicate operators, and victims. Node size is scaled by criminal risk score and betweenness centrality.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/50 border border-sky-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Burner SIM / Phone</span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Telephony nodes extracted from CDR files. High call burst frequencies are highlighted with pulsating red energy pulses.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Mule Bank Account</span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Financial accounts used to receive and rapidly disperse extorted capital. Circular transfers glow amber.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">domain</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Shell Organization</span>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      Corporate fronts used to layer money or disguise syndicate ownership.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FORENSIC SIGNALS */}
          {activeTab === 'signals' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-amber-600 text-[18px]">cached</span>
                  Circular Hawala Money Looping
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  When funds leave an origin account, pass through two or more mule accounts (e.g. A001 &rarr; A002), and return to a syndicate-connected corporate entity within 48 hours, Nexxus automatically flags the loop for PMLA Sec 3/4 violation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-rose-600 text-[18px]">notifications_active</span>
                  Extortion Call Spikes
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Unusual statistical bursts of short-duration calls (e.g. 22 calls in 3 hours) between unknown numbers and victims represent targeted duress.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                  BSA §65B Cryptographic Evidence Hashing
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Under the Bharatiya Sakshya Adhiniyam, 2023, electronic evidence must prove chain-of-custody without tampering. Nexxus maintains a backward-linked SHA-256 ledger guaranteeing zero retroactive alteration.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ROLES & CLEARANCES */}
          {activeTab === 'roles' && (
            <div className="space-y-3">
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Clearance Tier</th>
                      <th className="p-3">PII Visibility</th>
                      <th className="p-3">Audit Ledger</th>
                      <th className="p-3">Typical Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-bold text-sky-700">LEAD_INVESTIGATOR</td>
                      <td className="p-3 text-emerald-700 font-semibold">Unmasked PII</td>
                      <td className="p-3 text-emerald-700 font-semibold">Full Access</td>
                      <td className="p-3 text-slate-600">DSP / SP / Inspector</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-700">INVESTIGATOR</td>
                      <td className="p-3 text-amber-700 font-semibold">Partial Masked</td>
                      <td className="p-3 text-rose-600 font-semibold">Restricted (403)</td>
                      <td className="p-3 text-slate-600">Sub-Inspector / Field Team</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-700">ANALYST</td>
                      <td className="p-3 text-rose-600 font-semibold">Full Masked</td>
                      <td className="p-3 text-rose-600 font-semibold">Restricted (403)</td>
                      <td className="p-3 text-slate-600">Intelligence Analyst / Intern</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-purple-700">AUDITOR</td>
                      <td className="p-3 text-slate-600 font-semibold">Read-Only Logs</td>
                      <td className="p-3 text-emerald-700 font-semibold">Full Audit Vault</td>
                      <td className="p-3 text-slate-600">Judicial Magistrate / Public Prosecutor</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Omnisearch Suspects</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[10px] font-mono font-bold shadow-xs">
                    Ctrl + K
                  </kbd>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Close Evidence Drawer</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[10px] font-mono font-bold shadow-xs">
                    Esc
                  </kbd>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Zoom Graph Canvas</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[10px] font-mono font-bold shadow-xs">
                    Scroll Wheel
                  </kbd>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Pan Graph Canvas</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-[10px] font-mono font-bold shadow-xs">
                    Click + Drag
                  </kbd>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Nexxus Intelligence v2.6 // Defense System Manual</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
