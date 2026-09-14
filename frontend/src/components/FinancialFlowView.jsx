import React, { useState } from 'react';
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
    setFrozen(true);
    alert('Section 107 BNSS Emergency Freezing Orders issued to Kolkata Commercial Bank for 3 flagged mule accounts.');
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-transparent text-slate-900 p-4 lg:p-6 gap-5 no-scrollbar">
      {/* TACTICAL TOP BAR / SUB-HEADER TELEMETRY */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              PMLA SEC 3/4 FINANCIAL CRIME VECTOR
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              FIU-IND TACTICAL FEED ONLINE
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">
              Money Trail & Hawala Forensic Ledger
            </h1>
            <span className="text-xs font-mono font-bold text-amber-800 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
              ₹14,85,000 INR AGGREGATE
            </span>
          </div>
        </div>

        {/* Tactical Command Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRunSimulation}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-700 text-xs flex items-center gap-1.5 transition-colors border border-slate-200 shadow-xs font-semibold cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">
              {simulating ? 'autorenew' : 'play_circle'}
            </span>
            <span>{simulating ? 'Simulating Flow...' : 'Run Flow Simulation'}</span>
          </button>
          <button
            onClick={handleFreezeAccounts}
            className={`px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 ${
              frozen 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>{frozen ? 'Sec 107 Orders Active' : 'Sec 107 BNSS Freeze (3 Mules)'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TOP 4 METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tracked Flow */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">
              Total Tracked Flow
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700 border border-sky-200">
              <span className="material-symbols-outlined text-[17px]">currency_rupee</span>
            </div>
          </div>
          <div className="my-2 flex flex-col">
            <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">
              ₹14,85,000
            </div>
            <div className="flex items-center gap-1 pt-1">
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">trending_up</span>
                +₹5.00L last 24h
              </span>
              <span className="text-slate-500 text-xs font-medium">in 6 bursts</span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-slate-600 text-xs border-t border-slate-100">
            <span>Primary Inflow: Ashok Mehta</span>
            <span className="text-sky-700 font-mono font-bold">100% Sourced</span>
          </div>
        </div>

        {/* Card 2: Circular Loop Detected */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-800 tracking-wider font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Circular Loop Detected
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200">
              <span className="material-symbols-outlined text-[17px]">all_inclusive</span>
            </div>
          </div>
          <div className="my-2 flex flex-col">
            <div className="font-mono text-xl font-bold text-amber-800 tracking-tight">
              1 Loop (3 Hops)
            </div>
            <div className="flex items-center gap-1 pt-1 text-slate-500 text-xs">
              <span>Smurfing & Hawala Scheme</span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-slate-600 text-xs border-t border-slate-100">
            <span>Syndicate Leakage Cut</span>
            <span className="text-rose-600 font-mono font-bold">₹10,000 (2.0%)</span>
          </div>
        </div>

        {/* Card 3: Loop Closure Window */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-bold">
              Loop Closure Window
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 border border-purple-200">
              <span className="material-symbols-outlined text-[17px]">timer</span>
            </div>
          </div>
          <div className="my-2 flex flex-col">
            <div className="flex items-baseline gap-2">
              <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">
                48.2 Hours
              </div>
              <span className="text-slate-400 text-xs font-mono">/ 72h max</span>
            </div>
            <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full w-[67%]"></div>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-slate-600 text-xs border-t border-slate-100">
            <span>Velocity Index</span>
            <span className="text-emerald-700 font-mono font-bold">HIGH SPEED</span>
          </div>
        </div>

        {/* Card 4: High-Risk Cut-Outs */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-rose-600 tracking-wider font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">shield_alert</span>
              Flagged Mules
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200">
              <span className="material-symbols-outlined text-[17px]">account_balance</span>
            </div>
          </div>
          <div className="my-2 flex flex-col">
            <div className="font-mono text-xl font-bold text-rose-600 tracking-tight">
              3 Accounts
            </div>
            <div className="flex items-center gap-1 pt-1 text-slate-500 text-xs">
              <span>Kolkata Commercial Bank cluster</span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-slate-600 text-xs border-t border-slate-100">
            <span>Sec 107 Freeze</span>
            <span className="text-rose-600 font-mono font-bold">{frozen ? 'ENFORCED' : 'PENDING'}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: 3-HOP VISUAL HAWALA TRAIL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hop 1 */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col gap-3 relative overflow-hidden transition-all hover:border-amber-400">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">start</span>
              HOP 1: ORIGINATION
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Mar 20, 09:00 IST</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Sender (Shell Origin):</span>
            <h4 className="text-sm font-bold text-slate-900">Ashok Mehta (Mehta Global)</h4>
            <span className="text-[11px] font-mono text-sky-700 font-semibold">Acct: 30123456793</span>
          </div>
          <div className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono">
            <span className="text-lg font-bold text-amber-800">₹5,00,000</span>
            <span className="text-[10px] text-slate-500 block">Initial Layering Outflow</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Receiver:</span>
            <h4 className="text-sm font-bold text-slate-900">Priya Banerjee (Accountant)</h4>
            <span className="text-[11px] font-mono text-slate-500">Acct: 30123456794</span>
          </div>
        </div>

        {/* Hop 2 */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs flex flex-col gap-3 relative overflow-hidden transition-all hover:border-amber-400">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">sync_alt</span>
              HOP 2: LAYERING
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Mar 20, 15:00 IST (+6h)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Sender:</span>
            <h4 className="text-sm font-bold text-slate-900">Priya Banerjee (Accountant)</h4>
            <span className="text-[11px] font-mono text-slate-500">Acct: 30123456794</span>
          </div>
          <div className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono">
            <span className="text-lg font-bold text-amber-800">₹4,95,000</span>
            <span className="text-[10px] text-slate-500 block">Intermediary Split (Cut: ₹5,000)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Receiver:</span>
            <h4 className="text-sm font-bold text-slate-900">Sunita Das (Mule Tier 2)</h4>
            <span className="text-[11px] font-mono text-slate-500">Acct: 30123456795</span>
          </div>
        </div>

        {/* Hop 3 */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col gap-3 relative overflow-hidden transition-all hover:border-emerald-400">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">task_alt</span>
              HOP 3: CYCLE CLOSURE
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Mar 21, 11:15 IST (+20h)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Sender:</span>
            <h4 className="text-sm font-bold text-slate-900">Sunita Das (Mule Tier 2)</h4>
            <span className="text-[11px] font-mono text-slate-500">Acct: 30123456795</span>
          </div>
          <div className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono">
            <span className="text-lg font-bold text-emerald-700">₹4,90,000</span>
            <span className="text-[10px] text-slate-500 block">Returned to Shubh Laxmi (Mehta Link)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Destination / Loop Closed:</span>
            <h4 className="text-sm font-bold text-slate-900">Shubh Laxmi Finance (Apex Shell)</h4>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">Acct: 30123456791 (Closed!)</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: TRANSACTION LEDGER TABLE */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700 border border-sky-200">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Hawala & Mule Transaction Ledger
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {['ALL', 'CIRCULAR', 'REGULAR'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1.5 rounded-xl transition-colors font-semibold cursor-pointer ${
                  filterType === filter 
                    ? 'bg-sky-600 text-white font-bold shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[10px] font-mono uppercase tracking-wider bg-slate-50">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Sender</th>
                <th className="py-2.5 px-3">Receiver</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Bank / Ref</th>
                <th className="py-2.5 px-3">Pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransfers.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500">{tx.date}</td>
                  <td className="py-2.5 px-3 text-slate-900 font-semibold">{tx.from_name}</td>
                  <td className="py-2.5 px-3 text-slate-900 font-semibold">{tx.to_name}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sky-700">₹{(tx.amount).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[160px]">{tx.bank}</td>
                  <td className="py-2.5 px-3">
                    {tx.is_circular ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px] font-bold">
                        CIRCULAR LOOP
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200">
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
