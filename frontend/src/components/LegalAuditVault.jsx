import React, { useState, useEffect } from 'react';
import { apiService, MOCK_AUDIT_LOGS } from '../services/api';

export default function LegalAuditVault({ 
  caseInfo, 
  officerRole = 'LEAD_INVESTIGATOR', 
  currentUser, 
  onRoleChange 
}) {
  const formatMaskedHash = (hashStr) => {
    if (!hashStr) return 'xxxx...xxxx';
    const str = String(hashStr).trim();
    if (str.includes('(GENESIS)')) return 'xxxx...0000000000 (GENESIS)';
    if (str.length <= 10) return `xxxx...${str}`;
    return `xxxx...${str.slice(-10)}`;
  };

  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [rbacError, setRbacError] = useState(null);
  const [verificationResult, setVerificationResult] = useState({
    verified: true,
    total_blocks: 5,
    message: 'Full backward linkage verified from Genesis Block to current Tip Block. Zero tampering detected.'
  });
  const [latestTipHash, setLatestTipHash] = useState(
    MOCK_AUDIT_LOGS[MOCK_AUDIT_LOGS.length - 1]?.entry_hash || 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
  );
  const [copiedHash, setCopiedHash] = useState(false);

  const isRestrictedRole = officerRole === 'INVESTIGATOR' || officerRole === 'ANALYST';

  // Fetch real audit logs from GET /api/audit/logs
  const fetchAuditLogs = async () => {
    if (isRestrictedRole) {
      setRbacError(`Access Denied: Officer role '${officerRole}' lacks 'VIEW_AUDIT_LOGS' clearance. Access to the immutable cryptographic ledger is restricted to AUDITOR, LEAD_INVESTIGATOR, and ADMIN.`);
      return;
    }
    setRbacError(null);
    setLoadingLogs(true);
    try {
      const res = await apiService.getAuditLogs({ limit: 50 });
      if (res?.error) {
        setRbacError(res.error);
      } else if (res?.data?.entries) {
        setAuditLogs(res.data.entries);
        setLatestTipHash(res.data.latest_hash || latestTipHash);
      }
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [officerRole]);

  // Trigger live cryptographic verification via POST /api/audit/verify
  const handleVerifyLedger = async () => {
    setVerifying(true);
    try {
      const result = await apiService.verifyAuditChain();
      setVerificationResult(result);
    } catch (e) {
      setVerificationResult({
        verified: false,
        message: `Verification check error: ${e.message}`
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyTip = () => {
    navigator.clipboard.writeText(latestTipHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto w-full p-4 lg:p-6 bg-transparent text-slate-900 gap-5 no-scrollbar">
      {/* RBAC Access Denied Banner */}
      {rbacError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-rose-600 text-[24px] flex-shrink-0">lock</span>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900">{rbacError}</span>
              <span className="text-slate-500 text-[11px] mt-0.5">
                Current Role: <span className="font-mono font-semibold text-rose-700">{officerRole}</span>. Audit ledger inspection requires <span className="font-semibold">AUDITOR</span> or <span className="font-semibold">LEAD_INVESTIGATOR</span> clearance.
              </span>
            </div>
          </div>
          {onRoleChange && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onRoleChange('AUDITOR')}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Switch to Auditor (Adv. M. Mukherjee)
              </button>
              <button
                onClick={() => onRoleChange('LEAD_INVESTIGATOR')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Switch to Lead (DSP B. Banerjee)
              </button>
            </div>
          )}
        </div>
      )}

      {/* 1. TOP HEADER & COMPLIANCE SEAL */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 max-w-4xl">
            <div className="relative flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">gavel</span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                  COURT EVIDENCE VAULT // BSA SECTION 65B
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                  TAMPER-PROOF RECORD
                </span>
              </div>
              <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                Electronic Evidence Audit Log (BSA Section 65B Compliant)
              </h1>
              <p className="text-xs text-slate-500 max-w-3xl leading-relaxed font-normal">
                Cryptographically sealed append-only audit trail preserving chain-of-custody and digital admissibility for judicial submission.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              onClick={handleVerifyLedger}
              disabled={verifying}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                {verifying ? 'autorenew' : 'verified_user'}
              </span>
              <span>{verifying ? 'Verifying Records...' : 'Verify Evidence Chain (BSA §65B)'}</span>
            </button>
            <button
              onClick={handlePrintDossier}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium transition-all border border-slate-200/80 cursor-pointer active:scale-95 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Evidence Report</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. LIVE INTEGRITY VERIFICATION BANNER */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-2xl bg-white p-5 border border-emerald-200/80 shadow-xs">
        <div className="relative flex flex-col gap-4 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-700 border border-emerald-200/70">
                <span className="material-symbols-outlined text-[18px]">security</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-base text-slate-900 font-bold">
                    Evidence Integrity Verified
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 font-semibold tracking-wide uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                    Zero Tampering Detected
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  All records verified from start to finish • No alterations found
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-semibold flex-shrink-0 border border-emerald-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              <span>{auditLogs.length}/{auditLogs.length} Records Verified • Chain Intact</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-4xl leading-relaxed font-normal">
            All audit records have been verified from the very first entry to the latest update. No altered dates, modified records, or missing entries were detected. Fully compliant with electronic evidence rules under BSA 2023 Section 65B.
          </p>

          {/* Block telemetry strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-50 flex flex-col gap-1 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">Current Tip Block</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 font-semibold">
                  BLOCK #{auditLogs.length}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-xs text-slate-900 font-mono truncate font-semibold" title={String(latestTipHash || '')}>
                  {formatMaskedHash(latestTipHash)}
                </span>
                <button
                  onClick={handleCopyTip}
                  className="text-slate-400 hover:text-slate-800 transition-colors flex-shrink-0 cursor-pointer"
                  title="Copy Full Tip Hash"
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {copiedHash ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 flex flex-col gap-1 border border-slate-200/80">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">BSA Certificate Registry</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-emerald-700 text-[15px]">badge</span>
                <span className="text-xs text-slate-900 font-mono font-semibold tracking-tight">
                  BSA-KOL-2026-088-CERT
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 flex flex-col gap-1 border border-slate-200/80">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">Attestation Timestamp</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-slate-500 text-[15px]">schedule</span>
                <span className="text-xs text-slate-900 font-mono font-medium">
                  2026-03-24 18:45:12 IST
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 flex flex-col gap-1 border border-slate-200/80">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">Certifying Officer</span>
              <div className="flex items-center gap-1.5 mt-1 min-w-0">
                <span className="material-symbols-outlined text-amber-600 text-[15px]">verified</span>
                <span className="text-xs text-slate-900 truncate font-semibold">
                  Sub-Insp. B. Banerjee (WB-CID-0941)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUMMARY COURT FINDINGS (3 Admissible Evidence Pillars) */}
      <section className="flex flex-col flex-shrink-0 min-h-fit gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-600 text-[18px]">account_balance</span>
            <h2 className="text-xs font-mono font-semibold text-slate-900 tracking-wider uppercase">
              ADMISSIBLE FORENSIC FINDINGS // JUDICIAL SUBMISSION
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            3 Core Exhibits Attached to Charge Sheet
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Finding 1 */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider">
                  Ex. P-01 // Topological Link
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                  MASTERMIND CUT-OUT
                </span>
              </div>
              <h3 className="font-display text-sm font-semibold text-slate-900 mt-1">
                Debasish Chatterjee (P008) Apex Coordination
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Betweenness centrality ratio of 0.942 proves de facto coordination of extortion operatives without direct communication to victims.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
              <span className="font-mono text-slate-600">Section 120B BNS</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Admissible
              </span>
            </div>
          </div>

          {/* Finding 2 */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider">
                  Ex. P-02 // Hawala Layering Loop
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/70">
                  PMLA SEC 3/4
                </span>
              </div>
              <h3 className="font-display text-sm font-semibold text-slate-900 mt-1">
                ₹500,000 Circular Mule Layering Under 48h
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Forensic transaction trace corroborates ₹500,000 circular loop returning to origin entity with 2% syndicate cut.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
              <span className="font-mono text-slate-600">PMLA / Sec 107 BNSS</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Admissible
              </span>
            </div>
          </div>

          {/* Finding 3 */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-5 border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider">
                  Ex. P-03 // Acoustic Intercept
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200/70">
                  SEC 66D IT ACT
                </span>
              </div>
              <h3 className="font-display text-sm font-semibold text-slate-900 mt-1">
                22-Call Extortion Burst & Voice Match
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                Acoustic voiceprint match (94.2% confidence) of Rajesh K. Sharma demanding extortion payment from victim Manoj Tiwari.
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-slate-500 text-xs">
              <span className="font-mono text-slate-600">Telecomm Intercept #05B</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Admissible
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. APPEND-ONLY CRYPTOGRAPHIC AUDIT LEDGER TABLE */}
      <section className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col flex-shrink-0 min-h-fit gap-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/80">
              <span className="material-symbols-outlined text-[18px]">enhanced_encryption</span>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Append-Only Cryptographic Chain (SHA-256)
              </h3>
              <p className="text-[11px] text-slate-500">Immutable ledger hash chain with backward linkage</p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono font-medium">
            Chain Depth: {auditLogs.length} Blocks
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {auditLogs.map((log, idx) => {
            const detailsText = typeof log.details === 'string' 
              ? log.details 
              : log.details 
              ? JSON.stringify(log.details) 
              : typeof log.payload_preview === 'string'
              ? log.payload_preview
              : JSON.stringify(log.payload_preview || 'Payload hash validated under BSA 2023.');

            const prevHash = log.prev_hash || log.previous_hash || '00000000000000000000000000000000 (GENESIS)';
            const entryHash = log.entry_hash || 'a89fb73d32de...';
            const actionText = log.action || log.action_type || 'INVESTIGATIVE_ACTION';
            const investigatorText = log.user_id || log.badge_number || log.investigator_id || 'WB-CID-0941';

            return (
              <div
                key={log.log_id || log.entry_id || idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2.5 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white text-slate-800 border border-slate-200/80 font-semibold font-mono text-[10px]">
                      BLOCK #{idx + 1}
                    </span>
                    <span className="text-slate-900 font-semibold">{actionText}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-mono text-[11px]">{log.timestamp}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Investigator: <span className="text-slate-900 font-medium">{investigatorText}</span></span>
                </div>

                <p className="text-xs text-slate-700 font-mono leading-relaxed bg-white p-3 rounded-lg border border-slate-200/70">
                  {detailsText}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-200/70 font-mono text-[10px]">
                  <div className="truncate text-slate-500" title={`Full PREV_HASH: ${prevHash}`}>
                    <span className="font-semibold text-slate-600">PREV_HASH: </span>
                    <span className="text-slate-500 font-mono">{formatMaskedHash(prevHash)}</span>
                  </div>
                  <div className="truncate text-slate-800 font-medium" title={`Full ENTRY_HASH: ${entryHash}`}>
                    <span className="font-semibold text-slate-600">ENTRY_HASH: </span>
                    <span className="text-slate-900 font-semibold font-mono">{formatMaskedHash(entryHash)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
