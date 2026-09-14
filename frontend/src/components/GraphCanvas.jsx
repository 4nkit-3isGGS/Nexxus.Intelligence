import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Pause, 
  Play, 
  Sparkles,
  Layers,
  Crosshair
} from 'lucide-react';

export default function GraphCanvas({
  nodes,
  edges,
  selectedNode,
  onSelectNode,
  selectedEdge,
  onSelectEdge,
  highlightedNodeIds = [],
  highlightedEdgeIds = [],
  timelineDate = null,
  activeLayout = 'force',
  onLayoutChange
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Simulation & Viewport State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [physicsRunning, setPhysicsRunning] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Internal physical nodes state
  const simNodesRef = useRef([]);
  const animFrameRef = useRef(null);
  const pulseOffsetRef = useRef(0);

  // Cluster Center Anchors
  const clusterCenters = {
    bridge: { x: 0, y: -40, label: 'Mastermind Bridge' },
    cluster_a: { x: -300, y: 80, label: 'Cluster A: Extortion Cell' },
    cluster_b: { x: 300, y: 80, label: 'Cluster B: Laundering Cell' },
    victim: { x: -140, y: 330, label: 'Victims & Witnesses' },
  };

  // Sync Physical Nodes from Props
  useEffect(() => {
    const existingMap = new Map(simNodesRef.current.map(n => [n.id, n]));
    
    simNodesRef.current = nodes.map((node, i) => {
      const existing = existingMap.get(node.id);
      const clusterCenter = clusterCenters[node.cluster_id] || { x: 0, y: 0 };
      
      const baseRadius = node.type === 'Person' ? 22 : node.type === 'Organization' ? 20 : 17;
      const riskBonus = (node.risk_score || 0) * 0.12;
      const centralityBonus = (node.betweenness_centrality || 0) * 14;
      const radius = baseRadius + riskBonus + centralityBonus;

      const angle = (i / Math.max(nodes.length, 1)) * 2 * Math.PI;
      const spread = 80 + (i % 3) * 40;
      
      const initialX = existing?.x ?? (clusterCenter.x + Math.cos(angle) * spread + (Math.random() - 0.5) * 30);
      const initialY = existing?.y ?? (clusterCenter.y + Math.sin(angle) * spread + (Math.random() - 0.5) * 30);

      // Cyber Command Center Semantic Neon Colors
      let color = '#10b981'; // Emerald Low
      let glowColor = 'rgba(16, 185, 129, 0.35)';
      if (node.risk_score >= 85) {
        color = '#f43f5e'; // Crimson Critical
        glowColor = 'rgba(244, 63, 94, 0.45)';
      } else if (node.risk_score >= 70) {
        color = '#fbbf24'; // Amber High
        glowColor = 'rgba(251, 191, 36, 0.4)';
      } else if (node.risk_score >= 40) {
        color = '#06b6d4'; // Cyan Moderate
        glowColor = 'rgba(6, 182, 212, 0.4)';
      }

      return {
        ...node,
        x: initialX,
        y: initialY,
        vx: existing?.vx ?? 0,
        vy: existing?.vy ?? 0,
        radius,
        color,
        glowColor,
        isKingpin: node.id === 'P008' || node.name.includes('Debasish'),
      };
    });
  }, [nodes]);

  // Center initial view
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const fitZoom = rect.height < 600 ? 0.75 : rect.height < 750 ? 0.85 : 1;
      setPan({ x: rect.width / 2, y: rect.height / 2 - 30 });
      setZoom(fitZoom);
    }
  }, []);

  const applyLayout = (layoutType) => {
    if (!simNodesRef.current.length) return;
    const simNodes = simNodesRef.current;
    
    if (layoutType === 'radial') {
      simNodes.forEach((node) => {
        if (node.isKingpin) {
          node.x = 0;
          node.y = 0;
        } else {
          const isClusterA = node.cluster_id === 'cluster_a';
          const isClusterB = node.cluster_id === 'cluster_b';
          const ring = node.betweenness_centrality > 0.4 ? 140 : 260;
          const offsetAngle = isClusterA ? -Math.PI * 0.6 : isClusterB ? Math.PI * 0.6 : Math.PI * 0.2;
          const spread = (Math.random() - 0.5) * 1.2;
          node.x = Math.cos(offsetAngle + spread) * ring;
          node.y = Math.sin(offsetAngle + spread) * ring;
        }
        node.vx = 0;
        node.vy = 0;
      });
    } else if (layoutType === 'cluster') {
      simNodes.forEach((node, idx) => {
        const center = clusterCenters[node.cluster_id] || { x: 0, y: 0 };
        const angle = (idx * 1.3) % (2 * Math.PI);
        const radius = 60 + (idx % 4) * 25;
        node.x = center.x + Math.cos(angle) * radius;
        node.y = center.y + Math.sin(angle) * radius;
        node.vx = 0;
        node.vy = 0;
      });
    } else {
      // Force layout slight perturbation
      simNodes.forEach((node) => {
        node.vx += (Math.random() - 0.5) * 5;
        node.vy += (Math.random() - 0.5) * 5;
      });
    }
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updatePhysics = () => {
      if (!physicsRunning) return;
      const simNodes = simNodesRef.current;
      const kRepulsion = 1600;
      const kSpring = 0.035;
      const damping = 0.86;

      // 1. Repulsion between nodes
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const n1 = simNodes[i];
          const n2 = simNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);

          if (dist < 320) {
            const force = kRepulsion / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            n1.vx -= fx;
            n1.vy -= fy;
            n2.vx += fx;
            n2.vy += fy;
          }
        }
      }

      // 2. Spring force along edges
      const nodeMap = new Map(simNodes.map(n => [n.id, n]));
      edges.forEach((e) => {
        const src = nodeMap.get(e.source);
        const tgt = nodeMap.get(e.target);
        if (!src || !tgt) return;

        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const desiredDist = e.is_bridge ? 150 : e.is_anomaly ? 110 : 130;
        const displacement = dist - desiredDist;
        const force = displacement * kSpring;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        src.vx += fx;
        src.vy += fy;
        tgt.vx -= fx;
        tgt.vy -= fy;
      });

      // 3. Cluster gravity & Kingpin anchor
      simNodes.forEach((node) => {
        if (node.id === draggingNodeId) return;

        if (activeLayout === 'radial' && node.isKingpin) {
          node.vx *= 0.1;
          node.vy *= 0.1;
          node.x += (0 - node.x) * 0.1;
          node.y += (0 - node.y) * 0.1;
          return;
        }

        const center = clusterCenters[node.cluster_id] || { x: 0, y: 0 };
        const gravityStrength = 0.008;
        node.vx += (center.x - node.x) * gravityStrength;
        node.vy += (center.y - node.y) * gravityStrength;

        // Apply damping and step
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;
      });
    };

    const render = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      }

      const { width, height } = canvas;
      
      // Fill canvas with clean light canvas background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      pulseOffsetRef.current = (pulseOffsetRef.current + 0.035) % 100;
      const pulseVal = Math.sin(pulseOffsetRef.current);

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw Grid Crosshairs
      const gridSpacing = 100;
      const startX = Math.floor((-pan.x / zoom - 200) / gridSpacing) * gridSpacing;
      const endX = Math.floor((-pan.x / zoom + width / zoom + 200) / gridSpacing) * gridSpacing;
      const startY = Math.floor((-pan.y / zoom - 200) / gridSpacing) * gridSpacing;
      const endY = Math.floor((-pan.y / zoom + height / zoom + 200) / gridSpacing) * gridSpacing;

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.04)';
      ctx.lineWidth = 1;
      for (let x = startX; x <= endX; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }
      for (let y = startY; y <= endY; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }

      // Small subtle crosshairs at grid intersections
      ctx.fillStyle = 'rgba(2, 132, 199, 0.15)';
      for (let x = startX; x <= endX; x += gridSpacing * 2) {
        for (let y = startY; y <= endY; y += gridSpacing * 2) {
          ctx.fillRect(x - 3, y - 0.5, 7, 1);
          ctx.fillRect(x - 0.5, y - 3, 1, 7);
        }
      }

      // 1. Subtle Cluster Envelopes
      Object.entries(clusterCenters).forEach(([clusterId, center]) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(center.x, center.y, 165, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(center.x, center.y, 20, center.x, center.y, 165);
        if (clusterId === 'bridge') {
          grad.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
          grad.addColorStop(1, 'rgba(124, 58, 237, 0)');
        } else if (clusterId === 'cluster_a') {
          grad.addColorStop(0, 'rgba(220, 38, 38, 0.07)');
          grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
        } else if (clusterId === 'cluster_b') {
          grad.addColorStop(0, 'rgba(217, 119, 6, 0.07)');
          grad.addColorStop(1, 'rgba(217, 119, 6, 0)');
        } else {
          grad.addColorStop(0, 'rgba(5, 150, 105, 0.06)');
          grad.addColorStop(1, 'rgba(5, 150, 105, 0)');
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Dashed cluster boundary
        ctx.beginPath();
        ctx.arc(center.x, center.y, 165, 0, Math.PI * 2);
        ctx.strokeStyle = clusterId === 'bridge' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(100, 116, 139, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '600 10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(51, 65, 85, 0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(center.label.toUpperCase(), center.x, center.y - 145);
        ctx.restore();
      });

      const simNodes = simNodesRef.current;
      const nodeMap = new Map(simNodes.map(n => [n.id, n]));
      const hasHighlights = highlightedNodeIds.length > 0;

      // 2. Draw Edges with Directional Glowing Energy Pulses
      edges.forEach((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return;

        const isEdgeHighlighted = highlightedEdgeIds.includes(edge.id) || 
          (selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id));
        const isDimmed = hasHighlights && !isEdgeHighlighted && !highlightedNodeIds.includes(edge.source) && !highlightedNodeIds.includes(edge.target);

        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.2 : 1;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (edge.is_anomaly || edge.sub_type === 'CALL_SPIKE_ANOMALY') {
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = isEdgeHighlighted ? 3.5 : 2;
          ctx.stroke();

          // Animated energy pulse particle
          const progress = (pulseOffsetRef.current * 0.8) % 1;
          const px = source.x + (target.x - source.x) * progress;
          const py = source.y + (target.y - source.y) * progress;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#dc2626';
          ctx.fill();

        } else if (edge.anomaly_type?.includes('CIRCULAR') || edge.is_circular) {
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = isEdgeHighlighted ? 3.5 : 2;
          ctx.stroke();

          const progress = (pulseOffsetRef.current * 0.5) % 1;
          const px = source.x + (target.x - source.x) * progress;
          const py = source.y + (target.y - source.y) * progress;
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#d97706';
          ctx.fill();

        } else if (edge.is_bridge) {
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth = isEdgeHighlighted ? 3.5 : 2;
          ctx.stroke();
        } else {
          ctx.strokeStyle = isEdgeHighlighted ? '#0284c7' : 'rgba(100, 116, 139, 0.35)';
          ctx.lineWidth = isEdgeHighlighted ? 2.5 : 1.2;
          ctx.stroke();
        }

        // Amount / Call Count Pill on Edge
        if ((zoom > 0.95 || isEdgeHighlighted) && (edge.amount || edge.frequency)) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          const tag = edge.amount ? `₹${(edge.amount).toLocaleString('en-IN')}` : `${edge.frequency} calls`;

          ctx.font = 'bold 9px JetBrains Mono, monospace';
          const textWidth = ctx.measureText(tag).width;

          // Pill backdrop
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.strokeStyle = edge.is_anomaly ? '#dc2626' : edge.amount ? '#d97706' : 'rgba(148, 163, 184, 0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(midX - textWidth / 2 - 4, midY - 14, textWidth + 8, 14, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = edge.is_anomaly ? '#b91c1c' : edge.amount ? '#b45309' : '#334155';
          ctx.textAlign = 'center';
          ctx.fillText(tag, midX, midY - 4);
        }

        ctx.restore();
      });

      // 3. Draw Nodes
      simNodes.forEach((node) => {
        const isSelected = selectedNode?.id === node.id;
        const isHighlighted = highlightedNodeIds.includes(node.id) || isSelected;
        const isDimmed = hasHighlights && !isHighlighted;

        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.25 : 1;

        // Pulsing Halo
        if (node.isKingpin || node.risk_score >= 85 || isSelected) {
          ctx.beginPath();
          const haloRadius = node.radius + (node.isKingpin ? 9 + pulseVal * 2 : 5 + pulseVal * 1.5);
          ctx.arc(node.x, node.y, haloRadius, 0, Math.PI * 2);
          ctx.fillStyle = node.isKingpin ? 'rgba(124, 58, 237, 0.15)' : (node.glowColor || 'rgba(220, 38, 38, 0.12)');
          ctx.fill();

          // Outer dashed ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, haloRadius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = node.isKingpin ? '#7c3aed' : node.color;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Base Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Inner Radial Glow Tint
        const innerGrad = ctx.createRadialGradient(node.x - 2, node.y - 2, 2, node.x, node.y, node.radius);
        innerGrad.addColorStop(0, node.color + '25');
        innerGrad.addColorStop(1, '#ffffff');
        ctx.fillStyle = innerGrad;
        ctx.fill();

        // Node Border Ring
        ctx.lineWidth = isSelected ? 3.5 : node.isKingpin ? 3 : 2.2;
        ctx.strokeStyle = isSelected ? '#0284c7' : node.color;
        ctx.stroke();

        // Icon Glyph
        ctx.font = `${Math.round(node.radius * 0.85)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let glyph = '👤';
        if (node.type === 'Phone') glyph = '📱';
        if (node.type === 'Organization') glyph = '🏢';
        if (node.type === 'Vehicle') glyph = '🚗';
        if (node.type === 'Account') glyph = '💳';
        if (node.isKingpin) glyph = '👑';
        ctx.fillText(glyph, node.x, node.y);

        // Risk Score Floating Badge
        if (node.risk_score !== undefined && node.risk_score > 0) {
          const badgeX = node.x + node.radius * 0.72;
          const badgeY = node.y - node.radius * 0.72;
          ctx.beginPath();
          ctx.arc(badgeX, badgeY, 8.5, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = 'bold 8px JetBrains Mono, monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${node.risk_score}`, badgeX, badgeY);
        }

        // Clean Modern Light Name Label (100% Legible)
        if (showLabels || isSelected || isHighlighted) {
          const displayName = node.name.length > 22 ? node.name.substring(0, 20) + '...' : node.name;
          ctx.font = `${node.isKingpin ? 'bold 11px' : '600 10.5px'} Inter, sans-serif`;
          const textMetrics = ctx.measureText(displayName);
          const labelWidth = textMetrics.width + 12;
          const labelHeight = 16;
          const labelY = node.y + node.radius + 6;

          // White pill backdrop with subtle shadow
          ctx.beginPath();
          ctx.roundRect(node.x - labelWidth / 2, labelY, labelWidth, labelHeight, 6);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = isSelected ? '#0284c7' : 'rgba(203, 213, 225, 0.9)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Label Text
          ctx.fillStyle = isSelected ? '#0284c7' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(displayName, node.x, labelY + labelHeight / 2);
        }

        ctx.restore();
      });

      ctx.restore();
    };

    let animationId;
    const loop = () => {
      updatePhysics();
      render();
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationId);
  }, [edges, selectedNode, highlightedNodeIds, highlightedEdgeIds, zoom, pan, physicsRunning, showLabels, activeLayout]);

  // Mouse / Pan / Drag Handlers
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldPos = {
      x: (mouseX - pan.x) / zoom,
      y: (mouseY - pan.y) / zoom,
    };

    const clickedNode = simNodesRef.current.find((node) => {
      const dx = node.x - worldPos.x;
      const dy = node.y - worldPos.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius + 4;
    });

    if (clickedNode) {
      setDraggingNodeId(clickedNode.id);
      onSelectNode(clickedNode);
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: mouseX - pan.x, y: mouseY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const worldPos = {
      x: (mouseX - pan.x) / zoom,
      y: (mouseY - pan.y) / zoom,
    };

    if (draggingNodeId) {
      const node = simNodesRef.current.find((n) => n.id === draggingNodeId);
      if (node) {
        node.x = worldPos.x;
        node.y = worldPos.y;
        node.vx = 0;
        node.vy = 0;
      }
    } else if (isDraggingCanvas) {
      setPan({
        x: mouseX - dragStart.x,
        y: mouseY - dragStart.y,
      });
    } else {
      // Hover detection
      const hoverNode = simNodesRef.current.find((node) => {
        const dx = node.x - worldPos.x;
        const dy = node.y - worldPos.y;
        return Math.sqrt(dx * dx + dy * dy) <= node.radius + 5;
      });
      setHoveredNode(hoverNode || null);
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsDraggingCanvas(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.4), 3.0);

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setPan({
      x: mouseX - (mouseX - pan.x) * (newZoom / zoom),
      y: mouseY - (mouseY - pan.y) * (newZoom / zoom)
    });
    setZoom(newZoom);
  };

  const resetView = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const fitZoom = rect.height < 600 ? 0.75 : rect.height < 750 ? 0.85 : 1;
      setPan({ x: rect.width / 2, y: rect.height / 2 - 30 });
      setZoom(fitZoom);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-0 bg-slate-50 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Canvas Floating Bottom Controls & Legend Strip */}
      <div className="absolute left-4 bottom-4 z-30 flex flex-col gap-2.5 pointer-events-auto">
        {/* Layout Switcher & Navigation Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/95 shadow-md border border-slate-200 backdrop-blur-md">
          {/* Topology Engine Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 text-xs font-mono border border-slate-200">
            <button
              onClick={() => {
                applyLayout('force');
                onLayoutChange?.('force');
              }}
              className={`px-3 py-1 rounded-lg transition-all font-semibold cursor-pointer ${
                activeLayout === 'force'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Force-Directed
            </button>
            <button
              onClick={() => {
                applyLayout('cluster');
                onLayoutChange?.('cluster');
              }}
              className={`px-3 py-1 rounded-lg transition-all font-semibold cursor-pointer ${
                activeLayout === 'cluster'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cluster Hierarchy
            </button>
            <button
              onClick={() => {
                applyLayout('radial');
                onLayoutChange?.('radial');
              }}
              className={`px-3 py-1 rounded-lg transition-all font-semibold cursor-pointer ${
                activeLayout === 'radial'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Radial Multi-Tier
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-0.5"></div>

          {/* Canvas Operations */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.min(z * 1.2, 3.0))}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors border border-slate-200 shadow-xs cursor-pointer"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z * 0.8, 0.4))}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors border border-slate-200 shadow-xs cursor-pointer"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[17px]">remove</span>
            </button>
            <button
              onClick={resetView}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors border border-slate-200 shadow-xs cursor-pointer"
              title="Reset Canvas Centering"
            >
              <span className="material-symbols-outlined text-[17px]">filter_center_focus</span>
            </button>
            <button
              onClick={() => setPhysicsRunning(!physicsRunning)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border shadow-xs cursor-pointer ${
                physicsRunning 
                  ? 'bg-slate-50 hover:bg-slate-100 text-sky-700 border-slate-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={physicsRunning ? 'Pause Physics Simulation' : 'Resume Physics Simulation'}
            >
              <span className="material-symbols-outlined text-[17px]">
                {physicsRunning ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>
        </div>

        {/* Network Legend Overlay */}
        <div className="px-3.5 py-1.5 rounded-2xl bg-white/95 shadow-md border border-slate-200 backdrop-blur-md flex items-center gap-3.5 text-[11px] font-mono text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="font-semibold">Critical (&gt;85)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="font-semibold">High (70-84)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span className="font-semibold">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="font-semibold">Victim / Low</span>
          </div>
          <div className="h-3 w-px bg-slate-200"></div>
          <div className="flex items-center gap-1 text-amber-800 font-semibold">
            <span className="material-symbols-outlined text-[14px]">payments</span> Financial
          </div>
          <div className="flex items-center gap-1 text-sky-700 font-semibold">
            <span className="material-symbols-outlined text-[14px]">cell_tower</span> Comms
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredNode && !isDraggingCanvas && !draggingNodeId && (
        <div 
          className="absolute pointer-events-none bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xl z-40 max-w-xs transition-opacity animate-fade-in"
          style={{
            left: `${hoveredNode.x * zoom + pan.x + 18}px`,
            top: `${hoveredNode.y * zoom + pan.y - 18}px`,
          }}
        >
          <div className="flex items-center justify-between space-x-2 mb-1">
            <span className="font-bold text-slate-900 text-xs truncate">{hoveredNode.name}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                hoveredNode.risk_score >= 85
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : hoveredNode.risk_score >= 70
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-sky-50 text-sky-800 border border-sky-200'
              }`}
            >
              Risk: {hoveredNode.risk_score}
            </span>
          </div>
          <p className="text-[11px] text-sky-700 font-semibold mb-1">{hoveredNode.role || hoveredNode.type}</p>
          <p className="text-[10px] text-slate-600 line-clamp-2">{hoveredNode.summary}</p>
        </div>
      )}
    </div>
  );
}
