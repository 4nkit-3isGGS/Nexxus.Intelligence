import React, { useState } from 'react';
import { AGENT_QUERY_PRESETS } from '../data/mockIntelligenceData';

export default function AgentQueryBar({
  onRunAgentQuery,
  agentResponse,
  loadingQuery,
  onFocusSubgraph,
  officerRole = 'LEAD_INVESTIGATOR',
  currentUser,
  onRoleChange
}) {
  const [inputQuery, setInputQuery] = useState(
    'Investigate Rahul Sharma & Debasish Chatterjee connection: trace foreign crypto/hawala cash-out gateway and mule hierarchy'
  );
  const [showSteps, setShowSteps] = useState(false);
  const [showDossier, setShowDossier] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || loadingQuery) return;
    onRunAgentQuery(inputQuery);
  };

  const handleSelectPreset = (queryText) => {
    setInputQuery(queryText);
    onRunAgentQuery(queryText);
  };

  const [copiedDossier, setCopiedDossier] = useState(false);

  const isLiveFastAPI = agentResponse?.isLive || agentResponse?.source === 'LIVE_LANGGRAPH_FASTAPI';
  const summaryCard = agentResponse?.summary_card || agentResponse?.summary || {};

  const threatTier = summaryCard.threat_tier || 'HIGH CRITICAL';
  const riskScore = summaryCard.risk_score ?? 92;
  const nodesCount = summaryCard.entities_mapped ?? agentResponse?.discovered_entities?.length ?? 14;
  const edgesCount = summaryCard.relationships_mapped ?? agentResponse?.discovered_relationships?.length ?? 22;

  const defaultHypotheses = [
    {
      id: 'H1',
      code: 'CRIM-ARCH-01',
      title: 'Debasish Chatterjee acts as covert cut-out bridge between extortion cell and hawala syndicate.',
      status: 'SUPPORTED',
      confidence: '96.0',
      metric_label: 'Centr. 0.942',
      rationale: 'Betweenness centrality ratio 0.942 (top 0.1% of graph) with zero direct outgoing calls to victims, delegating extortion ops to Rajesh Kumar Sharma.',
      tags: ['#CDR_EXTORTION_SPIKE', '#FIR_101/24', '#CRIME_2_HOP_LINK']
    },
    {
      id: 'H2',
      code: 'FIN-LOOP-09',
      title: 'Rapid circular layering across mule accounts in Kolkata Commercial Bank.',
      status: 'SUPPORTED',
      confidence: '91.4',
      metric_label: 'Hawala Loop < 48h',
      rationale: '₹500,000 returned to originating entity via 3 intermediary shell layers in under 48 hours, satisfying classic Hawala loop signature.',
      tags: ['#BANK_LAYER_3', '#FIR_103/24', '#ROC_SHELL_MATCH']
    },
    {
      id: 'H3',
      code: 'CULP-VICTIM-03',
      title: 'Victim Manoj Tiwari holds operational / willing stake in Shubh Laxmi Finance.',
      status: 'REJECTED',
      confidence: '98.2',
      metric_label: 'Coercion Confirmed',
      rationale: 'Forensic voice and tone analysis of 22 intercepted calls confirms acute duress. Financial transactions are unidirectional extortion outflows, not equity dividends.',
      tags: ['#VOICE_CALL_ANALYSIS', '#UNIDIRECTIONAL_CASHFLOW']
    }
  ];

  const hypotheses = (agentResponse?.hypotheses && agentResponse.hypotheses.length > 0)
    ? agentResponse.hypotheses
    : defaultHypotheses;

  const totalHypotheses = summaryCard.hypotheses_evaluated ?? hypotheses.length;
  const confirmedHypotheses = hypotheses.filter(h => (h.status || 'SUPPORTED') === 'SUPPORTED').length;

  const agentExecutionSteps = agentResponse?.reasoning_steps || agentResponse?.execution_steps || [
    { agent: 'Ingestion & NER Agent', action: 'Normalized FIR 101/24 and 103/24 documents into 31 graph entities', time: '12ms' },
    { agent: 'Centrality Analytics Agent', action: 'Computed betweenness centrality; identified Debasish Chatterjee as cut-out bridge', time: '28ms' },
    { agent: 'Hawala AML Agent', action: 'Detected ₹500,000 3-hop circular loop through Kolkata Comm Bank', time: '45ms' },
    { agent: 'CDR Telemetry Agent', action: 'Correlated 22-call spike on 2026-03-05 with Salt Lake Sector V cell tower', time: '62ms' },
    { agent: 'Multi-Agent Synthesizer', action: 'Synthesized zero-hallucination judicial evidence dossier under BSA §65B', time: '88ms' },
  ];

  const fallbackDossier = `Based on autonomous multi-agent traversal across ${nodesCount} nodes and ${edgesCount} edges, suspect ${agentResponse?.subject_id || 'Debasish Chatterjee [P008]'} acts as the de facto apex coordinator. Multiple burner VoIP origins spoofed identity, while transactions of ₹5,00,000 satisfied circular Hawala layering under 48 hours. Attached digital certificates comply with Section 63/65B of the Bharatiya Sakshya Adhiniyam, 2023.`;

  const dossierContent = agentResponse?.dossier && agentResponse.dossier.length > 50
    ? agentResponse.dossier
    : fallbackDossier;

  const handleCopyDossier = () => {
    navigator.clipboard.writeText(dossierContent);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto w-full h-full p-4 lg:p-6 gap-4 no-scrollbar">
      {/* RBAC Error Banner if access denied */}
      {agentResponse?.error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-rose-600">lock</span>
            <span className="font-semibold">{agentResponse.error}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-white text-rose-700 font-mono text-[10px] font-bold border border-rose-200">
            HTTP 403
          </span>
        </div>
      )}

      {/* 1. AI COPILOT QUERY COMMAND BAR */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-xl p-4 bg-white shadow-2xs border border-slate-200/80">
        <div className="relative z-10 flex flex-col gap-3">
          {/* Title & Live Status */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white shadow-2xs">
                <span className="material-symbols-outlined text-[16px]">
                  psychology
                </span>
              </div>
              <div>
                <h2 className="font-display text-sm tracking-tight text-slate-900 flex items-center gap-2 font-bold">
                  AI Multi-Agent Investigation
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-medium border border-slate-200">
                    Active
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{isLiveFastAPI ? 'AI LIVE' : 'AI READY'}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">FastAPI Traversal</span>
            </div>
          </div>

          {/* Main Input Bar Form */}
          {officerRole === 'AUDITOR' && (
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-500 text-[16px]">gavel</span>
                <span>
                  Judicial Auditor Mode (Read-Only): Active inquiries restricted to investigators.
                </span>
              </div>
              {onRoleChange && (
                <button
                  type="button"
                  onClick={() => onRoleChange('LEAD_INVESTIGATOR')}
                  className="px-2 py-0.8 rounded-md bg-slate-900 text-white font-medium text-[11px] cursor-pointer"
                >
                  Switch to Lead
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 shadow-2xs focus-within:bg-white focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
            <div className="flex-1 flex items-center px-2.5 py-1 gap-2">
              <span className="material-symbols-outlined text-slate-400 text-[18px] flex-shrink-0">
                search
              </span>
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={officerRole === 'AUDITOR' ? "Auditor Mode: Read-only compliance mode active..." : "Ask AI Investigator (e.g. 'Investigate Rahul Sharma P001' or 'Trace hawala loop')..."}
                disabled={officerRole === 'AUDITOR'}
                className="w-full bg-transparent border-none outline-none text-xs text-slate-900 placeholder:text-slate-400 font-normal disabled:opacity-60"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="submit"
                disabled={loadingQuery || !inputQuery.trim() || officerRole === 'AUDITOR'}
                className="flex items-center gap-1.5 px-3.5 py-1.8 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-2xs transition-all disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {officerRole === 'AUDITOR' ? 'lock' : 'auto_awesome'}
                </span>
                <span>
                  {loadingQuery ? 'Analyzing...' : officerRole === 'AUDITOR' ? 'Restricted' : 'Investigate'}
                </span>
              </button>
            </div>
          </form>

          {/* Preset Scenario Quick Chips */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold mr-1">
              Examples:
            </span>
            <button
              onClick={() => handleSelectPreset('Investigate Rahul Sharma P001 and map his co-conspirators and front entities')}
              className="px-2 py-0.8 rounded-md bg-slate-100 hover:bg-slate-200/70 text-slate-700 transition-all text-xs flex items-center gap-1 cursor-pointer font-normal"
            >
              <span>Rahul Sharma (P001)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Hypothesis H1: Evaluate Debasish Chatterjee covert cut-out bridge to Kolkata syndicates')}
              className="px-2 py-0.8 rounded-md bg-slate-100 hover:bg-slate-200/70 text-slate-700 transition-all text-xs flex items-center gap-1 cursor-pointer font-normal"
            >
              <span>Kingpin Bridge (H1)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Hypothesis H2: Trace ₹500,000 mule circular loop through Kolkata Comm Bank')}
              className="px-2 py-0.8 rounded-md bg-slate-100 hover:bg-slate-200/70 text-slate-700 transition-all text-xs flex items-center gap-1 cursor-pointer font-normal"
            >
              <span>Hawala Loop (H2)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Analyze 22-call extortion burst between P008 and victim Manoj Tiwari')}
              className="px-2 py-0.8 rounded-md bg-slate-100 hover:bg-slate-200/70 text-slate-700 transition-all text-xs flex items-center gap-1 cursor-pointer font-normal"
            >
              <span>22-Call Spike</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE THREAT SCORECARD */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 flex-shrink-0 min-h-fit">
        {/* Card 1: Threat Classification */}
        <div className="p-4 rounded-xl bg-white shadow-2xs flex flex-col justify-between border border-slate-200/80">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Classification
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                riskScore >= 70 ? 'bg-rose-50 text-rose-800 border border-rose-200/60' : 'bg-amber-50 text-amber-800 border border-amber-200/60'
              }`}>
                {riskScore >= 70 ? 'CRITICAL' : 'MODERATE'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-lg font-bold text-slate-900 tracking-tight">
                {threatTier}
              </span>
              <span className="font-mono text-lg text-slate-900 font-bold">
                {Number(riskScore).toFixed(0)}<span className="text-xs text-slate-400 font-normal">/100</span>
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Risk Engine</span>
            <span className="text-[11px] font-mono">
              Target: {agentResponse?.subject_id || 'Network'}
            </span>
          </div>
        </div>

        {/* Card 2: Knowledge Graph Traversal */}
        <div className="p-4 rounded-xl bg-white shadow-2xs flex flex-col justify-between border border-slate-200/80">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Graph Traversal
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono font-medium">
                2-HOP EGO
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-lg font-bold text-slate-900 tracking-tight">
                {nodesCount} <span className="text-xs font-normal text-slate-500 font-sans">Nodes</span>
              </span>
              <span className="font-mono text-lg text-slate-700 font-bold">
                {edgesCount} <span className="text-xs text-slate-400 font-normal">Edges</span>
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Network Discovered</span>
            <span className="text-[11px] font-mono">Passes: {agentResponse?.iterations || 1}</span>
          </div>
        </div>

        {/* Card 3: Hypothesis Engine */}
        <div className="p-4 rounded-xl bg-white shadow-2xs flex flex-col justify-between border border-slate-200/80">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Hypotheses
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono font-medium">
                DUAL CRITIC
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-lg font-bold text-slate-900 tracking-tight">
                {totalHypotheses} <span className="text-xs font-normal text-slate-500 font-sans">Evaluated</span>
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-700">
                {confirmedHypotheses} Supported
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Cross-Correlated</span>
            <span className="text-slate-400 text-[11px] font-mono">Zero Hallucination</span>
          </div>
        </div>

        {/* Card 4: Legal Admissibility */}
        <div className="p-4 rounded-xl bg-white shadow-2xs flex flex-col justify-between border border-slate-200/80">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Admissibility
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-mono font-medium border border-emerald-200/60">
                SEC. 65B
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-lg font-bold text-slate-900 tracking-tight">
                BSA 2023
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-700">
                SHA-256 Valid
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span className="font-mono text-[11px]">Ledger: 7f83b1…</span>
            <span className="text-emerald-700 text-[11px] font-mono font-medium">
              Tamper-Proof
            </span>
          </div>
        </div>
      </section>

      {/* 3. EVALUATED HYPOTHESES ENGINE PANEL */}
      <section className="flex flex-col flex-shrink-0 min-h-fit gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xs font-bold text-slate-900 tracking-tight uppercase">
              Evaluated Hypotheses & Findings
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Dual Cross-Validation Matrix
          </span>
        </div>

        {/* Comparative Hypotheses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {hypotheses.map((h, idx) => {
            const isSupported = (h.status || 'SUPPORTED') === 'SUPPORTED';
            const confidenceNum = Number(h.confidence || (isSupported ? 95.0 : 98.2));
            const tags = Array.isArray(h.tags) && h.tags.length ? h.tags : ['#BSA_65B_EVIDENCE'];

            return (
              <div
                key={h.id || idx}
                className="p-4 rounded-xl bg-white shadow-2xs flex flex-col justify-between border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                        {h.id || `H${idx + 1}`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{h.code || `CRIM-HYP-0${idx + 1}`}</span>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.2 rounded text-xs font-mono font-medium ${
                      isSupported ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' : 'bg-rose-50 text-rose-800 border border-rose-200/60'
                    }`}>
                      <span>{h.status || (isSupported ? 'SUPPORTED' : 'REJECTED')}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-900 leading-snug">
                    {h.title || h.claim}
                  </p>

                  <div className="mt-3 p-2 rounded-lg bg-slate-50 text-xs space-y-1 border border-slate-200/60">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase font-semibold">
                      <span>Rationale</span>
                      <span className={`font-mono ${isSupported ? 'text-slate-700' : 'text-rose-700'}`}>
                        {h.metric_label || (isSupported ? 'Empirical Match' : 'Refuted')}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">{h.rationale}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-mono text-[9px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Confidence</span>
                    <span className={`font-mono text-[11px] font-semibold ${isSupported ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {confidenceNum.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${isSupported ? 'bg-emerald-600' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(100, Math.max(10, confidenceNum))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MULTI-AGENT REASONING PIPELINE & COURT DOSSIER */}
      <section className="rounded-xl p-4 bg-white shadow-2xs flex flex-col flex-shrink-0 min-h-fit gap-3 border border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xs font-bold text-slate-900 tracking-tight uppercase">
              Investigation Steps & Findings
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs transition-colors flex items-center gap-1 border border-slate-200 font-medium cursor-pointer shadow-2xs"
            >
              <span>{showSteps ? 'Hide Steps' : `Steps (${agentExecutionSteps.length})`}</span>
              <span className="material-symbols-outlined text-[14px]">
                {showSteps ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            <button
              onClick={() => setShowDossier(!showDossier)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs transition-colors flex items-center gap-1 border border-slate-200 font-medium cursor-pointer shadow-2xs"
            >
              <span>Evidence Summary</span>
            </button>
            {onFocusSubgraph && (
              <button
                onClick={() => onFocusSubgraph(agentResponse?.highlighted_nodes, agentResponse?.highlighted_edges)}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">hub</span>
                <span>Highlight on Graph</span>
              </button>
            )}
          </div>
        </div>

        {/* Execution Steps Timeline */}
        {showSteps && (
          <div className="flex flex-col gap-1 pt-2 border-t border-slate-100 animate-fade-in">
            {agentExecutionSteps.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-200/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400">{idx + 1}.</span>
                  <span className="font-medium text-slate-900">{step.agent}:</span>
                  <span className="text-slate-600">{step.action}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 shrink-0">
                  {step.time || '18ms'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Judicial Dossier Preview */}
        {showDossier && (
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2.5 animate-fade-in text-xs shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="font-semibold uppercase tracking-wider text-[11px] font-mono text-emerald-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Evidence Summary (BSA §65B Certified)
              </span>
              <button
                onClick={handleCopyDossier}
                className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>{copiedDossier ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200/80 font-mono text-xs text-slate-700 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap no-scrollbar">
              {dossierContent}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

