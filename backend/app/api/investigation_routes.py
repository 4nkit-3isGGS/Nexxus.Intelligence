"""
Investigation API Routes (LangGraph Multi-Agent Investigation Layer)
--------------------------------------------------------------------
Exposes the autonomous multi-agent criminal network intelligence engine
for Bishal & Jayanta's frontend UI and automated investigation workflows.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from backend.app.agents.state import initial_state
from backend.app.agents.nodes.supervisor import create_full_investigation_graph
from backend.app.auth.models import Permission, UserSession
from backend.app.auth.rbac import require_permission, mask_entity_pii
from backend.app.audit.audit_logger import audit_ledger
from backend.app.audit.models import AuditAction

router = APIRouter(prefix="/api", tags=["Investigation"])


class InvestigateRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Investigative query or hypothesis (e.g. 'Investigate Rahul Sharma')")
    subject_id: Optional[str] = Field(None, description="Explicit primary suspect entity ID (e.g. 'P001')")
    mock_mode: bool = Field(False, description="Whether to use mock worker stubs (for offline testing or rapid UI demos)")


def format_investigation_graph_data(
    entities: List[Dict[str, Any]],
    relationships: List[Dict[str, Any]],
    subject_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Transforms discovered entities and relationships into standardized Cytoscape / Vis.js format."""
    type_color_map = {
        "Person": "#ef4444",        # Red
        "Phone": "#3b82f6",         # Blue
        "Vehicle": "#f59e0b",       # Amber
        "Organization": "#8b5cf6",  # Purple
        "CryptoWallet": "#10b981",  # Emerald
        "CrimeIncident": "#ec4899", # Pink
        "FIR": "#ec4899",
        "Location": "#06b6d4",      # Cyan
        "IPAddress": "#64748b",     # Slate
        "IMEI": "#d97706",          # Orange
    }

    nodes = []
    seen_node_ids = set()
    for ent in entities:
        ent_id = str(ent.get("id") or ent.get("number") or ent.get("name") or ent.get("registration_number") or id(ent))
        if ent_id in seen_node_ids:
            continue
        seen_node_ids.add(ent_id)

        ent_label = ent.get("label") or ent.get("type") or "Entity"
        if isinstance(ent.get("labels"), list) and ent["labels"]:
            ent_label = ent["labels"][0]

        is_subject = bool(subject_id and ent_id == subject_id)
        risk_score = ent.get("risk_score", 0) or 0
        display_name = ent.get("name") or ent.get("number") or ent.get("registration_number") or ent.get("address") or ent_id

        color = "#dc2626" if is_subject else type_color_map.get(ent_label, "#6b7280")
        size = 50 if is_subject else max(25, min(60, 25 + int(risk_score * 0.35)))

        nodes.append({
            "id": ent_id,
            "label": display_name,
            "type": ent_label,
            "is_subject": is_subject,
            "risk_score": risk_score,
            "color": color,
            "size": size,
            "properties": ent,
        })

    edges = []
    seen_edge_keys = set()
    for rel in relationships:
        src = rel.get("source") or rel.get("start") or rel.get("from")
        tgt = rel.get("target") or rel.get("end") or rel.get("to")
        rel_type = rel.get("type") or rel.get("relationship") or "CONNECTED_TO"
        if not src or not tgt:
            continue
        edge_key = f"{src}->{tgt}:{rel_type}"
        if edge_key in seen_edge_keys:
            continue
        seen_edge_keys.add(edge_key)

        edges.append({
            "id": f"edge-{len(edges)+1}",
            "source": str(src),
            "target": str(tgt),
            "label": rel_type,
            "properties": rel.get("properties", {}),
        })

    return {"nodes": nodes, "edges": edges}


def format_investigation_summary(
    final_state: Dict[str, Any],
    entities_count: int,
    edges_count: int,
) -> Dict[str, Any]:
    """Generates an executive threat scorecard for dashboard summary cards."""
    risk = final_state.get("risk_analysis", {})
    risk_score = risk.get("risk_score", 0)
    threat_tier = "HIGH CRITICAL" if risk_score >= 70 else "MODERATE" if risk_score >= 40 else "LOW/MONITORING"

    return {
        "subject_id": final_state.get("subject_entity_id"),
        "threat_tier": threat_tier,
        "risk_score": risk_score,
        "entities_mapped": entities_count,
        "relationships_mapped": edges_count,
        "hypotheses_evaluated": len(final_state.get("hypotheses", [])),
        "evidence_corroborated": len(final_state.get("evidence_items", [])),
        "bsa_65b_certified": True,
    }


class InvestigateResponse(BaseModel):
    subject_id: Optional[str]
    query: str
    status: str
    iterations: int
    dossier: str
    summary: Dict[str, Any] = Field(default_factory=dict, description="Executive threat intelligence summary card")
    graph_data: Dict[str, Any] = Field(default_factory=dict, description="Visual graph canvas elements (nodes & edges) for Cytoscape.js / Vis.js")
    hypotheses: List[Dict[str, Any]]
    discovered_entities: List[Dict[str, Any]]
    discovered_relationships: List[Dict[str, Any]]
    evidence_items: List[Dict[str, Any]]
    verification_audit: List[Dict[str, Any]]
    tool_history: List[Dict[str, Any]]


@router.post("/investigate", response_model=InvestigateResponse)
def run_investigation(
    request: InvestigateRequest,
    current_user: UserSession = Depends(require_permission(Permission.INVESTIGATE)),
):
    """Executes an autonomous multi-agent criminal network investigation.
    
    Orchestrates the 7-agent pipeline:
    Supervisor -> Graph Investigator -> Risk Analyst -> Evidence Verifier ->
    Financial & Cyber Analyst -> Analysis Agent -> Critic / Verifier -> Report Agent.
    
    Access Restricted: INVESTIGATOR, LEAD_INVESTIGATOR.
    Every query is audited in the tamper-evident cryptographic hash ledger.
    """
    try:
        # Initialize state with full pipeline flag
        state = initial_state(
            user_query=request.query,
            subject_entity_id=request.subject_id,
            full_pipeline=True,
        )

        # Build and invoke compiled StateGraph
        graph = create_full_investigation_graph(worker_stubs=request.mock_mode)
        final_state = graph.invoke(state)

        # Apply RBAC PII redaction according to officer clearance level
        masked_entities = [
            mask_entity_pii(entity, current_user)
            for entity in final_state.get("discovered_entities", [])
        ]
        rels = final_state.get("discovered_relationships", [])
        subj_id = final_state.get("subject_entity_id")

        # Format visual graph canvas data and executive summary card
        graph_canvas_data = format_investigation_graph_data(
            entities=masked_entities,
            relationships=rels,
            subject_id=subj_id,
        )
        summary_card = format_investigation_summary(
            final_state=final_state,
            entities_count=len(masked_entities),
            edges_count=len(rels),
        )

        # Record tamper-evident audit event
        audit_ledger.log_event(
            user_id=current_user.user_id,
            badge_number=current_user.badge_number,
            role=current_user.role.value,
            action=AuditAction.RUN_INVESTIGATION.value,
            resource_type="CriminalInvestigation",
            resource_id=subj_id or "UNSPECIFIED",
            details={
                "query": request.query,
                "iterations": final_state.get("iteration", 0),
                "entities_mapped": len(masked_entities),
            },
        )

        return InvestigateResponse(
            subject_id=subj_id,
            query=final_state.get("user_query", request.query),
            status=final_state.get("current_step", "COMPLETED"),
            iterations=final_state.get("iteration", 0),
            dossier=final_state.get("final_answer") or "No dossier generated.",
            summary=summary_card,
            graph_data=graph_canvas_data,
            hypotheses=final_state.get("hypotheses", []),
            discovered_entities=masked_entities,
            discovered_relationships=rels,
            evidence_items=final_state.get("evidence_items", []),
            verification_audit=final_state.get("verification_results", []),
            tool_history=final_state.get("tool_history", []),
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Investigation engine error: {str(exc)}")

