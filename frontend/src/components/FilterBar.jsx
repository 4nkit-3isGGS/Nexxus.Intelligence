import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  riskThreshold,
  setRiskThreshold,
  selectedTypes,
  toggleType,
  selectedCluster,
  setSelectedCluster,
  timelineDate,
  setTimelineDate,
  timelinePlaying,
  setTimelinePlaying,
  nodeCountsByType,
  resetFilters,
  onSelectNode
}) {
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showHighRisk, setShowHighRisk] = useState(false);
  const [highRiskEntities, setHighRiskEntities] = useState([]);
  const [liveSuggestions, setLiveSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const highRiskContainerRef = useRef(null);

  const clusters = [
    { id: 'ALL', label: 'All Entities' },
    { id: 'bridge', label: '👑 Kingpin Bridge' },
    { id: 'cluster_a', label: '⚡ Extortion Cell' },
    { id: 'cluster_b', label: '💸 Laundering Cell' },
    { id: 'victim', label: '🛡️ Complainant' },
  ];

  const entityTypeOptions = [
    { id: 'Person', label: 'Suspects', icon: 'person' },
    { id: 'Phone', label: 'Burner SIMs', icon: 'perm_phone_msg' },
    { id: 'Organization', label: 'Shell Orgs', icon: 'domain' },
    { id: 'Account', label: 'Mule Accounts', icon: 'credit_card' },
    { id: 'Vehicle', label: 'Cloned Vehicles', icon: 'directions_car' },
  ];

  const timelineDates = [
    { day: '01', date: '2026-03-01', event: 'Initial Calls (Rajesh ↔ Bimal)' },
    { day: '05', date: '2026-03-05', event: '🚨 22-Call Extortion Spike & ₹45k duress' },
    { day: '10', date: '2026-03-10', event: 'Tea Stall Meeting (Debasish ↔ Sunita)' },
    { day: '12', date: '2026-03-12', event: 'FIR 101 Lodged (Bidhannagar PS)' },
    { day: '18', date: '2026-03-18', event: 'FIR 102 Lodged (Howrah PS)' },
    { day: '20', date: '2026-03-20', event: '₹500k Circular Loop (Hop 1 & 2)' },
    { day: '21', date: '2026-03-21', event: '₹490k Loop Closes (Hop 3)' },
    { day: '24', date: '2026-03-24', event: 'FIR 103 Lodged (AML Bank Alert)' },
  ];

  // Fetch top high-risk suspects via GET /api/graph/high-risk
  useEffect(() => {
    const fetchHighRisk = async () => {
      try {
        const res = await apiService.getHighRiskEntities(6);
        if (res?.data && Array.isArray(res.data)) {
          setHighRiskEntities(res.data);
        } else {
          setHighRiskEntities([
            { id: 'P008', name: 'Debasish Chatterjee', risk_score: 96, role: 'Syndicate Leader' },
            { id: 'P003', name: 'Rajesh Kumar Sharma', risk_score: 91, role: 'Extortion Ops Head' },
            { id: 'P002', name: 'Ashok Mehta', risk_score: 84, role: 'Hawala Broker' },
            { id: 'O001', name: 'Shubh Laxmi Finance', risk_score: 88, role: 'Shell Corp NBFC' },
            { id: 'V001', name: 'WB01AB1234', risk_score: 85, role: 'Cloned Vehicle' },
            { id: 'A001', name: 'Kolkata Comm Bank #3012', risk_score: 82, role: 'Mule Layer 1' },
          ]);
        }
      } catch {
        setHighRiskEntities([]);
      }
    };
    fetchHighRisk();
  }, []);

  // Omnisearch live search with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setLiveSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await apiService.searchEntities(searchQuery.trim());
        if (res?.data && Array.isArray(res.data)) {
          setLiveSuggestions(res.data.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch {
        setLiveSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (highRiskContainerRef.current && !highRiskContainerRef.current.contains(e.target)) {
        setShowHighRisk(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Timeline playback loop
  useEffect(() => {
    let interval = null;
    if (timelinePlaying) {
      interval = setInterval(() => {
        setTimelineDate((prev) => {
          const currentIndex = timelineDates.findIndex((d) => d.date === prev);
          if (currentIndex === -1 || currentIndex === timelineDates.length - 1) {
            return timelineDates[0].date;
          }
          return timelineDates[currentIndex + 1].date;
        });
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [timelinePlaying, timelineDates, setTimelineDate]);

  return (
    <section className="relative z-30 w-full px-4 py-2 bg-surface-secondary/85 backdrop-blur-xl shadow-lg flex flex-col gap-1.5 border-b border-white/[0.06] flex-shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Glassmorphic Omnisearch with Dynamic Suggestion Dropdown */}
        <div className="relative flex-1 min-w-[200px] max-w-sm xl:max-w-md" ref={searchContainerRef}>
          <div className="flex items-center px-3 py-1.5 rounded-xl bg-surface-container-lowest/90 border border-white/[0.06] shadow-inner focus-within:shadow-[0_0_16px_rgba(6,182,212,0.3)] focus-within:border-primary/40 transition-all">
            <span className="material-symbols-outlined text-primary text-[18px] mr-2">travel_explore</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => liveSuggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search suspects, burner phones, shell accounts..."
              className="w-full bg-transparent text-on-surface placeholder:text-outline text-xs focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-outline hover:text-on-surface text-xs mr-2 transition-colors"
              >
                ✕
              </button>
            )}
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded bg-surface-container font-mono text-[10px] text-outline-variant">
              ⌘K
            </span>
          </div>

          {/* Active Omnisearch Live Match Dropdown */}
          {showSuggestions && liveSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 p-2 rounded-xl bg-surface-container-low shadow-2xl backdrop-blur-2xl border border-white/[0.08] z-50 flex flex-col gap-1">
              <div className="flex items-center justify-between px-2.5 py-1 text-on-surface-variant font-mono text-[10px] uppercase">
                <span>Verified Matches (Neo4j Cluster 088)</span>
                <span className="text-verified-emerald font-bold">{liveSuggestions.length} Indexed Hits</span>
              </div>
              {liveSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectNode?.(item);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer transition-colors group/item"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-threat-crimson/20 flex items-center justify-center text-threat-crimson flex-shrink-0">
                      <span className="material-symbols-outlined text-[16px]">
                        {item.type === 'Person' ? 'person_alert' : item.type === 'Vehicle' ? 'directions_car' : 'dataset'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-on-surface font-bold group-hover/item:text-primary truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-risk-amber font-mono">[{item.id}]</span>
                        {item.risk_score >= 85 && (
                          <span className="px-1 rounded bg-threat-crimson/25 text-threat-crimson text-[9px] font-mono font-bold">
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-on-surface-variant truncate">
                        {item.role || item.type} • Risk {item.risk_score || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-threat-crimson/20 text-threat-crimson px-1.5 py-0.2 rounded-full font-bold ml-2 shrink-0">
                    RISK {item.risk_score || 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Tactical Controls Group */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Top Threats Dropdown Pill with Pulsing Flame */}
          <div className="relative" ref={highRiskContainerRef}>
            <button
              onClick={() => setShowHighRisk(!showHighRisk)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-threat-crimson/15 text-threat-crimson text-xs font-bold shadow-[0_0_12px_rgba(244,63,94,0.25)] hover:bg-threat-crimson/25 transition-all border border-threat-crimson/30"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-threat-crimson opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-threat-crimson"></span>
              </span>
              <span className="flex items-center gap-1">
                <span>Top Threats</span>
                <span className="px-1.5 py-0.2 rounded bg-threat-crimson text-surface-base font-mono text-[10px]">
                  {highRiskEntities.length || 6}
                </span>
              </span>
              <span className="material-symbols-outlined text-[15px]">expand_more</span>
            </button>

            {showHighRisk && (
              <div className="absolute right-0 top-full mt-1.5 w-72 p-2 rounded-xl bg-surface-container-low shadow-2xl backdrop-blur-xl border border-white/[0.08] z-50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant border-b border-white/[0.04] pb-1">
                  <span className="font-semibold uppercase tracking-wider">PRIORITY INTERCEPTION</span>
                  <span className="text-threat-crimson font-bold">SORTED SCORE</span>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  {highRiskEntities.map((suspect, idx) => (
                    <div
                      key={suspect.id || idx}
                      onClick={() => {
                        onSelectNode?.(suspect);
                        setShowHighRisk(false);
                      }}
                      className="flex items-center justify-between px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-outline-variant font-mono text-[10px]">{idx + 1}.</span>
                        <span className="text-on-surface font-semibold truncate text-xs">{suspect.name}</span>
                      </div>
                      <span className="font-bold text-threat-crimson font-mono text-xs ml-2 shrink-0">
                        {suspect.risk_score} PTS
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Risk Threshold Segmented Filter */}
          <div className="flex items-center p-0.5 rounded-lg bg-surface-container-lowest border border-white/[0.06]">
            {[
              { val: 0, label: 'All' },
              { val: 50, label: '>50' },
              { val: 75, label: '>75' },
              { val: 85, label: '🚨 85+' }
            ].map((th) => {
              const isSelected = riskThreshold === th.val;
              return (
                <button
                  key={th.val}
                  onClick={() => setRiskThreshold(th.val)}
                  className={`px-2 py-0.5 rounded-md text-xs transition-all font-mono ${
                    isSelected
                      ? th.val >= 85
                        ? 'font-bold bg-threat-crimson text-surface-base shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                        : 'font-bold bg-primary-container text-on-primary-container shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {th.label}
                </button>
              );
            })}
          </div>

          {/* Entity Types Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTypeFilter(!showTypeFilter)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container text-on-surface text-xs hover:bg-surface-container-high transition-colors border border-white/[0.06]"
            >
              <span className="material-symbols-outlined text-primary text-[15px]">category</span>
              <span>Types {selectedTypes.length}/5</span>
              <span className="material-symbols-outlined text-outline text-[14px]">arrow_drop_down</span>
            </button>

            {showTypeFilter && (
              <div className="absolute right-0 top-full mt-1.5 w-52 p-1.5 rounded-xl bg-surface-container-low shadow-2xl backdrop-blur-xl border border-white/[0.08] z-50 flex flex-col gap-1 text-xs">
                {entityTypeOptions.map((type) => {
                  const isSelected = selectedTypes.includes(type.id);
                  const count = nodeCountsByType?.[type.id] || 0;
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={`flex items-center justify-between px-2 py-1 rounded-lg transition-colors text-left ${
                        isSelected 
                          ? 'bg-surface-container text-primary font-semibold' 
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                      <span className="font-mono text-[10px] text-outline">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Timeline Button with Live Pulse */}
          <div className="relative">
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs border ${
                timelineDate || showTimeline
                  ? 'bg-tertiary-container/30 border-tertiary text-tertiary-fixed shadow-[0_0_12px_rgba(47,217,244,0.3)]'
                  : 'bg-surface-container text-tertiary hover:bg-surface-container-high border-white/[0.06]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
              </span>
              <span className="material-symbols-outlined text-[15px]">calendar_today</span>
              <span className="font-mono">{timelineDate || 'Timeline'}</span>
            </button>

            {/* Timeline Flyout Panel */}
            {showTimeline && (
              <div className="absolute right-0 top-full mt-1.5 w-76 p-2.5 rounded-xl bg-surface-container-low shadow-2xl backdrop-blur-xl border border-white/[0.08] z-50 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
                  <div className="flex items-center gap-1.5 text-tertiary text-xs font-bold">
                    <span className="material-symbols-outlined text-[15px]">history_toggle_drop</span>
                    <span>March 2026 Crime Timeline</span>
                  </div>
                  <button
                    onClick={() => setTimelinePlaying(!timelinePlaying)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary-container text-on-primary text-xs font-bold shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {timelinePlaying ? 'pause' : 'play_arrow'}
                    </span>
                    <span>{timelinePlaying ? 'Pause' : 'Play'}</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1 max-h-52 overflow-y-auto no-scrollbar">
                  {timelineDates.map((item) => (
                    <button
                      key={item.date}
                      onClick={() => setTimelineDate(item.date === timelineDate ? null : item.date)}
                      className={`w-full flex items-center gap-2 p-1.5 rounded text-left text-xs transition-colors ${
                        timelineDate === item.date
                          ? 'bg-primary-container/20 text-primary border border-primary/30 font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span className="font-mono text-outline text-[11px]">{item.day} Mar:</span>
                      <span className="truncate text-[11px]">{item.event}</span>
                    </button>
                  ))}
                </div>

                {timelineDate && (
                  <button
                    onClick={() => setTimelineDate(null)}
                    className="text-center text-outline hover:text-on-surface text-[11px] pt-1 border-t border-white/[0.04]"
                  >
                    Reset Timeline Filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Reset Filters Icon */}
          <button
            onClick={resetFilters}
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors border border-white/[0.06]"
            title="Reset all filters"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Entity Cluster Secondary Toolbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0 no-scrollbar">
        <span className="text-on-surface-variant text-[11px] font-mono uppercase mr-1 flex items-center gap-1 flex-shrink-0">
          <span className="material-symbols-outlined text-[13px] text-primary">grain</span>
          CLUSTER FILTERS:
        </span>
        {clusters.map((c) => {
          const isActive = selectedCluster === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCluster(c.id)}
              className={`px-2.5 py-0.5 rounded-full text-xs transition-all flex items-center gap-1 flex-shrink-0 border ${
                isActive
                  ? 'bg-primary/20 text-primary border-primary/40 shadow-[0_0_10px_rgba(6,182,212,0.3)] font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-white/[0.04]'
              }`}
            >
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
