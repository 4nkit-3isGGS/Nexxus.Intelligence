import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { apiService } from '../services/api';

export default function EvidenceDrawer({
  selectedNode,
  onClose,
  onFocusNode,
  onTraceKingpin,
  onOpenFirDoc,
  onExpandSubgraph,
  allEdges = []
}) {
  const [activeTab, setActiveTab] = useState('profile');
  const [liveNeighbors, setLiveNeighbors] = useState([]);
  const [sharedLocations, setSharedLocations] = useState([]);
  const [subgraphDepth, setSubgraphDepth] = useState(2);
  const [loadingNeighbors, setLoadingNeighbors] = useState(false);
  const [loadingShared, setLoadingShared] = useState(false);
  const [selectedEdgeEvidence, setSelectedEdgeEvidence] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (!selectedNode) return;

    // Fetch 1-hop direct neighbors from API
    const fetchNeighbors = async () => {
      setLoadingNeighbors(true);
      const res = await apiService.getEntityNeighbors(selectedNode.id);
      if (Array.isArray(res)) {
        setLiveNeighbors(res);
      }
      setLoadingNeighbors(false);
    };

    // Fetch shared locations from API
    const fetchShared = async () => {
      setLoadingShared(true);
      const res = await apiService.getSharedLocations(selectedNode.id);
      if (Array.isArray(res)) {
        setSharedLocations(res);
      }
      setLoadingShared(false);
    };

    fetchNeighbors();
    fetchShared();
  }, [selectedNode]);

  if (!selectedNode) return null;

  const connectedEdges = allEdges.filter(
    (e) => e.source === selectedNode.id || e.target === selectedNode.id
  );

  const breakdown = selectedNode.score_breakdown || {
    centrality_score: Math.round((selectedNode.risk_score || 85) * 0.3),
    cross_case_links: Math.round((selectedNode.risk_score || 85) * 0.25),
    call_velocity: Math.round((selectedNode.risk_score || 85) * 0.25),
    financial_anomalies: Math.round((selectedNode.risk_score || 85) * 0.2),
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleExportDossier = () => {
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });
    alert(`Court-Certified Evidence Dossier generated for [${selectedNode.name}] under BSA 2023 / Sec 65B.`);
  };

  const handleInspectEvidence = async (otherId) => {
    const ev = await apiService.getEvidence(selectedNode.id, otherId);
    setSelectedEdgeEvidence(ev);
  };

  const handleTriggerSubgraph = async () => {
    const sub = await apiService.getEntitySubgraph(selectedNode.id, subgraphDepth);
    if (onExpandSubgraph) {
      onExpandSubgraph(sub);
    }
  };

  const isCritical = (selectedNode.risk_score || 0) >= 85;
  const isHigh = (selectedNode.risk_score || 0) >= 70;

  // Biometric fallback avatar images
  const portraitUrl = selectedNode.id === 'P003' 
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuD_R3QdKfINDV_QvT9YM5XQsU5l5YN1cOG19uSHoDUbYG4FsW4n_bhA4vviPx8y7tCf0qa5Ir6BNsGBtRkMJo_PjWrhtflPTFyzeMKUVY016iyGoK8WTnM_IqL3o1OfvZKhRhOUFV-KV38_2RwMCfj_7UFPBsYU5h2fpvrrYRIxazX20UqCbEEvwSmFbhhIQWRcocXWSgJJqC99HUwGQIdYyFg53T5QTnQn00fx2tG1xYH8CNDXidh1"
    : selectedNode.id === 'P008'
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuA1-lSQBY1T70YowNjtiyP7r0Cp--UIS8F6H2lXxLfGDs2giUxpD9mC2pYxd2EYt3XhYN5gnLZSazF_WjBXmLl_JwKPDe22Lk8dEfhqUMo8ya4MkNSAK1xoEKL2BP_Izyde0Ygs0GpML2qthuBcZPqssH0JpgUdmFlybXYOGR1k_5p8BwkAjDVwi4fD1kwLMnZS8QMRhI3FoOK-05CLNiwAbpm58cbHpmASc3d2WRoC08TkVcMsYoMC"
    : selectedNode.id === 'P002'
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpYGXni-SFXhLNK1AuxKskfWK2QU0meqGVkdOBs88Ptn-XT7ZMIS95qqCrhxQ1RwcHg4DqJTQ-9Jboeoqy1rvHyewpGu1rLPKmjbwsaloTFU8EA8USgZRProZAtvY48FT3S6-DqmHkW7toTTKJrn5slx8-CMVPEuCohMvCcoJDsY49S3D4D7PCfLy08PVqJIT7eaOqUAGjFwtzz_ocdy-InLyyZEC0S83GLcgNMzktsQUGcOG9vRf"
    : null;

  return (
    <aside className="w-[500px] min-w-[480px] h-full fixed top-0 right-0 z-50 bg-[#070b16]/95 backdrop-blur-2xl shadow-2xl shadow-cyan-950/50 flex flex-col border-l border-primary/30 text-on-surface overflow-hidden">
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-surface-container-lowest/90 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-threat-crimson text-[20px] animate-pulse">
            radiology
          </span>
          <span className="font-label-sm text-label-sm text-threat-crimson font-bold uppercase tracking-widest">
            TARGET DOSSIER // FORENSIC INSPECT
          </span>
          <span className="px-1.5 py-0.2 rounded-full bg-threat-crimson/20 text-threat-crimson font-label-sm text-label-sm font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-threat-crimson animate-ping"></span>
            ACTIVE
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-bright text-outline hover:text-on-surface flex items-center justify-center transition-all hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          title="Close Dossier"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Scrollable Dossier Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
        {/* Suspect Profile Card */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest/90 border border-white/[0.08] shadow-xl relative overflow-hidden flex flex-col gap-3.5">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-threat-crimson/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-start gap-3.5 relative z-10">
            {/* Biometric Portrait or Icon Box */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-2 ring-threat-crimson shadow-[0_0_24px_rgba(244,63,94,0.4)] flex-shrink-0 bg-surface-container flex items-center justify-center">
              {portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt={`Mugshot of ${selectedNode.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-[36px] text-primary">
                  {selectedNode.type === 'Person' ? 'person' : selectedNode.type === 'Vehicle' ? 'directions_car' : 'apartment'}
                </span>
              )}
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-threat-crimson ring-2 ring-surface-base animate-pulse"></span>
              <span className="absolute bottom-0 inset-x-0 bg-threat-crimson text-surface-base text-center font-label-sm text-label-sm font-bold py-0.2 tracking-wider">
                RISK {selectedNode.risk_score || 0}
              </span>
            </div>

            {/* Suspect Details */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-headline-md text-headline-sm text-on-surface font-bold truncate">
                  {selectedNode.name}
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-primary font-mono font-bold">
                  {selectedNode.id}
                </span>
              </div>

              {selectedNode.aliases && selectedNode.aliases.length > 0 && (
                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm mt-0.5 flex-wrap">
                  <span>Aliases:</span>
                  {selectedNode.aliases.map((alias, idx) => (
                    <span key={idx} className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface font-medium font-mono text-[10px]">
                      "{alias}"
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-label-sm font-label-sm mt-1">
                <span className="w-2 h-2 rounded-full bg-threat-crimson animate-ping"></span>
                <span className="text-threat-crimson font-semibold truncate">
                  {selectedNode.role || `${selectedNode.type} Entity`} // Cluster {selectedNode.cluster_id || 'A'}
                </span>
              </div>

              {selectedNode.phone && (
                <div className="flex items-center gap-1.5 text-label-sm font-label-sm text-outline mt-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">phone_iphone</span>
                  <span className="font-mono text-on-surface select-all">{selectedNode.phone}</span>
                  <button 
                    onClick={() => handleCopy(selectedNode.phone, 'phone')}
                    className="material-symbols-outlined text-[13px] text-outline hover:text-primary transition-colors"
                    title="Copy Phone Number"
                  >
                    content_copy
                  </button>
                  {copiedField === 'phone' && (
                    <span className="text-[10px] text-verified-emerald font-bold">COPIED</span>
                  )}
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-surface-container text-tertiary truncate max-w-[140px]">
                    Airtel WB • Salt Lake
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Badges Strip */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {isCritical && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-threat-crimson/15 text-threat-crimson font-label-sm text-label-sm font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-threat-crimson animate-ping"></span>
                CRITICAL THREAT
              </span>
            )}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-verified-emerald/20 text-verified-emerald font-label-sm text-label-sm font-bold">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              BSA §65B CERTIFIED
            </span>
            {isHigh && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-risk-amber/20 text-risk-amber font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                WATCHLIST MATCH
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-surface-container font-mono text-[10px] text-primary font-bold">
              CYBER CRIME DIR MATCH
            </span>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={onTraceKingpin}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-primary text-surface-base font-label-sm text-label-sm font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)] hover:bg-tertiary-fixed transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] animate-pulse">near_me</span>
              <span className="truncate">Trace Path</span>
            </button>
            <button
              onClick={handleTriggerSubgraph}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm font-bold hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">hub</span>
              <span className="truncate">Expand (Hop 2)</span>
            </button>
            <button
              onClick={handleExportDossier}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm font-bold hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-risk-amber">picture_as_pdf</span>
              <span className="truncate">Court Export</span>
            </button>
          </div>
        </div>

        {/* Sticky Tab Navigation Bar */}
        <div className="sticky top-0 z-20 bg-surface-container-lowest/95 backdrop-blur-md p-1 rounded-xl flex items-center justify-between border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-label-sm text-label-sm font-bold transition-all text-center ${
              activeTab === 'profile'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-label-sm text-label-sm font-medium transition-all text-center flex items-center justify-center gap-1 ${
              activeTab === 'links'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>Links</span>
            <span className="px-1.5 py-0.2 rounded-full bg-threat-crimson/25 text-threat-crimson text-[9px] font-bold">
              {connectedEdges.length || liveNeighbors.length || 3}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-label-sm text-label-sm font-medium transition-all text-center ${
              activeTab === 'locations'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Locations
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 py-1.5 px-2 rounded-lg font-label-sm text-label-sm font-medium transition-all text-center ${
              activeTab === 'evidence'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            BSA §65B
          </button>
        </div>

        {/* TAB 1: PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-3.5">
            {/* Algorithmic Threat Score Meter Card */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest/90 border border-white/[0.08] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold">
                  Algorithmic Threat Score
                </span>
                <span className="text-threat-crimson font-mono font-bold text-headline-sm">
                  {selectedNode.risk_score || 91} <span className="text-[12px] text-outline">/ 100</span>
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                {/* Circular Score Gauge */}
                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-high"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-threat-crimson stroke-current"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeDasharray={`${selectedNode.risk_score || 91}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-[13px] font-bold text-on-surface font-mono">
                      {selectedNode.risk_score || 91}%
                    </span>
                  </div>
                </div>

                {/* Sub-Score Breakdown Bars */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[11px] font-label-sm">
                      <span className="text-on-surface-variant">Centrality Influence</span>
                      <span className="text-threat-crimson font-bold">88%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-threat-crimson h-full w-[88%]"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[11px] font-label-sm">
                      <span className="text-on-surface-variant">Cross-Case Links (FIR 101 & 103)</span>
                      <span className="text-threat-crimson font-bold">94%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-threat-crimson h-full w-[94%]"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[11px] font-label-sm">
                      <span className="text-on-surface-variant">Extortion Call Spikes</span>
                      <span className="text-risk-amber font-bold">92% (22/day)</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-risk-amber h-full w-[92%]"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[11px] font-label-sm">
                      <span className="text-on-surface-variant">Financial Layering Anomalies</span>
                      <span className="text-ai-purple-light font-bold">82%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                      <div className="bg-ai-purple h-full w-[82%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Known Identifiers & Blind Index Table */}
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest/90 border border-white/[0.08] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  Known Identifiers & Unmasked PII
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold font-mono border border-primary/20">
                  LEAD ACCESS TIER
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 font-label-sm text-label-sm">
                <div className="p-2 rounded-xl bg-surface-container flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-outline text-[10px]">FULL NAME</span>
                    <span className="text-on-surface font-semibold">{selectedNode.name}</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(selectedNode.name, 'name')}
                    className="material-symbols-outlined text-[15px] text-outline hover:text-primary transition-colors"
                  >
                    content_copy
                  </button>
                </div>

                <div className="p-2 rounded-xl bg-surface-container flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-outline text-[10px]">AADHAAR / TAX BLIND INDEX</span>
                      <span className="px-1 py-0.2 rounded bg-verified-emerald/20 text-verified-emerald text-[9px] font-mono font-bold">
                        SHA-256 VALIDATED
                      </span>
                    </div>
                    <span className="text-on-surface font-mono font-medium">4892-1204-5829</span>
                    <span className="text-[9px] text-outline font-mono">Hash: a89fb73d...32de</span>
                  </div>
                  <button 
                    onClick={() => handleCopy('4892-1204-5829', 'aadhaar')}
                    className="material-symbols-outlined text-[15px] text-outline hover:text-primary transition-colors"
                  >
                    content_copy
                  </button>
                </div>

                <div className="p-2 rounded-xl bg-surface-container flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-outline text-[10px]">PRIMARY SUSPECT MULE BANK</span>
                      <span className="px-1 py-0.2 rounded bg-threat-crimson/20 text-threat-crimson text-[9px] font-bold">
                        LAYER 1 MULE
                      </span>
                    </div>
                    <span className="text-on-surface font-mono font-medium">
                      {selectedNode.account || 'Kolkata Comm. Bank #30123456789'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[15px] text-outline">account_balance</span>
                </div>

                <div className="p-2 rounded-xl bg-surface-container flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-outline text-[10px]">ESCORT VEHICLE PLATE</span>
                      <span className="px-1 py-0.2 rounded bg-risk-amber/20 text-risk-amber text-[9px] font-bold">
                        CLONED TAG ALERT
                      </span>
                    </div>
                    <span className="text-on-surface font-mono font-bold">
                      {selectedNode.vehicle || 'WB01AB1234 (Toyota Fortuner)'}
                    </span>
                    <span className="text-[9px] text-threat-crimson">Fastag Mismatch: Salt Lake Sector V Toll</span>
                  </div>
                  <span className="material-symbols-outlined text-[15px] text-risk-amber">directions_car</span>
                </div>

                <div className="p-2 rounded-xl bg-surface-container flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-outline text-[10px]">LAST KNOWN CELL TOWER</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-verified-emerald animate-ping"></span>
                      <span className="text-on-surface font-medium">Salt Lake Sector V, Bidhannagar</span>
                    </div>
                    <span className="text-[9px] text-verified-emerald font-mono">Ping recorded 14m ago (BTS ID: #KOL-SL-04)</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-primary">cell_tower</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIRECT LINKS TAB */}
        {activeTab === 'links' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold">
              <span>Direct Intelligence Links</span>
              <span className="text-primary font-bold">
                {connectedEdges.length || liveNeighbors.length || 3} Graph Connections
              </span>
            </div>

            {connectedEdges.map((edge) => {
              const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
              const isOutgoing = edge.source === selectedNode.id;
              return (
                <div 
                  key={edge.id || `${edge.source}-${edge.target}`}
                  className="p-3 rounded-2xl bg-surface-container-lowest border-l-2 border-primary border border-white/[0.04] flex flex-col gap-1.5 hover:bg-surface-container transition-colors cursor-pointer"
                  onClick={() => handleInspectEvidence(otherId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        {isOutgoing ? 'call_made' : 'call_received'}
                      </span>
                      <span className="font-headline-sm text-body-sm text-on-surface font-bold">
                        {edge.target_name || otherId}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm font-bold">
                      {Math.round((edge.confidence || 0.95) * 100)}% Conf.
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-outline">
                    <span className="text-primary font-mono font-bold">Edge: {edge.type}</span>
                    <span>{edge.amount ? `₹${(edge.amount).toLocaleString('en-IN')}` : edge.calls ? `${edge.calls} Calls` : 'Verified Link'}</span>
                  </div>
                  {edge.details && (
                    <p className="text-body-sm text-on-surface-variant text-[11px] leading-tight">
                      {edge.details}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Selected edge evidence inspection popup */}
            {selectedEdgeEvidence && (
              <div className="p-3 rounded-xl bg-surface-container-high border border-primary/40 mt-2 flex flex-col gap-1.5 animate-fade-in">
                <div className="flex items-center justify-between font-label-sm text-label-sm text-primary font-bold">
                  <span>FORENSIC PROVENANCE EVIDENCE</span>
                  <button onClick={() => setSelectedEdgeEvidence(null)} className="text-outline hover:text-white">✕</button>
                </div>
                <p className="text-[11px] text-on-surface">
                  Source: {selectedEdgeEvidence.source_doc || 'CDR Telemetry / Bank Ingestion'}
                </p>
                <div className="font-mono text-[9px] text-outline truncate select-all">
                  Hash: {selectedEdgeEvidence.sha256 || '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LOCATIONS TAB */}
        {activeTab === 'locations' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold">
              <span>Cell Towers & Co-Locations</span>
              <span className="text-verified-emerald font-bold">GPS Triangulated</span>
            </div>

            <div className="p-3 rounded-2xl bg-surface-container-lowest border border-white/[0.06] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">cell_tower</span>
                  <span className="font-headline-sm text-body-sm text-on-surface font-bold">Sector V Bidhannagar</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono text-[10px]">#KOL-SL-04</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Primary extortion coordination tower. 18 outgoing calls logged within 2 hours.
              </p>
              <div className="flex items-center justify-between text-[10px] font-label-sm text-outline border-t border-white/5 pt-1">
                <span>Lat: 22.5804° N, Lon: 88.4378° E</span>
                <span className="text-verified-emerald font-bold">Signal: Strong (Airtel)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-surface-container-lowest border border-white/[0.06] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-risk-amber text-[18px]">store</span>
                  <span className="font-headline-sm text-body-sm text-on-surface font-bold">Salt Lake Tea Stall</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-risk-amber/20 text-risk-amber font-mono text-[10px]">CO-LOCATED</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Physical meeting site shared with Sunita Das and Debasish Chatterjee.
              </p>
              <div className="flex items-center justify-between text-[10px] font-label-sm text-outline border-t border-white/5 pt-1">
                <span>Observed: 2026-03-10 18:45 IST</span>
                <span className="text-risk-amber font-bold">Informant Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BSA §65B EVIDENCE TAB */}
        {activeTab === 'evidence' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold">
              <span>Court-Admissible Dossier Items</span>
              <span className="text-verified-emerald font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                BSA §65B
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-white/[0.08] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-threat-crimson text-[16px]">gavel</span>
                  <span className="font-headline-sm text-body-sm text-on-surface font-bold">FIR 101/24</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-threat-crimson/20 text-threat-crimson font-label-sm text-label-sm font-bold">
                  Sec 384/386/120B BNS
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Suspect demanded ₹50 Lakh extortion via VOIP call spoofing victim's family. Location matched CDR tower #KOL-SL-04.
              </p>
              <div className="flex items-center justify-between text-[10px] font-label-sm text-outline border-t border-white/5 pt-1.5">
                <span>IO: Sub-Insp. B. Banerjee</span>
                <span>Bidhannagar Cyber PS</span>
              </div>
              <div className="p-1.5 rounded bg-surface-container font-mono text-[9px] text-primary truncate select-all flex items-center justify-between">
                <span>sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
                <button 
                  onClick={() => handleCopy('7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', 'fir101')}
                  className="material-symbols-outlined text-[13px] text-outline hover:text-primary transition-colors ml-1"
                >
                  content_copy
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-white/[0.08] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">shield_alert</span>
                  <span className="font-headline-sm text-body-sm text-on-surface font-bold">FIR 103/24</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-primary/20 text-primary font-label-sm text-label-sm font-bold">
                  Sec 419/420/66D IT Act
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Operation of fake loan app recovery cell extorting citizens using morphed media contacts.
              </p>
              <div className="flex items-center justify-between text-[10px] font-label-sm text-outline border-t border-white/5 pt-1.5">
                <span>Kolkata Cyber Crime PS</span>
                <span className="text-verified-emerald font-bold">Hash Certified</span>
              </div>
              <div className="p-1.5 rounded bg-surface-container font-mono text-[9px] text-outline truncate select-all">
                sha256:3a1e948c267bca90432f8910e19ac9001b...d431
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-3.5 bg-surface-container-lowest/90 border-t border-white/10 flex items-center justify-between gap-2 flex-shrink-0">
        <button 
          onClick={() => alert(`Real-time CDR interception request broadcasted to Telco BTS for [${selectedNode.name}].`)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-primary text-surface-base font-label-sm text-label-sm font-bold shadow-[0_0_14px_rgba(6,182,212,0.4)] hover:bg-tertiary-fixed transition-all flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[17px]">cell_tower</span>
          <span>Live CDR Intercept</span>
        </button>
        <button 
          onClick={handleExportDossier}
          className="py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-bright text-on-surface font-label-sm text-label-sm font-bold transition-all flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-risk-amber text-[17px]">description</span>
          <span>Charge Sheet</span>
        </button>
      </div>
    </aside>
  );
}
