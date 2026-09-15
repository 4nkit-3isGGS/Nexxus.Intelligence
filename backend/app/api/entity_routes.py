#  GET /api/entity/{id} — entity detail with phones
#  GET /api/entity/{id}/neighbors — 1-hop connections
#  GET /api/entity/{id}/subgraph — multi-hop (configurable depth)
#  GET /api/entity/{id}/shared-locations — co-occurrence
#  GET /api/entity/{id1}/evidence/{id2}
"""
Entity API Routes
-----------------
Endpoints for querying individual entities and their connections.
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from backend.app.services.graph_service import (
    get_entity,
    get_neighbors,
    get_subgraph,
    get_shared_locations,
    get_evidence,
    get_review_queue,
    merge_duplicate_entities,
)
from backend.app.auth.rbac import get_current_user, require_permission, mask_entity_pii
from backend.app.auth.models import Permission, UserSession, Role
from backend.app.audit.audit_logger import audit_ledger
from backend.app.audit.models import AuditAction

router = APIRouter(prefix="/api/entity", tags=["Entity"])


class MergeEntitiesRequest(BaseModel):
    target_id: str
    duplicate_id: str


@router.get("/review-queue")
def entity_review_queue(
    current_user: UserSession = Depends(require_permission(Permission.VIEW_GRAPH)),
) -> list[dict]:
    """Returns all entity pairs flagged with POSSIBLE_DUPLICATE for investigator review."""
    queue = get_review_queue()
    if not current_user.has_permission(Permission.UNMASK_PII):
        masked_queue = []
        for item in queue:
            item_copy = dict(item)
            if "entity1_details" in item_copy and isinstance(item_copy["entity1_details"], dict):
                item_copy["entity1_details"] = mask_entity_pii(item_copy["entity1_details"], current_user)
            if "entity2_details" in item_copy and isinstance(item_copy["entity2_details"], dict):
                item_copy["entity2_details"] = mask_entity_pii(item_copy["entity2_details"], current_user)
            masked_queue.append(item_copy)
        return masked_queue
    return queue


@router.post("/merge")
def entity_merge(
    req: MergeEntitiesRequest,
    current_user: UserSession = Depends(require_permission(Permission.MERGE_ENTITIES)),
) -> dict:
    """Approves and executes the merge of duplicate_id into target_id. Restricted to LEAD_INVESTIGATOR."""
    result = merge_duplicate_entities(req.target_id, req.duplicate_id)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Merge failed"))

    # Log operational merge action to tamper-evident audit ledger
    audit_ledger.log_event(
        user_id=current_user.user_id,
        badge_number=current_user.badge_number,
        role=current_user.role.value,
        action="MERGE_ENTITIES",
        resource_type="Entity",
        resource_id=req.target_id,
        details={"duplicate_id": req.duplicate_id, "status": "APPROVED"}
    )
    return result


# Plural alias router (/api/entities/...) for dashboard compatibility
entities_router = APIRouter(prefix="/api/entities", tags=["Entities"])
entities_router.add_api_route("/review-queue", entity_review_queue, methods=["GET"], summary="Review Queue (Entities Alias)")
entities_router.add_api_route("/merge", entity_merge, methods=["POST"], summary="Merge Entities (Entities Alias)")


@router.get("/{entity_id}")
def entity_details(
    entity_id: str,
    current_user: UserSession = Depends(get_current_user),
) -> dict:
    """Returns an entity with all properties and linked phone numbers, masked based on officer clearance."""
    result = get_entity(entity_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Entity {entity_id} not found")
    return mask_entity_pii(result, current_user)


@router.get("/{entity_id}/neighbors")
def entity_neighbors(entity_id: str) -> list[dict]:
    """Returns all direct 1-hop connections of an entity."""
    return get_neighbors(entity_id)
    

@router.get("/{entity_id}/subgraph")
def entity_subgraph(entity_id: str, depth: int = Query(2, ge=1, le=5)):
    """Returns multi-hop subgraph around an entity up to given depth."""
    return get_subgraph(entity_id, depth)


@router.get("/{entity_id}/shared-locations")
def entity_shared_locations(entity_id: str) -> list[dict]:
    """Finds other people present at the same locations as the given person."""
    return get_shared_locations(entity_id)


@router.get("/{id1}/evidence/{id2}")
def entity_evidence(id1: str, id2: str) -> list[dict]:
    """Returns provenance/evidence data for relationships between two entities."""
    return get_evidence(id1, id2)

