import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function InvestigationPlaybook({
  onSelectNodeById,
  onHighlightSubgraph,
  onSetTimelineDate,
  nodes = []
}) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTraceApexLeader = () => {
    // P008 is Debasish Chatterjee
    onSelectNodeById?.('P008');
    onHighlightSubgraph?.(['P008', 'P003', 'P002', 'O001'], ['E008', 'E012', 'E001', 'E002']);
    toast.success('Apex Leader Traced', 'Debasish Chatterjee (P008) highlighted with 3-hop operational bridge.');
  };

  const handleExposeHawalaLoop = () => {
    // A001, A002, O001, P002
    onHighlightSubgraph?.(['A001', 'A002', 'O001', 'P002'], ['E003', 'E004', 'E005']);
    onSelectNodeById?.('A001');
    toast.warning('Circular Hawala Loop Isolated', '₹500,000 mule layering loop detected between A001, A002 & Shubh Laxmi Finance.');
  };

  const handleExtortionCallSpike = () => {
    onSetTimelineDate?.('2026-03-05');
    onHighlightSubgraph?.(['P003', 'P001', 'T001', 'T002'], ['E001', 'E007']);
    onSelectNodeById?.('P003');
    toast.error('22-Call Extortion Spike', 'Timeline jumped to March 5, 2026 (22 calls in 3h from Rajesh to Manoj).');
  };

  const handleOpenDuplicateQueue = () => {
    navigate('/workspace/resolution');
    toast.info('Suspect Disambiguation', '3 duplicate identity clusters queued for manual biometric review.');
  };

  const handleOpenAuditVault = () => {
    navigate('/workspace/audit');
    toast.info('Digital Evidence Vault', 'BSA Section 65B tamper-proof cryptographic ledger opened.');
  };

  return (
    <div className="w-full px-4 py-1.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar z-20 flex-shrink-0">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="material-symbols-outlined text-[15px] text-slate-400">bolt</span>
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500">
          Forensic Leads:
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-nowrap flex-shrink-0 text-xs">
        {/* Playbook 1: Trace Apex Syndicate Leader */}
        <button
          onClick={handleTraceApexLeader}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs font-medium transition-all cursor-pointer"
          title="Highlight Debasish Chatterjee & Mastermind Subgraph"
        >
          <span className="material-symbols-outlined text-[15px] text-purple-600">crown</span>
          <span>Trace Apex Leader</span>
        </button>

        {/* Playbook 2: Expose ₹500k Hawala Loop */}
        <button
          onClick={handleExposeHawalaLoop}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs font-medium transition-all cursor-pointer"
          title="Isolate ₹500,000 Circular Hawala Transfer Loop"
        >
          <span className="material-symbols-outlined text-[15px] text-amber-600">cached</span>
          <span>₹500k Hawala Loop</span>
        </button>

        {/* Playbook 3: 22-Call Extortion Burst */}
        <button
          onClick={handleExtortionCallSpike}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs font-medium transition-all cursor-pointer"
          title="Jump to 22-Call Extortion Burst on March 5"
        >
          <span className="material-symbols-outlined text-[15px] text-rose-600">crisis_alert</span>
          <span>Call Spike (Mar 5)</span>
        </button>

        {/* Playbook 4: Suspect Disambiguation */}
        <button
          onClick={handleOpenDuplicateQueue}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs font-medium transition-all cursor-pointer"
          title="Review 3 Duplicate Suspect & Mule Disambiguation Records"
        >
          <span className="material-symbols-outlined text-[15px] text-sky-600">fingerprint</span>
          <span>Duplicates (3)</span>
        </button>

        {/* Playbook 5: Audit Digital Custody */}
        <button
          onClick={handleOpenAuditVault}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs font-medium transition-all cursor-pointer"
          title="Verify BSA Section 65B Digital Evidence Ledger"
        >
          <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
          <span>BSA §65B Audit</span>
        </button>
      </div>
    </div>
  );
}
