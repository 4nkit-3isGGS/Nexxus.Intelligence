import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import GraphCanvas from './components/GraphCanvas';
import EvidenceDrawer from './components/EvidenceDrawer';
import AgentQueryBar from './components/AgentQueryBar';
import FinancialFlowView from './components/FinancialFlowView';
import CdrTelemetryView from './components/CdrTelemetryView';
import FirCorpusView from './components/FirCorpusView';
import LegalAuditVault from './components/LegalAuditVault';
import EntityResolutionView from './components/EntityResolutionView';
import IngestModal from './components/IngestModal';
import HomePage from './components/HomePage';
import AuthModal from './components/AuthModal';
import RbacRoute from './components/RbacRoute';
import NotFoundPage from './components/NotFoundPage';
import ExportDossierModal from './components/ExportDossierModal';
import OfficerFieldGuideModal from './components/OfficerFieldGuideModal';
import InvestigationPlaybook from './components/InvestigationPlaybook';
import AwaitingDirective from './components/AwaitingDirective';
import { useToast } from './context/ToastContext';
import { useAuth } from './context/AuthContext';
import { apiService } from './services/api';

// Workspace Authentication Guard — Intercepts unauthenticated guests
function WorkspaceAuthGuard({ currentUser, onOpenAuth, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const interceptedRef = useRef(false);

  useEffect(() => {
    if (!currentUser && !interceptedRef.current) {
      interceptedRef.current = true;
      try {
        sessionStorage.setItem('nexxus_pending_redirect', location.pathname);
      } catch (e) { }
      toast.info(
        'Authentication Required',
        'Please authenticate with your agency credentials to enter the workspace.'
      );
      onOpenAuth?.('login');
      navigate('/', { replace: true });
    }
  }, [currentUser, location.pathname, navigate, onOpenAuth, toast]);

  if (!currentUser) {
    return null;
  }

  return children;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Infer active workspace tab from URL pathname
  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.includes('/workspace/investigation')) return 'agent';
    if (path.includes('/workspace/resolution')) return 'resolution';
    if (path.includes('/workspace/financial')) return 'financial';
    if (path.includes('/workspace/cdr')) return 'cdr';
    if (path.includes('/workspace/fir')) return 'fir';
    if (path.includes('/workspace/audit') || path.includes('/workspace/vault')) return 'audit';
    if (path.includes('/workspace/graph')) return 'graph';
    return null;
  }, [location.pathname]);

  // Core Data
  const [rawGraphData, setRawGraphData] = useState({ case_info: {}, nodes: [], edges: [] });
  const [backendStatus, setBackendStatus] = useState({ isLive: false, source: 'DISCONNECTED', status: 'OFFLINE' });
  const [graphStats, setGraphStats] = useState({ total_nodes: 0, total_relationships: 0 });
  const [loading, setLoading] = useState(false);
  const [showIngestModal, setShowIngestModal] = useState(false);
  // Sidebar Entity-Resolution badge — scoped to the active investigation subgraph
  const [scopedReviewCount, setScopedReviewCount] = useState(0);

  // Authentication & Law Enforcement RBAC State
  const {
    currentUser,
    setCurrentUser,
    officerRole,
    setOfficerRole,
    showAuthModal,
    setShowAuthModal,
    authModalTab,
    setAuthModalTab
  } = useAuth();
  const { toast } = useToast();
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showFieldGuideModal, setShowFieldGuideModal] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [riskThreshold, setRiskThreshold] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState(['Person', 'Phone', 'Organization', 'Vehicle', 'Account']);
  const [selectedCluster, setSelectedCluster] = useState('ALL');
  const [timelineDate, setTimelineDate] = useState(null);
  const [timelinePlaying, setTimelinePlaying] = useState(false);

  // Selection & Focus
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState([]);
  const [highlightedEdgeIds, setHighlightedEdgeIds] = useState([]);
  const [activeLayout, setActiveLayout] = useState('force');

  // Ensure suspect criminal profile / dossier is visible only on the Knowledge Graph page
  useEffect(() => {
    if (activeTab !== 'graph' && selectedNode) {
      setSelectedNode(null);
    }
  }, [activeTab, selectedNode]);

  // Agent State & Investigation Session Persistence
  const [agentResponse, setAgentResponse] = useState(() => {
    try {
      const stored = sessionStorage.getItem('nexxus_investigation_response');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [investigationQuery, setInvestigationQuery] = useState(() => {
    try {
      return sessionStorage.getItem('nexxus_investigation_query') || '';
    } catch (e) {
      return '';
    }
  });
  const [loadingQuery, setLoadingQuery] = useState(false);
  const investigationAbortRef = useRef(null);

  // Cancel in-flight request and clear the query text field ONLY.
  // Does NOT reset rawGraphData, graphStats, agentResponse, or any workspace tab.
  // Used exclusively by the × button inside the search input.
  const handleCancelAgentQuery = useCallback(() => {
    if (investigationAbortRef.current) {
      investigationAbortRef.current.abort();
      investigationAbortRef.current = null;
    }
    setLoadingQuery(false);
    setInvestigationQuery('');
    try {
      sessionStorage.removeItem('nexxus_investigation_query');
    } catch (e) { }
  }, []);

  // Full global state reset — called ONLY on login and logout to wipe the workspace.
  const handleClearAgentQuery = useCallback(() => {
    if (investigationAbortRef.current) {
      investigationAbortRef.current.abort();
      investigationAbortRef.current = null;
    }
    setLoadingQuery(false);
    setAgentResponse(null);
    setInvestigationQuery('');
    // Reset global graph data to pristine empty state
    setRawGraphData({ case_info: {}, nodes: [], edges: [] });
    setGraphStats({ total_nodes: 0, total_relationships: 0 });
    setHighlightedNodeIds([]);
    setHighlightedEdgeIds([]);
    setSelectedNode(null);
    setSelectedEdge(null);
    setScopedReviewCount(0);
    try {
      sessionStorage.removeItem('nexxus_investigation_response');
      sessionStorage.removeItem('nexxus_investigation_query');
    } catch (e) { }
  }, []);

  // Health-only check on mount — NO automatic graph data fetch
  // Graph data is populated exclusively from investigation queries
  const loadData = useCallback(async () => {
    setLoading(true);
    const health = await apiService.checkHealth();
    const isLive = Boolean(health?.isLive);
    setBackendStatus({
      isLive,
      source: isLive ? 'LIVE_FASTAPI' : 'OFFLINE',
      status: isLive ? 'LIVE' : (health?.status || 'OFFLINE')
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(async () => {
      const health = await apiService.checkHealth();
      setBackendStatus(prev => ({
        ...prev,
        isLive: Boolean(health?.isLive),
        status: health?.isLive ? 'LIVE' : 'OFFLINE'
      }));
    }, 20000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle RBAC Officer Role Change
  const handleRoleChange = (newRole) => {
    setOfficerRole(newRole);
    const updated = apiService.setOfficerClearance(newRole);
    setCurrentUser(updated);
    loadData();
  };

  // Handle Login / Registration Success
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setOfficerRole(user.role);
    apiService.setOfficerClearance(user.role);

    // Check for cached directive / search query & redirect target
    const cachedQuery = sessionStorage.getItem('nexxus_pending_query');
    const cachedRedirect = sessionStorage.getItem('nexxus_pending_redirect');

    // Clean up pending storage flags
    sessionStorage.removeItem('nexxus_pending_query');
    sessionStorage.removeItem('nexxus_pending_redirect');

    if (cachedQuery && cachedQuery.trim()) {
      // User entered a query before logging in:
      // Populate investigationQuery, navigate to workspace, and automatically fire agent pipeline
      const queryText = cachedQuery.trim();
      setInvestigationQuery(queryText);
      navigate('/workspace/investigation');
      handleRunAgentQuery(queryText);
      loadData();
      toast.success(
        'Investigation Directive Initiated',
        `Authenticated as ${user.name}. Auto-executing investigation: "${queryText}".`
      );
    } else {
      // Normal workspace entry: navigate to pending redirect or default to graph workspace
      const targetPath = (cachedRedirect && cachedRedirect.startsWith('/workspace'))
        ? cachedRedirect
        : '/workspace/graph';
      handleClearAgentQuery();
      navigate(targetPath);
      loadData();
      toast.success(
        'Clearance Verified',
        `Welcome, ${user.name} (${user.rank || 'Officer'}). Access granted to intelligence workspace.`
      );
    }
  };

  // Quick 1-Click Role Select from Home Page
  const handleQuickRoleSelect = async (role) => {
    const res = await apiService.login({ identifier: role, role });
    if (res.success) {
      handleLoginSuccess(res.user);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    apiService.logout();
    setCurrentUser(null);
    handleClearAgentQuery();
    toast.info('Session Terminated', 'Officer has been securely signed out.');
    navigate('/');
  };

  // Node Counts by Type
  const nodeCountsByType = useMemo(() => {
    const counts = {};
    (rawGraphData?.nodes || []).forEach((n) => {
      counts[n.type] = (counts[n.type] || 0) + 1;
    });
    return counts;
  }, [rawGraphData]);

  // Whether the workspace has active investigation data
  const hasGraphData = (rawGraphData?.nodes?.length || 0) > 0;

  // Compute Entity Resolution badge count scoped to the active subgraph
  // Runs after each investigation completes (rawGraphData update)
  useEffect(() => {
    if (!hasGraphData) {
      setScopedReviewCount(0);
      return;
    }
    let cancelled = false;
    const graphNodeIds = new Set((rawGraphData.nodes || []).map(n => n.id));
    const graphNodeNames = new Set((rawGraphData.nodes || []).map(n => (n.name || '').toLowerCase()));
    const activeCaseId = rawGraphData.case_info?.id || rawGraphData.case_info?.case_id || null;

    apiService.getReviewQueue().then(result => {
      if (cancelled) return;
      const queue = (result && Array.isArray(result.data)) ? result.data : [];
      const scoped = queue.filter(item => {
        if (graphNodeIds.has(item.entity1_id) || graphNodeIds.has(item.entity2_id)) return true;
        const name1 = (item.entity1_name || '').toLowerCase();
        const name2 = (item.entity2_name || '').toLowerCase();
        for (const gName of graphNodeNames) {
          if (gName && name1.length > 2 && (name1.includes(gName) || gName.includes(name1))) return true;
          if (gName && name2.length > 2 && (name2.includes(gName) || gName.includes(name2))) return true;
        }
        const caseRef = (item.case_id || item.case_ref || '').toLowerCase();
        if (activeCaseId && caseRef && caseRef.includes(activeCaseId.toLowerCase())) return true;
        return false;
      });
      setScopedReviewCount(scoped.length);
    }).catch(() => {
      if (!cancelled) setScopedReviewCount(0);
    });
    return () => { cancelled = true; };
  }, [rawGraphData, hasGraphData]);

  // Toggle Type Selection
  const toggleType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  // Filtered Nodes Calculation
  const filteredNodes = useMemo(() => {
    let list = rawGraphData?.nodes || [];

    // Filter by Entity Type
    list = list.filter((n) => selectedTypes.includes(n.type));

    // Filter by Risk Threshold
    if (riskThreshold > 0) {
      list = list.filter((n) => (n.risk_score || 0) >= riskThreshold);
    }

    // Filter by Cluster
    if (selectedCluster !== 'ALL') {
      list = list.filter((n) => n.cluster_id === selectedCluster);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.name?.toLowerCase().includes(q) ||
          n.id?.toLowerCase().includes(q) ||
          (n.role && n.role.toLowerCase().includes(q)) ||
          (n.phone && n.phone.includes(q)) ||
          (n.account && n.account.includes(q)) ||
          (n.vehicle && n.vehicle.toLowerCase().includes(q)) ||
          (n.aliases && n.aliases.some((a) => a.toLowerCase().includes(q))) ||
          (n.source_docs && n.source_docs.some((doc) => doc.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [rawGraphData, selectedTypes, riskThreshold, selectedCluster, searchQuery]);

  // Filtered Edges (Edges between visible nodes or matching timeline)
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
    let edgeList = (rawGraphData?.edges || []).filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );

    // Timeline Date Filter
    if (timelineDate) {
      edgeList = edgeList.filter((e) => {
        if (!e.timestamp) return true;
        return e.timestamp.includes(timelineDate);
      });
    }

    return edgeList;
  }, [rawGraphData, filteredNodes, timelineDate]);

  // Run LangGraph Agent Investigation (POST /api/investigate)
  const handleRunAgentQuery = async (queryText, subjectId = null) => {
    if (!queryText || !queryText.trim()) return;

    // Abort any existing in-flight investigation request
    if (investigationAbortRef.current) {
      investigationAbortRef.current.abort();
    }
    const controller = new AbortController();
    investigationAbortRef.current = controller;

    setInvestigationQuery(queryText);
    try {
      sessionStorage.setItem('nexxus_investigation_query', queryText);
    } catch (e) { }

    setLoadingQuery(true);
    const result = await apiService.runInvestigation({
      query: queryText,
      subjectId,
      signal: controller.signal
    });

    // If cancelled by user, do not overwrite or error out
    if (result?.aborted) {
      return;
    }

    if (result?.data) {
      const resPayload = {
        query: queryText,
        isLive: result.isLive,
        source: result.source,
        ...result.data,
      };
      setAgentResponse(resPayload);
      try {
        sessionStorage.setItem('nexxus_investigation_response', JSON.stringify(resPayload));
      } catch (e) { }

      if (result.data.highlighted_nodes) {
        setHighlightedNodeIds(result.data.highlighted_nodes);
      }
      if (result.data.highlighted_edges) {
        setHighlightedEdgeIds(result.data.highlighted_edges);
      }

      // Replace the global graph data with investigation results (not merge)
      if (result.data.graph_data) {
        const investigationGraph = {
          case_info: result.data.case_info || result.data.graph_data.case_info || {},
          nodes: result.data.graph_data.nodes || [],
          edges: result.data.graph_data.edges || [],
        };
        setRawGraphData(investigationGraph);
        setGraphStats({
          total_nodes: investigationGraph.nodes.length,
          total_relationships: investigationGraph.edges.length,
        });
      }
    } else if (result?.error) {
      const errPayload = {
        query: queryText,
        error: result.error,
        hypotheses: [],
        tool_history: [],
      };
      setAgentResponse(errPayload);
      try {
        sessionStorage.setItem('nexxus_investigation_response', JSON.stringify(errPayload));
      } catch (e) { }
    }
    setLoadingQuery(false);
  };

  // Cross-app Investigation Trigger
  const handleTriggerInvestigation = (queryText, subjectId = null) => {
    navigate('/workspace/investigation');
    handleRunAgentQuery(queryText, subjectId);
  };


  // Trace to Kingpin
  const handleTraceKingpin = async (suspectNode) => {
    const result = await apiService.traceToKingpin(suspectNode.id);
    if (result?.data?.path) {
      setHighlightedNodeIds(result.data.path);
      const edgeIds = [];
      for (let i = 0; i < result.data.path.length - 1; i++) {
        const u = result.data.path[i];
        const v = result.data.path[i + 1];
        const edge = rawGraphData.edges.find(
          (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
        );
        if (edge) edgeIds.push(edge.id);
      }
      setHighlightedEdgeIds(edgeIds);
    } else {
      setHighlightedNodeIds([suspectNode.id, 'P008']);
      setHighlightedEdgeIds(['E008', 'E012']);
    }
  };

  // Expand Subgraph
  const handleExpandSubgraph = (subgraphData) => {
    if (!subgraphData) return;
    const newNodes = [...rawGraphData.nodes];
    const newEdges = [...rawGraphData.edges];

    (subgraphData.nodes || []).forEach((n) => {
      if (!newNodes.some((existing) => existing.id === n.id)) {
        newNodes.push(n);
      }
    });

    (subgraphData.edges || []).forEach((e) => {
      if (!newEdges.some((existing) => existing.id === e.id)) {
        newEdges.push(e);
      }
    });

    setRawGraphData({
      ...rawGraphData,
      nodes: newNodes,
      edges: newEdges,
    });
  };

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setRiskThreshold(0);
    setSelectedTypes(['Person', 'Phone', 'Organization', 'Vehicle', 'Account']);
    setSelectedCluster('ALL');
    setTimelineDate(null);
    setTimelinePlaying(false);
    setSelectedNode(null);
    setSelectedEdge(null);
    setHighlightedNodeIds([]);
    setHighlightedEdgeIds([]);
  };

  // Timeline Auto-Player Effect
  useEffect(() => {
    let interval = null;
    if (timelinePlaying) {
      const dates = ['2026-03-01', '2026-03-05', '2026-03-10', '2026-03-15', '2026-03-20', '2026-03-24'];
      let currentIndex = dates.indexOf(timelineDate);
      if (currentIndex === -1) currentIndex = 0;

      interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % dates.length;
        setTimelineDate(dates[currentIndex]);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [timelinePlaying, timelineDate]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('omnisearch-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-900 relative">
      <Routes>
        {/* VIEW 1: ATTRACTIVE EXECUTIVE HOMEPAGE */}
        <Route
          path="/"
          element={
            <div className="flex-1 overflow-y-auto w-full h-full no-scrollbar">
              <HomePage
                onLaunchWorkspace={() => navigate('/workspace/graph')}
                onOpenAuth={(tab = 'login') => {
                  setAuthModalTab(tab);
                  setShowAuthModal(true);
                }}
                onOpenFieldGuide={() => setShowFieldGuideModal(true)}
                currentUser={currentUser}
                onLogout={handleLogout}
                onQuickRoleSelect={handleQuickRoleSelect}
                onInvestigate={(query, subjectId) => handleTriggerInvestigation(query, subjectId)}
                stats={{
                  totalNodes: graphStats.total_nodes || rawGraphData?.nodes?.length || 0,
                  totalEdges: graphStats.total_relationships || rawGraphData?.edges?.length || 0,
                  totalAmount: '₹0'
                }}
              />
            </div>
          }
        />

        {/* WORKSPACE ROOT REDIRECT */}
        <Route
          path="/workspace"
          element={
            currentUser ? (
              <Navigate to="/workspace/graph" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* WORKSPACE COMMAND CENTER LAYOUT */}
        <Route
          path="/workspace/*"
          element={
            <WorkspaceAuthGuard
              currentUser={currentUser}
              onOpenAuth={(tab = 'login') => {
                setAuthModalTab(tab);
                setShowAuthModal(true);
              }}
            >
              <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
                {/* 1. Tactical Header */}
                <Header
                  activeTab={activeTab}
                  backendStatus={backendStatus}
                  refreshData={loadData}
                  caseInfo={rawGraphData?.case_info}
                  kpiStats={{
                    totalNodes: rawGraphData?.nodes?.length || 0,
                    totalEdges: rawGraphData?.edges?.length || 0,
                  }}
                  pendingReviewCount={3}
                  onOpenIngest={() => setShowIngestModal(true)}
                  officerRole={officerRole}
                  onRoleChange={handleRoleChange}
                  onGoHome={() => navigate('/')}
                  currentUser={currentUser}
                  onOpenAuth={(tab = 'login') => {
                    setAuthModalTab(tab);
                    setShowAuthModal(true);
                  }}
                  onLogout={handleLogout}
                  onOpenFieldGuide={() => setShowFieldGuideModal(true)}
                  onOpenDossier={() => setShowDossierModal(true)}
                  onLaunchWorkspace={() => navigate('/workspace/graph')}
                />

                {/* Main App Body Row: Sidebar + Primary Workspace */}
                <div className="flex-1 flex overflow-hidden w-full relative min-h-0">
                  {/* 2. Tactical Ops Left Sidebar */}
                  <Sidebar
                    activeTab={activeTab}
                    nodeCount={rawGraphData?.nodes?.length || 0}
                    pendingReviewCount={scopedReviewCount}
                    backendStatus={backendStatus}
                    officerRole={officerRole}
                    onGoHome={() => navigate('/')}
                  />

                  {/* 3. Primary Tactical Workspace Body */}
                  <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative min-h-0 min-w-0 bg-slate-50/70">
                    {/* Ambient Subtle Grid */}
                    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:24px_24px]"></div>
                    </div>

                    <main className="relative z-10 flex-1 flex flex-col overflow-hidden w-full min-h-0 min-w-0">
                      <Routes>
                        {/* VIEW 1: INTERACTIVE GRAPH CANVAS */}
                        <Route
                          path="graph"
                          element={
                            hasGraphData ? (
                              <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                                {/* 1-Click Tactical Forensic Playbook Leads */}
                                <InvestigationPlaybook
                                  nodes={rawGraphData?.nodes || []}
                                  onSelectNodeById={(id) => {
                                    const node = rawGraphData?.nodes?.find((n) => n.id === id);
                                    if (node) {
                                      setSelectedNode(node);
                                      setHighlightedNodeIds([node.id]);
                                    }
                                  }}
                                  onHighlightSubgraph={(nodeIds, edgeIds) => {
                                    setHighlightedNodeIds(nodeIds || []);
                                    setHighlightedEdgeIds(edgeIds || []);
                                  }}
                                  onSetTimelineDate={(date) => {
                                    setTimelineDate(date);
                                    setTimelinePlaying(false);
                                  }}
                                />

                                {/* Filter and Timeline Controls */}
                                <FilterBar
                                  searchQuery={searchQuery}
                                  setSearchQuery={setSearchQuery}
                                  riskThreshold={riskThreshold}
                                  setRiskThreshold={setRiskThreshold}
                                  selectedTypes={selectedTypes}
                                  toggleType={toggleType}
                                  selectedCluster={selectedCluster}
                                  setSelectedCluster={setSelectedCluster}
                                  timelineDate={timelineDate}
                                  setTimelineDate={setTimelineDate}
                                  timelinePlaying={timelinePlaying}
                                  setTimelinePlaying={setTimelinePlaying}
                                  nodeCountsByType={nodeCountsByType}
                                  resetFilters={resetFilters}
                                  onSelectNode={(node) => {
                                    const fullNode = rawGraphData?.nodes?.find((n) => n.id === node.id) || node;
                                    setSelectedNode(fullNode);
                                    setHighlightedNodeIds([fullNode.id]);
                                  }}
                                />

                                {/* Force Canvas */}
                                <div className="flex-1 relative overflow-hidden min-h-0">
                                  <GraphCanvas
                                    nodes={filteredNodes}
                                    edges={filteredEdges}
                                    selectedNode={selectedNode}
                                    onSelectNode={(node) => setSelectedNode(node)}
                                    selectedEdge={selectedEdge}
                                    onSelectEdge={(edge) => setSelectedEdge(edge)}
                                    highlightedNodeIds={highlightedNodeIds}
                                    highlightedEdgeIds={highlightedEdgeIds}
                                    timelineDate={timelineDate}
                                    activeLayout={activeLayout}
                                    onLayoutChange={(layout) => setActiveLayout(layout)}
                                  />
                                </div>
                              </div>
                            ) : (
                              <AwaitingDirective
                                icon="hub"
                                title="Knowledge Graph — Awaiting Directive"
                                subtitle="No active investigation query. Navigate to the AI Investigation tab and enter a case directive to populate the knowledge graph with live entity-relationship data."
                                context="Graph canvas will render nodes, edges, and cluster topology from investigation results."
                              />
                            )
                          }
                        />

                        {/* VIEW 2: AI AGENTIC INVESTIGATION CONSOLE */}
                        <Route
                          path="investigation"
                          element={
                            <AgentQueryBar
                              onRunAgentQuery={handleRunAgentQuery}
                              onCancelQuery={handleCancelAgentQuery}
                              onClearQuery={handleClearAgentQuery}
                              query={investigationQuery}
                              onQueryChange={setInvestigationQuery}
                              nodes={rawGraphData?.nodes || []}
                              agentResponse={agentResponse}
                              loadingQuery={loadingQuery}
                              officerRole={officerRole}
                              currentUser={currentUser}
                              onRoleChange={handleRoleChange}
                              onFocusSubgraph={(nodeIds, edgeIds) => {
                                setHighlightedNodeIds(nodeIds || []);
                                setHighlightedEdgeIds(edgeIds || []);
                                navigate('/workspace/graph');
                              }}
                            />
                          }
                        />

                        {/* VIEW 3: ENTITY RESOLUTION & DUPLICATE REVIEW QUEUE */}
                        <Route
                          path="resolution"
                          element={
                            hasGraphData ? (
                              <EntityResolutionView
                                graphData={rawGraphData}
                                officerRole={officerRole}
                                currentUser={currentUser}
                                onRoleChange={handleRoleChange}
                                onFocusEntity={(node) => {
                                  setSelectedNode(node);
                                  navigate('/workspace/graph');
                                }}
                                onJumpToGraph={() => navigate('/workspace/graph')}
                                onInvestigateEntity={(node) => {
                                  handleTriggerInvestigation(`Perform graph entity resolution and investigate network for ${node.name} (${node.id})`, node.id);
                                }}
                              />
                            ) : (
                              <AwaitingDirective
                                icon="fingerprint"
                                title="Entity Resolution — Awaiting Directive"
                                subtitle="No entity resolution queue available. Run an investigation query to populate the entity deduplication and merge review queue."
                                context="Duplicate entity pairs will appear here after investigation results are processed."
                              />
                            )
                          }
                        />

                        {/* VIEW 4: CIRCULAR MONEY TRAIL & AML FLOW */}
                        <Route
                          path="financial"
                          element={
                            hasGraphData ? (
                              <FinancialFlowView
                                graphData={rawGraphData}
                                onSelectEntity={(nodeId) => {
                                  const found = rawGraphData.nodes.find((n) => n.id === nodeId);
                                  if (found) {
                                    setSelectedNode(found);
                                    navigate('/workspace/graph');
                                  }
                                }}
                              />
                            ) : (
                              <AwaitingDirective
                                icon="account_balance"
                                title="Money Trail & Hawala — Awaiting Directive"
                                subtitle="No financial transaction data loaded. Execute an investigation directive to extract money flow trails, circular transfers, and AML flags."
                                context="Hawala corridors, mule accounts, and circular transaction chains will be visualized here."
                              />
                            )
                          }
                        />

                        {/* VIEW 5: CDR TELEMETRY & CALL SPIKE MATRIX */}
                        <Route
                          path="cdr"
                          element={
                            hasGraphData ? (
                              <CdrTelemetryView graphData={rawGraphData} />
                            ) : (
                              <AwaitingDirective
                                icon="cell_tower"
                                title="CDR Telemetry — Awaiting Directive"
                                subtitle="No call detail records loaded. Run an investigation to extract CDR telemetry, tower triangulation data, and call-spike analysis."
                                context="Call frequency heatmaps and mastermind communication patterns will populate here."
                              />
                            )
                          }
                        />

                        {/* VIEW 6: FIR CORPUS & IN-TEXT NER HIGHLIGHTER */}
                        <Route
                          path="fir"
                          element={
                            hasGraphData ? (
                              <FirCorpusView
                                graphData={rawGraphData}
                                onSelectEntity={(entityName) => {
                                  const found = rawGraphData.nodes.find((n) => n.name.includes(entityName));
                                  if (found) {
                                    setSelectedNode(found);
                                    navigate('/workspace/graph');
                                  }
                                }}
                                onJumpToGraph={() => navigate('/workspace/graph')}
                                onInvestigateFir={(fir) => {
                                  handleTriggerInvestigation(`Investigate FIR ${fir.fir_no} (${fir.doc_id}) involving ${fir.accused.join(', ')}`);
                                }}
                              />
                            ) : (
                              <AwaitingDirective
                                icon="policy"
                                title="FIR Documents — Awaiting Directive"
                                subtitle="No FIR corpus loaded. Execute an investigation query to retrieve digitized police First Information Reports and perform NER entity extraction."
                                context="FIR documents with highlighted named entities will appear in the reader pane."
                              />
                            )
                          }
                        />

                        {/* VIEW 7: BSA SECTION 65B LEGAL AUDIT VAULT */}
                        <Route
                          path="audit"
                          element={
                            hasGraphData ? (
                              <RbacRoute
                                allowedRoles={['LEAD_INVESTIGATOR', 'AUDITOR']}
                                currentRole={officerRole}
                                currentUser={currentUser}
                                onRoleChange={handleRoleChange}
                                pageTitle="Legal Audit Vault (BSA §65B)"
                              >
                                <LegalAuditVault
                                  caseInfo={rawGraphData.case_info}
                                  nodes={rawGraphData.nodes}
                                  edges={rawGraphData.edges}
                                  officerRole={officerRole}
                                  currentUser={currentUser}
                                  onRoleChange={handleRoleChange}
                                />
                              </RbacRoute>
                            ) : (
                              <AwaitingDirective
                                icon="verified_user"
                                title="Legal Audit Vault — Awaiting Directive"
                                subtitle="No audit ledger entries available. Run an investigation to generate cryptographic chain-of-custody audit logs for court admissibility under BSA §65B."
                                context="Immutable hash-chain ledger entries will be displayed after investigation operations are logged."
                              />
                            )
                          }
                        />
                        <Route
                          path="vault"
                          element={
                            hasGraphData ? (
                              <RbacRoute
                                allowedRoles={['LEAD_INVESTIGATOR', 'AUDITOR']}
                                currentRole={officerRole}
                                currentUser={currentUser}
                                onRoleChange={handleRoleChange}
                                pageTitle="Legal Audit Vault (BSA §65B)"
                              >
                                <LegalAuditVault
                                  caseInfo={rawGraphData.case_info}
                                  nodes={rawGraphData.nodes}
                                  edges={rawGraphData.edges}
                                  officerRole={officerRole}
                                  currentUser={currentUser}
                                  onRoleChange={handleRoleChange}
                                />
                              </RbacRoute>
                            ) : (
                              <AwaitingDirective
                                icon="verified_user"
                                title="Legal Audit Vault — Awaiting Directive"
                                subtitle="No audit ledger entries available. Run an investigation to generate cryptographic chain-of-custody audit logs for court admissibility under BSA §65B."
                                context="Immutable hash-chain ledger entries will be displayed after investigation operations are logged."
                              />
                            )
                          }
                        />

                        {/* Sub-workspace fallback */}
                        <Route path="*" element={<Navigate to="/workspace/graph" replace />} />
                      </Routes>
                    </main>
                  </div>
                </div>

                {/* Slide-Over Evidence & Investigation Drawer — Strictly visible only on Knowledge Graph page */}
                {selectedNode && activeTab === 'graph' && (
                  <EvidenceDrawer
                    selectedNode={selectedNode}
                    officerRole={officerRole}
                    currentUser={currentUser}
                    onClose={() => setSelectedNode(null)}
                    onFocusNode={(node) => {
                      setHighlightedNodeIds([node.id]);
                    }}
                    onTraceKingpin={handleTraceKingpin}
                    onOpenFirDoc={(docId) => {
                      navigate('/workspace/fir');
                    }}
                    onExpandSubgraph={handleExpandSubgraph}
                    onInvestigateNode={(node) => {
                      handleTriggerInvestigation(`Investigate suspect ${node.name} (${node.id}) and map connected syndicate operations`, node.id);
                    }}
                    allEdges={rawGraphData?.edges || []}
                    onOpenDossierModal={() => setShowDossierModal(true)}
                  />
                )}

                {/* Ingestion Modal */}
                <IngestModal
                  isOpen={showIngestModal}
                  onClose={() => setShowIngestModal(false)}
                  onIngestSuccess={loadData}
                />
              </div>
            </WorkspaceAuthGuard>
          }
        />

        {/* Global 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global Law Enforcement RBAC Authentication & Registration Modal */}
      <AuthModal
        isOpen={showAuthModal}
        initialTab={authModalTab}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Court Evidence Dossier & Export Modal */}
      <ExportDossierModal
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        caseInfo={rawGraphData?.case_info}
        nodes={rawGraphData?.nodes || []}
        edges={rawGraphData?.edges || []}
        currentUser={currentUser}
        officerRole={officerRole}
      />

      {/* Officer Field Guide & Operational Manual Modal */}
      <OfficerFieldGuideModal
        isOpen={showFieldGuideModal}
        onClose={() => setShowFieldGuideModal(false)}
      />
    </div>
  );
}
