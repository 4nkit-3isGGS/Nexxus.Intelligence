import React, { useState } from 'react';
import { FIR_CORPUS } from '../data/mockIntelligenceData';

export default function FirCorpusView({ onJumpToGraph, onInvestigateFir }) {
  const [selectedDocId, setSelectedDocId] = useState('FIR_101');

  const currentFir = FIR_CORPUS.find(f => f.doc_id === selectedDocId) || FIR_CORPUS[0];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-4 lg:p-6 gap-5 no-scrollbar">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700 border border-sky-200 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">policy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-sky-700 font-bold tracking-wider">
                EVIDENCE VAULT // POLICE RECORD CORPUS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                OCR NORMALIZED
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 tracking-tight mt-0.5">
              FIR Corpus & Electronic Case Records
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          {FIR_CORPUS.map((fir) => (
            <button
              key={fir.doc_id}
              onClick={() => setSelectedDocId(fir.doc_id)}
              className={`px-3.5 py-1.5 rounded-xl border transition-all shadow-xs cursor-pointer ${
                selectedDocId === fir.doc_id
                  ? 'bg-sky-600 text-white font-bold border-sky-600 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {fir.doc_id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* FIR Document Transcript */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <span className="text-[10px] text-slate-500 font-mono block uppercase font-bold tracking-wider">
                {currentFir.police_station}
              </span>
              <h3 className="font-display text-base font-bold text-slate-900 mt-0.5">
                FIR No: {currentFir.fir_no} • {currentFir.date}
              </h3>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {currentFir.offence}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 leading-relaxed max-h-[480px] overflow-y-auto whitespace-pre-wrap no-scrollbar">
            {currentFir.text}
          </div>
        </div>

        {/* Extracted Details Sidebar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 border-b border-slate-100 pb-2.5">
              <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
              <span>Extracted Incident Triplet Details</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-mono block font-bold uppercase tracking-wider">COMPLAINANT / VICTIM</span>
                <span className="text-slate-900 font-bold text-xs">{currentFir.complainant}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-mono block font-bold uppercase tracking-wider">ACCUSED SUSPECTS NAMED</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {currentFir.accused.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[11px] font-bold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-mono block font-bold uppercase tracking-wider">INCIDENT FORENSIC SUMMARY</span>
                <p className="text-slate-700 text-xs leading-relaxed font-normal">{currentFir.summary}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {onInvestigateFir && (
              <button
                onClick={() => onInvestigateFir(currentFir)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
                title="Launch multi-agent investigation into accused suspects and incident syndicate links"
              >
                <span className="material-symbols-outlined text-[17px] text-sky-200 group-hover:rotate-12 transition-transform">
                  smart_toy
                </span>
                <span>Investigate FIR with Swarm (/api/investigate)</span>
              </button>
            )}

            <button
              onClick={onJumpToGraph}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Jump to Knowledge Graph</span>
              <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
