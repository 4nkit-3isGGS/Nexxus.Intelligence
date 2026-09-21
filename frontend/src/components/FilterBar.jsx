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
  const typeFilterContainerRef = useRef(null);
  const timelineContainerRef = useRef(null);

  const clusters = [
    { id: 'ALL', label: 'All Entities' },
    { id: 'bridge', label: '👑 Kingpin Bridge' },
    { id: 'cluster_a', label: '⚡ Extortion Cell' },
    { id: 'cluster_b', label: '💸 Laundering Cell' },
    { id: 'victim', label: '🛡️ Complainant' },
  ];

  const entityTypeOptions = [
    { id: 'Person', label: 'Suspects (Person)', icon: 'person', dotColor: 'bg-red-500', textColor: 'text-red-600' },
    { id: 'Phone', label: 'Burner SIMs (Phone)', icon: 'perm_phone_msg', dotColor: 'bg-amber-500', textColor: 'text-amber-600' },
    { id: 'Organization', label: 'Shell Orgs', icon: 'domain', dotColor: 'bg-purple-500', textColor: 'text-purple-600' },
    { id: 'Account', label: 'Mule Accounts', icon: 'credit_card', dotColor: 'bg-emerald-500', textColor: 'text-emerald-600' },
    { id: 'Vehicle', label: 'Cloned Vehicles', icon: 'directions_car', dotColor: 'bg-sky-500', textColor: 'text-sky-600' },
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

  // Click outside or ESC key to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (highRiskContainerRef.current && !highRiskContainerRef.current.contains(e.target)) {
        setShowHighRisk(false);
      }
      if (typeFilterContainerRef.current && !typeFilterContainerRef.current.contains(e.target)) {
        setShowTypeFilter(false);
      }
      if (timelineContainerRef.current && !timelineContainerRef.current.contains(e.target)) {
        setShowTimeline(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setShowHighRisk(false);
        setShowTypeFilter(false);
        setShowTimeline(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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
    <section className="relative z-30 w-full px-4 py-2 bg-white border-b border-slate-200/80 flex flex-col gap-2 flex-shrink-0 text-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Omnisearch with Dynamic Suggestion Dropdown */}
        <div className="relative flex-1 min-w-[220px] max-w-sm xl:max-w-md" ref={searchContainerRef}>
          <div className="flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs focus-within:bg-white focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all">
            <span className="material-symbols-outlined text-slate-400 text-[17px] mr-2">search</span>
            <input
              id="omnisearch-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => liveSuggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search suspects, burner phones, shell accounts..."
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none font-normal"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 text-xs mr-2 transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded bg-slate-200/70 font-mono text-[9px] text-slate-500 font-medium">
              ⌘K
            </span>
          </div>

          {/* Active Omnisearch Live Match Dropdown */}
          {showSuggestions && liveSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 p-2 rounded-xl bg-white shadow-xl border border-slate-200 z-50 flex flex-col gap-1 animate-fade-in">
              <div className="flex items-center justify-between px-2 py-1 text-slate-400 font-mono text-[10px] uppercase font-semibold tracking-wider border-b border-slate-100">
                <span>Verified Matches</span>
                <span className="text-slate-600 font-medium">{liveSuggestions.length} Hits</span>
              </div>
              {liveSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectNode?.(item);
                    setShowSuggestions(false);
                  }}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 hover:bg-slate-100 border border-slate-200/60 cursor-pointer transition-colors group/item"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-slate-200">
                      <span className={`material-symbols-outlined text-[15px] ${
                        item.type === 'Person' ? 'text-red-500' :
                        item.type === 'Phone' ? 'text-amber-500' :
                        item.type === 'Organization' ? 'text-purple-500' :
                        item.type === 'Account' ? 'text-emerald-500' :
                        item.type === 'Vehicle' ? 'text-sky-500' : 'text-slate-600'
                      }`}>
                        {item.type === 'Person' ? 'person' : item.type === 'Phone' ? 'phone_iphone' : item.type === 'Vehicle' ? 'directions_car' : item.type === 'Account' ? 'credit_card' : 'domain'}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs text-slate-900 font-semibold group-hover/item:text-sky-700 truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">[{item.id}]</span>
                      </div>
                      <span className="text-[11px] text-slate-500 truncate">
                        {item.role || item.type}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium ml-2 shrink-0">
                    Risk {item.risk_score || 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Tactical Controls Group */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Top Threats Dropdown */}
          <div className="relative" ref={highRiskContainerRef}>
            <button
              onClick={() => setShowHighRisk(!showHighRisk)}
              className="flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg bg-rose-50 hover:bg-rose-100/70 text-rose-800 text-xs font-medium transition-all border border-rose-200/70 shadow-2xs cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>Top Threats</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-200/60 text-rose-900 font-mono text-[10px] font-bold">
                {highRiskEntities.length || 6}
              </span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {showHighRisk && (
              <div className="absolute right-0 top-full mt-1.5 w-72 p-2 rounded-xl bg-white shadow-xl border border-slate-200 z-50 flex flex-col gap-1 animate-fade-in">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-100 pb-1.5 px-1 uppercase font-semibold tracking-wider">
                  <span>Priority Interceptions</span>
                  <span>Sorted by Risk</span>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  {highRiskEntities.map((suspect, idx) => (
                    <div
                      key={suspect.id || idx}
                      onClick={() => {
                        onSelectNode?.(suspect);
                        setShowHighRisk(false);
                      }}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-slate-400 font-mono text-[10px]">{idx + 1}.</span>
                        <span className="text-slate-900 font-medium truncate text-xs">{suspect.name}</span>
                      </div>
                      <span className="font-semibold text-rose-700 font-mono text-[11px] ml-2 shrink-0">
                        {suspect.risk_score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Risk Threshold Segmented Filter */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200/70">
            {[
              { val: 0, label: 'All' },
              { val: 50, label: '>50' },
              { val: 75, label: '>75' },
              { val: 85, label: '85+' }
            ].map((th) => {
              const isSelected = riskThreshold === th.val;
              return (
                <button
                  key={th.val}
                  onClick={() => setRiskThreshold(th.val)}
                  className={`px-2 py-0.8 rounded text-xs transition-all font-mono cursor-pointer ${
                    isSelected
                      ? 'font-bold bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {th.label}
                </button>
              );
            })}
          </div>

          {/* Entity Types Dropdown */}
          <div className="relative" ref={typeFilterContainerRef}>
            <button
              onClick={() => setShowTypeFilter(!showTypeFilter)}
              className="flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg bg-white text-slate-700 text-xs hover:bg-slate-50 transition-colors border border-slate-200 shadow-2xs font-medium cursor-pointer"
            >
              <span className="material-symbols-outlined text-slate-500 text-[15px]">category</span>
              <span>Types ({selectedTypes.length}/5)</span>
              <span className="material-symbols-outlined text-slate-400 text-[13px]">expand_more</span>
            </button>

            {showTypeFilter && (
              <div className="absolute right-0 top-full mt-1.5 w-52 p-2 rounded-xl bg-white shadow-xl border border-slate-200 z-50 flex flex-col gap-1 text-xs animate-fade-in">
                <div className="px-2 py-1 text-slate-400 font-mono text-[10px] uppercase font-semibold tracking-wider border-b border-slate-100">
                  Filter Types
                </div>
                {entityTypeOptions.map((type) => {
                  const isSelected = selectedTypes.includes(type.id);
                  const count = nodeCountsByType?.[type.id] || 0;
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-left cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-100 text-slate-900 font-semibold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${type.dotColor} flex-shrink-0`}></span>
                        <span className={`material-symbols-outlined text-[15px] ${type.textColor}`}>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 font-medium">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Timeline Button */}
          <div className="relative" ref={timelineContainerRef}>
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className={`flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg transition-all text-xs border shadow-2xs font-medium cursor-pointer ${
                timelineDate || showTimeline
                  ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`material-symbols-outlined text-[15px] ${timelineDate || showTimeline ? 'text-white' : 'text-slate-500'}`}>calendar_today</span>
              <span className="font-mono">{timelineDate || 'Timeline'}</span>
              <span className="material-symbols-outlined text-[13px] opacity-70">expand_more</span>
            </button>

            {/* Timeline Flyout Panel */}
            {showTimeline && (
              <div className="absolute right-0 top-full mt-1.5 w-80 p-3 rounded-xl bg-white shadow-xl border border-slate-200 z-50 flex flex-col gap-2 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5 text-slate-900 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-slate-600">history_toggle_drop</span>
                    <span>March 2026 Timeline</span>
                  </div>
                  <button
                    onClick={() => setTimelinePlaying(!timelinePlaying)}
                    className="flex items-center gap-1 px-2 py-0.8 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-2xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {timelinePlaying ? 'pause' : 'play_arrow'}
                    </span>
                    <span>{timelinePlaying ? 'Pause' : 'Play'}</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto no-scrollbar">
                  {timelineDates.map((item) => (
                    <button
                      key={item.date}
                      onClick={() => setTimelineDate(item.date === timelineDate ? null : item.date)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                        timelineDate === item.date
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-mono text-slate-700 text-[11px] font-semibold">{item.day} Mar:</span>
                      <span className="truncate text-[11px]">{item.event}</span>
                    </button>
                  ))}
                </div>

                {timelineDate && (
                  <button
                    onClick={() => setTimelineDate(null)}
                    className="text-center text-sky-600 hover:underline text-[11px] pt-1.5 border-t border-slate-100 font-medium cursor-pointer"
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
            className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 shadow-2xs cursor-pointer"
            title="Reset all filters"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Entity Cluster Secondary Toolbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
        <span className="text-slate-400 text-[10px] font-mono uppercase font-semibold tracking-wider mr-1 flex items-center gap-1 flex-shrink-0">
          Cluster:
        </span>
        {clusters.map((c) => {
          const isActive = selectedCluster === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCluster(c.id)}
              className={`px-2.5 py-0.8 rounded-md text-xs transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-medium shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
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
