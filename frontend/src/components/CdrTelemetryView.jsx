import React, { useState } from 'react';
import { RAW_CDR_RECORDS } from '../data/mockIntelligenceData';

export default function CdrTelemetryView() {
  const [searchPhone, setSearchPhone] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeCallFilter, setActiveCallFilter] = useState('ALL');
  const [triangulating, setTriangulating] = useState(false);

  const filteredCalls = RAW_CDR_RECORDS.filter(c => {
    if (activeCallFilter === 'SPIKE' && !c.is_spike) return false;
    if (activeCallFilter === 'MASTERMIND' && !c.is_mastermind) return false;
    if (!searchPhone) return true;
    const q = searchPhone.toLowerCase();
    return (
      c.caller.includes(q) || 
      c.receiver.includes(q) || 
      c.caller_name.toLowerCase().includes(q) || 
      c.receiver_name.toLowerCase().includes(q)
    );
  });

  const handleTriangulate = () => {
    setTriangulating(true);
    setTimeout(() => {
      setTriangulating(false);
      alert('BTS Tower Triangulation complete: 22 calls converged on Sector V Tower #KOL-SL-04.');
    }, 1200);
  };

  const handleBsaCertificate = () => {
    alert('Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Electronic Telecomm Certificate generated.');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-4 lg:p-6 gap-5 no-scrollbar">
      {/* TOP CONTEXT PANEL / BREADCRUMB & METADATA BANNER */}
      <section className="bg-white rounded-2xl p-5 shadow-xs relative flex flex-col flex-shrink-0 min-h-fit border border-slate-200/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            {/* Breadcrumb & Case Pin */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono uppercase font-semibold text-[10px] tracking-wider">CASE WORKSPACE</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-mono uppercase font-semibold text-[10px] tracking-wider">PHONE RECORDS</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-800 font-mono font-semibold text-[10px] tracking-wider">CALL SPIKES</span>
              <span className="text-slate-300">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-mono font-semibold flex items-center gap-1.5 border border-rose-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                UNUSUAL SPIKE DETECTED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-medium border border-slate-200/80">
                CASE-KOL-2026-088
              </span>
            </div>

            {/* Page Title & Target Subtitle */}
            <div className="flex flex-col mt-0.5">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h1 className="font-display text-xl font-bold tracking-tight text-slate-900">
                  Call Records & Suspicious Call Spikes
                </h1>
                <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/70 font-mono font-semibold">
                  TARGET: +91 9832145678 (Rajesh Kumar Sharma)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-4xl font-normal">
                Analyzes telecom carrier records • Identifies caller locations and cell tower anchors • Flags VoIP burner devices
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTriangulate}
              disabled={triangulating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                {triangulating ? 'autorenew' : 'cell_tower'}
              </span>
              <span>{triangulating ? 'Locating...' : 'Locate Towers & Callers'}</span>
            </button>
            <button
              onClick={handleBsaCertificate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-800 hover:bg-slate-50 transition-all text-xs font-medium border border-slate-200/80 shadow-xs cursor-pointer active:scale-95"
              title="Bharatiya Sakshya Adhiniyam, 2023 Electronic Evidence Seal"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-700">verified</span>
              <span>BSA §65B Certificate</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4-CARD TELECOMM INTEL OVERVIEW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0 min-h-fit">
        {/* Card 1: Total Calls Analyzed */}
        <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Total Calls Analyzed
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-mono text-2xl font-bold text-slate-900">38</span>
                <span className="text-xs text-slate-500 font-medium">Events</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/70">
              <span className="material-symbols-outlined text-[18px]">call_log</span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
            <span>Span: 24 Days (01-24 Mar)</span>
            <span className="text-slate-800 font-mono font-semibold">3 Cell Towers</span>
          </div>
        </div>

        {/* Card 2: Extortion Spike Date */}
        <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 font-semibold">
                  Extortion Spike Date
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-mono text-xl font-bold text-slate-900 tracking-tight">
                  2026-03-05
                </span>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-mono font-semibold flex items-center gap-1 border border-rose-200/70">
              <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
              <span>22 Calls/Day</span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
            <span className="text-rose-700 font-medium">92% Duration Spike</span>
            <span className="text-slate-500 font-mono">74m 12s</span>
          </div>
        </div>

        {/* Card 3: Identified Burner SIMs */}
        <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Identified Burner SIMs
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-mono text-2xl font-bold text-slate-900">4</span>
                <span className="text-xs text-amber-800 font-medium">MSISDNs</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200/70">
              <span className="material-symbols-outlined text-[18px]">sim_card_alert</span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
            <span className="text-slate-600">Spoofed VoIP Handsets</span>
            <span className="text-slate-500 font-mono">Patna Switch</span>
          </div>
        </div>

        {/* Card 4: Cell Tower Anchor */}
        <div className="bg-white rounded-2xl p-4 shadow-xs flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Triangulated Cell Tower
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-mono text-lg font-bold text-slate-900">Sector V</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200/70">
              <span className="material-symbols-outlined text-[18px]">cell_tower</span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
            <span className="text-emerald-700 font-mono font-semibold">#KOL-SL-04</span>
            <span className="text-slate-500 font-mono">100% Signal Anchor</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: WIRETAP AUDIO SIMULATION & WAVEFORM */}
      <section className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col flex-shrink-0 min-h-fit gap-3.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/80">
              <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Acoustic Intercept Recording // Tape No. 2026-CDR-05B
              </h3>
              <p className="text-[11px] text-slate-500">Lawful intercept wiretap matching case audio profile</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
            <span className="material-symbols-outlined text-[13px] text-emerald-700">verified</span>
            Forensic Audio Hash Verified
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-900 font-semibold">2026-03-05 08:40:00 IST (Call #3)</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-mono">Duration: 55s</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-medium italic">
                Rajesh K. Sharma ➔ Manoj Tiwari: "You have until 4 PM to deposit ₹45,000 into the account."
              </p>
            </div>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center gap-1 h-8 px-3">
            {[12, 28, 16, 32, 24, 8, 30, 20, 36, 14, 26, 34, 18, 22, 30, 16, 28, 10, 24, 32].map((height, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlayingAudio ? 'bg-slate-900 animate-pulse' : 'bg-slate-300'
                }`}
                style={{ height: `${isPlayingAudio ? Math.max(height, 8) : 8}px` }}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CDR CALL LOG MATRIX TABLE */}
      <section className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col flex-shrink-0 min-h-fit gap-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/80">
              <span className="material-symbols-outlined text-[18px]">call</span>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Call Detail Records Log
              </h3>
              <p className="text-[11px] text-slate-500">Cross-carrier CDR matrix with duration, cell tower IDs, and caller IDs</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <input
                type="text"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Filter by caller or receiver..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 border border-slate-300 focus:outline-none focus:border-slate-500 font-medium"
              />
              <span className="material-symbols-outlined text-slate-400 text-[15px] absolute left-2.5 top-1/2 -translate-y-1/2">
                search
              </span>
            </div>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
              {['ALL', 'SPIKE', 'MASTERMIND'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveCallFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all font-medium cursor-pointer ${
                    activeCallFilter === f
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f === 'ALL' ? 'All Calls' : f === 'SPIKE' ? 'Extortion Burst (22)' : 'Mastermind'}
                </button>
              ))}
            </div>
          </div>
        </div>

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
              {filteredCalls.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500">{c.timestamp}</td>
                  <td className="py-2.5 px-3 text-slate-900 font-medium">{c.caller_name} ({c.caller})</td>
                  <td className="py-2.5 px-3 text-slate-900 font-medium">{c.receiver_name} ({c.receiver})</td>
                  <td className="py-2.5 px-3 font-mono text-slate-900 font-semibold">{c.duration_sec}s</td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-[160px]">{c.cell_tower}</td>
                  <td className="py-2.5 px-3">
                    {c.is_spike ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/70 font-mono text-[10px] font-semibold">
                        BURST SPIKE
                      </span>
                    ) : c.is_mastermind ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200/70 font-mono text-[10px] font-semibold">
                        CUT-OUT BRIDGE
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
      </section>
    </div>
  );
}
