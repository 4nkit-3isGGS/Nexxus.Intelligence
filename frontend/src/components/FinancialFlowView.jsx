import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RAW_BANK_TRANSFERS } from '../data/mockIntelligenceData';

export default function FinancialFlowView({ onSelectEntity }) {
  const [filterType, setFilterType] = useState('ALL');
  const [simulating, setSimulating] = useState(false);
  const [frozen, setFrozen] = useState(false);

  const circularTransfers = RAW_BANK_TRANSFERS.filter(t => t.is_circular);
  const filteredTransfers = filterType === 'ALL' 
    ? RAW_BANK_TRANSFERS 
    : filterType === 'CIRCULAR' 
    ? circularTransfers 
    : RAW_BANK_TRANSFERS.filter(t => !t.is_circular);

  const handleRunSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      alert('Hawala Flow Simulation complete: Verified 3-hop loop closed in 48.2 hours with 2% leakage.');
    }, 1200);
  };

  const handleFreezeAccounts = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setFrozen(true);
    alert('Section 107 BNSS Emergency Freezing Orders issued to Kolkata Commercial Bank for 3 flagged mule accounts.');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-surface-base text-on-surface p-margin lg:p-margin-lg gap-space-lg no-scrollbar">
      {/* TACTICAL TOP BAR / SUB-HEADER TELEMETRY */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-sm border-b border-white/[0.06]">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-risk-amber/15 text-risk-amber font-label-sm text-label-sm uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-sm border border-risk-amber/30">
              <span className="w-1.5 h-1.5 rounded-full bg-risk-amber animate-ping"></span>
              PMLA SEC 3/4 FINANCIAL CRIME VECTOR
            </span>
            <span className="text-on-surface-variant font-label-sm text-label-sm tracking-widest uppercase">
              NEXXUS-INTEL-TRIPLET
            </span>
            <span className="text-outline-variant font-label-sm text-label-sm">•</span>
            <span className="text-verified-emerald font-label-sm text-label-sm font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              FIU-IND TACTICAL FEED ONLINE
            </span>
          </div>
          <div className="flex items-baseline gap-space-md mt-1">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
              Money Trail & Hawala Forensic Ledger
            </h1>
            <span className="font-label-lg text-label-lg text-risk-amber font-mono font-semibold px-2 py-0.5 rounded bg-surface-container-high">
              ₹14,85,000 INR AGGREGATE
            </span>
          </div>
        </div>

        {/* Tactical Command Actions */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            onClick={handleRunSimulation}
            className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-space-xs shadow-md transition-all active:scale-95 border border-white/[0.06]"
          >
            <span className="material-symbols-outlined text-[18px]">
              {simulating ? 'autorenew' : 'play_circle'}
            </span>
            <span>{simulating ? 'Simulating Flow...' : 'Run Flow Simulation'}</span>
          </button>
          <button
            onClick={handleFreezeAccounts}
            className={`px-3.5 py-2 rounded-lg text-surface-base font-label-md text-label-md font-bold flex items-center gap-space-xs shadow-[0_0_16px_rgba(244,63,94,0.35)] transition-all active:scale-95 ${
              frozen ? 'bg-verified-emerald text-white' : 'bg-threat-crimson hover:bg-threat-crimson-dark'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <span>{frozen ? 'Sec 107 Orders Active' : 'Sec 107 BNSS Freeze (3 Mules)'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TOP 4 METRICS STRIP (Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-lg">
        {/* Card 1: Total Tracked Flow */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md shadow-xl flex flex-col justify-between border border-white/[0.06]">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-semibold">
              Total Tracked Flow
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
            </div>
          </div>
          <div className="my-space-sm flex flex-col">
            <div className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight font-mono">
              ₹14,85,000
            </div>
            <div className="flex items-center gap-space-xs pt-1">
              <span className="px-1.5 py-0.5 rounded-full bg-verified-emerald/20 text-verified-emerald font-label-sm text-label-sm font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                +₹5.00L last 24h
              </span>
              <span className="text-on-surface-variant font-body-sm text-body-sm">in 6 ledger bursts</span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-white/[0.04]">
            <span>Primary Inflow: Manoj Tiwari</span>
            <span className="text-primary font-mono font-bold">100% Sourced</span>
          </div>
        </div>

        {/* Card 2: Circular Loop Detected */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md shadow-xl flex flex-col justify-between border border-white/[0.06]">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-risk-amber/15 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-risk-amber tracking-wider font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-risk-amber animate-ping"></span>
              Circular Loop Detected
            </span>
            <div className="w-8 h-8 rounded-lg bg-risk-amber/20 flex items-center justify-center text-risk-amber">
              <span className="material-symbols-outlined text-[18px]">all_inclusive</span>
            </div>
          </div>
          <div className="my-space-sm flex flex-col">
            <div className="font-headline-md text-headline-md font-bold text-risk-amber tracking-tight font-mono">
              1 Loop (3 Hops)
            </div>
            <div className="flex items-center gap-space-xs pt-1 text-on-surface-variant font-body-sm text-body-sm">
              <span>Smurfing & Hawala Layering Scheme</span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-white/[0.04]">
            <span>Syndicate Leakage Cut</span>
            <span className="text-threat-crimson font-mono font-bold">₹10,000 (2.0%)</span>
          </div>
        </div>

        {/* Card 3: Loop Closure Window */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md shadow-xl flex flex-col justify-between border border-white/[0.06]">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-ai-purple/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-semibold">
              Loop Closure Window
            </span>
            <div className="w-8 h-8 rounded-lg bg-ai-purple/20 flex items-center justify-center text-ai-purple-light">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
          </div>
          <div className="my-space-sm flex flex-col">
            <div className="flex items-baseline gap-2">
              <div className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight font-mono">
                48.2 Hours
              </div>
              <span className="text-on-surface-variant font-label-sm text-label-sm">/ 72h max</span>
            </div>
            <div className="mt-2 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-gradient-to-r from-risk-amber to-threat-crimson h-full rounded-full w-[67%]"></div>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-white/[0.04]">
            <span>Velocity Index</span>
            <span className="text-verified-emerald font-mono font-bold">HIGH SPEED</span>
          </div>
        </div>

        {/* Card 4: High-Risk Cut-Outs */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-space-md shadow-xl flex flex-col justify-between border border-white/[0.06]">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-threat-crimson/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-threat-crimson tracking-wider font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">shield_alert</span>
              Flagged Mules
            </span>
            <div className="w-8 h-8 rounded-lg bg-threat-crimson/20 flex items-center justify-center text-threat-crimson">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </div>
          </div>
          <div className="my-space-sm flex flex-col">
            <div className="font-headline-md text-headline-md font-bold text-threat-crimson tracking-tight font-mono">
              3 Accounts
            </div>
            <div className="flex items-center gap-space-xs pt-1 text-on-surface-variant font-body-sm text-body-sm">
              <span>Kolkata Commercial Bank cluster</span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm border-t border-white/[0.04]">
            <span>Sec 107 Freeze</span>
            <span className="text-threat-crimson font-mono font-bold">{frozen ? 'ENFORCED' : 'PENDING'}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: 3-HOP VISUAL HAWALA TRAIL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
        {/* Hop 1 */}
        <div className="p-5 rounded-2xl bg-surface-container-low/90 backdrop-blur-xl border border-risk-amber/30 shadow-xl flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-risk-amber/20 text-risk-amber">
              HOP 1: ORIGINATION
            </span>
            <span className="text-[11px] text-outline font-mono">Mar 20, 09:00 IST</span>
          </div>
          <div>
            <span className="text-[11px] text-outline block">Sender (Shell Origin):</span>
            <h4 className="text-body-lg font-bold text-on-surface">Ashok Mehta (Mehta Global)</h4>
            <span className="text-[11px] font-mono text-primary">Acct: 30123456793</span>
          </div>
          <div className="py-2.5 px-3 bg-risk-amber/10 border border-risk-amber/20 rounded-xl text-center font-mono">
            <span className="text-headline-sm font-bold text-risk-amber">₹5,00,000</span>
            <span className="text-[10px] text-outline block">Initial Layering Outflow</span>
          </div>
          <div>
            <span className="text-[11px] text-outline block">Receiver:</span>
            <h4 className="text-body-md font-bold text-on-surface">Priya Banerjee (Accountant)</h4>
            <span className="text-[11px] font-mono text-outline">Acct: 30123456794</span>
          </div>
        </div>

        {/* Hop 2 */}
        <div className="p-5 rounded-2xl bg-surface-container-low/90 backdrop-blur-xl border border-risk-amber/30 shadow-xl flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-risk-amber/20 text-risk-amber">
              HOP 2: LAYERING
            </span>
            <span className="text-[11px] text-outline font-mono">Mar 20, 15:00 IST (+6h)</span>
          </div>
          <div>
            <span className="text-[11px] text-outline block">Sender:</span>
            <h4 className="text-body-lg font-bold text-on-surface">Priya Banerjee (Accountant)</h4>
            <span className="text-[11px] font-mono text-outline">Acct: 30123456794</span>
          </div>
          <div className="py-2.5 px-3 bg-risk-amber/10 border border-risk-amber/20 rounded-xl text-center font-mono">
            <span className="text-headline-sm font-bold text-risk-amber">₹4,95,000</span>
            <span className="text-[10px] text-outline block">Intermediary Split (Cut: ₹5,000)</span>
          </div>
          <div>
            <span className="text-[11px] text-outline block">Receiver:</span>
            <h4 className="text-body-md font-bold text-on-surface">Sunita Das (Mule Tier 2)</h4>
            <span className="text-[11px] font-mono text-outline">Acct: 30123456795</span>
          </div>
        </div>

        {/* Hop 3 */}
        <div className="p-5 rounded-2xl bg-surface-container-low/90 backdrop-blur-xl border border-verified-emerald/40 shadow-xl flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-verified-emerald/20 text-verified-emerald">
              HOP 3: CYCLE CLOSURE
            </span>
            <span className="text-[11px] text-outline font-mono">Mar 21, 11:15 IST (+20h)</span>
          </div>
          <div>
            <span className="text-[11px] text-outline block">Sender:</span>
            <h4 className="text-body-lg font-bold text-on-surface">Sunita Das (Mule Tier 2)</h4>
            <span className="text-[11px] font-mono text-outline">Acct: 30123456795</span>
          </div>
          <div className="py-2.5 px-3 bg-verified-emerald/10 border border-verified-emerald/20 rounded-xl text-center font-mono">
            <span className="text-headline-sm font-bold text-verified-emerald">₹4,90,000</span>
            <span className="text-[10px] text-outline block">Returned to Shubh Laxmi (Mehta Link)</span>
          </div>
          <div>
            <span className="text-[11px] text-outline block">Destination / Loop Closed:</span>
            <h4 className="text-body-md font-bold text-on-surface">Shubh Laxmi Finance (Apex Shell)</h4>
            <span className="text-[11px] font-mono text-verified-emerald font-bold">Acct: 30123456791 (Closed!)</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: TRANSACTION LEDGER TABLE */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-white/[0.08] flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.04] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Hawala & Mule Transaction Ledger
            </h3>
          </div>
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
            {['ALL', 'CIRCULAR', 'REGULAR'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filterType === filter 
                    ? 'bg-primary-container text-on-primary font-bold' 
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-label-sm text-label-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-outline text-[11px] uppercase">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Sender</th>
                <th className="py-2.5 px-3">Receiver</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Bank / Ref</th>
                <th className="py-2.5 px-3">Pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredTransfers.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-outline">{tx.date}</td>
                  <td className="py-2.5 px-3 text-on-surface font-semibold">{tx.from_name}</td>
                  <td className="py-2.5 px-3 text-on-surface font-semibold">{tx.to_name}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">₹{(tx.amount).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-outline truncate max-w-[160px]">{tx.bank}</td>
                  <td className="py-2.5 px-3">
                    {tx.is_circular ? (
                      <span className="px-2 py-0.5 rounded bg-risk-amber/20 text-risk-amber font-mono text-[10px] font-bold">
                        CIRCULAR LOOP
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-surface-container text-outline font-mono text-[10px]">
                        DIRECT TRANSFER
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
