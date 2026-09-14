import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function EvidenceDrawer({
  selectedNode,
  onClose,
  onFocusNode,
  onTraceKingpin,
  onOpenFirDoc,
  onExpandSubgraph,
  onInvestigateNode,
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
  const scrollRef = React.useRef(null);

  // Reset scroll to top when selectedNode changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedNode]);

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

  // Keyboard shortcut (ESC) to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!selectedNode) return null;

  const connectedEdges = allEdges.filter(
    (e) => e.source === selectedNode.id || e.target === selectedNode.id
  );

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleExportDossier = () => {
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
    <aside className="w-[520px] max-w-[95vw] fixed top-14 bottom-0 right-0 z-50 bg-white shadow-2xl border-l border-slate-200 text-slate-900 flex flex-col overflow-hidden animate-fade-in">
      {/* Top Header Bar */}
      <div className="h-14 px-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-rose-600 text-[20px] animate-pulse">
            security
          </span>
          <div className="flex flex-col">
            <span className="font-display text-[12px] text-slate-900 font-bold uppercase tracking-wider leading-tight">
              TARGET DOSSIER // FORENSIC PROFILE
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Entity ID: <span className="font-bold text-sky-600">{selectedNode.id}</span>
            </span>
          </div>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
            FLAGGED TARGET
          </span>
        </div>

        {/* Prominent Close Button */}
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-all border border-slate-200 shadow-xs active:scale-95 cursor-pointer"
          title="Close Target Dossier (ESC)"
        >
          <span className="material-symbols-outlined text-[17px] text-slate-500">close</span>
          <span className="text-xs font-bold">Close</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono bg-white rounded border border-slate-300 text-slate-600 font-bold">ESC</kbd>
        </button>
      </div>

      {/* Scrollable Dossier Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar bg-slate-50/50">
        {/* Suspect Profile Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs relative flex flex-col flex-shrink-0 min-h-fit gap-3.5">
          <div className="flex items-start gap-3.5 relative z-10">
            {/* Biometric Portrait or Icon Box */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-2 ring-rose-500 shadow-xs flex-shrink-0 bg-slate-100 flex items-center justify-center">
              {portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt={`Mugshot of ${selectedNode.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-[36px] text-sky-600">
                  {selectedNode.type === 'Person' ? 'person' : selectedNode.type === 'Vehicle' ? 'directions_car' : 'apartment'}
                </span>
              )}
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
              <span className="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-center font-mono text-[10px] font-bold py-0.5 tracking-wider">
                RISK {selectedNode.risk_score || 0}
              </span>
            </div>

            {/* Suspect Details */}
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h3 className="font-display text-lg text-slate-900 font-bold truncate">
                  {selectedNode.name}
                </h3>
                <span className="px-2 py-0.5 rounded-lg bg-sky-50 border border-sky-200 font-mono text-[11px] text-sky-700 font-bold">
                  {selectedNode.id}
                </span>
              </div>

              {selectedNode.aliases && selectedNode.aliases.length > 0 && (
                <div className="flex items-center gap-1.5 text-slate-600 text-xs mt-0.5 flex-wrap">
                  <span className="text-slate-500 font-medium">Aliases:</span>
                  {selectedNode.aliases.map((alias, idx) => (
                    <span key={idx} className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-800 font-semibold font-mono text-[10px] border border-slate-200">
                      "{alias}"
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs mt-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-rose-700 font-semibold truncate">
                  {selectedNode.role || `${selectedNode.type} Entity`} • Cluster {selectedNode.cluster_id || 'A'}
                </span>
              </div>

              {selectedNode.phone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                  <span className="material-symbols-outlined text-[15px] text-sky-600">phone_iphone</span>
                  <span className="font-mono text-slate-900 font-bold select-all">{selectedNode.phone}</span>
                  <button 
                    onClick={() => handleCopy(selectedNode.phone, 'phone')}
                    className="material-symbols-outlined text-[14px] text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                    title="Copy Phone Number"
                  >
                    content_copy
                  </button>
                  {copiedField === 'phone' && (
                    <span className="text-[10px] text-emerald-600 font-bold">COPIED</span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono border border-slate-200">
                    Airtel WB
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Badges Strip */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {isCritical && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                CRITICAL THREAT
              </span>
            )}
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              BSA §65B CERTIFIED
            </span>
            {isHigh && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px] font-bold">
                <span className="material-symbols-outlined text-[13px]">warning</span>
                WATCHLIST MATCH
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 font-mono text-[10px] text-sky-700 font-bold">
              CYBER CRIME DIR
            </span>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => onTraceKingpin(selectedNode)}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">near_me</span>
              <span className="truncate">Trace to Kingpin</span>
            </button>
            <button
              onClick={handleTriggerSubgraph}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-sky-700 text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-sky-600">hub</span>
              <span className="truncate">Expand (Hop 2)</span>
            </button>
            <button
              onClick={handleExportDossier}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-amber-800 text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-600">picture_as_pdf</span>
              <span className="truncate">Court Dossier</span>
            </button>
          </div>

          {/* Autonomous Multi-Agent Investigation Trigger */}
          {onInvestigateNode && (
            <button
              onClick={() => onInvestigateNode(selectedNode)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer group"
              title="Launch autonomous 7-agent LangGraph supervisor investigation on this entity"
            >
              <span className="material-symbols-outlined text-[18px] text-sky-200 group-hover:rotate-12 transition-transform">
                smart_toy
              </span>
              <span>Launch Multi-Agent Investigation</span>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono uppercase tracking-wider">
                LIVE SWARM
              </span>
            </button>
          )}
        </div>

        {/* Sticky Tab Navigation Bar */}
        <div className="sticky top-0 z-20 bg-slate-100 p-1 rounded-xl flex items-center justify-between border border-slate-200 flex-shrink-0 shadow-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs transition-all text-center cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-sky-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'links'
                ? 'bg-white text-sky-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <span>Links</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[9px] font-bold">
              {connectedEdges.length || liveNeighbors.length || 3}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs transition-all text-center cursor-pointer ${
              activeTab === 'locations'
                ? 'bg-white text-sky-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Locations
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs transition-all text-center cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-white text-sky-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            BSA §65B
          </button>
        </div>

        {/* TAB 1: PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-3.5 flex-shrink-0 min-h-fit">
            {/* Algorithmic Threat Score Meter Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col flex-shrink-0 min-h-fit gap-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 text-xs font-mono uppercase font-semibold">
                  Algorithmic Threat Score
                </span>
                <span className="text-rose-600 font-mono font-bold text-lg">
                  {selectedNode.risk_score || 91} <span className="text-[12px] text-slate-400 font-normal">/ 100</span>
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                {/* Circular Score Gauge */}
                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                    />
                    <path
                      className="text-rose-500 stroke-current"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeDasharray={`${selectedNode.risk_score || 91}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-[13px] font-bold text-slate-900 font-mono">
                      {selectedNode.risk_score || 91}%
                    </span>
                  </div>
                </div>

                {/* Sub-Score Breakdown Bars */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-600 font-medium">Centrality Influence</span>
                      <span className="text-rose-600 font-bold">88%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full w-[88%]"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-600 font-medium">Cross-Case Links (FIR 101 & 103)</span>
                      <span className="text-rose-600 font-bold">94%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full w-[94%]"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-600 font-medium">Extortion Call Spikes</span>
                      <span className="text-amber-600 font-bold">92% (22/day)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[92%]"></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-600 font-medium">Financial Layering Anomalies</span>
                      <span className="text-purple-600 font-bold">82%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full w-[82%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Known Identifiers & Blind Index Table */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 text-xs font-mono uppercase font-semibold">
                  Known Identifiers & Unmasked PII
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold font-mono border border-sky-200">
                  LEAD ACCESS TIER
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] font-mono font-medium">FULL NAME</span>
                    <span className="text-slate-900 font-bold">{selectedNode.name}</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(selectedNode.name, 'name')}
                    className="material-symbols-outlined text-[15px] text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                  >
                    content_copy
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[10px] font-mono font-medium">AADHAAR / TAX BLIND INDEX</span>
                      <span className="px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-mono font-bold">
                        SHA-256 VALIDATED
                      </span>
                    </div>
                    <span className="text-slate-900 font-mono font-bold">4892-1204-5829</span>
                    <span className="text-[9px] text-slate-500 font-mono">Hash: a89fb73d...32de</span>
                  </div>
                  <button 
                    onClick={() => handleCopy('4892-1204-5829', 'aadhaar')}
                    className="material-symbols-outlined text-[15px] text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                  >
                    content_copy
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[10px] font-mono font-medium">PRIMARY SUSPECT MULE BANK</span>
                      <span className="px-1 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold">
                        LAYER 1 MULE
                      </span>
                    </div>
                    <span className="text-slate-900 font-mono font-bold">
                      {selectedNode.account || 'Kolkata Comm. Bank #30123456789'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-slate-500">account_balance</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[10px] font-mono font-medium">ESCORT VEHICLE PLATE</span>
                      <span className="px-1 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">
                        CLONED TAG ALERT
                      </span>
                    </div>
                    <span className="text-slate-900 font-mono font-bold">
                      {selectedNode.vehicle || 'WB01AB1234 (Toyota Fortuner)'}
                    </span>
                    <span className="text-[9px] text-rose-600 font-medium">Fastag Mismatch: Salt Lake Sector V Toll</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-amber-600">directions_car</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] font-mono font-medium">LAST KNOWN CELL TOWER</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-slate-900 font-bold">Salt Lake Sector V, Bidhannagar</span>
                    </div>
                    <span className="text-[9px] text-emerald-700 font-mono font-medium">Ping recorded 14m ago (BTS ID: #KOL-SL-04)</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-sky-600">cell_tower</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIRECT LINKS TAB */}
        {activeTab === 'links' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-slate-700 text-xs font-mono uppercase font-semibold">
              <span>Direct Intelligence Links</span>
              <span className="text-sky-700 font-bold">
                {connectedEdges.length || liveNeighbors.length || 3} Graph Connections
              </span>
            </div>

            {connectedEdges.map((edge) => {
              const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
              const isOutgoing = edge.source === selectedNode.id;
              return (
                <div 
                  key={edge.id || `${edge.source}-${edge.target}`}
                  className="p-3 rounded-xl bg-white border-l-4 border-l-sky-600 border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => handleInspectEvidence(otherId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sky-600 text-[16px]">
                        {isOutgoing ? 'call_made' : 'call_received'}
                      </span>
                      <span className="text-xs text-slate-900 font-bold">
                        {edge.target_name || otherId}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-mono font-bold">
                      {Math.round((edge.confidence || 0.95) * 100)}% Conf.
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                    <span className="text-sky-700 font-mono font-bold">Edge: {edge.type}</span>
                    <span className="font-semibold text-slate-800">{edge.amount ? `₹${(edge.amount).toLocaleString('en-IN')}` : edge.calls ? `${edge.calls} Calls` : 'Verified Link'}</span>
                  </div>
                  {edge.details && (
                    <p className="text-slate-600 text-[11px] leading-tight mt-1">
                      {edge.details}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Selected edge evidence inspection popup */}
            {selectedEdgeEvidence && (
              <div className="p-3 rounded-xl bg-white border border-sky-300 mt-2 flex flex-col gap-1.5 animate-fade-in shadow-md">
                <div className="flex items-center justify-between text-xs font-mono text-sky-700 font-bold">
                  <span>FORENSIC PROVENANCE EVIDENCE</span>
                  <button onClick={() => setSelectedEdgeEvidence(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
                </div>
                <p className="text-[11px] text-slate-700">
                  Source: {selectedEdgeEvidence.source_doc || 'CDR Telemetry / Bank Ingestion'}
                </p>
                <div className="font-mono text-[9px] text-slate-600 truncate select-all bg-slate-50 p-1.5 rounded border border-slate-200">
                  Hash: {selectedEdgeEvidence.sha256 || '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LOCATIONS TAB */}
        {activeTab === 'locations' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-slate-700 text-xs font-mono uppercase font-semibold">
              <span>Cell Towers & Co-Locations</span>
              <span className="text-emerald-700 font-bold">GPS Triangulated</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-600 text-[18px]">cell_tower</span>
                  <span className="text-xs text-slate-900 font-bold">Sector V Bidhannagar</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px] font-semibold">#KOL-SL-04</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Primary extortion coordination tower. 18 outgoing calls logged within 2 hours.
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100 pt-1">
                <span>Lat: 22.5804° N, Lon: 88.4378° E</span>
                <span className="text-emerald-700 font-bold">Signal: Strong (Airtel)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-[18px]">store</span>
                  <span className="text-xs text-slate-900 font-bold">Salt Lake Tea Stall</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px] font-bold">CO-LOCATED</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Physical meeting site shared with Sunita Das and Debasish Chatterjee.
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100 pt-1">
                <span>Observed: 2026-03-10 18:45 IST</span>
                <span className="text-amber-700 font-bold">Informant Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BSA §65B EVIDENCE TAB */}
        {activeTab === 'evidence' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-slate-700 text-xs font-mono uppercase font-semibold">
              <span>Court-Admissible Dossier Items</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                BSA §65B
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-rose-600 text-[16px]">gavel</span>
                  <span className="text-xs text-slate-900 font-bold">FIR 101/24</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-mono font-bold">
                  Sec 384/386/120B BNS
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Suspect demanded ₹50 Lakh extortion via VOIP call spoofing victim's family. Location matched CDR tower #KOL-SL-04.
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100 pt-1.5">
                <span>IO: Sub-Insp. B. Banerjee</span>
                <span>Bidhannagar Cyber PS</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[9px] text-sky-700 truncate select-all flex items-center justify-between">
                <span>sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
                <button 
                  onClick={() => handleCopy('7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069', 'fir101')}
                  className="material-symbols-outlined text-[13px] text-slate-400 hover:text-sky-600 transition-colors ml-1 cursor-pointer"
                >
                  content_copy
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sky-600 text-[16px]">shield_alert</span>
                  <span className="text-xs text-slate-900 font-bold">FIR 103/24</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-mono font-bold">
                  Sec 419/420/66D IT Act
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Operation of fake loan app recovery cell extorting citizens using morphed media contacts.
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100 pt-1.5">
                <span>Kolkata Cyber Crime PS</span>
                <span className="text-emerald-700 font-bold">Hash Certified</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[9px] text-slate-600 truncate select-all">
                sha256:3a1e948c267bca90432f8910e19ac9001b...d431
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2 flex-shrink-0 shadow-xs">
        <button 
          onClick={onClose}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-xs border border-slate-200 cursor-pointer"
          title="Close Drawer (ESC)"
        >
          <span className="material-symbols-outlined text-[17px]">close</span>
          <span>Close</span>
        </button>
        <button 
          onClick={() => alert(`Real-time CDR interception request broadcasted to Telco BTS for [${selectedNode.name}].`)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[17px]">cell_tower</span>
          <span>Live CDR Intercept</span>
        </button>
        <button 
          onClick={handleExportDossier}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-amber-800 font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-amber-600 text-[17px]">description</span>
          <span>Charge Sheet</span>
        </button>
      </div>
    </aside>
  );
}
