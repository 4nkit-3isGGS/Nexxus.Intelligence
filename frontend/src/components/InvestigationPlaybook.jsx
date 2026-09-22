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
    if (!Array.isArray(nodes) || nodes.length === 0) {
      toast.info('Knowledge Graph Empty', 'Ingest case data or run query to identify apex entities.');
      return;
    }
    const apexNode = [...nodes].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0))[0];
    if (apexNode) {
      onSelectNodeById?.(apexNode.id);
      onHighlightSubgraph?.([apexNode.id]);
      toast.success('Apex Target Focused', `High-risk entity ${apexNode.name || apexNode.id} (Risk: ${apexNode.risk_score || 0}) centered on graph.`);
    }
  };

  const handleExposeHawalaLoop = () => {
    navigate('/workspace/financial');
    toast.info('Financial Investigation', 'Navigating to live Money Trail & Hawala transactions view.');
  };

  const handleExtortionCallSpike = () => {
    navigate('/workspace/cdr');
    toast.info('Telecommunications Telemetry', 'Navigating to live CDR Call Records & Tower anchors view.');
  };

  const handleOpenDuplicateQueue = () => {
    navigate('/workspace/resolution');
    toast.info('Suspect Disambiguation', 'Opening Entity Resolution review queue.');
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
          Investigation Playbooks:
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-nowrap flex-shrink-0 text-xs">
        {/* Playbook 1: Trace Apex Target */}
        <button
          onClick={handleTraceApexLeader}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs font-medium transition-all cursor-pointer"
          title="Highlight Highest-Risk Entity on Canvas"
        >
          <span className="material-symbols-outlined text-[15px] text-purple-600">crown</span>
          <span>Trace High-Risk Target</span>
        </button>

        {/* Playbook 2: Expose Hawala Money Trail */}
        <button
          onClick={handleExposeHawalaLoop}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs font-medium transition-all cursor-pointer"
          title="Analyze Money Trail & Suspicious Bank Transfers"
        >
          <span className="material-symbols-outlined text-[15px] text-amber-600">cached</span>
          <span>Money Trail & Hawala</span>
        </button>

        {/* Playbook 3: Call Spikes & Towers */}
        <button
          onClick={handleExtortionCallSpike}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs font-medium transition-all cursor-pointer"
          title="Inspect Call Telemetry & Cell Towers"
        >
          <span className="material-symbols-outlined text-[15px] text-rose-600">crisis_alert</span>
          <span>Call Spikes & Towers</span>
        </button>

        {/* Playbook 4: Suspect Disambiguation */}
        <button
          onClick={handleOpenDuplicateQueue}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs font-medium transition-all cursor-pointer"
          title="Review Duplicate Suspect & Mule Disambiguation Records"
        >
          <span className="material-symbols-outlined text-[15px] text-sky-600">fingerprint</span>
          <span>Entity Resolution</span>
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
