import React, { useState } from 'react';
import confetti from 'canvas-confetti';
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
    return c.caller.includes(q) || c.receiver.includes(q) || c.caller_name.toLowerCase().includes(q) || c.receiver_name.toLowerCase().includes(q);
  });

  const handleTriangulate = () => {
    setTriangulating(true);
    setTimeout(() => {
      setTriangulating(false);
      alert('BTS Tower Triangulation complete: 22 calls converged on Sector V Tower #KOL-SL-04.');
    }, 1200);
  };

  const handleBsaCertificate = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    alert('Bharatiya Sakshya Adhiniyam, 2023 / Section 65B Electronic Telecomm Certificate generated.');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-margin lg:p-margin-lg gap-space-lg no-scrollbar">
      {/* TOP CONTEXT PANEL / BREADCRUMB & METADATA BANNER */}
      <section className="bg-white rounded-2xl p-space-lg shadow-sm relative flex flex-col flex-shrink-0 min-h-fit border border-slate-200/80">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl"></div>
          <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-rose-500/5 blur-3xl"></div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative z-10">
          <div className="flex flex-col gap-space-xs">
            {/* Tactical Breadcrumb & Case Pin */}
            <div className="flex flex-wrap items-center gap-space-xs font-label-sm text-label-sm">
              <span className="text-slate-500">TACTICAL OPS</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">CDR GEO TOWER</span>
              <span className="text-slate-300">/</span>
              <span className="text-sky-700 font-bold tracking-wider">CALL MATRIX & BURST TELEMETRY</span>
              <span className="text-slate-300">•</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-label-sm text-label-sm font-semibold flex items-center gap-1.5 shadow-xs border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                BURST DETECTED
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-label-sm text-label-sm font-medium border border-slate-200/60">
                CASE-KOL-2026-088
              </span>
            </div>

            {/* Page Title & Target Subtitle */}
            <div className="flex flex-col mt-1">
              <div className="flex items-baseline gap-space-sm flex-wrap">
                <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-slate-900">
                  CDR Telemetry & Extortion Spike Matrix
                </h1>
                <span className="font-label-md text-label-md text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono font-medium">
                  TARGET: +91 9832145678 (Rajesh Kumar Sharma)
                </span>
              </div>
              <p className="font-body-md text-body-md text-slate-600 mt-0.5 max-w-4xl">
                Automated Telco Ingestion (Airtel WB, Reliance Jio, Vi India) • Geo-Spatial Tower Triangulation • IMSI/IMEI Burner Handset Correlation
              </p>
            </div>
          </div>

          {/* Tactical Ops Action Row */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              onClick={handleTriangulate}
              className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-sky-600 text-white font-label-md text-label-md font-bold shadow-xs hover:bg-sky-700 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">
                {triangulating ? 'autorenew' : 'cell_tower'}
              </span>
              <span>{triangulating ? 'Triangulating...' : 'Run Tower Triangulation'}</span>
            </button>
            <button
              onClick={handleBsaCertificate}
              className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all font-label-md text-label-md font-bold border border-emerald-200 shadow-xs"
              title="Bharatiya Sakshya Adhiniyam, 2023 Electronic Evidence Seal"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>BSA §65B Certificate</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4-CARD TELECOMM INTEL OVERVIEW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter-lg flex-shrink-0 min-h-fit">
        {/* Card 1: Total Calls Analyzed */}
        <div className="bg-white rounded-2xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-slate-500 font-semibold">
                Total Calls Analyzed
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-xl text-headline-xl font-bold text-slate-900">38</span>
                <span className="font-label-md text-label-md text-sky-700 font-semibold">Events</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700 border border-sky-100">
              <span className="material-symbols-outlined text-[22px]">call_log</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-slate-500 font-label-sm text-label-sm border-t border-slate-100">
            <span>Span: 24 Days (01-24 Mar)</span>
            <span className="text-sky-700 font-mono font-bold">3 Cell Towers</span>
          </div>
        </div>

        {/* Card 2: Extortion Spike Date */}
        <div className="bg-white rounded-2xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-rose-600 font-bold">
                  Extortion Spike Date
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              </div>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-lg text-headline-lg font-bold text-slate-900 tracking-tight font-mono">
                  2026-03-05
                </span>
              </div>
            </div>
            <div className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 font-label-sm text-label-sm font-bold flex items-center gap-1 border border-rose-200">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              <span>22 Calls/Day</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-slate-500 font-label-sm text-label-sm border-t border-slate-100 relative z-10">
            <span className="text-rose-600 font-semibold">92% Duration Concentration</span>
            <span className="text-slate-400 font-mono">74m 12s</span>
          </div>
        </div>

        {/* Card 3: Identified Burner SIMs */}
        <div className="bg-white rounded-2xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-slate-500 font-semibold">
                Identified Burner SIMs
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-xl text-headline-xl font-bold text-slate-900">4</span>
                <span className="font-label-md text-label-md text-amber-700 font-semibold">MSISDNs</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-100">
              <span className="material-symbols-outlined text-[22px]">sim_card_alert</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-slate-500 font-label-sm text-label-sm border-t border-slate-100">
            <span className="text-amber-700 font-medium">Spoofed VoIP Handsets</span>
            <span className="text-slate-400 font-mono">Patna Switch</span>
          </div>
        </div>

        {/* Card 4: Cell Tower Anchor */}
        <div className="bg-white rounded-2xl p-space-md shadow-sm flex flex-col justify-between relative overflow-hidden border border-slate-200/80">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-slate-500 font-semibold">
                Triangulated Cell Tower
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-md text-headline-sm font-bold text-slate-900">Sector V</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-100">
              <span className="material-symbols-outlined text-[22px]">cell_tower</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-slate-500 font-label-sm text-label-sm border-t border-slate-100">
            <span className="text-emerald-700 font-mono font-bold">#KOL-SL-04</span>
            <span className="text-slate-400 font-mono">100% Signal Anchor</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: WIRETAP AUDIO SIMULATION & WAVEFORM */}
      <section className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col flex-shrink-0 min-h-fit gap-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-600 text-[20px]">graphic_eq</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-slate-900">
              Acoustic Intercept Recording // Tape No. 2026-CDR-05B
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Forensic Audio Hash Verified
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-sky-600 text-white shadow-xs hover:bg-sky-700'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-label-sm font-label-sm">
                <span className="text-rose-600 font-bold">2026-03-05 08:40:00 IST (Call #3)</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-800 font-mono font-medium">Duration: 55s</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
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
                  isPlayingAudio ? 'bg-rose-600 animate-pulse' : 'bg-slate-300'
                }`}
                style={{ height: `${isPlayingAudio ? Math.max(height, 8) : 8}px` }}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CDR CALL LOG MATRIX TABLE */}
      <section className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col flex-shrink-0 min-h-fit gap-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-700 text-[20px]">call</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-slate-900">
              Call Detail Records Log
            </h3>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Filter by caller or receiver..."
              className="px-3 py-1.5 rounded-lg bg-slate-50 text-body-sm font-body-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:border-sky-500 font-medium"
            />
            {['ALL', 'SPIKE', 'MASTERMIND'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveCallFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors shadow-xs ${
                  activeCallFilter === f
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f === 'ALL' ? 'All Calls' : f === 'SPIKE' ? 'Extortion Burst (22)' : 'Mastermind'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-label-sm text-label-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase">
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
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{c.timestamp}</td>
                  <td className="py-2.5 px-3 text-slate-900 font-semibold">{c.caller_name} ({c.caller})</td>
                  <td className="py-2.5 px-3 text-slate-900 font-semibold">{c.receiver_name} ({c.receiver})</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{c.duration_sec}s</td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-[160px]">{c.cell_tower}</td>
                  <td className="py-2.5 px-3">
                    {c.is_spike ? (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold">
                        BURST SPIKE
                      </span>
                    ) : c.is_mastermind ? (
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-bold">
                        CUT-OUT BRIDGE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
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
