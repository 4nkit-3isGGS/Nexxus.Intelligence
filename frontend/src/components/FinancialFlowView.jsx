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
          </div>
          <div className="flex items-baseline gap-3 mt-0.5 flex-wrap">
            <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">
              Money Trail & Suspicious Bank Transfers
            </h1>
            <span className="text-xs font-mono font-semibold text-slate-700 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/80">
              TOTAL TRACKED: ₹14,85,000
            </span>
          </div>
        </div>

        {/* Command Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs flex items-center gap-1.5 transition-all border border-slate-200/80 shadow-xs font-medium cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">
              {simulating ? 'autorenew' : 'play_circle'}
            </span>
            <span>{simulating ? 'Simulating Movement...' : 'Simulate Money Flow'}</span>
          </button>
          <button
            onClick={handleFreezeAccounts}
            className={`px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 ${
              frozen 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {frozen ? 'task_alt' : 'gavel'}
            </span>
            <span>{frozen ? 'Freeze Orders Active' : 'Freeze Mule Accounts (Sec 107 BNSS)'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TOP 4 METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tracked Flow */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">
              Total Tracked Flow
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/70">
              <span className="material-symbols-outlined text-[17px]">currency_rupee</span>
            </div>
          </div>
          <div className="my-2 flex flex-col">
            <div className="font-mono text-xl font-bold text-slate-900 tracking-tight">
              ₹14,85,000
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-mono font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">trending_up</span>
                +₹5.00L last 24h
              </span>
              <span className="text-slate-500 text-xs">in 6 bursts</span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
            <span>Primary Inflow: Ashok Mehta</span>
            <span className="text-slate-800 font-mono font-semibold">100% Sourced</span>
          </div>
        </div>

        {/* Card 2: Circular Loop Detected */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-800 tracking-wider font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Circular Loop Detected
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200/70">
              <span className="material-symbols-outlined text-[17px]">all_inclusive</span>
            </div>
          </div>
          <div className="my-2 flex flex-col">
            <div className="font-mono text-xl font-bold text-amber-900 tracking-tight">
              1 Loop (3 Hops)
            </div>
            <div className="flex items-center gap-1 pt-1 text-slate-500 text-xs">
              <span>Smurfing & Hawala Scheme</span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
            <span>Syndicate Leakage Cut</span>
            <span className="text-rose-600 font-mono font-semibold">₹10,000 (2.0%)</span>
          </div>
        </div>

        {/* Card 3: Loop Closure Window */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">
              Loop Closure Window
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/70">
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
              <div className="bg-slate-700 h-full rounded-full w-[67%]"></div>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
            <span>Velocity Index</span>
            <span className="text-emerald-700 font-mono font-semibold">HIGH SPEED</span>
          </div>
        </div>

        {/* Card 4: High-Risk Cut-Outs */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-xs flex flex-col justify-between border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-rose-700 tracking-wider font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">shield_alert</span>
              Flagged Mules
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-200/70">
              <span className="material-symbols-outlined text-[17px]">account_balance</span>
            </div>
          </div>
          <div className="my-2 flex flex-col">
            <div className="font-mono text-xl font-bold text-rose-700 tracking-tight">
              3 Accounts
            </div>
            <div className="flex items-center gap-1 pt-1 text-slate-500 text-xs">
              <span>Kolkata Commercial Bank cluster</span>
            </div>
          </div>
          <div className="pt-2 flex items-center justify-between text-slate-500 text-xs border-t border-slate-100">
            <span>Sec 107 Freeze</span>
            <span className={`font-mono font-semibold ${frozen ? 'text-emerald-700' : 'text-amber-700'}`}>
              {frozen ? 'ENFORCED' : 'PENDING'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: 3-HOP VISUAL HAWALA TRAIL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hop 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-3.5 relative overflow-hidden transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">start</span>
              HOP 01 // ORIGINATION
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Mar 20, 09:00 IST</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Sender (Shell Origin):</span>
            <h4 className="text-sm font-semibold text-slate-900">Ashok Mehta (Mehta Global)</h4>
            <span className="text-[11px] font-mono text-slate-500">Acct: 30123456793</span>
          </div>
          <div className="py-2.5 px-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center font-mono">
            <span className="text-lg font-bold text-slate-900">₹5,00,000</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Initial Layering Outflow</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Receiver:</span>
            <h4 className="text-sm font-semibold text-slate-900">Priya Banerjee (Accountant)</h4>
            <span className="text-[11px] font-mono text-slate-500">Acct: 30123456794</span>
          </div>
        </div>

        {/* Hop 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-3.5 relative overflow-hidden transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">sync_alt</span>
              HOP 02 // LAYERING
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Mar 20, 15:00 IST (+6h)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Sender:</span>
            <h4 className="text-sm font-semibold text-slate-900">Priya Banerjee (Accountant)</h4>
            <span className="text-[11px] font-mono text-slate-500">Acct: 30123456794</span>
          </div>
          <div className="py-2.5 px-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center font-mono">
            <span className="text-lg font-bold text-slate-900">₹4,95,000</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Intermediary Split (Cut: ₹5,000)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Receiver:</span>
            <h4 className="text-sm font-semibold text-slate-900">Sunita Das (Mule Tier 2)</h4>
            <span className="text-[11px] font-mono text-slate-500">Acct: 30123456795</span>
          </div>
        </div>

        {/* Hop 3 */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs flex flex-col gap-3.5 relative overflow-hidden transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/70 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">task_alt</span>
              HOP 03 // CYCLE CLOSURE
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Mar 21, 11:15 IST (+20h)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Sender:</span>
            <h4 className="text-sm font-semibold text-slate-900">Sunita Das (Mule Tier 2)</h4>
            <span className="text-[11px] font-mono text-slate-500">Acct: 30123456795</span>
          </div>
          <div className="py-2.5 px-3 bg-emerald-50/50 border border-emerald-200/60 rounded-xl text-center font-mono">
            <span className="text-lg font-bold text-emerald-800">₹4,90,000</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Returned to Shubh Laxmi (Mehta Link)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Destination / Loop Closed:</span>
            <h4 className="text-sm font-semibold text-slate-900">Shubh Laxmi Finance (Apex Shell)</h4>
            <span className="text-[11px] font-mono text-emerald-700 font-semibold">Acct: 30123456791 (Closed!)</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: TRANSACTION LEDGER TABLE */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200/80">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">
                Hawala & Mule Transaction Ledger
              </h3>
              <p className="text-[11px] text-slate-500">Chronological transaction journal across all flagged accounts</p>
            </div>
          </div>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
            {['ALL', 'CIRCULAR', 'REGULAR'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
                  filterType === filter 
                    ? 'bg-white text-slate-900 font-semibold shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter === 'ALL' ? 'All Transactions' : filter === 'CIRCULAR' ? 'Circular Only' : 'Direct Only'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 text-[10px] font-mono uppercase tracking-wider bg-slate-50/70">
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
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500">{tx.date}</td>
                  <td className="py-2.5 px-3 text-slate-900 font-medium">{tx.from_name}</td>
                  <td className="py-2.5 px-3 text-slate-900 font-medium">{tx.to_name}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">₹{(tx.amount).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-[160px]">{tx.bank}</td>
                  <td className="py-2.5 px-3">
                    {tx.is_circular ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 font-mono text-[10px] font-semibold">
                        CIRCULAR LOOP
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200/70">
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
