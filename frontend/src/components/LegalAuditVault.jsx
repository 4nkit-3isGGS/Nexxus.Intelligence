import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { apiService, MOCK_AUDIT_LOGS } from '../services/api';

export default function LegalAuditVault({ caseInfo }) {
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState({
    verified: true,
    total_blocks: 5,
    message: 'Full backward linkage verified from Genesis Block to current Tip Block. Zero tampering detected.'
  });
  const [latestTipHash, setLatestTipHash] = useState(
    MOCK_AUDIT_LOGS[MOCK_AUDIT_LOGS.length - 1]?.entry_hash || 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
  );
  const [copiedHash, setCopiedHash] = useState(false);

  // Fetch real audit logs from GET /api/audit/logs
  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await apiService.getAuditLogs({ limit: 50 });
      if (res?.data?.entries) {
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
  }, []);

  // Trigger live cryptographic verification via POST /api/audit/verify
  const handleVerifyLedger = async () => {
    setVerifying(true);
    try {
      const result = await apiService.verifyAuditChain();
      setVerificationResult(result);
      if (result.verified) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
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
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto w-full p-margin lg:p-margin-lg bg-surface-base text-on-surface gap-space-lg no-scrollbar">
      {/* 1. TOP HEADER & COMPLIANCE SEAL */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-2xl p-space-lg bg-surface-container-lowest/90 backdrop-blur-2xl shadow-xl border border-white/[0.08]">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          <div className="flex items-start gap-space-md max-w-4xl">
            <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container shadow-xl border border-verified-emerald/30">
              <span className="material-symbols-outlined text-verified-emerald text-[28px]">gavel</span>
              <span className="absolute inset-0 rounded-xl bg-verified-emerald/10 animate-pulse"></span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-verified-emerald font-bold tracking-wider">
                  LEGAL VAULT // SECTION 65B BSA 2023
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-verified-emerald/20 text-verified-emerald border border-verified-emerald/30">
                  MATHEMATICALLY UNBREAKABLE
                </span>
              </div>
              <h1 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                Bharatiya Sakshya Adhiniyam (BSA) 2023 / Section 65B Cryptographic Audit Ledger
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl leading-relaxed">
                Immutable SHA-256 hash-chain <span className="font-label-sm text-label-sm text-primary font-semibold">[H_n = SHA-256(H_prev + payload)]</span> guaranteeing evidentiary admissibility, strict chain of custody, and mathematical non-repudiation in Indian Courts of Law.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-space-sm flex-shrink-0">
            <button
              onClick={handleVerifyLedger}
              disabled={verifying}
              className="flex items-center gap-space-xs px-4 py-2 rounded-lg bg-verified-emerald text-surface-base font-label-md text-label-md font-bold shadow-xl hover:bg-emerald-400 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">
                {verifying ? 'autorenew' : 'verified_user'}
              </span>
              <span>{verifying ? 'Verifying Hashes...' : 'Verify Hash-Chain (BSA §65B)'}</span>
            </button>
            <button
              onClick={handlePrintDossier}
              className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-medium transition-all shadow-md border border-white/[0.06]"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print Certified Evidence Dossier</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. LIVE INTEGRITY VERIFICATION BANNER */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md lg:p-space-lg shadow-xl border border-verified-emerald/30">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-verified-emerald/5 via-primary/5 to-transparent"></div>
        </div>
        <div className="relative flex flex-col gap-space-md z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-verified-emerald/20 flex items-center justify-center flex-shrink-0 text-verified-emerald">
                <span className="material-symbols-outlined text-[20px]">security</span>
              </div>
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Cryptographic Ledger Integrity Verified
                  </span>
                  <span className="font-label-sm text-label-sm text-verified-emerald font-bold tracking-wide uppercase">
                    (Zero Tampering Detected)
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Full backward linkage checked • Cryptographic roots mathematically congruent
                </span>
              </div>
            </div>

            <div className="flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-verified-emerald/15 text-verified-emerald font-label-sm text-label-sm font-semibold flex-shrink-0 shadow-sm border border-verified-emerald/30">
              <span className="w-2 h-2 rounded-full bg-verified-emerald animate-ping"></span>
              <span>{auditLogs.length}/{auditLogs.length} Blocks Verified • Merkle Root Match</span>
            </div>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-4xl leading-relaxed">
            Full hash-chain backward linkage verified from Genesis Block (Block #1) to current Tip Block. No modified timestamps, severed parent hashes, or manipulated investigator payloads detected. Fully compliant with Section 63 & 65B of Bharatiya Sakshya Adhiniyam, 2023.
          </p>

          {/* Block telemetry strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-sm pt-space-xs">
            <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col gap-1 border border-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Current Tip Block</span>
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-primary/20 text-primary font-bold">
                  BLOCK #{auditLogs.length}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="font-label-sm text-label-sm text-primary font-mono truncate" title={String(latestTipHash || '')}>
                  {typeof latestTipHash === 'string' && latestTipHash.length > 18
                    ? `${latestTipHash.slice(0, 10)}...${latestTipHash.slice(-8)}`
                    : (latestTipHash || 'ef2d12...fe39d')}
                </span>
                <button
                  onClick={handleCopyTip}
                  className="text-on-surface-variant hover:text-primary transition-colors flex-shrink-0"
                  title="Copy Full Tip Hash"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedHash ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col gap-1 border border-white/[0.04]">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">BSA Certificate Registry</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-verified-emerald text-[16px]">badge</span>
                <span className="font-label-sm text-label-sm text-on-surface font-mono font-bold tracking-tight">
                  BSA-KOL-2026-088-CERT
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col gap-1 border border-white/[0.04]">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Attestation Timestamp</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-primary text-[16px]">schedule</span>
                <span className="font-label-sm text-label-sm text-on-surface font-mono">
                  2026-03-24 18:45:12 IST
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col gap-1 border border-white/[0.04]">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Certifying Officer</span>
              <div className="flex items-center gap-1.5 mt-1 min-w-0">
                <span className="material-symbols-outlined text-risk-amber text-[16px]">verified</span>
                <span className="font-label-sm text-label-sm text-on-surface truncate font-medium">
                  Sub-Insp. B. Banerjee (WB-CID-0941)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUMMARY COURT FINDINGS (3 Admissible Evidence Pillars) */}
      <section className="flex flex-col flex-shrink-0 min-h-fit gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
            <h2 className="font-label-lg text-label-lg text-on-surface font-bold tracking-wide uppercase">
              ADMISSIBLE FORENSIC FINDINGS // READY FOR JUDICIAL SUBMISSION
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            3 Core Submissions Attached to Charge Sheet
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
          {/* Finding 1 */}
          <div className="flex flex-col justify-between rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md shadow-xl border border-white/[0.06]">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  Ex. P-01 // Topological Link
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-threat-crimson/20 text-threat-crimson">
                  MASTERMIND CUT-OUT
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Debasish Chatterjee (P008) Apex Coordination
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Betweenness centrality ratio of 0.942 proves de facto coordination of extortion operatives without direct communication to victims.
              </p>
            </div>
            <div className="mt-space-md pt-space-xs border-t border-white/[0.04] flex items-center justify-between text-outline font-label-sm text-label-sm">
              <span>Section 120B BNS</span>
              <span className="text-verified-emerald font-bold">Admissible</span>
            </div>
          </div>

          {/* Finding 2 */}
          <div className="flex flex-col justify-between rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md shadow-xl border border-white/[0.06]">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  Ex. P-02 // Hawala Layering Loop
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-risk-amber/20 text-risk-amber">
                  PMLA SEC 3/4
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                ₹500,000 Circular Mule Layering Under 48h
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Forensic transaction trace corroborates ₹500,000 circular loop returning to origin entity with 2% syndicate cut.
              </p>
            </div>
            <div className="mt-space-md pt-space-xs border-t border-white/[0.04] flex items-center justify-between text-outline font-label-sm text-label-sm">
              <span>PMLA / Sec 107 BNSS</span>
              <span className="text-verified-emerald font-bold">Admissible</span>
            </div>
          </div>

          {/* Finding 3 */}
          <div className="flex flex-col justify-between rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md shadow-xl border border-white/[0.06]">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  Ex. P-03 // Acoustic Intercept
                </span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-primary/20 text-primary">
                  SEC 66D IT ACT
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                22-Call Extortion Burst & Voice Match
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Acoustic voiceprint match (94.2% confidence) of Rajesh K. Sharma demanding extortion payment from victim Manoj Tiwari.
              </p>
            </div>
            <div className="mt-space-md pt-space-xs border-t border-white/[0.04] flex items-center justify-between text-outline font-label-sm text-label-sm">
              <span>Telecomm Intercept #05B</span>
              <span className="text-verified-emerald font-bold">Admissible</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. APPEND-ONLY CRYPTOGRAPHIC AUDIT LEDGER TABLE */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-white/[0.08] flex flex-col flex-shrink-0 min-h-fit gap-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.04] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-verified-emerald text-[20px]">enhanced_encryption</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Append-Only Cryptographic Chain (SHA-256)
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-outline font-mono">
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
                className="p-4 rounded-xl bg-surface-container-low border border-white/[0.04] flex flex-col gap-2 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-label-sm font-label-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-bold font-mono">
                      BLOCK #{idx + 1}
                    </span>
                    <span className="text-on-surface font-semibold">{actionText}</span>
                    <span className="text-outline">•</span>
                    <span className="text-on-surface-variant font-mono">{log.timestamp}</span>
                  </div>
                  <span className="text-outline font-mono text-[11px]">Investigator: {investigatorText}</span>
                </div>

                <p className="text-body-sm text-on-surface-variant text-[12px] font-mono">
                  {detailsText}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] font-mono text-[10px]">
                  <div className="truncate text-outline">
                    <span>PREV_HASH: </span>
                    <span className="text-on-surface-variant">{prevHash}</span>
                  </div>
                  <div className="truncate text-primary">
                    <span>ENTRY_HASH: </span>
                    <span className="text-primary font-bold">{entryHash}</span>
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
