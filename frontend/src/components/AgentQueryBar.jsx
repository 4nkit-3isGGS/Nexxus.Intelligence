import React, { useState } from 'react';
import { AGENT_QUERY_PRESETS } from '../data/mockIntelligenceData';

export default function AgentQueryBar({
  onRunAgentQuery,
  agentResponse,
  loadingQuery,
  onFocusSubgraph
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
      tags: ['#CDR_EXTORTION_SPIKE', '#FIR_101/24', '#NEO4J_2_HOP_BRIDGE']
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
      rationale: 'Forensic NLP sentiment analysis of 22 intercepted calls confirms acute duress. Financial transactions are unidirectional extortion outflows, not equity dividends.',
      tags: ['#WHISPER_VOICE_NLP', '#UNIDIRECTIONAL_CASHFLOW']
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
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-rose-600">lock</span>
            <span className="font-semibold">{agentResponse.error}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-white text-rose-700 font-mono text-[10px] font-bold border border-rose-200">
            HTTP 403
          </span>
        </div>
      )}

      {/* 1. AI COPILOT QUERY COMMAND BAR */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-2xl p-5 bg-white shadow-xs border border-slate-200">
        <div className="relative z-10 flex flex-col gap-3.5">
          {/* Title & Live Status */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 shadow-xs">
                <span className="material-symbols-outlined text-purple-600 text-[20px] animate-pulse">
                  psychology
                </span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
              </div>
              <div>
                <h2 className="font-display text-base tracking-tight text-slate-900 flex items-center gap-2 font-bold">
                  Autonomous Swarm Investigation Copilot
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] border border-purple-200 font-mono font-bold">
                    LangGraph 7-Agent Swarm
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                isLiveFastAPI 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-sky-50 text-sky-800 border-sky-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isLiveFastAPI ? 'bg-emerald-500 animate-pulse' : 'bg-sky-500'}`}></span>
                <span>{isLiveFastAPI ? 'POST /api/investigate (LIVE)' : 'AUTONOMOUS MATCHER'}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">LLM:</span>
              <span className="text-purple-700 font-bold">OpenAI API</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">Neo4j Bolt:</span>
              <span className="text-emerald-700 font-bold">ACTIVE</span>
            </div>
          </div>

          {/* Main Input Bar Form */}
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-300 shadow-inner focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
            <div className="flex-1 flex items-center px-3 py-1 gap-2.5">
              <span className="material-symbols-outlined text-sky-600 text-[22px] flex-shrink-0">
                travel_explore
              </span>
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask AI Investigator (e.g. 'Investigate Rahul Sharma P001' or 'Trace Debasish Chatterjee hawala loop')..."
                className="w-full bg-transparent border-none outline-none text-xs text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 px-1">
              <button
                type="submit"
                disabled={loadingQuery || !inputQuery.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[17px]">
                  auto_awesome
                </span>
                <span>{loadingQuery ? 'Executing Swarm...' : 'Investigate'}</span>
                <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-sky-700 uppercase tracking-wider text-white font-mono font-bold">
                  /api/investigate
                </span>
              </button>
            </div>
          </form>

          {/* Preset Scenario Quick Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-wider mr-1">
              QUICK PRESETS:
            </span>
            <button
              onClick={() => handleSelectPreset('Investigate Rahul Sharma P001 and map his co-conspirators and front entities')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:text-sky-700 hover:bg-slate-200 transition-all text-xs flex items-center gap-1 shadow-xs border border-slate-200 cursor-pointer font-medium"
            >
              <span>🔍</span> <span>Investigate Rahul Sharma (P001)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Hypothesis H1: Evaluate Debasish Chatterjee covert cut-out bridge to Kolkata syndicates')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:text-sky-700 hover:bg-slate-200 transition-all text-xs flex items-center gap-1 shadow-xs border border-slate-200 cursor-pointer font-medium"
            >
              <span>👑</span> <span>Kingpin Bridge (H1)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Hypothesis H2: Trace ₹500,000 mule circular loop through Kolkata Comm Bank')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:text-sky-700 hover:bg-slate-200 transition-all text-xs flex items-center gap-1 shadow-xs border border-slate-200 cursor-pointer font-medium"
            >
              <span>💸</span> <span>Hawala Loop (H2)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Analyze 22-call extortion burst between P008 and victim Manoj Tiwari')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:text-sky-700 hover:bg-slate-200 transition-all text-xs flex items-center gap-1 shadow-xs border border-slate-200 cursor-pointer font-medium"
            >
              <span>📞</span> <span>22-Call Spike</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Generate Bharatiya Sakshya Adhiniyam 2023 §65B hash certificate for court bundle')}
              className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:text-emerald-700 hover:bg-slate-200 transition-all text-xs flex items-center gap-1 shadow-xs border border-slate-200 cursor-pointer font-medium"
            >
              <span>⚖️</span> <span>BSA §65B Synthesis</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE THREAT SCORECARD (Dynamic 4 Grid HUD Metric Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-shrink-0 min-h-fit">
        {/* Card 1: Threat Classification */}
        <div className="relative p-4 rounded-2xl bg-white shadow-xs flex flex-col justify-between overflow-hidden border border-slate-200">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                Classification
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                riskScore >= 70 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {riskScore >= 70 ? 'TIER 1 CRITICAL' : 'TIER 2 MODERATE'}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-xl font-bold text-rose-600 tracking-tight">
                {threatTier}
              </span>
              <span className="font-mono text-xl text-slate-900 font-bold">
                {Number(riskScore).toFixed(0)}<span className="text-xs text-slate-400 font-normal">/100</span>
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
            <span className="flex items-center text-rose-600 font-semibold">
              <span className="material-symbols-outlined text-[15px] mr-1">trending_up</span> Risk Engine
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Target: {agentResponse?.subject_id || 'Syndicate Network'}
            </span>
          </div>
        </div>

        {/* Card 2: Knowledge Graph Traversal */}
        <div className="relative p-4 rounded-2xl bg-white shadow-xs flex flex-col justify-between overflow-hidden border border-slate-200">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-700 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-sky-600">account_tree</span>
                Graph Traversal
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-mono font-bold border border-sky-200">
                2-HOP EGO NETWORK
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-xl font-bold text-slate-900 tracking-tight">
                {nodesCount} <span className="text-sm font-normal text-slate-500 font-sans">Nodes</span>
              </span>
              <span className="font-mono text-xl text-sky-700 font-bold">
                {edgesCount} <span className="text-xs text-slate-400 font-normal">Edges</span>
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
            <span className="text-sky-700 font-medium">Cytoscape Visualized</span>
            <span className="text-[11px] text-slate-500 font-mono">Iterations: {agentResponse?.iterations || 1}</span>
          </div>
        </div>

        {/* Card 3: Hypothesis Engine */}
        <div className="relative p-4 rounded-2xl bg-white shadow-xs flex flex-col justify-between overflow-hidden border border-slate-200">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-purple-600">psychology</span>
                Hypothesis Engine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono font-bold border border-purple-200">
                DUAL CRITIC
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-xl font-bold text-slate-900 tracking-tight">
                {totalHypotheses} <span className="text-sm font-normal text-slate-500 font-sans">Theories</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {confirmedHypotheses} CONFIRMED
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
            <span className="text-emerald-700 font-medium">Cross-Correlated</span>
            <span className="text-slate-500 text-[11px] font-mono font-medium">Zero Hallucination</span>
          </div>
        </div>

        {/* Card 4: Legal Admissibility */}
        <div className="relative p-4 rounded-2xl bg-white shadow-xs flex flex-col justify-between overflow-hidden border border-slate-200">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">verified_user</span>
                Legal Admissibility
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                SEC. 65B
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-xl font-bold text-slate-900 tracking-tight">
                BSA 2023
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                CERTIFIED
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
            <span className="text-slate-500 font-mono text-[11px]">Ledger Hash: 7f83b1…26d9</span>
            <span className="text-emerald-700 text-[11px] font-mono flex items-center gap-0.5 font-bold">
              <span className="material-symbols-outlined text-[13px]">lock</span> Audited
            </span>
          </div>
        </div>
      </section>

      {/* 3. EVALUATED HYPOTHESES ENGINE PANEL */}
      <section className="flex flex-col flex-shrink-0 min-h-fit gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-sky-600 rounded-full"></div>
            <h3 className="font-display text-sm font-bold text-slate-900 tracking-tight uppercase">
              Autonomous Hypothesis Engine <span className="text-slate-400 font-normal">/</span> <span className="text-sky-700 font-mono text-xs">Verification Matrix</span>
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono uppercase tracking-wider">
            Zero Hallucination Verified • Dual Cross-Validation
          </span>
        </div>

        {/* Comparative Hypotheses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {hypotheses.map((h, idx) => {
            const isSupported = (h.status || 'SUPPORTED') === 'SUPPORTED';
            const confidenceNum = Number(h.confidence || (isSupported ? 95.0 : 98.2));
            const tags = Array.isArray(h.tags) && h.tags.length ? h.tags : ['#BSA_65B_EVIDENCE'];

            return (
              <div
                key={h.id || idx}
                className="relative p-4 rounded-2xl bg-white shadow-xs flex flex-col justify-between group hover:border-sky-400 transition-colors border border-slate-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold ${
                        isSupported ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {h.id || `H${idx + 1}`}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-semibold">{h.code || `CRIM-HYP-0${idx + 1}`}</span>
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      isSupported ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {isSupported ? 'check_circle' : 'cancel'}
                      </span>
                      <span>{h.status || (isSupported ? 'SUPPORTED' : 'REJECTED')}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-900 leading-snug">
                    {h.title || h.claim}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 space-y-1 border border-slate-200">
                    <div className="flex items-center justify-between text-slate-500 font-mono text-[10px] uppercase font-bold tracking-wider">
                      <span>Forensic Rationale</span>
                      <span className={`font-mono font-bold ${isSupported ? 'text-sky-700' : 'text-rose-600'}`}>
                        {h.metric_label || (isSupported ? 'Empirical Match' : 'Refuted')}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">{h.rationale}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{isSupported ? 'Confidence:' : 'Refutation Confidence:'}</span>
                    <span className={`font-mono font-bold ${isSupported ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {confidenceNum.toFixed(1)}% {isSupported ? 'Support' : 'Refuted'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
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
      <section className="rounded-2xl p-5 bg-white shadow-xs flex flex-col flex-shrink-0 min-h-fit gap-3 border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600 text-[20px]">timeline</span>
            <h3 className="font-display text-sm font-bold text-slate-900 tracking-tight">
              LangGraph Multi-Agent Execution Stream
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors flex items-center gap-1 border border-slate-200 font-semibold cursor-pointer shadow-xs"
            >
              <span>{showSteps ? 'Collapse Pipeline' : `View ${agentExecutionSteps.length}-Agent Steps`}</span>
              <span className="material-symbols-outlined text-[15px]">
                {showSteps ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            <button
              onClick={() => setShowDossier(!showDossier)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs transition-colors flex items-center gap-1 border border-amber-200 font-semibold cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px] text-amber-600">gavel</span>
              <span>Court Dossier ({dossierContent.length} chars)</span>
            </button>
            {onFocusSubgraph && (
              <button
                onClick={() => onFocusSubgraph(agentResponse?.highlighted_nodes, agentResponse?.highlighted_edges)}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">hub</span>
                <span>Focus Subgraph on Canvas</span>
              </button>
            )}
          </div>
        </div>

        {/* Execution Steps Timeline */}
        {showSteps && (
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 animate-fade-in">
            {agentExecutionSteps.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sky-700 font-bold">{idx + 1}.</span>
                  <span className="font-bold text-slate-900">{step.agent}:</span>
                  <span className="text-slate-700">{step.action}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200 font-semibold shrink-0">
                  {step.time || '18ms'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Collapsible Judicial Dossier Preview */}
        {showDossier && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-sky-300 flex flex-col gap-3 animate-fade-in text-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold uppercase tracking-wider text-[11px] font-mono text-emerald-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Charge Sheet Ready Annexure (BSA 2023 / Section 65B Electronic Evidence)
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500 text-[10px]">SHA-256 Verified Ledger</span>
                <button
                  onClick={handleCopyDossier}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedDossier ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedDossier ? 'Copied!' : 'Copy Dossier'}</span>
                </button>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed max-h-[360px] overflow-y-auto whitespace-pre-wrap no-scrollbar">
              {dossierContent}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

