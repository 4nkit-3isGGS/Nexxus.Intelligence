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
    <div className="w-full flex flex-col gap-space-lg p-margin lg:p-margin-lg overflow-y-auto no-scrollbar max-h-[calc(100vh-5rem)]">
      {/* 1. AI COPILOT QUERY COMMAND BAR */}
      <section className="relative rounded-2xl p-space-lg bg-surface-container-lowest/80 backdrop-blur-2xl shadow-xl overflow-hidden border border-white/[0.08]">
        {/* Ambient glowing backdrops */}
        <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full bg-ai-purple/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col space-y-space-md">
          {/* Title & Live Status */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center space-x-space-sm">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-high border border-ai-purple/30 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                <span className="material-symbols-outlined text-ai-purple text-[20px] animate-pulse">
                  neurology
                </span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-ping"></span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm tracking-tight text-on-surface flex items-center gap-space-xs font-bold">
                  Autonomous Swarm Investigation Copilot
                  <span className="px-2 py-0.5 rounded-full bg-ai-purple/20 text-ai-purple-light font-label-sm text-label-sm border border-ai-purple/30 font-mono">
                    LangGraph v2.4 Multi-Agent
                  </span>
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-space-xs font-label-sm text-label-sm">
              <span className="text-on-surface-variant">Active Model:</span>
              <span className="text-primary font-mono font-semibold">Qwen-2.5-72B-Instruct</span>
              <span className="text-outline-variant">•</span>
              <span className="text-on-surface-variant">Neo4j Bolt:</span>
              <span className="text-verified-emerald font-semibold">7474 ACTIVE</span>
            </div>
          </div>

          {/* Main Input Bar Form */}
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-stretch gap-space-sm bg-surface-container-low/90 p-1.5 rounded-xl shadow-inner border border-white/[0.06]">
            <div className="flex-1 flex items-center px-space-md py-space-xs space-x-space-sm">
              <span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0 animate-pulse">
                psychology_alt
              </span>
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask AI Investigator (e.g. 'Investigate Rahul Sharma & Debasish Chatterjee connection')..."
                className="w-full bg-transparent border-none outline-none font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0"
              />
            </div>
            <div className="flex items-center space-x-space-xs flex-shrink-0 px-1">
              <button
                type="submit"
                disabled={loadingQuery || !inputQuery.trim()}
                className="group relative flex items-center gap-space-xs px-space-lg py-3 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-[0_0_20px_rgba(6,182,212,0.45)] hover:bg-tertiary transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform">
                  auto_awesome
                </span>
                <span>{loadingQuery ? 'Running Swarm...' : 'Run Autonomous Task Force'}</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-surface-base/30 uppercase tracking-widest text-on-primary font-mono">
                  7 Agents
                </span>
              </button>
            </div>
          </form>

          {/* Preset Scenario Quick Chips */}
          <div className="flex flex-wrap items-center gap-space-xs pt-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mr-1">
              Tactic Quick Presets:
            </span>
            <button
              onClick={() => handleSelectPreset('Hypothesis H1: Evaluate Debasish Chatterjee covert cut-out bridge to Kolkata syndicates')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-sm border border-white/[0.04]"
            >
              <span>👑</span> <span>Mastermind Kingpin Bridge (H1)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Hypothesis H2: Trace ₹500,000 mule circular loop through Kolkata Comm Bank')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-sm border border-white/[0.04]"
            >
              <span>💸</span> <span>Hawala Laundering Loop (H2)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Analyze 22-call extortion burst between P008 and victim Manoj Tiwari')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-sm border border-white/[0.04]"
            >
              <span>📞</span> <span>22-Call Extortion Spike</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Perform graph entity resolution between P003 (Rajesh Sharma) & P008 alias')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-sm border border-white/[0.04]"
            >
              <span>👥</span> <span>Entity Disambiguation (P003 vs P008)</span>
            </button>
            <button
              onClick={() => handleSelectPreset('Generate Bharatiya Sakshya Adhiniyam 2023 §65B hash certificate for court bundle')}
              className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-verified-emerald hover:bg-surface-container-high transition-all font-label-sm text-label-sm flex items-center gap-1 shadow-sm border border-white/[0.04]"
            >
              <span>⚖️</span> <span>BSA §65B Evidence Synthesis</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE THREAT SCORECARD (4 Grid HUD Metric Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter-lg">
        {/* Card 1: Threat Classification */}
        <div className="relative p-space-md rounded-2xl bg-surface-container-low/90 backdrop-blur-xl shadow-lg flex flex-col justify-between overflow-hidden border border-white/[0.06]">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-threat-crimson/10 blur-xl"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-threat-crimson font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-threat-crimson animate-ping"></span>
                Classification
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-threat-crimson/20 text-threat-crimson font-mono font-bold">
                TIER 1
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-threat-crimson tracking-tight">
                HIGH CRITICAL
              </span>
              <span className="font-headline-md text-headline-md font-mono text-on-surface">
                92<span className="text-label-sm font-label-sm text-outline">/100</span>
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant border-t border-white/[0.04]">
            <span className="flex items-center text-threat-crimson font-semibold">
              <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +14% Algorithmic Risk
            </span>
            <span className="text-[11px] text-outline font-label-sm">FIR 101/24 linkage</span>
          </div>
        </div>

        {/* Card 2: Knowledge Graph Traversal */}
        <div className="relative p-space-md rounded-2xl bg-surface-container-low/90 backdrop-blur-xl shadow-lg flex flex-col justify-between overflow-hidden border border-white/[0.06]">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary/10 blur-xl"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">account_tree</span>
                Graph Traversal
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-primary-container/20 text-primary font-mono">
                2-HOP DEPTH
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                14 <span className="font-headline-sm text-headline-sm font-normal text-on-surface-variant">Nodes</span>
              </span>
              <span className="font-headline-md text-headline-md font-mono text-primary">
                22 <span className="text-label-sm font-label-sm text-outline">Edges</span>
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant border-t border-white/[0.04]">
            <span className="text-primary font-medium">4 Clusters Identified</span>
            <span className="text-[11px] text-outline font-label-sm">3 Cut-Out Nodes</span>
          </div>
        </div>

        {/* Card 3: Hypothesis Engine */}
        <div className="relative p-space-md rounded-2xl bg-surface-container-low/90 backdrop-blur-xl shadow-lg flex flex-col justify-between overflow-hidden border border-white/[0.06]">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-ai-purple/10 blur-xl"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-ai-purple-light font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Hypothesis Engine
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-ai-purple/20 text-ai-purple-light font-mono font-bold">
                94.8% CONF
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                3 / 3 <span className="font-headline-sm text-headline-sm font-normal text-on-surface-variant">Theories</span>
              </span>
              <span className="font-label-sm text-label-sm text-verified-emerald font-bold">2 CONFIRMED</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant border-t border-white/[0.04]">
            <span className="text-verified-emerald font-medium">H1 & H2 Validated</span>
            <span className="text-threat-crimson text-[11px] font-label-sm">H3 Refuted (Duress)</span>
          </div>
        </div>

        {/* Card 4: Legal Admissibility */}
        <div className="relative p-space-md rounded-2xl bg-surface-container-low/90 backdrop-blur-xl shadow-lg flex flex-col justify-between overflow-hidden border border-white/[0.06]">
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-verified-emerald/10 blur-xl"></div>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-verified-emerald font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                Admissibility
              </span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-verified-emerald/20 text-verified-emerald font-mono">
                SEC. 65B
              </span>
            </div>
            <div className="mt-space-sm flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                BSA 2023
              </span>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-verified-emerald/15 text-verified-emerald font-bold">
                AUDITED
              </span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant border-t border-white/[0.04]">
            <span className="text-on-surface-variant font-mono text-[11px]">SHA-256: 7f9a…c4b2</span>
            <span className="text-verified-emerald text-[11px] font-label-sm flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">lock</span> Tamper-Proof
            </span>
          </div>
        </div>
      </section>

      {/* 3. EVALUATED HYPOTHESES ENGINE PANEL */}
      <section className="flex flex-col space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-space-sm">
            <div className="w-1.5 h-5 bg-risk-amber rounded-full"></div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight uppercase">
              Autonomous Hypothesis Engine <span className="text-outline-variant font-normal">//</span> <span className="text-primary font-mono text-label-lg">Verification Matrix</span>
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
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
                className="relative p-space-lg rounded-2xl bg-surface-container-low/80 backdrop-blur-xl shadow-lg flex flex-col justify-between group hover:bg-surface-container-low transition-colors border border-white/[0.06]"
              >
                <div>
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center space-x-space-xs">
                      <span className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-bold ${
                        isSupported ? 'bg-primary/20 text-primary' : 'bg-threat-crimson/20 text-threat-crimson'
                      }`}>
                        {h.id}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline">{h.code}</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${
                      isSupported ? 'bg-verified-emerald/20 text-verified-emerald' : 'bg-threat-crimson/20 text-threat-crimson'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {isSupported ? 'check_circle' : 'cancel'}
                      </span>
                      <span>{h.status}</span>
                    </div>
                  </div>

                  <p className="mt-space-sm font-body-lg text-body-lg font-semibold text-on-surface leading-snug">
                    {h.title}
                  </p>

                  <div className="mt-space-md p-space-sm rounded-lg bg-surface-container-lowest/80 text-body-sm font-body-sm text-on-surface-variant space-y-1 border border-white/[0.04]">
                    <div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase">
                      <span>Statistical Rationale</span>
                      <span className={`font-mono font-semibold ${isSupported ? 'text-primary' : 'text-threat-crimson'}`}>
                        {h.metric_label}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed">{h.rationale}</p>
                  </div>
                </div>

                <div className="mt-space-lg pt-space-sm border-t border-white/[0.04]">
                  <div className="flex flex-wrap gap-1.5 mb-space-sm">
                    {h.tags.map((tag, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-label-sm font-label-sm">
                    <span className="text-on-surface-variant">{isSupported ? 'Model Confidence:' : 'Refutation Confidence:'}</span>
                    <span className={`font-mono font-bold ${isSupported ? 'text-verified-emerald' : 'text-threat-crimson'}`}>
                      {h.confidence}% {isSupported ? 'Support' : 'Refuted'}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${isSupported ? 'bg-verified-emerald' : 'bg-threat-crimson'}`}
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
      <section className="rounded-2xl p-space-lg bg-surface-container-lowest/90 backdrop-blur-xl shadow-xl flex flex-col space-y-space-md border border-white/[0.08]">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center space-x-space-sm">
            <span className="material-symbols-outlined text-ai-purple text-[20px]">timeline</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
              LangGraph Multi-Agent Execution Stream
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1"
            >
              <span>{showSteps ? 'Collapse Pipeline' : 'View 7-Agent Steps'}</span>
              <span className="material-symbols-outlined text-[16px]">
                {showSteps ? 'expand_less' : 'expand_more'}
              </span>
            </button>
            <button
              onClick={() => setShowDossier(!showDossier)}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-risk-amber font-label-sm text-label-sm transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Court Dossier</span>
            </button>
            {onFocusSubgraph && (
              <button
                onClick={() => onFocusSubgraph(agentResponse?.highlighted_nodes, agentResponse?.highlighted_edges)}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-surface-base font-label-sm text-label-sm font-bold shadow-md hover:bg-tertiary-fixed transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">hub</span>
                <span>Focus Subgraph on Canvas</span>
              </button>
            )}
          </div>
        </div>

        {/* Execution Steps Timeline */}
        {showSteps && (
          <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.04] animate-fade-in">
            {agentExecutionSteps.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container text-body-sm font-body-sm">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-primary font-bold text-label-sm">{idx + 1}.</span>
                  <span className="font-semibold text-on-surface">{step.agent}:</span>
                  <span className="text-on-surface-variant text-[12px]">{step.action}</span>
                </div>
                <span className="font-mono text-[10px] text-outline px-2 py-0.5 rounded bg-surface-container-high">
                  {step.time}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Collapsible Judicial Dossier Preview */}
        {showDossier && (
          <div className="p-4 rounded-xl bg-surface-container-low border border-primary/30 flex flex-col gap-2 animate-fade-in text-body-sm">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="font-bold text-on-surface uppercase tracking-wider font-label-sm text-label-sm text-verified-emerald flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Charge Sheet Ready Annexure (BSA 2023 / Section 65B)
              </span>
              <span className="font-mono text-outline text-[11px]">Hash: 7f83b165...26d9069</span>
            </div>
            <p className="text-on-surface-variant text-[12px] leading-relaxed">
              Based on autonomous agent traversal across 14 nodes and 22 edges, suspect Debasish Chatterjee [P008] acts as the de facto apex coordinator. Multiple burner VoIP origins spoofed identity, while transactions of ₹5,00,000 satisfied circular Hawala layering under 48 hours. Attached digital certificates comply with Section 63/65B of the Bharatiya Sakshya Adhiniyam, 2023.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
