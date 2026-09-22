"""
Tests for Case Evidence Document Ingestion Pipeline & API
----------------------------------------------------------
Tests text extraction, entity extraction, BSA §65B cryptographic hashing,
and POST /api/ingest/document endpoint.
"""

import io
import json
import hashlib
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.ingestion.document_extractor import (
    compute_sha256,
    extract_text_from_file,
    extract_entities_from_raw_text,
    ingest_document_file,
)
from backend.app.audit.audit_logger import audit_ledger

client = TestClient(app)


def test_sha256_computation():
    content = b"Case Evidence Test Content"
    expected = hashlib.sha256(content).hexdigest()
    assert compute_sha256(content) == expected


def test_extract_text_from_txt_and_json():
    txt_content = b"FIR No: 101/2026\nComplainant: Manoj Tiwari"
    extracted_txt, direct_json = extract_text_from_file("test_fir.txt", txt_content)
    assert "Manoj Tiwari" in extracted_txt
    assert direct_json is None

    contract_json = json.dumps({"entities": [{"id": "P001", "type": "Person", "name": "Test"}]}).encode("utf-8")
    extracted_text, direct_json = extract_text_from_file("contract.json", contract_json)
    assert direct_json is not None
    assert direct_json["entities"][0]["name"] == "Test"


def test_extract_entities_from_fir_text():
    sample_text = """
    FIRST INFORMATION REPORT
    FIR No: 101/2026
    Police Station: Bidhannagar (Salt Lake) PS, Kolkata
    Complainant: Manoj Tiwari, S/o Ram Tiwari, R/o Salt Lake Sector V, Kolkata, Mobile: 9434567123
    
    STATEMENT:
    Rajesh Kumar Sharma, recovery agent of "Shubh Laxmi Finance", called me on 9434567123 from 9832145678.
    Along with Bimal Das (mobile: 9748123456), came in a white Maruti Swift WB02CD5678.
    Forced to transfer Rs. 45,000 to account 30123456789.
    """
    payload = extract_entities_from_raw_text(sample_text, doc_id="FIR_101")
    entities = payload["entities"]
    relationships = payload["relationships"]

    entity_types = {e["type"] for e in entities}
    assert "Person" in entity_types
    assert "Phone" in entity_types
    assert "Vehicle" in entity_types
    assert "Organization" in entity_types

    person_names = [e["name"] for e in entities if e["type"] == "Person"]
    assert any("Manoj Tiwari" in name for name in person_names)
    assert any("Rajesh Kumar Sharma" in name for name in person_names)

    phone_numbers = [e["number"] for e in entities if e["type"] == "Phone"]
    assert "9434567123" in phone_numbers
    assert "9832145678" in phone_numbers

    vehicle_plates = [e["registration_number"] for e in entities if e["type"] == "Vehicle"]
    assert "WB02CD5678" in vehicle_plates

    assert len(relationships) > 0


def test_api_ingest_document_endpoint():
    sample_content = b"FIR No: 101/2026\nComplainant: Manoj Tiwari, Mobile: 9434567123\nAccused: Rajesh Kumar Sharma\nPlate: WB02CD5678"
    file_tuple = ("fir_evidence.txt", io.BytesIO(sample_content), "text/plain")

    response = client.post(
        "/api/ingest/document",
        files={"file": file_tuple},
        headers={
            "X-User-Id": "OFFICER_LEAD_01",
            "X-Badge-Number": "WB-CID-0941",
            "X-Role": "LEAD_INVESTIGATOR",
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["filename"] == "fir_evidence.txt"
    assert "evidence_hash" in data
    assert data["evidence_hash"] == hashlib.sha256(sample_content).hexdigest()
    assert "node_counts" in data
    assert data["node_counts"]["total_nodes"] >= 1
    assert "risk_assessment" in data
    assert data["risk_assessment"]["status"] in ("completed", "skipped")


def test_extract_from_cdr_csv():
    csv_content = b"caller_phone,receiver_phone,timestamp,duration\n9830112233,9830445566,2026-03-01T10:00:00Z,120"
    raw_text, direct_payload = extract_text_from_file("cdr_log.csv", csv_content)
    assert direct_payload is not None
    assert "entities" in direct_payload
    assert "relationships" in direct_payload

    phones = [e["number"] for e in direct_payload["entities"] if e["type"] == "Phone"]
    assert "9830112233" in phones
    assert "9830445566" in phones
    assert len(direct_payload["relationships"]) == 1
    assert direct_payload["relationships"][0]["type"] == "CALLED"


def test_extract_from_bank_csv():
    csv_content = b"sender_acct,receiver_acct,amount,timestamp\n100029384756,100099887766,50000,2026-03-01T11:00:00Z"
    raw_text, direct_payload = extract_text_from_file("bank_transfers.csv", csv_content)
    assert direct_payload is not None
    accts = [e["account_number"] for e in direct_payload["entities"] if e["type"] == "Account"]
    assert "100029384756" in accts
    assert "100099887766" in accts
    assert len(direct_payload["relationships"]) == 1
    assert direct_payload["relationships"][0]["type"] == "TRANSFERRED_FUNDS"

