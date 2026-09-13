import React, { useState } from 'react';
import { FIR_CORPUS } from '../data/mockIntelligenceData';

export default function FirCorpusView({ onJumpToGraph }) {
  const [selectedDocId, setSelectedDocId] = useState('FIR_101');

  const currentFir = FIR_CORPUS.find(f => f.doc_id === selectedDocId) || FIR_CORPUS[0];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-surface-base text-on-surface p-margin lg:p-margin-lg gap-space-lg no-scrollbar">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <span className="material-symbols-outlined text-[24px]">policy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-primary font-bold tracking-wider">
                EVIDENCE VAULT // POLICE RECORD CORPUS
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-verified-emerald/20 text-verified-emerald border border-verified-emerald/30">
                OCR NORMALIZED
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight mt-0.5">
              FIR Corpus & Electronic Case Records
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-label-sm font-label-sm font-mono">
          {FIR_CORPUS.map((fir) => (
            <button
              key={fir.doc_id}
              onClick={() => setSelectedDocId(fir.doc_id)}
              className={`px-3.5 py-1.5 rounded-lg border transition-all ${
                selectedDocId === fir.doc_id
                  ? 'bg-primary-container text-on-primary font-bold border-primary shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-surface-container text-on-surface-variant border-white/[0.06] hover:text-on-surface'
              }`}
            >
              {fir.doc_id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FIR Document Transcript */}
        <div className="lg:col-span-2 bg-surface-container-low/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between border-b border-white/[0.06] pb-3 gap-2">
            <div>
              <span className="text-[10px] text-outline font-mono block uppercase">
                {currentFir.police_station}
              </span>
              <h3 className="text-headline-sm font-bold text-on-surface">
                FIR No: {currentFir.fir_no} • {currentFir.date}
              </h3>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label-sm font-bold bg-threat-crimson/20 text-threat-crimson border border-threat-crimson/30">
              {currentFir.offence}
            </span>
          </div>

          <div className="bg-surface-container-lowest/90 border border-white/[0.04] rounded-xl p-4 font-mono text-[12px] text-on-surface leading-relaxed max-h-[480px] overflow-y-auto whitespace-pre-wrap no-scrollbar shadow-inner">
            {currentFir.text}
          </div>
        </div>

        {/* Extracted Details Sidebar */}
        <div className="bg-surface-container-low/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xl gap-4">
          <div className="flex flex-col gap-4">
            <h4 className="text-label-sm font-label-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Extracted Incident Triplet Details</span>
            </h4>

            <div className="flex flex-col gap-3 text-body-sm">
              <div className="bg-surface-container p-3 rounded-xl border border-white/[0.04] flex flex-col gap-1">
                <span className="text-[10px] text-outline font-mono block">COMPLAINANT / VICTIM</span>
                <span className="text-on-surface font-semibold">{currentFir.complainant}</span>
              </div>

              <div className="bg-surface-container p-3 rounded-xl border border-white/[0.04] flex flex-col gap-1">
                <span className="text-[10px] text-outline font-mono block">ACCUSED SUSPECTS NAMED</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentFir.accused.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-threat-crimson/15 text-threat-crimson font-mono text-[11px] font-bold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container p-3 rounded-xl border border-white/[0.04] flex flex-col gap-1">
                <span className="text-[10px] text-outline font-mono block">INCIDENT FORENSIC SUMMARY</span>
                <p className="text-on-surface-variant text-[12px] leading-relaxed">{currentFir.summary}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onJumpToGraph}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-surface-base font-label-md text-label-md font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:bg-tertiary-fixed transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Jump to Knowledge Graph</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
