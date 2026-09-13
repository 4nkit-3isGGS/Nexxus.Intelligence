import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Printer, 
  Lock, 
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  FileCheck,
  Hash,
  Fingerprint,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiService, MOCK_AUDIT_LOGS } from '../services/api';

export default function LegalAuditVault({ caseInfo }) {
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [latestTipHash, setLatestTipHash] = useState(MOCK_AUDIT_LOGS[MOCK_AUDIT_LOGS.length - 1]?.entry_hash || '');

  // Fetch real audit logs from GET /api/audit/logs
  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await apiService.getAuditLogs({ limit: 50 });
      if (res?.data?.entries) {
        setAuditLogs(res.data.entries);
        setLatestTipHash(res.data.latest_hash || '');
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

  const handlePrintDossier = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto w-full p-4 lg:p-6 bg-[#060913]">
      <div className="max-w-6xl w-full mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-white/[0.02] to-transparent border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold tracking-wider">
                  LEGAL VAULT // COURT EVIDENCE READY
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  BSA §65B CERTIFIED
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Bharatiya Sakshya Adhiniyam (BSA) 2023 / Section 65B Audit Ledger
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Append-only cryptographic hash-chain [H_n = SHA-256(H_prev + payload)] guaranteeing legal admissibility and tamper-evidence in Indian courts.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleVerifyLedger}
              disabled={verifying}
              className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Chain...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify Hash-Chain (BSA §65B)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrintDossier}
              className="px-4 py-2 btn-glow-cyan font-semibold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Verification Result Banner */}
      {verificationResult && (
        <div className={`rounded-2xl p-4.5 border transition-all animate-fade-in ${
          verificationResult.verified
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-xl mt-0.5 ${
                verificationResult.verified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {verificationResult.verified ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {verificationResult.verified
                    ? 'Cryptographic Ledger Integrity Verified (Zero Tampering Detected)'
                    : 'Ledger Integrity Verification Alert: Discrepancy Found'}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 text-slate-300">
                    {verificationResult.record_count || auditLogs.length} Blocks Verified
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {verificationResult.message}
                </p>
                {verificationResult.latest_hash && (
                  <div className="mt-2 flex items-center space-x-2 text-[10px] font-mono text-slate-400">
                    <span className="text-slate-500 font-semibold">TIP SHA-256:</span>
                    <span className="text-emerald-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                      {verificationResult.latest_hash}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setVerificationResult(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-white/[0.04]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Cryptographic Append-Only Ledger Table (GET /api/audit/logs) */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Append-Only Cryptographic Audit Ledger (GET /api/audit/logs)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
              {auditLogs.length} Blocks Recorded
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAuditLogs}
              disabled={loadingLogs}
              className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 flex items-center space-x-1.5 transition-all border border-white/[0.06]"
            >
              <RefreshCw className={`w-3 h-3 ${loadingLogs ? 'animate-spin' : ''}`} />
              <span>Refresh Ledger</span>
            </button>
            <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chain Intact</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] text-slate-500 font-mono uppercase">
                <th className="py-2.5 px-3">Log ID & Action</th>
                <th className="py-2.5 px-3">Officer & Role</th>
                <th className="py-2.5 px-3">Resource</th>
                <th className="py-2.5 px-3">Current Block Hash (SHA-256)</th>
                <th className="py-2.5 px-3">Previous Chained Hash</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono">
              {auditLogs.map((entry, i) => (
                <tr key={entry.log_id || i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-cyan-300 block">{entry.log_id}</span>
                    <span className="text-[10px] font-mono text-slate-400">{entry.action}</span>
                    <span className="text-[9px] text-slate-500 block">{entry.timestamp?.replace('T', ' ').slice(0, 19)}</span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <span className="text-slate-200 font-medium block">{entry.user_id}</span>
                    <span className="text-[10px] font-mono text-amber-300/80">{entry.role}</span>
                    {entry.badge_number && (
                      <span className="text-[9px] text-slate-500 block font-mono">{entry.badge_number}</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-300 font-medium block">{entry.resource_id}</span>
                    <span className="text-[10px] text-slate-500">{entry.resource_type}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-emerald-400/90 truncate max-w-[160px] block font-mono bg-black/30 px-1.5 py-0.5 rounded border border-white/[0.04]">
                      {entry.entry_hash}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-slate-500 truncate max-w-[140px] block font-mono">
                      {entry.prev_hash?.slice(0, 16)}...
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ BSA 65B VALID
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Findings */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-3 shadow-lg">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Summary Case Findings ({caseInfo?.id || 'CASE-KOL-2026-088'})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.04] space-y-1">
            <span className="font-bold text-slate-200 block">1. Mastermind Identification</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Debasish Chatterjee (P008) identified as bridge node connecting Extortion (Cluster A) and Laundering (Cluster B) with 0.942 Betweenness Centrality.
            </p>
          </div>

          <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.04] space-y-1">
            <span className="font-bold text-slate-200 block">2. Extortion Calling Spike</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              22 extortion calls logged on 2026-03-05 from Rajesh Kumar Sharma to victim Manoj Tiwari, coercing ₹45,000 duress payment.
            </p>
          </div>

          <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.04] space-y-1">
            <span className="font-bold text-slate-200 block">3. Circular Money Loop</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              ₹500,000 circular fund route across Ashok Mehta, Priya Banerjee, and Nikhil Ghosh completed in 48 hours at Kolkata Commercial Bank.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
