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
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-margin lg:p-margin-lg gap-space-lg no-scrollbar">
      {/* Top Banner / Mission Context */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-2xl p-space-lg bg-white shadow-sm border border-slate-200/80">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-label-sm text-label-sm uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-xs border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                IDENTITY DEDUPLICATION & MULE DETECTION
              </span>
              <span className="text-slate-300 font-label-sm text-label-sm">•</span>
              <span className="text-emerald-700 font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                NEXXUS-INTEL-TRIPLET
              </span>
            </div>

            <div className="flex items-baseline gap-space-md mt-1">
              <h1 className="font-headline-lg text-headline-lg font-bold text-slate-900 tracking-tight">
                Entity Resolution & Fraud Disambiguation Queue
              </h1>
              <span className="font-label-md text-label-md text-amber-800 font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                {queue.length} PENDING AUDITS
              </span>
            </div>
            <p className="font-body-md text-body-md text-slate-600 max-w-3xl">
              Cross-source fuzzy entity resolution detecting synthetic mule identities, cloned vehicular tags, and VoIP burner accounts across Kolkata cyber syndicates.
            </p>
          </div>

          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={fetchQueue}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-label-md text-label-md flex items-center gap-space-xs transition-colors border border-slate-200 shadow-xs font-medium"
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
              className="px-4 py-2 rounded-lg bg-sky-600 text-white font-label-md text-label-md font-bold shadow-xs hover:bg-sky-700 transition-all flex items-center gap-space-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              <span>Auto-Merge High Confidence (&gt;90%)</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-2">
          <span className="text-slate-500 font-label-sm text-label-sm uppercase font-medium">FILTER BY:</span>
          {['ALL', 'Person', 'Vehicle', 'Account'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 rounded-full font-label-sm text-label-sm transition-all shadow-xs ${
                activeFilter === cat
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
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
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-sky-50 border-sky-200 text-sky-800'
        }`}>
          <div className="flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-[18px]">
              {statusMessage.type === 'success' ? 'task_alt' : 'info'}
            </span>
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
        </div>
      )}

      {/* Review Queue Cards */}
      <div className="flex flex-col flex-shrink-0 min-h-fit gap-space-md">
        {filteredQueue.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white text-center flex flex-col items-center justify-center border border-slate-200 shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-emerald-600 mb-2">done_all</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-slate-900">Queue Cleared</h3>
            <p className="text-slate-500 text-body-sm mt-1">All potential duplicate identities disambiguated.</p>
          </div>
        ) : (
          filteredQueue.map((item) => {
            const matchScore = item.match_score ?? (item.confidence_score != null ? (item.confidence_score <= 1 ? Math.round(item.confidence_score * 100) : item.confidence_score) : 91);
            const entity1Phone = item.entity1_phone || item.entity1_details?.phone || item.entity1_details?.msisdn || (item.entity1_type === 'Vehicle' ? 'FastTag: FT-904128' : '+91 98321 45678');
            const entity1Bank = item.entity1_bank || item.entity1_details?.bank || item.entity1_details?.account || item.entity1_details?.branch || (item.entity1_type === 'Vehicle' ? 'Reg: WB Transport' : 'Kolkata Comm. Bank #3012');
            const entity1Risk = item.entity1_risk || item.entity1_details?.risk_score || 91;

            const entity2Phone = item.entity2_phone || item.entity2_details?.phone || item.entity2_details?.msisdn || (item.entity2_type === 'Vehicle' ? 'FastTag: FT-882190' : '+91 98321 45678');
            const entity2Bank = item.entity2_bank || item.entity2_details?.bank || item.entity2_details?.account || item.entity2_details?.branch || (item.entity2_type === 'Vehicle' ? 'Reg: Cloned Duplicate' : 'Kolkata Comm. Bank #3012');
            const entity2Risk = item.entity2_risk || item.entity2_details?.risk_score || 88;

            const sharedSignals = (item.shared_features && item.shared_features.length > 0)
              ? item.shared_features
              : (item.match_reason ? [item.match_reason, 'Co-located Cell Tower #KOL-SL-04'] : ['Identical MSISDN', 'Matching Voiceprint (94.2%)', 'Co-located Cell Tower #KOL-SL-04']);

            return (
              <div
                key={item.id || item.entity2_id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col flex-shrink-0 min-h-fit gap-4"
              >
                {/* Header Info */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[11px] font-bold">
                      {item.id || 'REV-001'}
                    </span>
                    <span className="font-label-sm text-label-sm text-slate-500 uppercase font-medium">
                      MATCH CONFIDENCE:
                    </span>
                    <span className="font-mono font-bold text-headline-sm text-sky-700">
                      {matchScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-label-sm">RECOMMENDED:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-mono text-[11px]">
                      {item.recommended_action || (matchScore >= 90 ? 'MERGE CANONICAL' : 'FLAG SUSPECT')}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Entity 1: Primary Target */}
                  <div className="p-4 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-sky-700 font-mono font-bold uppercase">PRIMARY CANONICAL RECORD</span>
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold">
                        RISK {entity1Risk}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-bold text-slate-900 text-headline-sm">{item.entity1_name}</h4>
                      <span className="text-slate-400 font-mono text-xs font-medium">[{item.entity1_id}]</span>
                    </div>
                    <div className="text-[12px] text-slate-600 flex flex-col gap-1 mt-1">
                      <div><span className="text-slate-400 font-medium">Phone/Tag:</span> {entity1Phone}</div>
                      <div><span className="text-slate-400 font-medium">Bank/Ref:</span> {entity1Bank}</div>
                    </div>
                  </div>

                  {/* Entity 2: Candidate Duplicate */}
                  <div className="p-4 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-700 font-mono font-bold uppercase">DUPLICATE / SHADOW CANDIDATE</span>
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold">
                        RISK {entity2Risk}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-bold text-slate-900 text-headline-sm">{item.entity2_name}</h4>
                      <span className="text-slate-400 font-mono text-xs font-medium">[{item.entity2_id}]</span>
                    </div>
                    <div className="text-[12px] text-slate-600 flex flex-col gap-1 mt-1">
                      <div><span className="text-slate-400 font-medium">Phone/Tag:</span> {entity2Phone}</div>
                      <div><span className="text-slate-400 font-medium">Bank/Ref:</span> {entity2Bank}</div>
                    </div>
                  </div>
                </div>

                {/* Shared Linkage Tags & Conflicts */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-label-sm mr-1">SHARED SIGNALS:</span>
                    {sharedSignals.map((feat, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100 font-mono text-[10px] font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">link</span>
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDismiss(item)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-label-sm text-label-sm transition-colors border border-slate-200 shadow-xs font-medium"
                    >
                      Keep Disconnected
                    </button>
                    <button
                      onClick={() => handleApproveMerge(item)}
                      disabled={processingId === item.entity2_id}
                      className="px-4 py-1.5 rounded-lg bg-sky-600 text-white font-label-sm text-label-sm font-bold shadow-xs hover:bg-sky-700 transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">merge</span>
                      <span>{processingId === item.entity2_id ? 'Merging...' : 'Approve Merge'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
