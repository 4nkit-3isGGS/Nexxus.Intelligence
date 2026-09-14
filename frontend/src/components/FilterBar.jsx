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
    <section className="relative z-30 w-full px-4 py-2 bg-white/95 backdrop-blur-xl shadow-sm flex flex-col gap-1.5 border-b border-slate-200/80 flex-shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Glassmorphic Omnisearch with Dynamic Suggestion Dropdown */}
        <div className="relative flex-1 min-w-[200px] max-w-sm xl:max-w-md" ref={searchContainerRef}>
          <div className="flex items-center px-3 py-1.5 rounded-xl bg-slate-50/90 border border-slate-200/90 shadow-inner focus-within:shadow-[0_0_12px_rgba(2,132,199,0.18)] focus-within:border-sky-500/50 transition-all">
            <span className="material-symbols-outlined text-sky-600 text-[18px] mr-2">travel_explore</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => liveSuggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search suspects, burner phones, shell accounts..."
              className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-xs focus:outline-none font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 text-xs mr-2 transition-colors"
              >
                ✕
              </button>
            )}
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded bg-slate-200/80 font-mono text-[10px] text-slate-600 font-semibold">
              ⌘K
            </span>
          </div>

          {/* Active Omnisearch Live Match Dropdown */}
          {showSuggestions && liveSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 p-2 rounded-xl bg-white shadow-2xl backdrop-blur-2xl border border-slate-200 z-50 flex flex-col gap-1">
              <div className="flex items-center justify-between px-2.5 py-1 text-slate-500 font-mono text-[10px] uppercase">
                <span>Verified Matches (Neo4j Cluster 088)</span>
                <span className="text-emerald-600 font-bold">{liveSuggestions.length} Indexed Hits</span>
              </div>
              {liveSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectNode?.(item);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-sky-50/70 border border-slate-100 cursor-pointer transition-colors group/item"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 flex-shrink-0 border border-rose-200/50">
                      <span className="material-symbols-outlined text-[16px]">
                        {item.type === 'Person' ? 'person_alert' : item.type === 'Vehicle' ? 'directions_car' : 'dataset'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-slate-800 font-bold group-hover/item:text-sky-600 truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-amber-700 font-mono font-medium">[{item.id}]</span>
                        {item.risk_score >= 85 && (
                          <span className="px-1 rounded bg-rose-100 text-rose-700 text-[9px] font-mono font-bold">
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 truncate">
                        {item.role || item.type} • Risk {item.risk_score || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full font-bold ml-2 shrink-0">
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
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold shadow-xs hover:bg-rose-100/70 transition-all border border-rose-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <span className="flex items-center gap-1">
                <span>Top Threats</span>
                <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                  {highRiskEntities.length || 6}
                </span>
              </span>
              <span className="material-symbols-outlined text-[15px]">expand_more</span>
            </button>

            {showHighRisk && (
              <div className="absolute right-0 top-full mt-1.5 w-72 p-2 rounded-xl bg-white shadow-2xl backdrop-blur-xl border border-slate-200 z-50 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-b border-slate-100 pb-1">
                  <span className="font-semibold uppercase tracking-wider">PRIORITY INTERCEPTION</span>
                  <span className="text-rose-600 font-bold">SORTED SCORE</span>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  {highRiskEntities.map((suspect, idx) => (
                    <div
                      key={suspect.id || idx}
                      onClick={() => {
                        onSelectNode?.(suspect);
                        setShowHighRisk(false);
                      }}
                      className="flex items-center justify-between px-2 py-1 rounded-lg bg-slate-50 hover:bg-rose-50/70 border border-slate-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-slate-400 font-mono text-[10px]">{idx + 1}.</span>
                        <span className="text-slate-800 font-semibold truncate text-xs">{suspect.name}</span>
                      </div>
                      <span className="font-bold text-rose-600 font-mono text-xs ml-2 shrink-0">
                        {suspect.risk_score} PTS
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Risk Threshold Segmented Filter */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
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
                        ? 'font-bold bg-rose-600 text-white shadow-xs'
                        : 'font-bold bg-white text-sky-700 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
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
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-slate-700 text-xs hover:bg-slate-50 transition-colors border border-slate-200 shadow-xs font-medium"
            >
              <span className="material-symbols-outlined text-sky-600 text-[15px]">category</span>
              <span>Types {selectedTypes.length}/5</span>
              <span className="material-symbols-outlined text-slate-400 text-[14px]">arrow_drop_down</span>
            </button>

            {showTypeFilter && (
              <div className="absolute right-0 top-full mt-1.5 w-52 p-1.5 rounded-xl bg-white shadow-2xl backdrop-blur-xl border border-slate-200 z-50 flex flex-col gap-1 text-xs">
                {entityTypeOptions.map((type) => {
                  const isSelected = selectedTypes.includes(type.id);
                  const count = nodeCountsByType?.[type.id] || 0;
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={`flex items-center justify-between px-2 py-1 rounded-lg transition-colors text-left ${
                        isSelected 
                          ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-100' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px] text-sky-600">{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">({count})</span>
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
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs border shadow-xs font-medium ${
                timelineDate || showTimeline
                  ? 'bg-sky-50 border-sky-400 text-sky-700 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
              </span>
              <span className="material-symbols-outlined text-[15px] text-sky-600">calendar_today</span>
              <span className="font-mono">{timelineDate || 'Timeline'}</span>
            </button>

            {/* Timeline Flyout Panel */}
            {showTimeline && (
              <div className="absolute right-0 top-full mt-1.5 w-76 p-2.5 rounded-xl bg-white shadow-2xl backdrop-blur-xl border border-slate-200 z-50 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold">
                    <span className="material-symbols-outlined text-[15px] text-sky-600">history_toggle_drop</span>
                    <span>March 2026 Crime Timeline</span>
                  </div>
                  <button
                    onClick={() => setTimelinePlaying(!timelinePlaying)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-600 text-white text-xs font-bold shadow-xs hover:bg-sky-700"
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
                          ? 'bg-sky-50 text-sky-800 border border-sky-300 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-mono text-slate-400 text-[11px]">{item.day} Mar:</span>
                      <span className="truncate text-[11px]">{item.event}</span>
                    </button>
                  ))}
                </div>

                {timelineDate && (
                  <button
                    onClick={() => setTimelineDate(null)}
                    className="text-center text-slate-500 hover:text-slate-800 text-[11px] pt-1 border-t border-slate-100"
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
            className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200 shadow-xs"
            title="Reset all filters"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Entity Cluster Secondary Toolbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0 no-scrollbar">
        <span className="text-slate-500 text-[11px] font-mono uppercase mr-1 flex items-center gap-1 flex-shrink-0">
          <span className="material-symbols-outlined text-[13px] text-sky-600">grain</span>
          CLUSTER FILTERS:
        </span>
        {clusters.map((c) => {
          const isActive = selectedCluster === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCluster(c.id)}
              className={`px-2.5 py-0.5 rounded-full text-xs transition-all flex items-center gap-1 flex-shrink-0 border shadow-xs ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 font-bold'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
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
