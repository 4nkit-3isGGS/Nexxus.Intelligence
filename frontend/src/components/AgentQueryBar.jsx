import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  Crosshair, 
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  XCircle,
  Scale
} from 'lucide-react';
import { AGENT_QUERY_PRESETS } from '../data/mockIntelligenceData';

export default function AgentQueryBar({
  onRunAgentQuery,
  agentResponse,
  loadingQuery,
  onFocusSubgraph
}) {
  const [inputQuery, setInputQuery] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [showHypotheses, setShowHypotheses] = useState(true);
  const [showDossier, setShowDossier] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || loadingQuery) return;
    onRunAgentQuery(inputQuery);
  };

  const handleSelectPreset = (preset) => {
    setInputQuery(preset.query);
    onRunAgentQuery(preset.query);
  };

  return (
    <div className="bg-[#090d16]/80 border-b border-white/[0.06] p-4 space-y-3">
      <div className="max-w-[1720px] mx-auto space-y-3">
        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI Investigator (e.g. 'Who is the hidden mastermind bridging Cluster A and B?', 'Investigate Rahul Sharma')..."
            className="w-full pl-10 pr-28 py-2.5 bg-black/40 border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={loadingQuery || !inputQuery.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 btn-glow-cyan font-semibold rounded-lg text-xs flex items-center space-x-1.5 disabled:opacity-50 transition-all shadow-md"
          >
            {loadingQuery ? (
              <>
                <Cpu className="w-3.5 h-3.5 animate-spin" />
                <span>Investigating...</span>
              </>
            ) : (
              <>
                <span>Investigate</span>
                <Send className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-medium flex items-center space-x-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Preset Scenarios:</span>
          </span>
          {AGENT_QUERY_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 hover:text-white transition-all font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Agent Response Card */}
        {agentResponse && (
          <div className="bg-white/[0.02] border border-cyan-500/30 rounded-xl p-4 space-y-3 shadow-xl">
            {/* Top Status & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-cyan-300">
                  Autonomous Multi-Agent Investigation Synthesis (POST /api/investigate)
                </span>
                {agentResponse.summary_card?.threat_tier && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    agentResponse.summary_card.threat_tier.includes('HIGH') || agentResponse.summary_card.threat_tier.includes('CRITICAL')
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {agentResponse.summary_card.threat_tier} • RISK: {agentResponse.summary_card.risk_score || 0}/100
                  </span>
                )}
                {agentResponse.summary_card?.bsa_65b_certified && (
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    BSA §65B CERTIFIED
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onFocusSubgraph?.(agentResponse.highlighted_nodes, agentResponse.highlighted_edges, agentResponse.graph_data)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium flex items-center space-x-1.5 transition-all"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Highlight Path in Graph</span>
                </button>

                {agentResponse.dossier && (
                  <button
                    onClick={() => setShowDossier(!showDossier)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] flex items-center space-x-1.5 transition-all"
                  >
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>{showDossier ? 'Hide Dossier' : 'View Court Dossier'}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className="px-2.5 py-1 text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs flex items-center space-x-1 transition-all"
                >
                  <span>{showSteps ? 'Hide Reasoning' : 'View Reasoning'}</span>
                  {showSteps ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Summary Text */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {agentResponse.summary}
            </p>

            {/* Evaluated Hypotheses Strip */}
            {agentResponse.hypotheses && agentResponse.hypotheses.length > 0 && (
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3 h-3 text-cyan-400" />
                    <span>Evaluated Investigative Theories ({agentResponse.hypotheses.length})</span>
                  </span>
                  <button
                    onClick={() => setShowHypotheses(!showHypotheses)}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    {showHypotheses ? 'Collapse' : 'Expand'}
                  </button>
                </div>

                {showHypotheses && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {agentResponse.hypotheses.map((h, i) => {
                      const isSupported = h.status === 'SUPPORTED';
                      const isWeak = h.status === 'WEAK';
                      return (
                        <div
                          key={h.id || i}
                          className="bg-black/30 border border-white/[0.06] p-2.5 rounded-xl space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">{h.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                              isSupported
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : isWeak
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {h.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium leading-snug">{h.claim}</p>
                          {h.rationale && (
                            <p className="text-[10px] text-slate-400">{h.rationale}</p>
                          )}
                          {h.supported_evidence_id && h.supported_evidence_id.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {h.supported_evidence_id.map((eid) => (
                                <span key={eid} className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/[0.04] text-cyan-300 border border-white/[0.06]">
                                  {eid}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Expandable Intelligence Dossier */}
            {showDossier && agentResponse.dossier && (
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>Report Agent Dossier (BSA §65B Admissible Output)</span>
                  </span>
                </div>
                <div className="bg-black/50 border border-amber-500/20 rounded-xl p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {agentResponse.dossier}
                </div>
              </div>
            )}

            {/* Multi-Agent Reasoning Pipeline Steps */}
            {showSteps && agentResponse.reasoning_steps && (
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Multi-Agent Execution Pipeline ({agentResponse.reasoning_steps.length} Steps)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {agentResponse.reasoning_steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-black/30 border border-white/[0.06] p-2.5 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-cyan-300 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{step.agent}</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{step.action}</p>
                      <p className="text-[10px] font-mono text-slate-400 bg-white/[0.02] p-1.5 rounded border border-white/[0.04] break-words">
                        {step.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
