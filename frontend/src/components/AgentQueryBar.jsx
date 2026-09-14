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

  const hypotheses = agentResponse?.hypotheses || [
    {
      id: 'H1',
      code: 'CRIM-ARCH-01',
      title: 'Debasish Chatterjee acts as covert cut-out bridge between extortion cell and hawala syndicate.',
      status: 'SUPPORTED',
      confidence: 96.0,
      metric_label: 'Centr. 0.942',
      rationale: 'Betweenness centrality ratio 0.942 (top 0.1% of graph) with zero direct outgoing calls to victims, delegating extortion ops to Rajesh Kumar Sharma.',
      tags: ['#CDR_EXTORTION_SPIKE', '#FIR_101/24', '#NEO4J_2_HOP_BRIDGE']
    },
    {
      id: 'H2',
      code: 'FIN-LOOP-09',
      title: 'Rapid circular layering across mule accounts in Kolkata Commercial Bank.',
      status: 'SUPPORTED',
      confidence: 91.4,
      metric_label: 'Hawala Loop < 48h',
      rationale: '₹500,000 returned to originating entity via 3 intermediary shell layers in under 48 hours, satisfying classic Hawala loop signature.',
      tags: ['#BANK_LAYER_3', '#FIR_103/24', '#ROC_SHELL_MATCH']
    },
    {
      id: 'H3',
      code: 'CULP-VICTIM-03',
      title: 'Victim Manoj Tiwari holds operational / willing stake in Shubh Laxmi Finance.',
      status: 'REJECTED',
      confidence: 98.2,
      metric_label: 'Coercion Confirmed',
      rationale: 'Forensic NLP sentiment analysis of 22 intercepted calls confirms acute duress. Financial transactions are unidirectional extortion outflows, not equity dividends.',
      tags: ['#WHISPER_VOICE_NLP', '#UNIDIRECTIONAL_CASHFLOW']
    }
  ];

  const agentExecutionSteps = agentResponse?.execution_steps || [
    { agent: 'Ingestion & NER Agent', action: 'Normalized FIR 101/24 and 103/24 documents into 31 graph entities', time: '12ms' },
    { agent: 'Centrality Analytics Agent', action: 'Computed betweenness centrality; identified Debasish Chatterjee as cut-out bridge', time: '28ms' },
    { agent: 'Hawala AML Agent', action: 'Detected ₹500,000 3-hop circular loop through Kolkata Comm Bank', time: '45ms' },
    { agent: 'CDR Telemetry Agent', action: 'Correlated 22-call spike on 2026-03-05 with Salt Lake Sector V cell tower', time: '62ms' },
    { agent: 'Multi-Agent Synthesizer', action: 'Synthesized zero-hallucination judicial evidence dossier under BSA §65B', time: '88ms' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto w-full h-full p-4 lg:p-6 gap-4 no-scrollbar">
      {/* 1. AI COPILOT QUERY COMMAND BAR */}
      <section className="relative flex flex-col flex-shrink-0 min-h-fit rounded-2xl p-space-lg bg-white/95 backdrop-blur-2xl shadow-sm border border-slate-200/80">
        {/* Ambient glowing backdrops */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full bg-sky-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col space-y-space-md">
          {/* Title & Live Status */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center space-x-space-sm">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 shadow-xs">
                <span className="material-symbols-outlined text-purple-600 text-[20px] animate-pulse">
                  neurology
                </span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm tracking-tight text-slate-900 flex items-center gap-space-xs font-bold">
                  Autonomous Swarm Investigation Copilot
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-label-sm text-label-sm border border-purple-200 font-mono font-medium">
                    LangGraph v2.4 Multi-Agent
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-space-xs font-label-sm text-label-sm">
              <span className="text-slate-500">Active Model:</span>
              <span className="text-sky-700 font-mono font-semibold">Qwen-2.5-72B-Instruct</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">Neo4j Bolt:</span>
              <span className="text-emerald-700 font-semibold">7474 ACTIVE</span>
            </div>
          </div>

          {/* Main Input Bar Form */}
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch gap-space-sm bg-slate-50 p-1.5 rounded-xl shadow-inner border border-slate-200/90">
            <div className="flex-1 flex items-center px-space-md py-space-xs space-x-space-sm">
              <span className="material-symbols-outlined text-sky-600 text-[22px] flex-shrink-0 animate-pulse">
                psychology_alt
              </span>
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask AI Investigator (e.g. 'Investigate Rahul Sharma & Debasish Chatterjee connection')..."
                className="w-full bg-transparent border-none outline-none font-body-md text-body-md text-slate-800 placeholder:text-slate-400 focus:ring-0 font-medium"
              />
            </div>
            <div className="flex items-center space-x-space-xs flex-shrink-0 px-1">
              <button
                type="submit"
                disabled={loadingQuery || !inputQuery.trim()}
                className="group relative flex items-center gap-space-xs px-space-lg py-3 rounded-lg bg-sky-600 text-white font-label-md text-label-md font-bold shadow-sm hover:bg-sky-700 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform">
                  auto_awesome
                </span>
                <span>{loadingQuery ? 'Running Swarm...' : 'Run Autonomous Task Force'}</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-sky-800/40 uppercase tracking-widest text-white font-mono">
                  7 Agents
                </span>
              </button>
            </div>
          </form>

          {/* Preset Scenario Quick Chips */}
          <div className="flex flex-wrap items-center gap-space-xs pt-1">
            <span className="font-label-sm text-label-sm text-slate-500 uppercase tracking-wider mr-1">
              Tactic Quick Presets:
            </span>
            <button
              onClick={() => handleSelectPreset('Hypothesis H1: Evaluate Debasish Chatterjee covert cut-out bridge to Kolkata syndicates')}
              className="px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-xs border border-slate-200"
            >
              <span>👑</span> <span>Mastermind Kingpin Bridge (H1)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Hypothesis H2: Trace ₹500,000 mule circular loop through Kolkata Comm Bank')}
              className="px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-xs border border-slate-200"
            >
              <span>💸</span> <span>Hawala Laundering Loop (H2)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Analyze 22-call extortion burst between P008 and victim Manoj Tiwari')}
              className="px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-xs border border-slate-200"
            >
              <span>📞</span> <span>22-Call Extortion Spike</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Perform graph entity resolution between P003 (Rajesh Sharma) & P008 alias')}
              className="px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-xs border border-slate-200"
            >
              <span>👥</span> <span>Entity Disambiguation (P003 vs P008)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Generate Bharatiya Sakshya Adhiniyam 2023 §65B hash certificate for court bundle')}
              className="px-2.5 py-1 rounded-full bg-white text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-xs border border-slate-200"
            >
              <span>⚖️</span> <span>BSA §65B Evidence Synthesis</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE THREAT SCORECARD (4 Grid HUD Metric Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter-lg flex-shrink-0 min-h-fit">
        {/* Card 1: Threat Classification */}
        <div className="relative p-space-md rounded-2xl bg-white shadow-sm flex flex-col justify-between overflow-hidden border border-slate-200/80">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-rose-500/5 blur-xl"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-rose-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                Classification
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-mono font-bold border border-rose-200/60">
                TIER 1
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-rose-600 tracking-tight">
                HIGH CRITICAL
              </span>
              <span className="font-headline-md text-headline-md font-mono text-slate-900 font-bold">
                92<span className="text-label-sm font-label-sm text-slate-400 font-normal">/100</span>
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-slate-500 border-t border-slate-100">
            <span className="flex items-center text-rose-600 font-semibold">
              <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +14% Algorithmic Risk
            </span>
            <span className="text-[11px] text-slate-400 font-label-sm">FIR 101/24 linkage</span>
          </div>
        </div>

        {/* Card 2: Knowledge Graph Traversal */}
        <div className="relative p-space-md rounded-2xl bg-white shadow-sm flex flex-col justify-between overflow-hidden border border-slate-200/80">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-sky-500/5 blur-xl"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-sky-700 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">account_tree</span>
                Graph Traversal
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-mono font-bold border border-sky-200/60">
                2-HOP DEPTH
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-slate-900 tracking-tight">
                14 <span className="font-headline-sm text-headline-sm font-normal text-slate-500">Nodes</span>
              </span>
              <span className="font-headline-md text-headline-md font-mono text-sky-700 font-bold">
                22 <span className="text-label-sm font-label-sm text-slate-400 font-normal">Edges</span>
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-slate-500 border-t border-slate-100">
            <span className="text-sky-700 font-medium">4 Clusters Identified</span>
            <span className="text-[11px] text-slate-400 font-label-sm">3 Cut-Out Nodes</span>
          </div>
        </div>

        {/* Card 3: Hypothesis Engine */}
        <div className="relative p-space-md rounded-2xl bg-white shadow-sm flex flex-col justify-between overflow-hidden border border-slate-200/80">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-purple-500/5 blur-xl"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-purple-700 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Hypothesis Engine
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-mono font-bold border border-purple-200/60">
                94.8% CONF
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-slate-900 tracking-tight">
                3 / 3 <span className="font-headline-sm text-headline-sm font-normal text-slate-500">Theories</span>
              </span>
              <span className="font-label-sm text-label-sm text-emerald-600 font-bold">2 CONFIRMED</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-slate-500 border-t border-slate-100">
            <span className="text-emerald-600 font-medium">H1 & H2 Validated</span>
            <span className="text-rose-600 text-[11px] font-label-sm">H3 Refuted (Duress)</span>
          </div>
        </div>

        {/* Card 4: Legal Admissibility */}
        <div className="relative p-space-md rounded-2xl bg-white shadow-sm flex flex-col justify-between overflow-hidden border border-slate-200/80">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-emerald-500/5 blur-xl"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-emerald-700 font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                Admissibility
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200/60">
                SEC. 65B
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-slate-900 tracking-tight">
                BSA 2023
              </span>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                AUDITED
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-slate-500 border-t border-slate-100">
            <span className="text-slate-600 font-mono text-[11px]">SHA-256: 7f9a…c4b2</span>
            <span className="text-emerald-700 text-[11px] font-label-sm flex items-center gap-0.5 font-medium">
              <span className="material-symbols-outlined text-[12px]">lock</span> Tamper-Proof
            </span>
          </div>
        </div>
      </section>

      {/* 3. EVALUATED HYPOTHESES ENGINE PANEL */}
      <section className="flex flex-col flex-shrink-0 min-h-fit space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-space-sm">
            <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-slate-900 tracking-tight uppercase">
              Autonomous Hypothesis Engine <span className="text-slate-300 font-normal">//</span> <span className="text-sky-700 font-mono text-label-lg">Verification Matrix</span>
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-slate-500 uppercase tracking-wider font-medium">
            Zero Hallucination Verified • Dual Cross-Validation
          </span>
        </div>

        {/* Comparative Hypotheses 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg">
          {hypotheses.map((h) => {
            const isSupported = h.status === 'SUPPORTED';
            return (
              <div
                key={h.id}
                className="relative p-space-lg rounded-2xl bg-white shadow-sm flex flex-col justify-between group hover:border-slate-300 transition-colors border border-slate-200/80"
              >
                <div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center space-x-space-xs">
                      <span className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-bold ${
                        isSupported ? 'bg-sky-50 text-sky-700 border border-sky-200/70' : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                      }`}>
                        {h.id}
                      </span>
                      <span className="font-label-sm text-label-sm text-slate-400 font-mono font-medium">{h.code}</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                      isSupported ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70' : 'bg-rose-50 text-rose-700 border border-rose-200/70'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {isSupported ? 'check_circle' : 'cancel'}
                      </span>
                      <span>{h.status}</span>
                    </div>
                  </div>

                  <p className="mt-space-sm font-body-lg text-body-lg font-semibold text-slate-900 leading-snug">
                    {h.title}
                  </p>

                  <div className="mt-space-md p-space-sm rounded-lg bg-slate-50 text-body-sm font-body-sm text-slate-600 space-y-1 border border-slate-150">
                    <div className="flex items-center justify-between text-slate-400 font-label-sm text-label-sm uppercase">
                      <span>Statistical Rationale</span>
                      <span className={`font-mono font-semibold ${isSupported ? 'text-sky-700' : 'text-rose-600'}`}>
                        {h.metric_label}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-slate-700">{h.rationale}</p>
                  </div>
                </div>

                <div className="mt-space-lg pt-space-sm border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5 mb-space-sm">
                    {h.tags.map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-label-sm text-label-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-label-sm font-label-sm">
                    <span className="text-slate-500">{isSupported ? 'Model Confidence:' : 'Refutation Confidence:'}</span>
                    <span className={`font-mono font-bold ${isSupported ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {h.confidence}% {isSupported ? 'Support' : 'Refuted'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${isSupported ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${h.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MULTI-AGENT REASONING PIPELINE & COURT DOSSIER */}
      <section className="rounded-2xl p-space-lg bg-white shadow-sm flex flex-col flex-shrink-0 min-h-fit space-y-space-md border border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center space-x-space-sm">
            <span className="material-symbols-outlined text-purple-600 text-[20px]">timeline</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-slate-900 tracking-tight">
              LangGraph Multi-Agent Execution Stream
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-label-sm text-label-sm transition-colors flex items-center gap-1 border border-slate-200/60 font-medium"
            >
              <span>{showSteps ? 'Collapse Pipeline' : 'View 7-Agent Steps'}</span>
              <span className="material-symbols-outlined text-[16px]">
                {showSteps ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            <button
              onClick={() => setShowDossier(!showDossier)}
              className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-label-sm text-label-sm transition-colors flex items-center gap-1 border border-amber-200 font-medium"
            >
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Court Dossier</span>
            </button>
            {onFocusSubgraph && (
              <button
                onClick={() => onFocusSubgraph(agentResponse?.highlighted_nodes, agentResponse?.highlighted_edges)}
                className="px-3.5 py-1.5 rounded-lg bg-sky-600 text-white font-label-sm text-label-sm font-bold shadow-xs hover:bg-sky-700 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">hub</span>
                <span>Focus Subgraph on Canvas</span>
              </button>
            )}
          </div>
        </div>

        {/* Execution Steps Timeline */}
        {showSteps && (
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 animate-fade-in">
            {agentExecutionSteps.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-body-sm font-body-sm">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sky-700 font-bold text-label-sm">{idx + 1}.</span>
                  <span className="font-semibold text-slate-900">{step.agent}:</span>
                  <span className="text-slate-600 text-[12px]">{step.action}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 px-2 py-0.5 rounded bg-slate-200/70 font-medium">
                  {step.time}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Collapsible Judicial Dossier Preview */}
        {showDossier && (
          <div className="p-4 rounded-xl bg-slate-50 border border-sky-300 flex flex-col gap-2 animate-fade-in text-body-sm">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="font-bold uppercase tracking-wider font-label-sm text-label-sm text-emerald-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Charge Sheet Ready Annexure (BSA 2023 / Section 65B)
              </span>
              <span className="font-mono text-slate-400 text-[11px]">Hash: 7f83b165...26d9069</span>
            </div>
            <p className="text-slate-700 text-[12px] leading-relaxed">
              Based on autonomous agent traversal across 14 nodes and 22 edges, suspect Debasish Chatterjee [P008] acts as the de facto apex coordinator. Multiple burner VoIP origins spoofed identity, while transactions of ₹5,00,000 satisfied circular Hawala layering under 48 hours. Attached digital certificates comply with Section 63/65B of the Bharatiya Sakshya Adhiniyam, 2023.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
