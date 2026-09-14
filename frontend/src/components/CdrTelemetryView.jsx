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
    <div className="flex-1 flex flex-col overflow-y-auto bg-surface-base text-on-surface p-margin lg:p-margin-lg gap-space-lg no-scrollbar">
      {/* TOP CONTEXT PANEL / BREADCRUMB & METADATA BANNER */}
      <section className="bg-card-glass backdrop-blur-xl rounded-2xl p-space-lg shadow-xl relative flex flex-col flex-shrink-0 min-h-fit border border-white/[0.08]">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-threat-crimson/5 blur-3xl"></div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg relative z-10">
          <div className="flex flex-col gap-space-xs">
            {/* Tactical Breadcrumb & Case Pin */}
            <div className="flex flex-wrap items-center gap-space-xs font-label-sm text-label-sm">
              <span className="text-on-surface-variant">TACTICAL OPS</span>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface-variant">CDR GEO TOWER</span>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-bold tracking-wider">CALL MATRIX & BURST TELEMETRY</span>
              <span className="text-outline-variant">•</span>
              <span className="px-2 py-0.5 rounded-full bg-threat-crimson/15 text-threat-crimson font-label-sm text-label-sm font-semibold flex items-center gap-1.5 shadow-[0_0_8px_rgba(244,63,94,0.2)] border border-threat-crimson/30">
                <span className="w-1.5 h-1.5 rounded-full bg-threat-crimson animate-ping"></span>
                BURST DETECTED
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">
                CASE-KOL-2026-088
              </span>
            </div>

            {/* Page Title & Target Subtitle */}
            <div className="flex flex-col mt-1">
              <div className="flex items-baseline gap-space-sm flex-wrap">
                <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
                  CDR Telemetry & Extortion Spike Matrix
                </h1>
                <span className="font-label-md text-label-md text-risk-amber bg-surface-container-low px-2 py-0.5 rounded border border-risk-amber/30">
                  TARGET: +91 9832145678 (Rajesh Kumar Sharma)
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5 max-w-4xl">
                Automated Telco Ingestion (Airtel WB, Reliance Jio, Vi India) • Geo-Spatial Tower Triangulation • IMSI/IMEI Burner Handset Correlation
              </p>
            </div>
          </div>

          {/* Tactical Ops Action Row */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              onClick={handleTriangulate}
              className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-primary text-surface-base font-label-md text-label-md font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:bg-tertiary-fixed transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">
                {triangulating ? 'autorenew' : 'cell_tower'}
              </span>
              <span>{triangulating ? 'Triangulating...' : 'Run Tower Triangulation'}</span>
            </button>
            <button
              onClick={handleBsaCertificate}
              className="flex items-center gap-space-xs px-3.5 py-2 rounded-lg bg-verified-emerald/15 text-verified-emerald hover:bg-verified-emerald/25 transition-all font-label-md text-label-md font-bold border border-verified-emerald/30"
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
        <div className="bg-card-glass backdrop-blur-xl rounded-2xl p-space-md shadow-md flex flex-col justify-between relative overflow-hidden border border-white/[0.06]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Total Calls Analyzed
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-xl text-headline-xl font-bold text-on-surface">38</span>
                <span className="font-label-md text-label-md text-primary font-semibold">Events</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <span className="material-symbols-outlined text-[22px]">call_log</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-white/[0.04]">
            <span>Span: 24 Days (01-24 Mar)</span>
            <span className="text-primary font-mono font-bold">3 Cell Towers</span>
          </div>
        </div>

        {/* Card 2: Extortion Spike Date */}
        <div className="bg-card-glass backdrop-blur-xl rounded-2xl p-space-md shadow-md flex flex-col justify-between relative overflow-hidden border border-white/[0.06]">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-threat-crimson/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-threat-crimson font-bold">
                  Extortion Spike Date
                </span>
                <span className="w-2 h-2 rounded-full bg-threat-crimson animate-ping"></span>
              </div>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight font-mono">
                  2026-03-05
                </span>
              </div>
            </div>
            <div className="px-2 py-1 rounded-lg bg-threat-crimson/20 text-threat-crimson font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.35)]">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              <span>22 Calls/Day</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-white/[0.04] relative z-10">
            <span className="text-threat-crimson font-semibold">92% Duration Concentration</span>
            <span className="text-outline font-mono">74m 12s</span>
          </div>
        </div>

        {/* Card 3: Identified Burner SIMs */}
        <div className="bg-card-glass backdrop-blur-xl rounded-2xl p-space-md shadow-md flex flex-col justify-between relative overflow-hidden border border-white/[0.06]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Identified Burner SIMs
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-xl text-headline-xl font-bold text-on-surface">4</span>
                <span className="font-label-md text-label-md text-risk-amber font-semibold">MSISDNs</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-risk-amber/20 flex items-center justify-center text-risk-amber">
              <span className="material-symbols-outlined text-[22px]">sim_card_alert</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-white/[0.04]">
            <span className="text-risk-amber font-medium">Spoofed VoIP Handsets</span>
            <span className="text-outline font-mono">Patna Switch</span>
          </div>
        </div>

        {/* Card 4: Cell Tower Anchor */}
        <div className="bg-card-glass backdrop-blur-xl rounded-2xl p-space-md shadow-md flex flex-col justify-between relative overflow-hidden border border-white/[0.06]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Triangulated Cell Tower
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-md text-headline-sm font-bold text-on-surface">Sector V</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-verified-emerald/20 flex items-center justify-center text-verified-emerald">
              <span className="material-symbols-outlined text-[22px]">cell_tower</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-white/[0.04]">
            <span className="text-verified-emerald font-mono font-bold">#KOL-SL-04</span>
            <span className="text-outline font-mono">100% Signal Anchor</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: WIRETAP AUDIO SIMULATION & WAVEFORM */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-white/[0.08] flex flex-col flex-shrink-0 min-h-fit gap-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-threat-crimson text-[20px]">graphic_eq</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Acoustic Intercept Recording // Tape No. 2026-CDR-05B
            </h3>
          </div>
          <span className="text-[11px] font-mono text-verified-emerald font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Forensic Audio Hash Verified
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isPlayingAudio
                  ? 'bg-threat-crimson text-surface-base shadow-[0_0_16px_rgba(244,63,94,0.4)]'
                  : 'bg-primary text-surface-base shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:bg-tertiary-fixed'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">
                {isPlayingAudio ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-label-sm font-label-sm">
                <span className="text-threat-crimson font-bold">2026-03-05 08:40:00 IST (Call #3)</span>
                <span className="text-outline">•</span>
                <span className="text-on-surface font-mono">Duration: 55s</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
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
                  isPlayingAudio ? 'bg-threat-crimson animate-pulse' : 'bg-surface-container-highest'
                }`}
                style={{ height: `${isPlayingAudio ? Math.max(height, 8) : 8}px` }}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: CDR CALL LOG MATRIX TABLE */}
      <section className="p-5 rounded-2xl bg-surface-container-lowest border border-white/[0.08] flex flex-col flex-shrink-0 min-h-fit gap-3 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.04] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">call</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
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
              className="px-3 py-1.5 rounded-lg bg-surface-container text-body-sm font-body-sm text-on-surface placeholder:text-outline border border-white/[0.06] focus:outline-none"
            />
            {['ALL', 'SPIKE', 'MASTERMIND'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveCallFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors ${
                  activeCallFilter === f
                    ? 'bg-primary-container text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
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
              <tr className="border-b border-white/[0.06] text-outline text-[11px] uppercase">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Caller</th>
                <th className="py-2.5 px-3">Receiver</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Cell Tower</th>
                <th className="py-2.5 px-3">Event Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredCalls.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-outline">{c.timestamp}</td>
                  <td className="py-2.5 px-3 text-on-surface font-semibold">{c.caller_name} ({c.caller})</td>
                  <td className="py-2.5 px-3 text-on-surface font-semibold">{c.receiver_name} ({c.receiver})</td>
                  <td className="py-2.5 px-3 font-mono">{c.duration_sec}s</td>
                  <td className="py-2.5 px-3 text-outline truncate max-w-[160px]">{c.cell_tower}</td>
                  <td className="py-2.5 px-3">
                    {c.is_spike ? (
                      <span className="px-2 py-0.5 rounded bg-threat-crimson/20 text-threat-crimson font-mono text-[10px] font-bold">
                        BURST SPIKE
                      </span>
                    ) : c.is_mastermind ? (
                      <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-[10px] font-bold">
                        CUT-OUT BRIDGE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-surface-container text-outline font-mono text-[10px]">
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
