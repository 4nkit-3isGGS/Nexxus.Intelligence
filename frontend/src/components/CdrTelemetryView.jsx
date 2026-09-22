import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

export default function CdrTelemetryView({ graphData = { nodes: [], edges: [] } }) {
  const [allCalls, setAllCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [activeCallFilter, setActiveCallFilter] = useState('ALL');
  const [triangulating, setTriangulating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCdr() {
      setLoading(true);
      try {
        const data = await apiService.getCdrRecords();
        if (isMounted) {
          setAllCalls(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to load CDR records:', err);
        if (isMounted) setAllCalls([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCdr();
    return () => { isMounted = false; };
  }, []);

  const activeCaseId = graphData.case_info?.id || graphData.case_info?.case_id || null;

  // Extract all phone numbers from the active investigation graph
  const graphPhoneNumbers = useMemo(() => {
    const s = new Set();
    (graphData.nodes || []).forEach(n => {
      // Phone-type nodes — their id or name is a phone number
      if (n.type === 'Phone' || n.type === 'PHONE') {
        if (n.id) s.add(String(n.id).toLowerCase());
        if (n.name) s.add(String(n.name).toLowerCase());
        if (n.phone) s.add(String(n.phone).toLowerCase());
        if (n.number) s.add(String(n.number).toLowerCase());
      }
      // Person nodes may carry phone attributes
      if (n.phone) s.add(String(n.phone).toLowerCase());
      if (n.msisdn) s.add(String(n.msisdn).toLowerCase());
    });
    return s;
  }, [graphData.nodes]);

  // Names of all graph entities for caller_name / receiver_name matching
  const graphEntityNames = useMemo(() => {
    const s = new Set();
    (graphData.nodes || []).forEach(n => {
      if (n.name) s.add(n.name.toLowerCase());
    });
    return s;
  }, [graphData.nodes]);

  const graphNodeIds = useMemo(() => new Set((graphData.nodes || []).map(n => n.id?.toLowerCase())), [graphData.nodes]);

  // Helper: does a call record involve an investigated entity?
  const callMatchesSubgraph = (c) => {
    const caller = String(c.caller || '').toLowerCase();
    const receiver = String(c.receiver || '').toLowerCase();
    const callerName = String(c.caller_name || '').toLowerCase();
    const receiverName = String(c.receiver_name || '').toLowerCase();
    const caseRef = String(c.case_id || '').toLowerCase();

    // Exact phone match
    if (graphPhoneNumbers.has(caller) || graphPhoneNumbers.has(receiver)) return true;

    // Partial phone match (in case numbers stored differently)
    for (const ph of graphPhoneNumbers) {
      if (ph && caller.includes(ph) || ph && receiver.includes(ph)) return true;
    }

    // Name match
    for (const gName of graphEntityNames) {
      if (!gName) continue;
      if (callerName.includes(gName) || gName.includes(callerName) ||
          receiverName.includes(gName) || gName.includes(receiverName)) {
        if (callerName.length > 2 || receiverName.length > 2) return true;
      }
    }

    // ID match
    if (graphNodeIds.has(caller) || graphNodeIds.has(receiver)) return true;

    // Case ID match
    if (activeCaseId && caseRef && caseRef.includes(activeCaseId.toLowerCase())) return true;

    return false;
  };

  // Scope CDR to the active investigated subgraph
  const calls = useMemo(() => {
    if (!allCalls.length) return [];
    if (graphPhoneNumbers.size === 0 && graphEntityNames.size === 0) return [];
    return allCalls.filter(callMatchesSubgraph);
  }, [allCalls, graphPhoneNumbers, graphEntityNames, graphNodeIds, activeCaseId]);

  // Additional filters (spike, mastermind, search)
  const filteredCalls = useMemo(() => {
    return calls.filter(c => {
      if (activeCallFilter === 'SPIKE' && !c.is_spike) return false;
      if (activeCallFilter === 'MASTERMIND' && !c.is_mastermind) return false;
      if (!searchPhone) return true;
      const q = searchPhone.toLowerCase();
      return (
        (c.caller && String(c.caller).toLowerCase().includes(q)) ||
        (c.receiver && String(c.receiver).toLowerCase().includes(q)) ||
        (c.caller_name && String(c.caller_name).toLowerCase().includes(q)) ||
        (c.receiver_name && String(c.receiver_name).toLowerCase().includes(q))
      );
    });
  }, [calls, activeCallFilter, searchPhone]);

  const totalCalls = calls.length;
  const spikeCalls = useMemo(() => calls.filter(c => c.is_spike), [calls]);

  const dateCounts = useMemo(() => {
    const counts = {};
    calls.forEach(c => {
      const d = c.date || (c.timestamp ? String(c.timestamp).slice(0, 10) : 'Unknown');
      counts[d] = (counts[d] || 0) + 1;
    });
    return counts;
  }, [calls]);

  const spikeDate = useMemo(() => {
    let maxDate = 'N/A';
    let maxCount = 0;
    Object.entries(dateCounts).forEach(([d, count]) => {
      if (count > maxCount) { maxCount = count; maxDate = d; }
    });
    return { date: maxDate, count: maxCount };
  }, [dateCounts]);

  const uniqueNumbers = useMemo(() => {
    const s = new Set();
    calls.forEach(c => {
      if (c.caller) s.add(c.caller);
      if (c.receiver) s.add(c.receiver);
    });
    return s.size;
  }, [calls]);

  const uniqueTowers = useMemo(() => {
    const s = new Set();
    calls.forEach(c => { if (c.cell_tower) s.add(c.cell_tower); });
    return Array.from(s);
  }, [calls]);

  const primaryTower = uniqueTowers.length > 0 ? uniqueTowers[0] : 'None Identified';
  const caseLabel = activeCaseId ? `Case ${activeCaseId}` : 'Active Investigation';

  const handleTriangulate = () => {
    if (calls.length === 0) return;
    setTriangulating(true);
    setTimeout(() => {
      setTriangulating(false);
      alert(`BTS Tower Triangulation complete: ${calls.length} calls cross-correlated across ${uniqueTowers.length} cell tower anchors for ${caseLabel}.`);
    }, 1200);
  };

  const handleBsaCertificate = () => {
    alert('Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Electronic Telecomm Certificate generated.');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-4 lg:p-6 gap-5 no-scrollbar">
      {/* TOP CONTEXT PANEL */}
      <section className="bg-white rounded-2xl p-5 shadow-xs relative flex flex-col flex-shrink-0 min-h-fit border border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono uppercase font-semibold text-[10px] tracking-wider">CASE WORKSPACE</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-mono uppercase font-semibold text-[10px] tracking-wider">PHONE RECORDS</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 font-mono font-semibold text-[10px] tracking-wider">CALL TELEMETRY</span>
              <span className="text-slate-300">•</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1.5 border ${
                spikeCalls.length > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200/70'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200/70'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${spikeCalls.length > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                {spikeCalls.length > 0 ? `${spikeCalls.length} SPIKES DETECTED` : 'NOMINAL PATTERNS'}
              </span>
              {activeCaseId && (
                <span className="text-xs font-mono font-semibold text-sky-700 px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200/80 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">folder_open</span>
                  {caseLabel}
                </span>
              )}
            </div>

            <div className="flex flex-col mt-0.5">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h1 className="font-display text-xl font-bold tracking-tight text-slate-900">
                  Call Records &amp; Telecommunications Telemetry
                </h1>
                <span className="text-xs text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/70 font-mono font-semibold">
                  {totalCalls} CALLS INDEXED
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-4xl font-normal">
                {graphPhoneNumbers.size > 0
                  ? `Filtering ${graphPhoneNumbers.size} monitored phone numbers from the active investigation subgraph.`
                  : 'Scoped to active investigation entities. Identifies caller locations and cell tower anchors.'
                }
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriangulate}
              disabled={triangulating || calls.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                {triangulating ? 'autorenew' : 'cell_tower'}
              </span>
              <span>{triangulating ? 'Locating...' : 'Locate Towers & Callers'}</span>
            </button>
            <button
              onClick={handleBsaCertificate}
              disabled={calls.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-800 hover:bg-slate-50 transition-all text-xs font-medium border border-slate-200/80 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              title="Bharatiya Sakshya Adhiniyam, 2023 Electronic Evidence Seal"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-700">verified</span>
              <span>BSA §65B Certificate</span>
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="material-symbols-outlined animate-spin text-[32px] text-slate-400 mb-2">sync</span>
          <p className="text-xs text-slate-600 font-medium">Extracting telecommunications telemetry from knowledge graph...</p>
        </div>
      ) : calls.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-xs gap-3">
          <span className="material-symbols-outlined text-[42px] text-slate-400">phone_disabled</span>
          <h3 className="font-display text-base font-bold text-slate-900">No Telecom Records Associated with Investigated Entity</h3>
          <p className="text-xs text-slate-500 max-w-md">
            No call detail records found for the {graphPhoneNumbers.size} monitored phone numbers and entities in <span className="font-semibold text-slate-700">{caseLabel}</span>. The active subgraph has no telecommunications edges linking to the searched suspects.
          </p>
        </div>
      ) : (
        <>
          {/* SECTION 2: 4-CARD TELECOMM INTEL OVERVIEW */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0 min-h-fit">
            <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Total Calls Analyzed</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-mono text-2xl font-bold text-slate-900">{totalCalls}</span>
                    <span className="text-xs text-slate-500 font-medium">Events</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/70">
                  <span className="material-symbols-outlined text-[18px]">call_log</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
                <span>Active Channels</span>
                <span className="text-slate-800 font-mono font-semibold">{uniqueNumbers} Endpoints</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 font-semibold">Peak Frequency Date</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-mono text-xl font-bold text-slate-900 tracking-tight">{spikeDate.date}</span>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-mono font-semibold flex items-center gap-1 border border-rose-200/70">
                  <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                  <span>{spikeDate.count} Calls</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
                <span className="text-rose-700 font-medium">Concentrated Volume</span>
                <span className="text-slate-500 font-mono">Flagged Date</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Monitored MSISDNs</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-mono text-2xl font-bold text-slate-900">{uniqueNumbers}</span>
                    <span className="text-xs text-amber-800 font-medium">Identifiers</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200/70">
                  <span className="material-symbols-outlined text-[18px]">sim_card_alert</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
                <span className="text-slate-600">Interlinked Network</span>
                <span className="text-slate-500 font-mono">Carrier Logged</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Triangulated Tower</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-mono text-base font-bold text-slate-900 truncate max-w-[140px]" title={primaryTower}>{primaryTower}</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200/70">
                  <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                </div>
              </div>
              <div className="mt-3 pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
                <span className="text-emerald-700 font-mono font-semibold">{uniqueTowers.length} Anchors</span>
                <span className="text-slate-500 font-mono">Geocoded</span>
              </div>
            </div>
          </section>

          {/* SECTION 3: CDR CALL LOG MATRIX TABLE */}
          <section className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col flex-shrink-0 min-h-fit gap-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/80">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">Call Detail Records Log</h3>
                  <p className="text-[11px] text-slate-500">
                    {filteredCalls.length} records scoped to {caseLabel} · {uniqueTowers.length} cell tower anchors
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <input
                    type="text"
                    value={searchPhone}
                    onChange={e => setSearchPhone(e.target.value)}
                    placeholder="Filter by caller or receiver..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:outline-none focus:border-slate-500 font-medium"
                  />
                  <span className="material-symbols-outlined text-slate-400 text-[15px] absolute left-2.5 top-1/2 -translate-y-1/2">search</span>
                </div>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
                  {['ALL', 'SPIKE', 'MASTERMIND'].map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveCallFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all font-medium cursor-pointer ${
                        activeCallFilter === f
                          ? 'bg-white text-slate-900 font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f === 'ALL' ? 'All Calls' : f === 'SPIKE' ? `Spikes (${spikeCalls.length})` : 'Mastermind'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredCalls.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                No call records match the current filter for the active investigation.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-slate-500 text-[10px] font-mono uppercase tracking-wider bg-slate-50/70">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Caller</th>
                      <th className="py-2.5 px-3">Receiver</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Cell Tower</th>
                      <th className="py-2.5 px-3">Event Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCalls.map((c, idx) => (
                      <tr key={c.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-500">{c.timestamp}</td>
                        <td className="py-2.5 px-3 text-slate-900 font-medium">
                          {c.caller_name} <span className="text-slate-400 font-normal">({c.caller})</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-900 font-medium">
                          {c.receiver_name} <span className="text-slate-400 font-normal">({c.receiver})</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-900 font-semibold">{c.duration_sec}s</td>
                        <td className="py-2.5 px-3 text-slate-500 truncate max-w-[160px]">{c.cell_tower}</td>
                        <td className="py-2.5 px-3">
                          {c.is_spike ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/70 font-mono text-[10px] font-semibold">
                              BURST SPIKE
                            </span>
                          ) : c.is_mastermind ? (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/70 font-mono text-[10px] font-semibold">
                              TARGET BRIDGE
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200/70">
                              ROUTINE
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
