import React, { useState } from 'react';
import { FIR_CORPUS } from '../data/mockIntelligenceData';

export default function FirCorpusView({ onJumpToGraph }) {
  const [selectedDocId, setSelectedDocId] = useState('FIR_101');

  const currentFir = FIR_CORPUS.find(f => f.doc_id === selectedDocId) || FIR_CORPUS[0];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-margin lg:p-margin-lg gap-space-lg no-scrollbar">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700 border border-sky-200 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">policy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-sky-700 font-bold tracking-wider">
                EVIDENCE VAULT // POLICE RECORD CORPUS
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                OCR NORMALIZED
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-slate-900 tracking-tight mt-0.5">
              FIR Corpus & Electronic Case Records
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-label-sm font-label-sm font-mono">
          {FIR_CORPUS.map((fir) => (
            <button
              key={fir.doc_id}
              onClick={() => setSelectedDocId(fir.doc_id)}
              className={`px-3.5 py-1.5 rounded-lg border transition-all shadow-xs ${
                selectedDocId === fir.doc_id
                  ? 'bg-sky-600 text-white font-bold border-sky-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {fir.doc_id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FIR Document Transcript */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block uppercase font-medium">
                {currentFir.police_station}
              </span>
              <h3 className="text-headline-sm font-bold text-slate-900">
                FIR No: {currentFir.fir_no} • {currentFir.date}
              </h3>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {currentFir.offence}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 font-mono text-[12px] text-slate-800 leading-relaxed max-h-[480px] overflow-y-auto whitespace-pre-wrap no-scrollbar shadow-inner">
            {currentFir.text}
          </div>
        </div>

        {/* Extracted Details Sidebar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm gap-4">
          <div className="flex flex-col gap-4">
            <h4 className="text-label-sm font-label-sm font-bold uppercase tracking-wider flex items-center gap-2 text-sky-700">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Extracted Incident Triplet Details</span>
            </h4>

            <div className="flex flex-col gap-3 text-body-sm">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-mono block font-medium">COMPLAINANT / VICTIM</span>
                <span className="text-slate-900 font-semibold">{currentFir.complainant}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-mono block font-medium">ACCUSED SUSPECTS NAMED</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentFir.accused.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[11px] font-bold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-mono block font-medium">INCIDENT FORENSIC SUMMARY</span>
                <p className="text-slate-600 text-[12px] leading-relaxed">{currentFir.summary}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onJumpToGraph}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-600 text-white font-label-md text-label-md font-bold shadow-xs hover:bg-sky-700 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Jump to Knowledge Graph</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
