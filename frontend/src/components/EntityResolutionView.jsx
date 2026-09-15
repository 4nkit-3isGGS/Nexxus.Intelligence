import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function EntityResolutionView({ 
  onFocusEntity, 
  onJumpToGraph, 
  onInvestigateEntity,
  officerRole = 'LEAD_INVESTIGATOR',
  currentUser,
  onRoleChange
}) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const isLead = officerRole === 'LEAD_INVESTIGATOR' || officerRole === 'ADMIN';

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
    if (!isLead) {
      setStatusMessage({
        type: 'error',
        text: `Clearance Denied: Merging canonical entities requires Tier-1 LEAD_INVESTIGATOR clearance. Active role is '${officerRole}'. Switch to Lead Investigator (DSP B. Banerjee) to approve merges.`
      });
      setTimeout(() => {
        setStatusMessage(null);
      }, 5000);
      return;
    }

    setProcessingId(item.entity2_id);
    const res = await apiService.mergeEntities(item.entity1_id, item.entity2_id);

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: res.message || `Canonical identity merged: ${item.entity2_name || item.entity2_id} -> ${item.entity1_name || item.entity1_id}`
      });
      setQueue((prev) => prev.filter((q) => q.entity2_id !== item.entity2_id));
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message || res.error || "Operational Clearance Denied: Only Tier 1 Lead Investigators can approve entity merges."
      });
    }

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
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-4 lg:p-6 gap-4 no-scrollbar">
      {/* Top Banner / Mission Context */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-2xl p-5 bg-white shadow-xs border border-slate-200">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                DEDUPLICATION & MULE DETECTION
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 text-xs font-mono font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                NEXXUS-INTEL-TRIPLET
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-1">
              <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                Entity Resolution & Fraud Disambiguation Queue
              </h1>
              <span className="text-xs font-mono font-bold text-amber-800 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                {queue.length} PENDING REVIEW
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed font-normal">
              Cross-source fuzzy entity resolution detecting synthetic mule identities, cloned vehicular tags, and VoIP burner accounts across Kolkata cyber syndicates.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchQueue}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Refresh Queue</span>
            </button>
            <button
              onClick={() => {
                queue.forEach(item => {
                  if (item.match_score >= 90) handleApproveMerge(item);
                });
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
              <span>Auto-Merge High Match (&gt;90%)</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2">
          <span className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider mr-1">FILTER:</span>
          {['ALL', 'Person', 'Vehicle', 'Account'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs transition-all shadow-xs cursor-pointer ${
                activeFilter === cat
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Entities' : cat === 'Person' ? 'Suspects' : cat === 'Vehicle' ? 'Vehicles' : 'Mule Accounts'}
            </button>
          ))}
        </div>
      </section>

      {/* Status Banner Message */}
      {statusMessage && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-fade-in ${
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
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Review Queue Cards */}
      <div className="flex flex-col flex-shrink-0 min-h-fit gap-3.5">
        {filteredQueue.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white text-center flex flex-col items-center justify-center border border-slate-200 shadow-xs">
            <span className="material-symbols-outlined text-[44px] text-emerald-600 mb-2">done_all</span>
            <h3 className="font-display text-base font-bold text-slate-900">Queue Cleared</h3>
            <p className="text-slate-500 text-xs mt-1">All potential duplicate identities disambiguated.</p>
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
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col flex-shrink-0 min-h-fit gap-3.5"
              >
                {/* Header Info */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[11px] font-bold">
                      {item.id || 'REV-001'}
                    </span>
                    <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
                      MATCH CONFIDENCE:
                    </span>
                    <span className="font-mono font-bold text-sm text-sky-700">
                      {matchScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono font-medium">RECOMMENDED:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-mono text-[11px]">
                      {item.recommended_action || (matchScore >= 90 ? 'MERGE CANONICAL' : 'FLAG SUSPECT')}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                  {/* Entity 1: Primary Target */}
                  <div className="p-4 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-sky-700 font-mono font-bold uppercase">PRIMARY CANONICAL RECORD</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold">
                        RISK {entity1Risk}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-display font-bold text-slate-900 text-sm">{item.entity1_name}</h4>
                      <span className="text-slate-500 font-mono text-xs font-medium">[{item.entity1_id}]</span>
                    </div>
                    <div className="text-xs text-slate-700 flex flex-col gap-1 mt-1 font-mono">
                      <div><span className="text-slate-500 font-medium font-sans">Phone/Tag:</span> {entity1Phone}</div>
                      <div><span className="text-slate-500 font-medium font-sans">Bank/Ref:</span> {entity1Bank}</div>
                    </div>
                  </div>

                  {/* Entity 2: Candidate Duplicate */}
                  <div className="p-4 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-800 font-mono font-bold uppercase">DUPLICATE / SHADOW CANDIDATE</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold">
                        RISK {entity2Risk}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-display font-bold text-slate-900 text-sm">{item.entity2_name}</h4>
                      <span className="text-slate-500 font-mono text-xs font-medium">[{item.entity2_id}]</span>
                    </div>
                    <div className="text-xs text-slate-700 flex flex-col gap-1 mt-1 font-mono">
                      <div><span className="text-slate-500 font-medium font-sans">Phone/Tag:</span> {entity2Phone}</div>
                      <div><span className="text-slate-500 font-medium font-sans">Bank/Ref:</span> {entity2Bank}</div>
                    </div>
                  </div>
                </div>

                {/* Shared Linkage Tags & Conflicts */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-mono font-semibold mr-1">SIGNALS:</span>
                    {sharedSignals.map((feat, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-sky-600">link</span>
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {onInvestigateEntity && (
                      <button
                        onClick={() => onInvestigateEntity({ id: item.entity1_id, name: item.entity1_name })}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        title="Run autonomous multi-agent swarm investigation on candidate match"
                      >
                        <span className="material-symbols-outlined text-[15px]">smart_toy</span>
                        <span>Investigate Swarm</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors border border-slate-200 shadow-xs font-semibold cursor-pointer"
                    >
                      Keep Disconnected
                    </button>
                    <button
                      onClick={() => handleApproveMerge(item)}
                      disabled={processingId === item.entity2_id}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 ${
                        isLead 
                          ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                      title={isLead ? "Approve and execute canonical merge" : "Requires Tier 1 Lead Investigator clearance"}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isLead ? 'merge' : 'lock'}
                      </span>
                      <span>
                        {processingId === item.entity2_id 
                          ? 'Merging...' 
                          : isLead 
                          ? 'Approve Merge' 
                          : 'Requires Lead Clearance'}
                      </span>
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
