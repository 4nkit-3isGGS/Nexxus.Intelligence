"""
Ingestion API Routes
--------------------
POST /api/ingest/document — Accepts evidence documents (.txt, .pdf, .docx, .json),
computes SHA-256 evidence hash for BSA §65B audit tracking, extracts entities and
relationships, and ingests them into the Neo4j knowledge graph.

POST /api/graph/ingest — Accepts Abhidha's NLP output contract JSON directly.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Header
from typing import Optional

from backend.app.ingestion.graph_ingestor import ingest_nlp_payload
from backend.app.ingestion.document_extractor import ingest_document_file
from backend.app.models.entities import NLPOutputPayload
from backend.app.ingestion.validator import PayloadValidationError


router = APIRouter(tags=["Ingestion"])


@router.post("/api/ingest/document")
async def ingest_document_endpoint(
    file: UploadFile = File(...),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    x_badge_number: Optional[str] = Header(None, alias="X-Badge-Number"),
    x_role: Optional[str] = Header(None, alias="X-Role"),
) -> dict:
    """
    Ingests case evidence files (.txt, .pdf, .docx, .json).
    - Computes SHA-256 hash under BSA Section 65B.
    - Extracts suspects, phone numbers, vehicles, accounts, and relationships.
    - Resolves and persists entities into the Neo4j Knowledge Graph.
    - Returns filename, evidence_hash, and node counts.
    """
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        result = ingest_document_file(
            filename=file.filename or "evidence_document.txt",
            content=content,
            user_id=x_user_id or "OFFICER_FIELD_01",
            badge_number=x_badge_number or "WB-CID-0941",
            role=x_role or "LEAD_INVESTIGATOR",
        )
        return result

    except PayloadValidationError as e:
        raise HTTPException(
            status_code=422,
            detail={"message": "Document Entity Validation Failed", "errors": e.errors}
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Document Ingestion Failed: {str(e)}")


@router.post("/api/graph/ingest")
@router.post("/api/ingest/contract")
def ingest_payload(payload: NLPOutputPayload) -> dict:
    """
    Accepts the pre-extracted NLP payload and ingests it into the knowledge graph.
    Runs entity resolution on Person entities, creates/merges all node types,
    and processes relationships with full provenance.
    """
    try:
        result = ingest_nlp_payload(payload.model_dump())
        return {"status": "success", **result}
    except PayloadValidationError as e:
        raise HTTPException(
            status_code=422,
            detail={"message": "Payload Validation Failed", "errors": e.errors}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion Failed: {str(e)}")
