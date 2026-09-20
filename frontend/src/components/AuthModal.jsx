import React, { useState } from 'react';
import { apiService, DEMO_OFFICERS } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login form state
  const [loginIdent, setLoginIdent] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regBadge, setRegBadge] = useState('');
  const [regDept, setRegDept] = useState('CID Cyber Crime Directorate');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('LEAD_INVESTIGATOR');
  const [regPass, setRegPass] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  if (!isOpen) return null;

  const handleDemoLogin = async (demoOfficer) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.login({
        identifier: demoOfficer.badgeNumber,
        role: demoOfficer.role
      });
      if (res.success) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Authentication failed');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    if (!loginIdent.trim()) {
      setError('Please provide your Badge Number or Official Email.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.login({
        identifier: loginIdent.trim(),
        password: loginPass || 'demo123'
      });
      if (res.success) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Authentication failed');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regBadge.trim() || !regEmail.trim()) {
      setError('Please fill in all mandatory officer credentials.');
      return;
    }
    if (!acceptedTerms) {
      setError('You must acknowledge the Official Secrets Act & Section 65B statutory compliance.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.register({
        name: regName.trim(),
        badge_number: regBadge.trim(),
        department: regDept.trim(),
        email: regEmail.trim(),
        role: regRole,
        jurisdiction: 'State Law Enforcement Command',
        password: regPass || 'demo123'
      });
      if (res.success) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in text-slate-900 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/80 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Law Enforcement Authentication & Clearance
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-mono text-[9px] font-semibold">
                  RBAC SECURE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Nexxus Intelligence • Tiered Need-to-Know Authorization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-0 border-b border-slate-200/80 flex items-center gap-4 flex-shrink-0 bg-white">
          <button
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`pb-2.5 text-xs font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'login'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Officer Sign In</span>
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`pb-2.5 text-xs font-semibold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Register New Clearance</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 no-scrollbar flex flex-col gap-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/70 text-rose-700 flex items-center gap-2 animate-fade-in text-xs font-medium">
              <span className="material-symbols-outlined text-[18px] text-rose-600">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <div className="flex flex-col gap-4">
              {/* 1-Click Demo Roles */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-semibold text-slate-500 tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-600">bolt</span>
                    1-Click Evaluator & Demo Clearance
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium font-mono">Instant Access</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEMO_OFFICERS.map((officer) => (
                    <button
                      key={officer.userId}
                      onClick={() => handleDemoLogin(officer)}
                      disabled={loading}
                      className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-400 hover:bg-slate-50/50 text-left transition-all shadow-xs flex flex-col gap-1 cursor-pointer active:scale-98 disabled:opacity-50 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 text-xs group-hover:text-slate-900">
                          {officer.name}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-medium ${
                          officer.role === 'LEAD_INVESTIGATOR' ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                          officer.role === 'INVESTIGATOR' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          officer.role === 'ANALYST' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
                        }`}>
                          {officer.role.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Badge: <span className="font-medium text-slate-600">{officer.badgeNumber}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1">
                        {officer.clearanceLevel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-slate-200/80"></div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">OR SIGN IN WITH CREDENTIALS</span>
                <div className="flex-1 h-px bg-slate-200/80"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleCustomLogin} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-700 font-mono uppercase">
                    Badge Number or Police Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginIdent}
                      onChange={(e) => setLoginIdent(e.target.value)}
                      placeholder="e.g. WB-CID-0941 or officer@police.gov.in"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-slate-500 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none font-medium"
                    />
                    <span className="material-symbols-outlined text-[17px] text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2">
                      badge
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-700 font-mono uppercase">
                    Security PIN / Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-slate-500 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none font-medium"
                    />
                    <span className="material-symbols-outlined text-[17px] text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2">
                      lock
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {loading ? 'autorenew' : 'security'}
                  </span>
                  <span>{loading ? 'Authenticating...' : 'Authenticate Law Enforcement Session'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-700 font-mono uppercase">
                    Officer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Insp. Amit Roy"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-slate-500 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-700 font-mono uppercase">
                    Service Badge Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regBadge}
                    onChange={(e) => setRegBadge(e.target.value)}
                    placeholder="e.g. WB-CID-8812"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-slate-500 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none font-medium font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-700 font-mono uppercase">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="officer@cid.wb.gov.in"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-slate-500 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-700 font-mono uppercase">
                    Investigation Unit / Cell
                  </label>
                  <input
                    type="text"
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    placeholder="e.g. Kolkata Cyber Cell"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-slate-500 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-slate-700 font-mono uppercase">
                  Requested RBAC Clearance Tier *
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-slate-500 text-slate-900 text-xs focus:outline-none font-medium"
                >
                  <option value="LEAD_INVESTIGATOR">👑 LEAD_INVESTIGATOR (DSP / ACP — Full Clearance, Unmasked PII, Asset Freeze)</option>
                  <option value="INVESTIGATOR">🔍 INVESTIGATOR (Inspector / SI — Field Ops, Telecomm / CDR)</option>
                  <option value="ANALYST">📊 ANALYST (Intelligence Analyst — Topology, Centrality, Masked PII)</option>
                  <option value="AUDITOR">⚖️ AUDITOR (Judicial Auditor — Read-Only §65B Court Ledger)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-slate-700 font-mono uppercase">
                  Security PIN / Password
                </label>
                <input
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="Set password (default: demo123)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:border-slate-500 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none font-medium"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-slate-900 focus:ring-slate-500"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                  I certify that I am authorized personnel accessing criminal intelligence subject to the <strong>Official Secrets Act</strong> and Section 65B of the <strong>Bharatiya Sakshya Adhiniyam, 2023</strong>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[17px]">
                  {loading ? 'autorenew' : 'how_to_reg'}
                </span>
                <span>{loading ? 'Registering...' : 'Register & Issue Clearance'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
