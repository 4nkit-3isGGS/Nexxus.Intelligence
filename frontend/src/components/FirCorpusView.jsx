import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';

export default function FirCorpusView({ graphData = { nodes: [], edges: [] }, onJumpToGraph, onInvestigateFir, onOpenUpload }) {
  const [allFirs, setAllFirs] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFirs() {
      setLoading(true);
      try {
        const data = await apiService.getFirDocuments();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          setAllFirs(list);
        }
      } catch (err) {
        console.error('Failed to load FIR documents:', err);
        if (isMounted) setAllFirs([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadFirs();
    return () => { isMounted = false; };
  }, []);

  const activeCaseId = graphData.case_info?.id || graphData.case_info?.case_id || null;

  // Build identity sets from the active investigation graph
  const graphEntityNames = useMemo(() => {
    const s = new Set();
    (graphData.nodes || []).forEach(n => {
      if (n.name) s.add(n.name.toLowerCase());
    });
    return s;
  }, [graphData.nodes]);

  // Scope FIR documents to only those linked to the active investigation
  const firs = useMemo(() => {
    if (!allFirs.length) return [];
    if (graphEntityNames.size === 0 && !activeCaseId) return [];

    return allFirs.filter(fir => {
      const firCaseId = (fir.case_id || fir.fir_case_id || '').toLowerCase();

      // Case ID match
      if (activeCaseId && firCaseId && firCaseId.includes(activeCaseId.toLowerCase())) return true;

      // Accused/complainant name overlap with graph entities
      const accusedNames = (fir.accused || []).map(a => a.toLowerCase());
      const complainantName = (fir.complainant || '').toLowerCase();
      const firText = (fir.text || fir.summary || '').toLowerCase();
      const firNo = (fir.fir_no || fir.doc_id || '').toLowerCase();

      for (const gName of graphEntityNames) {
        if (!gName || gName.length < 3) continue;

        // Direct accused match
        if (accusedNames.some(acc => acc.includes(gName) || gName.includes(acc))) return true;
        if (complainantName.includes(gName)) return true;

        // FIR text mentions the entity name
        if (firText.includes(gName)) return true;
      }

      // FIR number / doc_id matches an active case reference
      if (activeCaseId) {
        if (firNo.includes(activeCaseId.toLowerCase())) return true;
      }

      return false;
    });
  }, [allFirs, graphEntityNames, activeCaseId]);

  // Keep selection valid
  useEffect(() => {
    if (firs.length > 0) {
      setSelectedDocId(prev => {
        if (firs.find(f => f.doc_id === prev)) return prev;
        return firs[0].doc_id;
      });
    } else {
      setSelectedDocId(null);
    }
  }, [firs]);

  const currentFir = firs.find(f => f.doc_id === selectedDocId) || firs[0] || null;
  const caseLabel = activeCaseId ? `Case ${activeCaseId}` : 'Active Investigation';

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-4 lg:p-6 gap-5 no-scrollbar">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/80 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">policy</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                POLICE RECORDS // FIRST INFORMATION REPORTS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                DIGITIZED CORPUS
              </span>
              {activeCaseId && (
                <span className="text-xs font-mono font-semibold text-sky-700 px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-200/80 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">folder_open</span>
                  {caseLabel}
                </span>
              )}
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              FIR Case Documents &amp; Police Records
              {firs.length > 0 && (
                <span className="ml-2 text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                  {firs.length} LINKED
                </span>
              )}
            </h2>
          </div>
        </div>

        {firs.length > 0 && (
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs font-mono">
            {firs.map(fir => (
              <button
                key={fir.doc_id}
                onClick={() => setSelectedDocId(fir.doc_id)}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
                  (currentFir?.doc_id === fir.doc_id)
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {fir.doc_id}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="material-symbols-outlined animate-spin text-[32px] text-slate-400 mb-2">sync</span>
          <p className="text-xs text-slate-600 font-medium">Loading FIR records from database...</p>
        </div>
      ) : (!currentFir || firs.length === 0) ? (
        <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200/80 shadow-xs gap-3">
          <span className="material-symbols-outlined text-[42px] text-slate-400">description</span>
          <h3 className="font-display text-base font-bold text-slate-900">No FIR Documents Linked to Investigated Suspects</h3>
          <p className="text-xs text-slate-500 max-w-md">
            No FIR complaints or police records are linked to the entities in <span className="font-semibold text-slate-700">{caseLabel}</span>. The active subgraph suspects do not appear in any indexed FIR documents.
          </p>
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              <span>Upload Case Evidence</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* FIR Document Transcript */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-mono block uppercase font-semibold tracking-wider">
                  {currentFir.police_station || 'Jurisdiction Cyber Cell'}
                </span>
                <h3 className="font-display text-base font-bold text-slate-900 mt-0.5">
                  FIR No: {currentFir.fir_no || currentFir.doc_id} {currentFir.date ? `• ${currentFir.date}` : ''}
                </h3>
              </div>
              {currentFir.offence && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                  {currentFir.offence}
                </span>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 font-mono text-xs text-slate-800 leading-relaxed max-h-[480px] overflow-y-auto whitespace-pre-wrap no-scrollbar">
              {currentFir.text || currentFir.summary || 'Document transcript linked to knowledge graph.'}
            </div>
          </div>

          {/* Extracted Details Sidebar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2.5">
                <span className="material-symbols-outlined text-[17px] text-slate-600">auto_awesome</span>
                <span>Entities Linked to Record</span>
              </div>

              <div className="flex flex-col gap-3">
                {currentFir.complainant && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-mono block font-semibold uppercase tracking-wider">COMPLAINANT / RECORD OFFICER</span>
                    <span className="text-slate-900 font-semibold text-xs">{currentFir.complainant}</span>
                  </div>
                )}

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-mono block font-semibold uppercase tracking-wider">NAMED SUSPECT ENTITIES</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {Array.isArray(currentFir.accused) && currentFir.accused.length > 0 ? (
                      currentFir.accused.map((a, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold border ${
                            // Highlight if the accused is an investigated entity
                            [...graphEntityNames].some(gn => gn && a.toLowerCase().includes(gn))
                              ? 'bg-amber-50 text-amber-800 border-amber-200/70'
                              : 'bg-rose-50 text-rose-700 border-rose-200/70'
                          }`}
                        >
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs italic">Entities indexed in knowledge graph</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 font-mono block font-semibold uppercase tracking-wider">CASE INCIDENT SUMMARY</span>
                  <p className="text-slate-600 text-xs leading-relaxed font-normal">{currentFir.summary}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {onInvestigateFir && (
                <button
                  onClick={() => onInvestigateFir(currentFir)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                  title="Launch multi-agent investigation into accused suspects and incident syndicate links"
                >
                  <span className="material-symbols-outlined text-[17px] text-slate-300">smart_toy</span>
                  <span>Investigate FIR with Agent Swarm</span>
                </button>
              )}
              {onJumpToGraph && (
                <button
                  onClick={onJumpToGraph}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Jump to Knowledge Graph</span>
                  <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
