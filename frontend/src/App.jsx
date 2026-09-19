import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ToastProvider } from './context/ToastContext';
import { apiService } from './services/api';
import { MOCK_GRAPH_DATA, AGENT_QUERY_PRESETS } from './data/mockIntelligenceData';

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
    if (path.includes('/workspace/audit')) return 'audit';
    if (path.includes('/workspace/graph')) return 'graph';
    return null;
  }, [location.pathname]);

  // Core Data
  const [rawGraphData, setRawGraphData] = useState(MOCK_GRAPH_DATA);
  const [backendStatus, setBackendStatus] = useState({ isLive: false, source: 'AUTONOMOUS_DATASET' });
  const [graphStats, setGraphStats] = useState({ total_nodes: 16, total_relationships: 28 });
  const [loading, setLoading] = useState(false);
  const [showIngestModal, setShowIngestModal] = useState(false);

  // Authentication & Law Enforcement RBAC State
  const [currentUser, setCurrentUser] = useState(() => apiService.getCurrentUser());
  const [officerRole, setOfficerRole] = useState(currentUser?.role || 'LEAD_INVESTIGATOR');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
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

  // Agent State
  const [agentResponse, setAgentResponse] = useState(AGENT_QUERY_PRESETS[0].response);
  const [loadingQuery, setLoadingQuery] = useState(false);

  // Fetch / Refresh Data on Mount
  const loadData = useCallback(async () => {
    setLoading(true);
    const health = await apiService.checkHealth();
    const result = await apiService.getGraph();
    const stats = await apiService.getStats();

    if (result?.data) {
      setRawGraphData(result.data);
      setBackendStatus({
        isLive: health.isLive || result.source === 'LIVE_FASTAPI',
        source: result.source
      });
    }

    if (stats?.data) {
      setGraphStats(stats.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
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
    navigate('/workspace/graph');
    loadData();
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
    setLoadingQuery(true);
    const result = await apiService.runInvestigation({ query: queryText, subjectId });
    if (result?.data) {
      setAgentResponse({
        query: queryText,
        ...result.data,
      });
      if (result.data.highlighted_nodes) {
        setHighlightedNodeIds(result.data.highlighted_nodes);
      }
      if (result.data.highlighted_edges) {
        setHighlightedEdgeIds(result.data.highlighted_edges);
      }

      // Merge newly discovered nodes & edges into active canvas graph
      if (result.data.graph_data?.nodes?.length) {
        setRawGraphData((prev) => {
          const existingNodeIds = new Set(prev.nodes.map((n) => n.id));
          const existingEdgeKeys = new Set(prev.edges.map((e) => `${e.source}->${e.target}:${e.type || e.label || ''}`));

          const newNodes = [...prev.nodes];
          result.data.graph_data.nodes.forEach((n) => {
            if (!existingNodeIds.has(n.id)) {
              newNodes.push(n);
              existingNodeIds.add(n.id);
            }
          });

          const newEdges = [...prev.edges];
          result.data.graph_data.edges.forEach((e) => {
            const k = `${e.source}->${e.target}:${e.type || e.label || ''}`;
            if (!existingEdgeKeys.has(k)) {
              newEdges.push(e);
              existingEdgeKeys.add(k);
            }
          });

          return { ...prev, nodes: newNodes, edges: newEdges };
        });
      }
    } else if (result?.error) {
      setAgentResponse({
        query: queryText,
        error: result.error,
        hypotheses: [],
        tool_history: [],
      });
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
    <ToastProvider>
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
                onQuickRoleSelect={handleQuickRoleSelect}
                onInvestigate={(query, subjectId) => handleTriggerInvestigation(query, subjectId)}
                stats={{
                  totalNodes: graphStats.total_nodes || rawGraphData?.nodes?.length || 31,
                  totalEdges: graphStats.total_relationships || rawGraphData?.edges?.length || 42,
                  totalAmount: '₹14,85,000'
                }}
              />
            </div>
          }
        />

        {/* WORKSPACE ROOT REDIRECT */}
        <Route
          path="/workspace"
          element={<Navigate to="/workspace/graph" replace />}
        />

        {/* WORKSPACE COMMAND CENTER LAYOUT */}
        <Route
          path="/workspace/*"
          element={
            <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative">
              {/* 1. Tactical Header */}
              <Header
                activeTab={activeTab}
                backendStatus={backendStatus}
                refreshData={loadData}
                caseInfo={rawGraphData?.case_info}
                kpiStats={{
                  totalNodes: graphStats.total_nodes || rawGraphData?.nodes?.length || 0,
                  totalEdges: graphStats.total_relationships || rawGraphData?.edges?.length || 0,
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
              />

              {/* Main App Body Row: Sidebar + Primary Workspace */}
              <div className="flex-1 flex overflow-hidden w-full relative min-h-0">
                {/* 2. Tactical Ops Left Sidebar */}
                <Sidebar
                  activeTab={activeTab}
                  nodeCount={graphStats.total_nodes || rawGraphData?.nodes?.length || 31}
                  pendingReviewCount={3}
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
                        }
                      />

                      {/* VIEW 2: AI AGENTIC INVESTIGATION CONSOLE */}
                      <Route
                        path="investigation"
                        element={
                          <AgentQueryBar
                            onRunAgentQuery={handleRunAgentQuery}
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
                          <EntityResolutionView
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
                        }
                      />

                      {/* VIEW 4: CIRCULAR MONEY TRAIL & AML FLOW */}
                      <Route
                        path="financial"
                        element={
                          <FinancialFlowView
                            onSelectEntity={(nodeId) => {
                              const found = rawGraphData.nodes.find((n) => n.id === nodeId);
                              if (found) {
                                setSelectedNode(found);
                                navigate('/workspace/graph');
                              }
                            }}
                          />
                        }
                      />

                      {/* VIEW 5: CDR TELEMETRY & CALL SPIKE MATRIX */}
                      <Route
                        path="cdr"
                        element={<CdrTelemetryView />}
                      />

                      {/* VIEW 6: FIR CORPUS & IN-TEXT NER HIGHLIGHTER */}
                      <Route
                        path="fir"
                        element={
                          <FirCorpusView
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
                        }
                      />

                      {/* VIEW 7: BSA SECTION 65B LEGAL AUDIT VAULT */}
                      <Route
                        path="audit"
                        element={
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
    </ToastProvider>
  );
}
