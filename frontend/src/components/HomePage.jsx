import React, { useState } from 'react';

export default function HomePage({
  onLaunchWorkspace,
  onOpenAuth,
  onOpenFieldGuide,
  currentUser,
  onQuickRoleSelect,
  onInvestigate,
  stats = { totalNodes: 0, totalEdges: 0, totalAmount: '₹0' }
}) {
  const [heroQuery, setHeroQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    const q = heroQuery.trim();
    if (q) {
      if (onInvestigate) {
        onInvestigate(q);
      } else {
        onLaunchWorkspace?.();
      }
    } else {
      onLaunchWorkspace?.();
    }
  };

  const handleSearchClick = () => {
    const el = document.getElementById('hero-omnisearch');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => el.focus(), 300);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-[#0F172A] selection:text-white font-sans">
      {/* 1. TOP EXECUTIVE NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-2xs transition-all">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Brand Emblem & Identification */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0F172A] text-white shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px] text-sky-400">shield</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base sm:text-[17px] tracking-tight text-[#0F172A]">
                  NEXXUS<span className="text-[#0F172A]">.INTEL</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] text-[11px] font-mono font-medium border border-[#E2E8F0]">
                  v2.6
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8] font-mono hidden sm:inline tracking-tight -mt-0.5">
                Defense-Grade Crime Knowledge Graph
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-[14px] font-medium text-[#64748B]">
            <a href="#hero" className="hover:text-[#0F172A] transition-colors">Home</a>
            <a href="#capabilities" className="hover:text-[#0F172A] transition-colors">Capabilities</a>
            <a href="#rbac" className="hover:text-[#0F172A] transition-colors">Clearance Tiers</a>
            <a href="#compliance" className="hover:text-[#0F172A] transition-colors">BSA Vault</a>
            <button 
              onClick={() => onOpenFieldGuide ? onOpenFieldGuide() : document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })} 
              className="hover:text-[#0F172A] transition-colors cursor-pointer bg-transparent border-none p-0 text-[14px] font-medium text-[#64748B]"
            >
              Documentation
            </button>
          </nav>

          {/* Right Header Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Search Circular Button */}
            <button
              onClick={handleSearchClick}
              className="w-10 h-10 rounded-full border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-slate-50 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Search AI Crime Graph"
              aria-label="Search AI Crime Graph"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Sign In / Officer Profile Button (Replaces Settings Icon) */}
            {currentUser ? (
              <button
                onClick={() => onOpenAuth?.('login')}
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#0F172A] text-xs sm:text-sm font-semibold shadow-2xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                title={`Signed in as ${currentUser.name} (${currentUser.role}) - Click to switch`}
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-emerald-100 flex-shrink-0"></span>
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth?.('login')}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#0F172A] text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px] text-[#64748B]">login</span>
                <span>Sign In</span>
              </button>
            )}

            {/* Main Primary CTA Button */}
            <button
              onClick={onLaunchWorkspace}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <span>Launch Workspace</span>
              <span className="material-symbols-outlined text-[17px] sm:text-[18px]">arrow_forward</span>
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl border border-[#E2E8F0] hover:bg-slate-100 flex items-center justify-center text-[#0F172A] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-white/98 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-5 shadow-lg animate-fade-in">
            <nav className="flex flex-col gap-3.5 text-sm font-medium text-[#64748B]">
              <a 
                href="#hero" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-1 hover:text-[#0F172A] transition-colors"
              >
                Home
              </a>
              <a 
                href="#capabilities" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-1 hover:text-[#0F172A] transition-colors"
              >
                Capabilities
              </a>
              <a 
                href="#rbac" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-1 hover:text-[#0F172A] transition-colors"
              >
                Clearance Tiers
              </a>
              <a 
                href="#compliance" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-1 hover:text-[#0F172A] transition-colors"
              >
                BSA Vault
              </a>
              <button 
                onClick={() => { 
                  setMobileMenuOpen(false); 
                  if (onOpenFieldGuide) onOpenFieldGuide(); 
                  else document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' }); 
                }} 
                className="text-left py-1 hover:text-[#0F172A] transition-colors bg-transparent border-none p-0 text-sm font-medium text-[#64748B]"
              >
                Documentation
              </button>
              
              <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2.5">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth?.('login'); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#64748B]">badge</span>
                  <span>{currentUser ? `${currentUser.name} (${currentUser.role})` : 'Officer Sign In'}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLaunchWorkspace?.(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-xs"
                >
                  <span>Launch Workspace</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION — TWO COLUMN WITH GRAPH VISUALIZATION */}
      <section 
        id="hero" 
        className="relative pt-12 pb-16 lg:pt-18 lg:pb-24 overflow-hidden border-b border-[#E2E8F0]"
        style={{
          background: 'radial-gradient(circle at 75% 40%, rgba(37, 99, 235, 0.08), transparent 35%), #F8FAFC'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Compliance Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-mono font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                <span>• BSA Compliant • Secure • Multi-Agency</span>
              </div>

              {/* Headline */}
              <h1 className="hero-title font-display font-bold tracking-tight text-[#0F172A]">
                Smarter Intelligence for a Safer India
              </h1>

              {/* Subtitle */}
              <p className="hero-subtitle mt-4 text-[#64748B] text-base sm:text-lg leading-relaxed">
                AI-powered criminal intelligence, knowledge graph analysis and forensic tools — built for law enforcement, analysts and the judiciary.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onLaunchWorkspace}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <span>Start Investigation</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('capabilities');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] text-sm font-semibold border border-[#E2E8F0] shadow-2xs transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#2563EB]">play_circle</span>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Key Stats Counter Ribbon */}
              <div className="mt-10 pt-8 border-t border-[#E2E8F0] w-full grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">7+</div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">AI Agents</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">65B+</div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">Secure Records</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">4</div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">Agency Tiers</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-display text-[#0F172A]">End-to-End</div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">Audit Ready</div>
                </div>
              </div>

              {/* Quick AI Search Prompt Bar */}
              <form onSubmit={handleHeroSubmit} className="mt-8 w-full max-w-xl flex items-center gap-2 p-1.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <span className="material-symbols-outlined text-[#94A3B8] text-[20px] ml-2">search</span>
                <input
                  id="hero-omnisearch"
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Ask AI or search (e.g. 'Investigate Rahul Sharma P001')..."
                  className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                  <span>Investigate</span>
                </button>
              </form>

              {/* Quick Lead Preset Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[10px] text-[#94A3B8] font-mono font-medium uppercase">Quick Leads:</span>
                <button
                  type="button"
                  onClick={() => onInvestigate ? onInvestigate('Investigate Rahul Sharma P001 and map his associates', 'P001') : onLaunchWorkspace()}
                  className="px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] text-[11px] transition-all cursor-pointer shadow-2xs"
                >
                  Rahul Sharma (P001)
                </button>
                <button
                  type="button"
                  onClick={() => onInvestigate ? onInvestigate('Hypothesis H1: Evaluate Debasish Chatterjee covert cut-out bridge to Kolkata syndicates', 'P008') : onLaunchWorkspace()}
                  className="px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] text-[11px] transition-all cursor-pointer shadow-2xs"
                >
                  Apex Leader Debasish (P008)
                </button>
                <button
                  type="button"
                  onClick={() => onInvestigate ? onInvestigate('Hypothesis H2: Trace ₹500,000 mule circular loop through Kolkata Comm Bank') : onLaunchWorkspace()}
                  className="px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] text-[11px] transition-all cursor-pointer shadow-2xs"
                >
                  ₹500k Hawala Loop
                </button>
              </div>
            </div>

            {/* Right Hero Column: Interactive Graphic Knowledge Mockup Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[460px] executive-card relative bg-white/95 rounded-3xl p-6 border border-[#E2E8F0] shadow-xl backdrop-blur-md">
                
                {/* SVG Visual Graph Network Canvas with Perfectly Aligned Nodes */}
                <div className="relative w-full h-[320px] overflow-hidden">
                  {/* Background Network Connecting Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Center to Financial Trail (Top-Left) */}
                    <line x1="50%" y1="48%" x2="25%" y2="18%" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    {/* Center to Phone Records (Top-Right) */}
                    <line x1="50%" y1="48%" x2="75%" y2="16%" stroke="#CBD5E1" strokeWidth="1.5" />
                    
                    {/* Center to Shell Company (Right) */}
                    <line x1="50%" y1="48%" x2="78%" y2="48%" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 2" />
                    
                    {/* Center to Location (Bottom-Right) */}
                    <line x1="50%" y1="48%" x2="72%" y2="80%" stroke="#CBD5E1" strokeWidth="1.5" />
                    
                    {/* Center to Associate (Bottom-Left) */}
                    <line x1="50%" y1="48%" x2="22%" y2="76%" stroke="#8B5CF6" strokeWidth="1.5" />
                  </svg>

                  {/* Satellite Node 1: Financial Trail (Top-Left: 25%, 18%) */}
                  <div 
                    style={{ left: '25%', top: '18%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#A7F3D0] shadow-xs text-xs font-semibold text-[#0F172A] hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
                  >
                    <span className="w-5 h-5 rounded-lg bg-[#ECFDF5] text-[#10B981] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[13px]">payments</span>
                    </span>
                    <span>Financial Trail</span>
                  </div>

                  {/* Satellite Node 2: Phone Records (Top-Right: 75%, 16%) */}
                  <div 
                    style={{ left: '75%', top: '16%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#BFDBFE] shadow-xs text-xs font-semibold text-[#0F172A] hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
                  >
                    <span className="w-5 h-5 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[13px]">call</span>
                    </span>
                    <span>Phone Records</span>
                  </div>

                  {/* Satellite Node 3: Shell Company (Right: 78%, 48%) */}
                  <div 
                    style={{ left: '78%', top: '48%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#FECACA] shadow-xs text-xs font-semibold text-[#0F172A] hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
                  >
                    <span className="w-5 h-5 rounded-lg bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[13px]">domain</span>
                    </span>
                    <span>Shell Company</span>
                  </div>

                  {/* Satellite Node 4: Location (Bottom-Right: 72%, 80%) */}
                  <div 
                    style={{ left: '72%', top: '80%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#FDE68A] shadow-xs text-xs font-semibold text-[#0F172A] hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
                  >
                    <span className="w-5 h-5 rounded-lg bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[13px]">location_on</span>
                    </span>
                    <span>Location</span>
                  </div>

                  {/* Satellite Node 5: Associate (Bottom-Left: 22%, 76%) */}
                  <div 
                    style={{ left: '22%', top: '76%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#DDD6FE] shadow-xs text-xs font-semibold text-[#0F172A] hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
                  >
                    <span className="w-5 h-5 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[13px]">group</span>
                    </span>
                    <span>Associate</span>
                  </div>

                  {/* Central Main Suspect Node (50%, 48%) */}
                  <div 
                    style={{ left: '50%', top: '48%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2563EB] to-[#4F46E5] p-1 shadow-lg shadow-blue-500/25 ring-8 ring-blue-50/80 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer">
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[30px]">person</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Bottom Detection Banner */}
                <div className="mt-2 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[18px]">hub</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#0F172A] truncate">
                        Network Pattern Detected
                      </span>
                      <span className="text-[11px] text-[#64748B] truncate">
                        High probability money trail
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA] font-mono text-xs font-bold flex-shrink-0">
                    87%
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES SECTION — 6 CARDS 3x2 GRID */}
      <section id="capabilities" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">
              OPERATIONAL CAPABILITIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mt-2">
              Built for Real-World Impact
            </h2>
            <p className="text-base text-[#64748B] mt-3 leading-relaxed">
              End-to-end intelligence infrastructure combining AI agents, graph analytics, and forensic tools to uncover hidden networks and ensure court-admissible evidence.
            </p>
          </div>

          {/* 6 Capabilities Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Knowledge Graph */}
            <div className="executive-card flex flex-col justify-between group cursor-pointer" onClick={onLaunchWorkspace}>
              <div>
                <div className="w-12 h-12 rounded-2xl icon-blue flex items-center justify-center mb-5 shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">hub</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  Interactive Knowledge Graph
                </h3>
                <p className="text-sm text-[#64748B] mt-2.5 leading-relaxed">
                  Model multi-tier syndicates, shell accounts and burner identities with advanced graph analytics.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-1 text-xs font-semibold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                <span>Explore Graph Analysis</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </div>
            </div>

            {/* Card 2: Autonomous Multi-Agent Swarm */}
            <div className="executive-card flex flex-col justify-between group cursor-pointer" onClick={onLaunchWorkspace}>
              <div>
                <div className="w-12 h-12 rounded-2xl icon-purple flex items-center justify-center mb-5 shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-[#8B5CF6] transition-colors">
                  Autonomous Multi-Agent Swarm
                </h3>
                <p className="text-sm text-[#64748B] mt-2.5 leading-relaxed">
                  LangGraph v2.4 agents for hypothesis generation, cross-validation and judicial reasoning.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-1 text-xs font-semibold text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform">
                <span>Meet the AI Agents</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </div>
            </div>

            {/* Card 3: Entity Resolution & Mule Detection */}
            <div className="executive-card flex flex-col justify-between group cursor-pointer" onClick={onLaunchWorkspace}>
              <div>
                <div className="w-12 h-12 rounded-2xl icon-yellow flex items-center justify-center mb-5 shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">fingerprint</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-[#F59E0B] transition-colors">
                  Entity Resolution & Mule Detection
                </h3>
                <p className="text-sm text-[#64748B] mt-2.5 leading-relaxed">
                  Disambiguate identities, detect synthetic entities and match records using fuzzy algorithms.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-1 text-xs font-semibold text-[#F59E0B] group-hover:translate-x-0.5 transition-transform">
                <span>See How It Works</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </div>
            </div>

            {/* Card 4: Hawala AML & Circular Smurfing */}
            <div className="executive-card flex flex-col justify-between group cursor-pointer" onClick={onLaunchWorkspace}>
              <div>
                <div className="w-12 h-12 rounded-2xl icon-red flex items-center justify-center mb-5 shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">sync</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-[#EF4444] transition-colors">
                  Hawala AML & Circular Smurfing
                </h3>
                <p className="text-sm text-[#64748B] mt-2.5 leading-relaxed">
                  Track layered transactions and detect circular money flows across institutions.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-1 text-xs font-semibold text-[#EF4444] group-hover:translate-x-0.5 transition-transform">
                <span>Explore AML Tools</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </div>
            </div>

            {/* Card 5: BSA §65B Cryptographic Vault */}
            <div className="executive-card flex flex-col justify-between group cursor-pointer" onClick={onLaunchWorkspace}>
              <div>
                <div className="w-12 h-12 rounded-2xl icon-blue flex items-center justify-center mb-5 shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">gavel</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  BSA §65B Cryptographic Vault
                </h3>
                <p className="text-sm text-[#64748B] mt-2.5 leading-relaxed">
                  Tamper-proof evidence storage with cryptographic attestation and audit trails.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-1 text-xs font-semibold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                <span>About the Vault</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </div>
            </div>

            {/* Card 6: CDR Telecom & Wiretap Intercept */}
            <div className="executive-card flex flex-col justify-between group cursor-pointer" onClick={onLaunchWorkspace}>
              <div>
                <div className="w-12 h-12 rounded-2xl icon-blue flex items-center justify-center mb-5 shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">sensors</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                  CDR Telecom & Wiretap Intercept
                </h3>
                <p className="text-sm text-[#64748B] mt-2.5 leading-relaxed">
                  Analyze call detail records, perform triangulation and detect communication patterns in real-time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center gap-1 text-xs font-semibold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                <span>View Telecom Module</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. RBAC SECTION — ROLE-BASED ACCESS CONTROL */}
      <section id="rbac" className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">
              SECURITY CLEARANCE ARCHITECTURE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F172A] mt-2">
              Role-Based Access Control (RBAC)
            </h2>
            <p className="text-base text-[#64748B] mt-3 leading-relaxed">
              Different access for different responsibilities. Enforcing security, ensuring accountability.
            </p>
          </div>

          {/* 4 RBAC Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Role 1: Lead Investigator */}
            <div className="executive-card bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#BFDBFE]">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                  <span className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">shield_person</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-mono text-[10px] font-bold border border-[#BFDBFE]">
                    TIER 1 TOP SECRET
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-[#0F172A] mt-4">
                  Lead Investigator
                </h4>
                <p className="text-xs text-[#64748B] font-medium">Rank: DSP / ACP / Superintendent</p>
                <ul className="mt-4 space-y-2 text-xs text-[#64748B]">
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Full Unmasked PII Access
                  </li>
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Entity Merge Authorization
                  </li>
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Sec 107 BNSS Freeze Orders
                  </li>
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> LangGraph Agent Inquiries
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickRoleSelect?.('LEAD_INVESTIGATOR')}
                className="mt-6 w-full py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Enter as Lead Investigator →
              </button>
            </div>

            {/* Role 2: Field Investigator */}
            <div className="executive-card bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#DDD6FE]">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                  <span className="w-8 h-8 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5F3FF] text-[#8B5CF6] font-mono text-[10px] font-bold border border-[#DDD6FE]">
                    TIER 2 CONFIDENTIAL
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-[#0F172A] mt-4">
                  Field Investigator
                </h4>
                <p className="text-xs text-[#64748B] font-medium">Rank: Inspector / Sub-Inspector</p>
                <ul className="mt-4 space-y-2 text-xs text-[#64748B]">
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Graph Traversal & Search
                  </li>
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> CDR & BTS Triangulation
                  </li>
                  <li className="flex items-center gap-2 text-[#F59E0B] font-medium">
                    <span className="material-symbols-outlined text-[15px]">warning</span> Masked Aadhaar / PAN (Last 4)
                  </li>
                  <li className="flex items-center gap-2 text-[#94A3B8]">
                    <span className="material-symbols-outlined text-[15px]">close</span> No Merge Authority
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickRoleSelect?.('INVESTIGATOR')}
                className="mt-6 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] shadow-2xs transition-all cursor-pointer"
              >
                Enter as Field Investigator →
              </button>
            </div>

            {/* Role 3: Intelligence Analyst */}
            <div className="executive-card bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#A7F3D0]">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                  <span className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] font-mono text-[10px] font-bold border border-[#A7F3D0]">
                    TIER 2 ANALYTICAL
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-[#0F172A] mt-4">
                  Intelligence Analyst
                </h4>
                <p className="text-xs text-[#64748B] font-medium">Rank: Technical Forensic Analyst</p>
                <ul className="mt-4 space-y-2 text-xs text-[#64748B]">
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Centrality & Topology Metrics
                  </li>
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Hawala Flow Modeling
                  </li>
                  <li className="flex items-center gap-2 text-[#64748B]">
                    <span className="material-symbols-outlined text-[15px]">lock</span> Full PII Masked (Blind Index)
                  </li>
                  <li className="flex items-center gap-2 text-[#94A3B8]">
                    <span className="material-symbols-outlined text-[15px]">close</span> No Merge / Freeze Rights
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickRoleSelect?.('ANALYST')}
                className="mt-6 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] shadow-2xs transition-all cursor-pointer"
              >
                Enter as Crime Analyst →
              </button>
            </div>

            {/* Role 4: Judicial Auditor */}
            <div className="executive-card bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#FDE68A]">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0]">
                  <span className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#F59E0B] font-mono text-[10px] font-bold border border-[#FDE68A]">
                    TIER 3 JUDICIAL
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-[#0F172A] mt-4">
                  Judicial Auditor
                </h4>
                <p className="text-xs text-[#64748B] font-medium">Rank: Court Evidence Commissioner</p>
                <ul className="mt-4 space-y-2 text-xs text-[#64748B]">
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Section 65B Audit Chain
                  </li>
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Cryptographic Hash Attestation
                  </li>
                  <li className="flex items-center gap-2 text-[#10B981] font-medium">
                    <span className="material-symbols-outlined text-[15px]">check</span> Court Dossier Generation
                  </li>
                  <li className="flex items-center gap-2 text-[#64748B]">
                    <span className="material-symbols-outlined text-[15px]">visibility</span> Read-Only Workspace
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onQuickRoleSelect?.('AUDITOR')}
                className="mt-6 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-xs font-semibold border border-[#E2E8F0] shadow-2xs transition-all cursor-pointer"
              >
                Enter as Judicial Auditor →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 5. DARK CTA SECTION WITH STYLIZED INDIA NETWORK MAP */}
      <section 
        className="relative py-24 bg-[#07111F] text-white overflow-hidden border-t border-slate-800"
      >
        {/* Background Stylized Map Graphic */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none flex items-center justify-end">
          <img 
            src="/india_network_dark_map.jpg" 
            alt="India Cyber Intelligence Network" 
            className="w-full h-full object-cover object-right lg:object-center"
          />
        </div>

        {/* Ambient Dark Navy Gradient Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111F] via-[#07111F]/90 to-transparent z-1 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: CTA Headline & Action Buttons */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="text-xs font-mono font-bold text-[#2563EB] tracking-wider uppercase bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60 mb-4">
                FOR A SAFER TOMORROW
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Turning Data into Justice
              </h2>
              <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                Empowering agencies with AI-driven intelligence for a more transparent and secure India.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onLaunchWorkspace}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <span>Launch Workspace</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>

                <button
                  onClick={() => onOpenAuth?.('login')}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-sm font-semibold border border-slate-700 shadow-xs transition-all cursor-pointer"
                >
                  <span>Talk to Our Team</span>
                </button>
              </div>
            </div>

            {/* Right Column: Key Agency Impact Metrics */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col">
                <span className="text-3xl sm:text-4xl font-bold font-display text-white">65B+</span>
                <span className="text-xs text-slate-400 mt-1">Records Processed</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col">
                <span className="text-3xl sm:text-4xl font-bold font-display text-white">120+</span>
                <span className="text-xs text-slate-400 mt-1">Agencies Connected</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col">
                <span className="text-3xl sm:text-4xl font-bold font-display text-white">99.9%</span>
                <span className="text-xs text-slate-400 mt-1">Uptime & Security</span>
              </div>
              <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-800/50 backdrop-blur-md flex flex-col">
                <span className="text-3xl sm:text-4xl font-bold font-display text-blue-400">Faster</span>
                <span className="text-xs text-slate-400 mt-1">Case Resolution</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer id="compliance" className="py-10 bg-white text-[#64748B] text-xs font-medium border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">shield</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#0F172A] text-sm">NEXXUS.INTEL</span>
              <span className="text-[11px] text-[#94A3B8]">Defense-Grade Crime Knowledge Graph</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#64748B]">
            <a href="#hero" className="hover:text-[#0F172A] transition-colors">Home</a>
            <a href="#capabilities" className="hover:text-[#0F172A] transition-colors">Capabilities</a>
            <a href="#rbac" className="hover:text-[#0F172A] transition-colors">Documentation</a>
            <button onClick={() => onOpenAuth?.('login')} className="hover:text-[#0F172A] transition-colors cursor-pointer">Contact</button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
            <span>Built for a safer India</span>
            <span>🇮🇳</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
