"""
Graph API Routes
----------------
Endpoints for graph-wide operations: paths, search, stats.
"""


from typing import Optional
from fastapi import APIRouter, Query, Depends

from backend.app.services.graph_service import (
    get_graph_stats,
    get_shortest_path,
    search_entities,
    get_graph_overview,
    get_high_risk_entities,
)
from backend.app.auth.rbac import get_current_user, mask_entity_pii
from backend.app.auth.models import Permission, UserSession

router = APIRouter(prefix="/api/graph", tags=["Graph"])

@router.get("/overview")
def graph_overview(
    limit: int = Query(100, ge=10, le=500),
    current_user: UserSession = Depends(get_current_user),
) -> dict:
    """Returns connected network nodes and edges formatted for visual graph canvases with RBAC PII masking."""
    data = get_graph_overview(limit)
    if not current_user.has_permission(Permission.UNMASK_PII) and "nodes" in data:
        data["nodes"] = [mask_entity_pii(n, current_user) for n in data["nodes"]]
    return data


@router.get("/high-risk")
def high_risk_suspects(
    limit: int = Query(10, ge=1, le=50),
    current_user: UserSession = Depends(get_current_user),
) -> list:
    """Returns top high-risk suspects for dashboard threat intelligence cards with RBAC PII masking."""
    suspects = get_high_risk_entities(limit)
    if not current_user.has_permission(Permission.UNMASK_PII):
        return [mask_entity_pii(s, current_user) for s in suspects]
    return suspects


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
    current_user: UserSession = Depends(get_current_user),
):
    """Searches entities by name, alias, phone number, vehicle plate, crypto address, or FIR with RBAC PII masking."""
    results = search_entities(query=query, limit=limit, entity_type=type)
    if not current_user.has_permission(Permission.UNMASK_PII):
        return [mask_entity_pii(e, current_user) for e in results]
    return results


