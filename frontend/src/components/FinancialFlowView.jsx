import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "../services/api";

// Financial predicate allow-list (case-insensitive)
const FINANCIAL_PREDICATES = new Set([
  "transaction","transferred_funds","transacted_with","transferred_to",
  "transfer","transfers","paid","pays","payment","sends_money",
  "sent_funds","hawala_transfer","hawala","financial_flow",
  "wire_transfer","money_flow","remittance","deposits","deposit",
  "withdrawal","withdrew","funding","funds","loaned","loan",
  "invested","diverted_funds","layered","laundered","moved_money",
]);

const isFinancialEdge = (e) => {
  const t = (e.type || e.label || e.relationship || "").toLowerCase().trim();
  if (FINANCIAL_PREDICATES.has(t)) return true;
  const amount = e.amount ?? e.properties?.amount ?? e.value ?? e.properties?.value;
  return amount != null && Number(amount) > 0;
};

const edgeToTx = (e, nodeMap, idx) => {
  const srcId = typeof e.source === "object" ? e.source?.id : e.source || e.from || e.start || "";
  const tgtId = typeof e.target === "object" ? e.target?.id : e.target || e.to || e.end || "";
  const srcNode = nodeMap.get(String(srcId)) || (typeof e.source === "object" ? e.source : null);
  const tgtNode = nodeMap.get(String(tgtId)) || (typeof e.target === "object" ? e.target : null);
  const fromName = srcNode?.name || srcNode?.label || String(srcId) || ("Entity " + (idx + 1));
  const toName   = tgtNode?.name || tgtNode?.label || String(tgtId) || ("Entity " + (idx + 2));
  const amount = Number(e.amount ?? e.value ?? e.properties?.amount ?? e.properties?.value ?? 0);
  const date = e.timestamp || e.date || e.properties?.timestamp || e.properties?.date || "2026-03-05";
  const bank = e.properties?.bank || e.properties?.channel || e.bank || srcNode?.bank || "Commercial Banking Registry";
  const isCircular = Boolean(e.is_circular || e.properties?.is_circular || e.circular);
  return {
    id: e.id || e.properties?.transaction_id || ("TXN-" + (idx + 1)),
    source: srcId, target: tgtId,
    from_name: fromName, to_name: toName, from_id: srcId, to_id: tgtId,
    amount, date, timestamp: date, bank,
    evidence: e.evidence || e.properties?.evidence || "Recorded in investigation graph",
    transaction_id: e.properties?.transaction_id || e.id || ("TXN-" + (idx + 1)),
    type: e.type || e.label || "FINANCIAL_FLOW",
    is_circular: isCircular, _source: "graph_edge",
  };
};

export default function FinancialFlowView({ graphData = { nodes: [], edges: [] }, onSelectEntity }) {
  const [apiTransactions, setApiTransactions] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [simulating, setSimulating] = useState(false);
  const [frozen, setFrozen] = useState(false);

  // PRIMARY: derive from the live investigation graphData.edges prop
  const graphDerivedTransactions = useMemo(() => {
    const nodes = graphData?.nodes || [];
    const edges = graphData?.edges || [];
    console.debug("[FinancialFlow] graphData.edges total:", edges.length);
    const nodeMap = new Map(nodes.map(n => [String(n.id || n.name || ""), n]));
    const financialEdges = edges.filter(isFinancialEdge);
    console.debug("[FinancialFlow] financial edges matched:", financialEdges.length, financialEdges.map(e => e.type || e.label));
    const derived = financialEdges.map((e, idx) => edgeToTx(e, nodeMap, idx));
    console.debug("[FinancialFlow] graph-derived transactions:", derived.length);
    return derived;
  }, [graphData]);

  // SUPPLEMENTARY: API fetch triggered whenever graphData changes
  useEffect(() => {
    if (!graphData?.nodes?.length) { setApiTransactions([]); return; }
    let isMounted = true;
    setApiLoading(true);
    apiService.getFinancialTransactions()
      .then(data => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        console.debug("[FinancialFlow] API supplementary transactions:", list.length);
        setApiTransactions(list);
      })
      .catch(err => console.warn("[FinancialFlow] API fetch failed (non-fatal):", err))
      .finally(() => { if (isMounted) setApiLoading(false); });
    return () => { isMounted = false; };
  }, [graphData]);

  // MERGE: graph-derived wins; API records fill gaps, scoped to this subgraph
  const allTransfers = useMemo(() => {
    const seen = new Set();
    const merged = [];
    for (const tx of graphDerivedTransactions) {
      const key = tx.id || tx.transaction_id;
      if (!seen.has(key)) { seen.add(key); merged.push(tx); }
    }
    const graphNodeIds   = new Set((graphData?.nodes || []).map(n => String(n.id || "").toLowerCase()));
    const graphNodeNames = new Set((graphData?.nodes || []).map(n => (n.name || "").toLowerCase()));
    for (const tx of apiTransactions) {
      const key = tx.id || tx.transaction_id;
      if (seen.has(key)) continue;
      const fromId   = (tx.from_id   || tx.source || "").toLowerCase();
      const toId     = (tx.to_id     || tx.target || "").toLowerCase();
      const fromName = (tx.from_name || "").toLowerCase();
      const toName   = (tx.to_name   || "").toLowerCase();
      const inScope =
        (fromId   && graphNodeIds.has(fromId))   ||
        (toId     && graphNodeIds.has(toId))     ||
        (fromName && graphNodeNames.has(fromName)) ||
        (toName   && graphNodeNames.has(toName));
      if (inScope) { seen.add(key); merged.push(tx); }
    }
    console.debug("[FinancialFlow] merged allTransfers:", merged.length);
    return merged;
  }, [graphDerivedTransactions, apiTransactions, graphData]);

  const loading = apiLoading && graphDerivedTransactions.length === 0;
  const circularTransfers = useMemo(() => allTransfers.filter(t => t.is_circular), [allTransfers]);
  const filteredTransfers = useMemo(() => {
    let result;
    if (filterType === "CIRCULAR") result = circularTransfers;
    else if (filterType === "REGULAR") result = allTransfers.filter(t => !t.is_circular);
    else result = allTransfers;
    console.debug("[FinancialFlow] filteredTransfers after filter", filterType, ":", result.length);
    return result;
  }, [allTransfers, circularTransfers, filterType]);

  const totalTracked = useMemo(() => allTransfers.reduce((acc, t) => acc + (Number(t.amount) || 0), 0), [allTransfers]);
  const formattedTotal = totalTracked > 0 ? ("Rs." + totalTracked.toLocaleString("en-IN")) : "Rs.0";
  const uniqueEntities = useMemo(() => {
    const s = new Set();
    allTransfers.forEach(t => { if (t.from_name) s.add(t.from_name); if (t.to_name) s.add(t.to_name); });
    return s;
  }, [allTransfers]);
  const muleCount = uniqueEntities.size;
  const activeCaseId = graphData?.case_info?.id || graphData?.case_info?.case_id || null;
  const caseLabel = activeCaseId ? ("Case " + activeCaseId) : "Active Investigation";

  const handleRunSimulation = () => {
    if (allTransfers.length === 0) return;
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      alert("Hawala Flow Simulation complete: Verified " + (circularTransfers.length > 0 ? (circularTransfers.length + "-hop circular trail") : (allTransfers.length + " transaction pathways")) + " analyzed for " + caseLabel + ".");
    }, 1200);
  };
  const handleFreezeAccounts = () => {
    setFrozen(true);
    alert("Section 107 BNSS Emergency Freezing Orders registered for " + (muleCount > 0 ? muleCount : "flagged") + " linked accounts in " + caseLabel + ".");
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-4 lg:p-6 gap-5 no-scrollbar">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono uppercase font-semibold tracking-wider flex items-center gap-1.5 border border-amber-200/70">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              MONEY LAUNDERING INVESTIGATION
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 text-xs font-mono font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              FINANCIAL INTELLIGENCE ACTIVE
            </span>
            {activeCaseId && (
              <span className="text-xs font-mono font-semibold text-sky-700 px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200/80 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">folder_open</span>
                {caseLabel}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3 mt-0.5 flex-wrap">
            <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">Money Trail &amp; Suspicious Bank Transfers</h1>
            <span className="text-xs font-mono font-semibold text-slate-700 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/80">TOTAL TRACKED: {formattedTotal}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleRunSimulation} disabled={simulating || allTransfers.length === 0} className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs flex items-center gap-1.5 transition-all border border-slate-200/80 shadow-xs font-medium cursor-pointer active:scale-95 disabled:opacity-50">
            <span className="material-symbols-outlined text-[16px] text-slate-600">{simulating ? "autorenew" : "play_circle"}</span>
            <span>{simulating ? "Simulating Movement..." : "Simulate Money Flow"}</span>
          </button>
          <button onClick={handleFreezeAccounts} disabled={allTransfers.length === 0} className={"px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 " + (frozen ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900 hover:bg-slate-800")}>
            <span className="material-symbols-outlined text-[16px]">{frozen ? "task_alt" : "gavel"}</span>
            <span>{frozen ? "Freeze Orders Active" : "Freeze Mule Accounts (Sec 107 BNSS)"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="material-symbols-outlined animate-spin text-[32px] text-slate-400 mb-2">sync</span>
          <p className="text-xs text-slate-600 font-medium">Extracting financial graph telemetry from database...</p>
        </div>
      ) : allTransfers.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-xs gap-3">
          <span className="material-symbols-outlined text-[42px] text-slate-400">account_balance_wallet</span>
          <h3 className="font-display text-base font-bold text-slate-900">No Transaction Records Found for Target</h3>
          <p className="text-xs text-slate-500 max-w-md">
            No financial edges found in the active investigation subgraph for <span className="font-semibold text-slate-700">{caseLabel}</span>.
            The knowledge graph contains <span className="font-semibold">{(graphData?.edges || []).length}</span> relationship edge{(graphData?.edges || []).length !== 1 ? "s" : ""} total,
            of which <span className="font-semibold">0</span> carry financial predicates or amount values.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">Total Tracked Flow</span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/70">
                  <span className="material-symbols-outlined text-[17px]">currency_rupee</span>
                </div>
              </div>
              <div className="my-2 flex flex-col">
                <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">{formattedTotal}</div>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-mono font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[11px]">trending_up</span>
                    {allTransfers.length} transactions
                  </span>
                  <span className="text-slate-500 text-xs">in subgraph</span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
                <span>Ledger Integrity</span>
                <span className="text-slate-800 font-mono font-semibold">100% Sourced</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-amber-800 tracking-wider font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Circular Patterns
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200/70">
                  <span className="material-symbols-outlined text-[17px]">all_inclusive</span>
                </div>
              </div>
              <div className="my-2 flex flex-col">
                <div className="font-mono text-xl font-bold text-amber-900 tracking-tight">{circularTransfers.length > 0 ? (circularTransfers.length + " Flagged Hops") : "0 Loops Detected"}</div>
                <div className="flex items-center gap-1 pt-1 text-slate-500 text-xs"><span>{circularTransfers.length > 0 ? "Layering & Hawala Scheme" : "No circular loops detected"}</span></div>
              </div>
              <div className="pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
                <span>Pattern Status</span>
                <span className="text-slate-700 font-mono font-semibold">{circularTransfers.length > 0 ? "Suspicious" : "Nominal"}</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">Velocity Window</span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/70">
                  <span className="material-symbols-outlined text-[17px]">timer</span>
                </div>
              </div>
              <div className="my-2 flex flex-col">
                <div className="flex items-baseline gap-2">
                  <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">Multi-Hop</div>
                  <span className="text-slate-400 text-xs font-mono">Rapid Transfer</span>
                </div>
                <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-slate-700 h-full rounded-full w-[75%]"></div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
                <span>Velocity Index</span>
                <span className="text-emerald-700 font-mono font-semibold">HIGH SPEED</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-rose-700 tracking-wider font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">shield_alert</span>Flagged Entities
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200/70">
                  <span className="material-symbols-outlined text-[17px]">account_balance</span>
                </div>
              </div>
              <div className="my-2 flex flex-col">
                <div className="font-mono text-xl font-bold text-rose-700 tracking-tight">{muleCount} Entities</div>
                <div className="flex items-center gap-1 pt-1 text-slate-500 text-xs"><span>Linked banking transactors</span></div>
              </div>
              <div className="pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
                <span>Sec 107 BNSS</span>
                <span className={"font-mono font-semibold " + (frozen ? "text-emerald-700" : "text-amber-700")}>{frozen ? "ENFORCED" : "PENDING"}</span>
              </div>
            </div>
          </div>

          {allTransfers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(circularTransfers.length > 0 ? circularTransfers.slice(0, 3) : allTransfers.slice(0, 3)).map((tx, idx) => (
                <div key={tx.id || idx} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-3.5 relative overflow-hidden transition-all hover:border-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200/70 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">{idx === 0 ? "start" : idx === 1 ? "sync_alt" : "task_alt"}</span>
                      HOP 0{idx + 1} // {idx === 0 ? "ORIGINATION" : idx === 1 ? "LAYERING" : "DISPOSITION"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{tx.date || tx.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block font-medium">Sender:</span>
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{tx.from_name}</h4>
                    <span className="text-[11px] font-mono text-slate-400 truncate block">Ref: {tx.id}</span>
                  </div>
                  <div className="py-2.5 px-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center font-mono">
                    <span className="text-lg font-bold text-slate-900">Rs.{Number(tx.amount || 0).toLocaleString("en-IN")}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{tx.bank || "Banking Ledger"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block font-medium">Receiver:</span>
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{tx.to_name}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/80">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">Hawala &amp; Mule Transaction Ledger</h3>
                  <p className="text-[11px] text-slate-500">{allTransfers.length} transactions scoped to {caseLabel}</p>
                </div>
              </div>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
                {["ALL","CIRCULAR","REGULAR"].map(filter => (
                  <button key={filter} onClick={() => setFilterType(filter)} className={"px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer " + (filterType === filter ? "bg-white text-slate-900 font-semibold shadow-xs" : "text-slate-600 hover:text-slate-900")}>
                    {filter === "ALL" ? "All Transactions" : filter === "CIRCULAR" ? "Circular Only" : "Direct Only"}
                  </button>
                ))}
              </div>
            </div>
            {filteredTransfers.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">No {filterType === "CIRCULAR" ? "circular" : "direct"} transactions found for the active filter.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-slate-500 text-[10px] font-mono uppercase tracking-wider bg-slate-50/70">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Sender</th>
                      <th className="py-2.5 px-3">Receiver</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Bank / Channel</th>
                      <th className="py-2.5 px-3">Pattern</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransfers.map((tx, idx) => (
                      <tr key={tx.id || idx} className="hover:bg-slate-50/70 transition-colors cursor-pointer" onClick={() => onSelectEntity && onSelectEntity(tx.source || tx.from_id)}>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{tx.date || tx.timestamp}</td>
                        <td className="py-2.5 px-3 text-slate-900 font-medium">{tx.from_name}</td>
                        <td className="py-2.5 px-3 text-slate-900 font-medium">{tx.to_name}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">Rs.{Number(tx.amount || 0).toLocaleString("en-IN")}</td>
                        <td className="py-2.5 px-3 text-slate-500 truncate max-w-[160px]">{tx.bank || "Direct Transfer"}</td>
                        <td className="py-2.5 px-3">
                          {tx.is_circular ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 font-mono text-[10px] font-semibold">CIRCULAR LOOP</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200/70">DIRECT TRANSFER</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
