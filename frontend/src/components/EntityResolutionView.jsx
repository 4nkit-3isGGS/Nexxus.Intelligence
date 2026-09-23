import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

export default function EntityResolutionView({
  graphData = { nodes: [], edges: [] },
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
  const [searchText, setSearchText] = useState('');
  const [selectedSuspect, setSelectedSuspect] = useState('ALL');

  const isLead = officerRole === 'LEAD_INVESTIGATOR' || officerRole === 'ADMIN';

  // Truncate long UUID/hash IDs to show only the trailing 8 chars
  const formatEntityId = (id) => {
    if (!id) return '';
    const cleanId = String(id).replace(/^(P-|E-|O-|V-|A-|ENT-)/i, '');
    return cleanId.length >= 9 ? `\u2026${cleanId.slice(-8)}` : cleanId;
  };

  // Build subgraph entity identity sets from the active investigation graph
  const graphNodeIds = useMemo(() => new Set((graphData.nodes || []).map(n => n.id)), [graphData.nodes]);
  const graphNodeNames = useMemo(() => new Set((graphData.nodes || []).map(n => (n.name || '').toLowerCase())), [graphData.nodes]);

  // Person/Suspect entities from the active graph for the dropdown
  const suspectNodes = useMemo(() =>
    (graphData.nodes || []).filter(n => n.type === 'Person' || n.type === 'Suspect'),
    [graphData.nodes]
  );

  // Active case ID from graph
  const activeCaseId = graphData.case_info?.id || graphData.case_info?.case_id || null;

  // Load the global review queue from the backend
  const fetchQueue = async () => {
    setLoading(true);
    const result = await apiService.getReviewQueue();
    if (result && Array.isArray(result.data)) {
      setQueue(result.data);
    } else {
      setQueue([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Subgraph-scoped filtering: keep pairs where at least one entity belongs to the active investigation
  const scopedQueue = useMemo(() => {
    if (!queue.length) return [];
    return queue.filter(item => {
      const id1 = (item.entity1_id || '').toLowerCase();
      const id2 = (item.entity2_id || '').toLowerCase();
      const name1 = (item.entity1_name || '').toLowerCase();
      const name2 = (item.entity2_name || '').toLowerCase();
      const caseRef = (item.case_id || item.case_ref || '').toLowerCase();

      // Match against graph node IDs
      if (graphNodeIds.has(item.entity1_id) || graphNodeIds.has(item.entity2_id)) return true;
      // Match against graph node names (fuzzy)
      for (const gName of graphNodeNames) {
        if (gName && (name1.includes(gName) || name2.includes(gName) || gName.includes(name1) || gName.includes(name2))) {
          if (name1.length > 2 || name2.length > 2) return true;
        }
      }
      // Match by case ID if present
      if (activeCaseId && caseRef && caseRef.includes(activeCaseId.toLowerCase())) return true;
      return false;
    });
  }, [queue, graphNodeIds, graphNodeNames, activeCaseId]);

  // Entity-type filter
  const typeFilteredQueue = useMemo(() => {
    if (activeFilter === 'ALL') return scopedQueue;
    return scopedQueue.filter(item => (item.entity_type || item.entity1_type) === activeFilter);
  }, [scopedQueue, activeFilter]);

  // Suspect dropdown filter
  const suspectFilteredQueue = useMemo(() => {
    if (selectedSuspect === 'ALL') return typeFilteredQueue;
    const targetName = selectedSuspect.toLowerCase();
    return typeFilteredQueue.filter(item => {
      const name1 = (item.entity1_name || '').toLowerCase();
      const name2 = (item.entity2_name || '').toLowerCase();
      return name1.includes(targetName) || name2.includes(targetName);
    });
  }, [typeFilteredQueue, selectedSuspect]);

  // Text search filter
  const filteredQueue = useMemo(() => {
    if (!searchText.trim()) return suspectFilteredQueue;
    const q = searchText.toLowerCase().trim();
    return suspectFilteredQueue.filter(item => {
      const name1 = (item.entity1_name || '').toLowerCase();
      const name2 = (item.entity2_name || '').toLowerCase();
      const id1 = (item.entity1_id || '').toLowerCase();
      const id2 = (item.entity2_id || '').toLowerCase();
      const phone1 = (item.entity1_phone || item.entity1_details?.phone || '').toLowerCase();
      const phone2 = (item.entity2_phone || item.entity2_details?.phone || '').toLowerCase();
      return (
        name1.includes(q) || name2.includes(q) ||
        id1.includes(q) || id2.includes(q) ||
        phone1.includes(q) || phone2.includes(q)
      );
    });
  }, [suspectFilteredQueue, searchText]);

  // Handle Merge Approval
  const handleApproveMerge = async (item) => {
    if (!isLead) {
      setStatusMessage({
        type: 'error',
        text: `Clearance Denied: Merging canonical entities requires Tier-1 LEAD_INVESTIGATOR clearance. Active role is '${officerRole}'. Switch to Lead Investigator to approve merges.`
      });
      setTimeout(() => setStatusMessage(null), 5000);
      return;
    }

    setProcessingId(item.entity2_id);
    const res = await apiService.mergeEntities(item.entity1_id, item.entity2_id);

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: res.message || `Canonical identity merged: ${item.entity2_name || item.entity2_id} → ${item.entity1_name || item.entity1_id}`
      });
      setQueue(prev => prev.filter(q => q.entity2_id !== item.entity2_id));
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message || res.error || 'Operational Clearance Denied: Only Tier 1 Lead Investigators can approve entity merges.'
      });
    }

    setProcessingId(null);
    setTimeout(() => setStatusMessage(null), 4500);
  };

  // Handle Dismiss
  const handleDismiss = (item) => {
    setQueue(prev => prev.filter(q => q.entity2_id !== item.entity2_id));
    setStatusMessage({ type: 'info', text: 'Pair marked as distinct entities. Disambiguation resolved.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const caseLabel = activeCaseId ? `Case ${activeCaseId}` : 'Active Investigation';

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-4 lg:p-6 gap-5 no-scrollbar">
      {/* Top Banner / Mission Context */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-2xl p-5 bg-white shadow-xs border border-slate-200/80">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono uppercase font-semibold tracking-wider flex items-center gap-1.5 border border-amber-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                DUPLICATE &amp; FAKE IDENTITY CHECK
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 text-xs font-mono font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                SMART IDENTITY MATCHER
              </span>
            </div>

            <div className="flex items-baseline gap-3 mt-0.5 flex-wrap">
              <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                Duplicate Suspect &amp; Identity Review
              </h1>
              <span className="text-xs font-mono font-semibold text-slate-700 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/80">
                {filteredQueue.length} PENDING REVIEW
              </span>
              {activeCaseId && (
                <span className="text-xs font-mono font-semibold text-sky-700 px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200/80 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">folder_open</span>
                  {caseLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed font-normal">
              Scoped to {suspectNodes.length} investigated suspect{suspectNodes.length !== 1 ? 's' : ''} in the active subgraph. Merge confirmed aliases to maintain a single canonical identity.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={fetchQueue}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs flex items-center gap-1.5 transition-all border border-slate-200/80 shadow-xs font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-500">refresh</span>
              <span>{loading ? 'Refreshing...' : 'Refresh Queue'}</span>
            </button>
            <button
              onClick={() => {
                filteredQueue.forEach(item => {
                  if (item.match_score >= 90) handleApproveMerge(item);
                });
              }}
              disabled={filteredQueue.length === 0}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
              <span>Merge Clear Matches (&gt;90%)</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search + Suspect Dropdown + Type Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 mt-3">
          {/* Text Search */}
          <div className="relative">
            <span className="material-symbols-outlined text-slate-400 text-[15px] absolute left-2.5 top-1/2 -translate-y-1/2">search</span>
            <input
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder="Search suspect, ID, phone..."
              className="pl-8 pr-8 py-1.5 rounded-xl bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-200/80 focus:outline-none focus:border-slate-400 font-medium w-52"
            />
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          {/* Suspect Dropdown */}
          {suspectNodes.length > 0 && (
            <div className="relative">
              <span className="material-symbols-outlined text-slate-400 text-[14px] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">person_search</span>
              <select
                value={selectedSuspect}
                onChange={e => setSelectedSuspect(e.target.value)}
                className="pl-8 pr-6 py-1.5 rounded-xl bg-slate-50 text-xs text-slate-900 border border-slate-200/80 focus:outline-none focus:border-slate-400 font-medium appearance-none cursor-pointer"
              >
                <option value="ALL">All Investigated Suspects</option>
                {suspectNodes.map(n => (
                  <option key={n.id} value={n.name}>{n.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined text-slate-400 text-[13px] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
            </div>
          )}

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-500 font-mono text-[10px] uppercase font-semibold tracking-wider">FILTER:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
              {['ALL', 'Person', 'Vehicle', 'Account'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all font-medium cursor-pointer ${
                    activeFilter === cat
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'All Entities' : cat === 'Person' ? 'Suspects' : cat === 'Vehicle' ? 'Vehicles' : 'Mule Accounts'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Status Banner Message */}
      {statusMessage && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-fade-in ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200/70 text-emerald-800'
            : 'bg-slate-100 border-slate-200 text-slate-800'
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
      <div className="flex flex-col flex-shrink-0 min-h-fit gap-4">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="material-symbols-outlined animate-spin text-[32px] text-slate-400 mb-2">sync</span>
            <p className="text-xs text-slate-600 font-medium">Loading resolution queue for active investigation...</p>
          </div>
        ) : scopedQueue.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white text-center flex flex-col items-center justify-center border border-slate-200/80 shadow-xs gap-3">
            <span className="material-symbols-outlined text-[40px] text-emerald-600">done_all</span>
            <h3 className="font-display text-base font-bold text-slate-900">No Duplicate Resolution Candidates</h3>
            <p className="text-slate-500 text-xs max-w-sm">
              No duplicate entity resolution candidates found for the active case/suspects in <span className="font-semibold text-slate-700">{caseLabel}</span>. All investigated entities are already disambiguated.
            </p>
          </div>
        ) : filteredQueue.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white text-center flex flex-col items-center justify-center border border-slate-200/80 shadow-xs gap-3">
            <span className="material-symbols-outlined text-[40px] text-slate-400">filter_list_off</span>
            <h3 className="font-display text-base font-bold text-slate-900">No Matches for Current Filter</h3>
            <p className="text-slate-500 text-xs max-w-sm">
              No candidates match the active search/filter criteria. Try clearing filters to see all {scopedQueue.length} scoped pair{scopedQueue.length !== 1 ? 's' : ''}.
            </p>
          </div>
        ) : (
          filteredQueue.map(item => {
            const matchScore = item.match_score ?? (item.confidence_score != null ? (item.confidence_score <= 1 ? Math.round(item.confidence_score * 100) : item.confidence_score) : 90);
            const entity1Phone = item.entity1_phone || item.entity1_details?.phone || item.entity1_details?.msisdn || (item.entity1_type === 'Vehicle' ? 'FastTag: N/A' : '—');
            const entity1Bank = item.entity1_bank || item.entity1_details?.bank || item.entity1_details?.account || item.entity1_details?.branch || '—';
            const entity1Risk = item.entity1_risk ?? item.entity1_details?.risk_score ?? '—';

            const entity2Phone = item.entity2_phone || item.entity2_details?.phone || item.entity2_details?.msisdn || (item.entity2_type === 'Vehicle' ? 'FastTag: N/A' : '—');
            const entity2Bank = item.entity2_bank || item.entity2_details?.bank || item.entity2_details?.account || item.entity2_details?.branch || '—';
            const entity2Risk = item.entity2_risk ?? item.entity2_details?.risk_score ?? '—';

            const sharedSignals = (item.shared_features && item.shared_features.length > 0)
              ? item.shared_features
              : (item.match_reason ? [item.match_reason] : ['High entity correlation']);

            return (
              <div
                key={item.id || item.entity2_id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col flex-shrink-0 min-h-fit gap-4"
              >
                {/* Header Info */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 font-mono text-[11px] font-semibold">
                      {item.id || 'REV-001'}
                    </span>
                    <span className="text-xs font-mono uppercase text-slate-500 font-medium">MATCH CONFIDENCE:</span>
                    <span className="font-mono font-bold text-sm text-slate-900">{matchScore}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">RECOMMENDED:</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-semibold font-mono text-[11px]">
                      {item.recommended_action || (matchScore >= 90 ? 'MERGE CANONICAL' : 'FLAG SUSPECT')}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase">PRIMARY CANONICAL RECORD</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/70 font-mono text-[10px] font-semibold">
                        RISK {entity1Risk}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-display font-semibold text-slate-900 text-sm">{item.entity1_name}</h4>
                      <span
                        className="text-slate-400 font-mono text-xs cursor-default"
                        title={item.entity1_id}
                      >
                        [{formatEntityId(item.entity1_id)}]
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 flex flex-col gap-1 mt-1 font-mono">
                      <div><span className="text-slate-500 font-normal font-sans">Phone/Tag:</span> {entity1Phone}</div>
                      <div><span className="text-slate-500 font-normal font-sans">Bank/Ref:</span> {entity1Bank}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 flex flex-col gap-2 border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-amber-800 font-mono font-semibold uppercase">DUPLICATE / SHADOW CANDIDATE</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/70 font-mono text-[10px] font-semibold">
                        RISK {entity2Risk}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-display font-semibold text-slate-900 text-sm">{item.entity2_name}</h4>
                      <span
                        className="text-slate-400 font-mono text-xs cursor-default"
                        title={item.entity2_id}
                      >
                        [{formatEntityId(item.entity2_id)}]
                      </span>
                    </div>
                    <div className="text-xs text-slate-700 flex flex-col gap-1 mt-1 font-mono">
                      <div><span className="text-slate-500 font-normal font-sans">Phone/Tag:</span> {entity2Phone}</div>
                      <div><span className="text-slate-500 font-normal font-sans">Bank/Ref:</span> {entity2Bank}</div>
                    </div>
                  </div>
                </div>

                {/* Shared Linkage Tags & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-mono font-medium mr-1">SIGNALS:</span>
                    {sharedSignals.map((feat, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 font-mono text-[10px] font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-slate-500">link</span>
                        {feat}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {onInvestigateEntity && (
                      <button
                        onClick={() => onInvestigateEntity({ id: item.entity1_id, name: item.entity1_name })}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 text-xs font-medium shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        title="Run autonomous multi-agent swarm investigation on candidate match"
                      >
                        <span className="material-symbols-outlined text-[15px] text-slate-600">smart_toy</span>
                        <span>Investigate Swarm</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDismiss(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors border border-slate-200/80 shadow-xs font-medium cursor-pointer"
                    >
                      Keep Disconnected
                    </button>
                    <button
                      onClick={() => handleApproveMerge(item)}
                      disabled={processingId === item.entity2_id}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 ${
                        isLead
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                      title={isLead ? 'Approve and execute canonical merge' : 'Requires Tier 1 Lead Investigator clearance'}
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
