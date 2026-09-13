"""
Graph API Routes
----------------
Endpoints for graph-wide operations: paths, search, stats.
"""


from typing import Optional
from fastapi import APIRouter, Query

from backend.app.services.graph_service import (
    get_graph_stats,
    get_shortest_path,
    search_entities,
    get_graph_overview,
    get_high_risk_entities,
)

router = APIRouter(prefix="/api/graph", tags=["Graph"])

@router.get("/overview")
def graph_overview(limit: int = Query(100, ge=10, le=500)) -> dict:
    """Returns connected network nodes and edges formatted for visual graph canvases (Cytoscape.js / Vis.js)."""
    return get_graph_overview(limit)


@router.get("/high-risk")
def high_risk_suspects(limit: int = Query(10, ge=1, le=50)) -> list:
    """Returns top high-risk suspects for dashboard threat intelligence cards."""
    return get_high_risk_entities(limit)


@router.get("/path")
def shortest_path(id1: str = Query(...), id2: str = Query(...)) -> dict:
    """Finds the shortest path between two entities."""
    return get_shortest_path(id1, id2)


@router.get("/stats")
def graph_stats() -> dict:
    """Returns node and relationship counts for the dashboard."""
    stats = get_graph_stats()
    total_nodes = sum(s["count"] for s in stats if s.get("category") == "node")
    total_relationships = sum(s["count"] for s in stats if s.get("category") == "relationship")
    return {
        "total_nodes": total_nodes,
        "total_relationships": total_relationships,
        "breakdown": stats
    }


@router.get("/search")
def search(
    query: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
    type: Optional[str] = Query(None, description="Optional entity label filter (e.g. Person, Phone, Vehicle, CryptoWallet, CrimeIncident)"),
):
    """Searches entities by name, alias, phone number, vehicle plate, crypto address, or FIR."""
    return search_entities(query=query, limit=limit, entity_type=type)


