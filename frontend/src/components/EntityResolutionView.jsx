import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { apiService } from '../services/api';

export default function EntityResolutionView({ onFocusEntity, onJumpToGraph }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Load Review Queue from live backend or fallback
  const fetchQueue = async () => {
    setLoading(true);
    const result = await apiService.getReviewQueue();
    if (result && Array.isArray(result.data)) {
      setQueue(result.data);
    } else {
      setQueue([
        {
          id: 'REV-001',
          entity1_id: 'P003',
          entity1_name: 'Rajesh Kumar Sharma',
          entity1_type: 'Person',
          entity1_risk: 91,
          entity1_phone: '+91 98321 45678',
          entity1_bank: 'Kolkata Comm. Bank #3012',
          entity2_id: 'P008_ALIAS',
          entity2_name: 'Commander Raj (VoIP Alias)',
          entity2_type: 'Person',
          entity2_risk: 88,
          entity2_phone: '+91 98321 45678',
          entity2_bank: 'Kolkata Comm. Bank #3012',
          match_score: 96,
          shared_features: ['Identical MSISDN', 'Matching Voiceprint (94.2%)', 'Co-located Cell Tower #KOL-SL-04'],
          conflict_features: ['Reported IP Patna vs Kolkata'],
          recommended_action: 'MERGE'
        },
        {
          id: 'REV-002',
          entity1_id: 'V001',
          entity1_name: 'WB01AB1234 (Toyota Fortuner)',
          entity1_type: 'Vehicle',
          entity1_risk: 85,
          entity1_phone: 'FastTag ID: FT-904128',
          entity1_bank: 'Owner: Shubh Laxmi Fin.',
          entity2_id: 'V002_CLONED',
          entity2_name: 'WB01AB1234 (Ghost Duplicate)',
          entity2_type: 'Vehicle',
          entity2_risk: 82,
          entity2_phone: 'FastTag ID: FT-882190',
          entity2_bank: 'Owner: Burrabazar Courier',
          match_score: 92,
          shared_features: ['Identical Registration Plate', 'Chassis Tamper Signature', 'Sector V Toll Gate Spikes'],
          conflict_features: ['Different RFID Transponder EPC'],
          recommended_action: 'FLAG_CLONED'
        },
        {
          id: 'REV-003',
          entity1_id: 'A001',
          entity1_name: 'HDFC ****4921 (Bimal Sen)',
          entity1_type: 'Account',
          entity1_risk: 78,
          entity1_phone: '+91 98301 XXXXX',
          entity1_bank: 'HDFC Salt Lake',
          entity2_id: 'A002_MULE',
          entity2_name: 'ICICI ****8812 (Bimal Kumar S.)',
          entity2_type: 'Account',
          entity2_risk: 76,
          entity2_phone: '+91 98301 XXXXX',
          entity2_bank: 'ICICI Bidhannagar',
          match_score: 89,
          shared_features: ['Same PAN Blind Hash', 'Rapid Cash Smurfing Pattern', 'Common Angadia Drop Address'],
          conflict_features: ['Variant in Registered Name'],
          recommended_action: 'MERGE'
        }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Handle Merge Approval
  const handleApproveMerge = async (item) => {
    setProcessingId(item.entity2_id);
    const res = await apiService.mergeEntities(item.entity1_id, item.entity2_id);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setStatusMessage({
      type: 'success',
      text: res.message || `Canonical identity merged: ${item.entity2_name || item.entity2_id} -> ${item.entity1_name || item.entity1_id}`
    });

    setQueue((prev) => prev.filter((q) => q.entity2_id !== item.entity2_id));
    setProcessingId(null);

    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // Handle Dismiss
  const handleDismiss = (item) => {
    setQueue((prev) => prev.filter((q) => q.entity2_id !== item.entity2_id));
    setStatusMessage({
      type: 'info',
      text: `Pair marked as distinct entities. Disambiguation resolved.`
    });
    setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
  };

  const filteredQueue = queue.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return (item.entity_type || item.entity1_type) === activeFilter;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-surface-base text-on-surface p-margin lg:p-margin-lg gap-space-lg no-scrollbar">
      {/* Top Banner / Mission Context */}
      <section className="relative rounded-2xl p-space-lg bg-surface-container-lowest/90 backdrop-blur-2xl shadow-xl overflow-hidden border border-white/[0.08]">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-risk-amber/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-risk-amber/15 text-risk-amber font-label-sm text-label-sm uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-sm border border-risk-amber/30">
                <span className="w-1.5 h-1.5 rounded-full bg-risk-amber animate-ping"></span>
                IDENTITY DEDUPLICATION & MULE DETECTION
              </span>
              <span className="text-outline-variant font-label-sm text-label-sm">•</span>
              <span className="text-verified-emerald font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                NEXXUS-INTEL-TRIPLET
              </span>
            </div>

            <div className="flex items-baseline gap-space-md mt-1">
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Entity Resolution & Fraud Disambiguation Queue
              </h1>
              <span className="font-label-md text-label-md text-risk-amber font-mono font-semibold px-2 py-0.5 rounded bg-surface-container-high">
                {queue.length} PENDING AUDITS
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Cross-source fuzzy entity resolution detecting synthetic mule identities, cloned vehicular tags, and VoIP burner accounts across Kolkata cyber syndicates.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={fetchQueue}
              className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-space-xs transition-colors border border-white/[0.06]"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Refresh Queue</span>
            </button>
            <button
              onClick={() => {
                queue.forEach(item => {
                  if (item.match_score >= 90) handleApproveMerge(item);
                });
              }}
              className="px-4 py-2 rounded-lg bg-primary text-surface-base font-label-md text-label-md font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:bg-tertiary-fixed transition-all flex items-center gap-space-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              <span>Auto-Merge High Confidence (&gt;90%)</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-4 border-t border-white/[0.04] mt-2">
          <span className="text-on-surface-variant font-label-sm text-label-sm uppercase">FILTER BY:</span>
          {['ALL', 'Person', 'Vehicle', 'Account'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all ${
                activeFilter === cat
                  ? 'bg-primary/20 text-primary border border-primary/40 font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat === 'ALL' ? 'All Entities' : cat === 'Person' ? 'Suspects' : cat === 'Vehicle' ? 'Vehicles' : 'Mule Accounts'}
            </button>
          ))}
        </div>
      </section>

      {/* Status Banner Message */}
      {statusMessage && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-body-sm animate-fade-in ${
          statusMessage.type === 'success' 
            ? 'bg-verified-emerald/15 border-verified-emerald/30 text-verified-emerald' 
            : 'bg-primary/15 border-primary/30 text-primary'
        }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              {statusMessage.type === 'success' ? 'task_alt' : 'info'}
            </span>
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-outline hover:text-white">✕</button>
        </div>
      )}

      {/* Review Queue Cards */}
      <div className="flex flex-col gap-space-md">
        {filteredQueue.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-container-lowest text-center flex flex-col items-center justify-center border border-white/[0.06]">
            <span className="material-symbols-outlined text-[48px] text-verified-emerald mb-2">done_all</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Queue Cleared</h3>
            <p className="text-on-surface-variant text-body-sm mt-1">All potential duplicate identities disambiguated.</p>
          </div>
        ) : (
          filteredQueue.map((item) => (
            <div
              key={item.id || item.entity2_id}
              className="p-5 rounded-2xl bg-surface-container-low/90 backdrop-blur-xl border border-white/[0.08] shadow-xl flex flex-col gap-4"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-risk-amber/20 text-risk-amber font-mono text-[11px] font-bold">
                    {item.id || 'REV-001'}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    MATCH CONFIDENCE:
                  </span>
                  <span className="font-mono font-bold text-headline-sm text-primary">
                    {item.match_score}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-outline font-label-sm">RECOMMENDED:</span>
                  <span className="px-2 py-0.5 rounded bg-verified-emerald/20 text-verified-emerald font-bold font-mono text-[11px]">
                    {item.recommended_action || 'MERGE CANONICAL'}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Entity 1: Primary Target */}
                <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-2 border border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-primary font-mono font-bold uppercase">PRIMARY CANONICAL RECORD</span>
                    <span className="px-2 py-0.5 rounded bg-threat-crimson/20 text-threat-crimson font-mono text-[10px] font-bold">
                      RISK {item.entity1_risk || 91}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-bold text-on-surface text-headline-sm">{item.entity1_name}</h4>
                    <span className="text-outline font-mono text-xs">[{item.entity1_id}]</span>
                  </div>
                  <div className="text-[12px] text-on-surface-variant flex flex-col gap-1 mt-1">
                    <div><span className="text-outline">Phone/Tag:</span> {item.entity1_phone}</div>
                    <div><span className="text-outline">Bank/Ref:</span> {item.entity1_bank}</div>
                  </div>
                </div>

                {/* Entity 2: Candidate Duplicate */}
                <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-2 border border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-risk-amber font-mono font-bold uppercase">DUPLICATE / SHADOW CANDIDATE</span>
                    <span className="px-2 py-0.5 rounded bg-threat-crimson/20 text-threat-crimson font-mono text-[10px] font-bold">
                      RISK {item.entity2_risk || 88}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-bold text-on-surface text-headline-sm">{item.entity2_name}</h4>
                    <span className="text-outline font-mono text-xs">[{item.entity2_id}]</span>
                  </div>
                  <div className="text-[12px] text-on-surface-variant flex flex-col gap-1 mt-1">
                    <div><span className="text-outline">Phone/Tag:</span> {item.entity2_phone}</div>
                    <div><span className="text-outline">Bank/Ref:</span> {item.entity2_bank}</div>
                  </div>
                </div>
              </div>

              {/* Shared Linkage Tags & Conflicts */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.04]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-outline font-label-sm mr-1">SHARED SIGNALS:</span>
                  {(item.shared_features || []).map((feat, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[10px] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">link</span>
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDismiss(item)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors"
                  >
                    Keep Disconnected
                  </button>
                  <button
                    onClick={() => handleApproveMerge(item)}
                    disabled={processingId === item.entity2_id}
                    className="px-4 py-1.5 rounded-lg bg-primary text-surface-base font-label-sm text-label-sm font-bold shadow-md hover:bg-tertiary-fixed transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">merge</span>
                    <span>{processingId === item.entity2_id ? 'Merging...' : 'Approve Merge'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
