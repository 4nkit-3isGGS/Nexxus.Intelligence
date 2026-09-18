import React from 'react';

export default function HomePage({
  onLaunchWorkspace,
  onOpenAuth,
  currentUser,
  onQuickRoleSelect,
  onInvestigate,
  stats = { totalNodes: 31, totalEdges: 42, totalAmount: '₹14,85,000' }
}) {
  const [heroQuery, setHeroQuery] = React.useState('');

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    const q = heroQuery.trim() || 'Investigate Rahul Sharma P001 and map his criminal network';
    if (onInvestigate) {
      onInvestigate(q);
    } else {
      onLaunchWorkspace?.();
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-slate-900 selection:text-white">
      {/* 1. TOP EXECUTIVE NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 text-white shadow-xs flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">shield</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base tracking-tight text-slate-900">
                  NEXXUS<span className="text-sky-600 font-semibold">.INTEL</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-mono font-medium border border-slate-200/80">
                  v2.6
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline tracking-tight">
                Defense-Grade Crime Knowledge Graph
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#capabilities" className="hover:text-slate-900 transition-colors">Capabilities</a>
            <a href="#rbac" className="hover:text-slate-900 transition-colors">Clearance Tiers</a>
            <a href="#compliance" className="hover:text-slate-900 transition-colors">BSA §65B Vault</a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors cursor-pointer shadow-2xs"
                  title="Switch Officer Profile"
                >
                  <span className="material-symbols-outlined text-[17px] text-slate-500">badge</span>
                  <span>{currentUser.name}</span>
                </button>
                <button
                  onClick={onLaunchWorkspace}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span>Launch Workspace</span>
                  <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onLaunchWorkspace}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span>Command Center</span>
                  <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-14 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          {/* Government / Compliance Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>BHARATIYA SAKSHYA ADHINIYAM (BSA) COMPLIANT</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 max-w-4xl leading-[1.12]">
            AI Criminal Intelligence & Knowledge Graph Defense Platform
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed font-normal">
            Automates syndicate network mapping, circular hawala tracking, suspect disambiguation, and court-admissible digital evidence generation under Indian law.
          </p>

          {/* Interactive Quick AI Investigation Bar */}
          <form onSubmit={handleHeroSubmit} className="mt-8 w-full max-w-2xl flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-300/80 shadow-xs focus-within:bg-white focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
            <div className="flex-1 flex items-center gap-2 px-3 py-1 w-full">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">psychology</span>
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Ask AI or search (e.g. 'Investigate Rahul Sharma' or 'Trace money trail')..."
                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-normal"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
              <span>Investigate</span>
            </button>
          </form>

          {/* Quick Preset Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-[10px] text-slate-400 font-mono font-medium uppercase">Quick Leads:</span>
            <button
              type="button"
              onClick={() => onInvestigate ? onInvestigate('Investigate Rahul Sharma P001 and map his associates', 'P001') : onLaunchWorkspace()}
              className="px-2.5 py-0.8 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition-all text-[11px] font-normal cursor-pointer"
            >
              Rahul Sharma (P001)
            </button>
            <button
              type="button"
              onClick={() => onInvestigate ? onInvestigate('Hypothesis H1: Evaluate Debasish Chatterjee covert cut-out bridge to Kolkata syndicates', 'P008') : onLaunchWorkspace()}
              className="px-2.5 py-0.8 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition-all text-[11px] font-normal cursor-pointer"
            >
              Apex Leader Debasish (P008)
            </button>
            <button
              type="button"
              onClick={() => onInvestigate ? onInvestigate('Hypothesis H2: Trace ₹500,000 mule circular loop through Kolkata Comm Bank') : onLaunchWorkspace()}
              className="px-2.5 py-0.8 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition-all text-[11px] font-normal cursor-pointer"
            >
              ₹500k Hawala Loop
            </button>
          </div>

          {/* Primary Action Button Cluster */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={onLaunchWorkspace}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">hub</span>
              <span>Open Investigation Workspace</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-slate-500">admin_panel_settings</span>
              <span>Officer Sign In</span>
            </button>
          </div>

          {/* Quick Evaluator Roles Strip */}
          <div className="mt-8 p-1.5 rounded-xl bg-slate-100/80 border border-slate-200/70 flex flex-wrap items-center justify-center gap-1 text-xs">
            <span className="text-slate-400 font-mono text-[10px] uppercase px-2 font-medium">
              Demo Clearances:
            </span>
            <button
              onClick={() => onQuickRoleSelect('LEAD_INVESTIGATOR')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-200/60 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Lead Investigator (DSP)</span>
            </button>
            <button
              onClick={() => onQuickRoleSelect('INVESTIGATOR')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-200/60 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Field Investigator (SI)</span>
            </button>
            <button
              onClick={() => onQuickRoleSelect('ANALYST')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-200/60 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Crime Analyst</span>
            </button>
            <button
              onClick={() => onQuickRoleSelect('AUDITOR')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-200/60 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Judicial Auditor (§65B)</span>
            </button>
          </div>

          {/* Telemetry Metrics Ribbon */}
          <div className="mt-12 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider">ACTIVE KNOWLEDGE GRAPH</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-slate-900">{stats.totalNodes || 31}</span>
                <span className="text-xs text-slate-500">Entities</span>
              </div>
              <span className="text-[11px] text-slate-400">Persons, Phones, Shells, Vehicles</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider">HAWALA MONEY TRAIL</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-slate-900">{stats.totalAmount || '₹14.85L'}</span>
                <span className="text-xs text-slate-500">INR</span>
              </div>
              <span className="text-[11px] text-slate-400">3-Hop Circular Layering Loop</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider">EXTORTION CDR SPIKE</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-slate-900">22</span>
                <span className="text-xs text-slate-500">Calls/Day</span>
              </div>
              <span className="text-[11px] text-slate-400">Sector V BTS Triangulated</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider">EVIDENCE ADMISSIBILITY</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl font-mono font-bold text-slate-900">100%</span>
                <span className="text-xs text-emerald-700 font-medium">Verified</span>
              </div>
              <span className="text-[11px] text-slate-400">Section 65B SHA-256 Chain</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FIVE CORE CAPABILITY PILLARS */}
      <section id="capabilities" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">OPERATIONAL CAPABILITIES</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Designed for High-Stakes Police & Intelligence Operations
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Unified cross-agency intelligence infrastructure replacing fragmented spreadsheets with real-time graph reasoning, audio wiretap analytics, and tamper-proof legal chains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 mb-4 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">hub</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Interactive Knowledge Graph
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Neo4j graph engine modeling multi-tier criminal syndicates, cut-out brokers, burner MSISDNs, and shell accounts with betweenness centrality analytics.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 text-xs font-mono font-bold text-sky-700 flex items-center gap-1">
                <span>Force-Directed & Radial Topologies</span>
                <span className="material-symbols-outlined text-[15px]">chevron_right</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 mb-4 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">psychology</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Autonomous Multi-Agent Swarm
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  LangGraph v2.4 multi-agent copilot utilizing Qwen-2.5-72B for hypothesis generation, cross-validation, and non-hallucinatory judicial reasoning.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 text-xs font-mono font-bold text-purple-700 flex items-center gap-1">
                <span>7 Autonomous Specialist Agents</span>
                <span className="material-symbols-outlined text-[15px]">chevron_right</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-4 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">fingerprint</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Entity Resolution & Mule Detection
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Disambiguates synthetic identities, cloned license plates, and duplicate VoIP aliases using fuzzy phonetic algorithms and co-location matching.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 text-xs font-mono font-bold text-amber-800 flex items-center gap-1">
                <span>Fuzzy Token Matching & Merges</span>
                <span className="material-symbols-outlined text-[15px]">chevron_right</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700 mb-4 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">currency_exchange</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Hawala AML & Circular Smurfing
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Automated detection of 3-hop circular cash flows and syndicate cuts under 48 hours, with one-click Section 107 BNSS asset freeze directives.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 text-xs font-mono font-bold text-rose-700 flex items-center gap-1">
                <span>PMLA Section 3/4 Financial Crime</span>
                <span className="material-symbols-outlined text-[15px]">chevron_right</span>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">gavel</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  BSA §65B Cryptographic Vault
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Immutable SHA-256 backward hash-chain certifying every piece of electronic evidence for admissibility in Indian judicial proceedings.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
                <span>Mathematically Tamper-Evident</span>
                <span className="material-symbols-outlined text-[15px]">chevron_right</span>
              </div>
            </div>

            {/* Pillar 6: Telecom Triangulation */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 mb-4 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">cell_tower</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  CDR Telecom & Wiretap Intercept
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  BTS antenna co-location triangulation, IMEI burner handset correlation, and acoustic wiretap recording player with animated waveform.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-200 text-xs font-mono font-bold text-sky-700 flex items-center gap-1">
                <span>Multi-Telco Ingestion (Airtel, Jio, Vi)</span>
                <span className="material-symbols-outlined text-[15px]">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RBAC CLEARANCE TIERS SHOWCASE */}
      <section id="rbac" className="py-16 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider">SECURITY CLEARANCE ARCHITECTURE</span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Role-Based Access Control (RBAC)
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Enforcing strict need-to-know access control, dynamic PII redacting (Aadhaar & PAN blind indexes), and forensic accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Role 1: Lead Investigator */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-2xl">👑</span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-mono text-[10px] font-bold border border-sky-200">
                    TIER 1 TOP SECRET
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 mt-3">
                  Lead Investigator
                </h4>
                <p className="text-xs text-slate-500 font-medium">Rank: DSP / ACP / Superintendent</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Full Unmasked PII Access
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Entity Merge Authorization
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Sec 107 BNSS Freeze Orders
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> LangGraph Agent Inquiries
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickRoleSelect('LEAD_INVESTIGATOR')}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Enter as Lead Investigator
              </button>
            </div>

            {/* Role 2: Field Investigator */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-2xl">🔍</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200">
                    TIER 2 CONFIDENTIAL
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 mt-3">
                  Field Investigator
                </h4>
                <p className="text-xs text-slate-500 font-medium">Rank: Inspector / Sub-Inspector</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Graph Traversal & Search
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> CDR & BTS Triangulation
                  </li>
                  <li className="flex items-center gap-1.5 text-amber-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">warning</span> Masked Aadhaar / PAN (Last 4)
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-400">
                    <span className="material-symbols-outlined text-[15px]">close</span> No Merge Authority
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickRoleSelect('INVESTIGATOR')}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 shadow-xs transition-all cursor-pointer"
              >
                Enter as Field Investigator
              </button>
            </div>

            {/* Role 3: Crime Analyst */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-2xl">📊</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-mono text-[10px] font-bold border border-purple-200">
                    TIER 2 ANALYTICAL
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 mt-3">
                  Intelligence Analyst
                </h4>
                <p className="text-xs text-slate-500 font-medium">Rank: Technical Forensic Analyst</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Centrality & Topology Metrics
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Hawala Flow Modeling
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-500">
                    <span className="material-symbols-outlined text-[15px]">lock</span> Full PII Masked (Blind Index)
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-400">
                    <span className="material-symbols-outlined text-[15px]">close</span> No Merge / Freeze Rights
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickRoleSelect('ANALYST')}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 shadow-xs transition-all cursor-pointer"
              >
                Enter as Crime Analyst
              </button>
            </div>

            {/* Role 4: Judicial Auditor */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-2xl">⚖️</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                    TIER 3 JUDICIAL
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 mt-3">
                  Judicial Auditor
                </h4>
                <p className="text-xs text-slate-500 font-medium">Rank: Court Evidence Commissioner</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Section 65B Audit Chain
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Cryptographic Hash Attestation
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Court Dossier Generation
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-500">
                    <span className="material-symbols-outlined text-[15px]">visibility</span> Read-Only Workspace
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickRoleSelect('AUDITOR')}
                className="mt-5 w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-xs transition-all cursor-pointer"
              >
                Enter as Judicial Auditor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACTIVE CASE STUDY */}
      <section id="cases" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px] font-bold">
                  ACTIVE BENCHMARK CASE: KOL-2026-088
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-700 font-mono text-xs font-semibold">FIR 101/24 & 103/24 Linked</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">
                Operation Kolkata Synergy: Cyber Extortion & Multi-Tier Hawala
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Investigating kingpin Debasish Chatterjee [P008] and cut-out broker Rajesh Kumar Sharma [P003]. Features fake loan app extortion, 22-call telecommunications spikes from Sector V cell towers, and a ₹5,00,000 circular layering loop across 3 mule accounts in Kolkata Commercial Bank.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">14 Key Nodes</span>
                <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">22 Direct Edges</span>
                <span className="px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 font-bold">Risk Score: 92/100</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (onInvestigate) {
                    onInvestigate('Investigate Operation Kolkata Synergy: suspect Debasish Chatterjee [P008] and cut-out broker Rajesh Kumar Sharma [P003] for extortion and hawala laundering', 'P008');
                  } else {
                    onLaunchWorkspace();
                  }
                }}
                className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Investigate Case with Agent Swarm</span>
                <span className="material-symbols-outlined text-[17px]">travel_explore</span>
              </button>
              <button
                onClick={() => {
                  if (onInvestigate) {
                    onInvestigate('Investigate kingpin Debasish Chatterjee [P008] and map his cut-out broker hierarchy', 'P008');
                  } else {
                    onQuickRoleSelect('LEAD_INVESTIGATOR');
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Inspect Kingpin Subgraph</span>
                <span className="material-symbols-outlined text-[16px] text-sky-600">hub</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer id="compliance" className="py-8 bg-[#f8fafc] text-slate-500 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Nexxus Intelligence</span>
            <span>•</span>
            <span>Law Enforcement & Intelligence Defense Suite</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>BSA 2023 §65B Certified</span>
            <span>•</span>
            <span>BNSS 2023 Sec 107 Enforceable</span>
            <span>•</span>
            <span>Confidential & Classified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
