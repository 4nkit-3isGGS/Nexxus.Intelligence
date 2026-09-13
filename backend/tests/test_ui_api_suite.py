"""
Unit Tests for UI Team API Suite (Bishal & Jayanta's Integration Endpoints)
---------------------------------------------------------------------------
Tests graph canvas endpoints (/overview), high-risk suspect rankings,
universal multi-entity search, investigation graph_data formatting,
and role authorization for Section 65B audit verification.
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.auth.models import Role, Permission, UserSession
from backend.app.api.investigation_routes import format_investigation_graph_data, format_investigation_summary


client = TestClient(app)


# =========================================================================
# 1. Graph Canvas Overview & High-Risk Endpoints
# =========================================================================

def test_graph_overview_endpoint():
    """Tests GET /api/graph/overview returns formatted nodes and edges for UI canvas."""
    mock_subgraph = {
        "nodes": [
            {"id": "P001", "name": "Rahul Sharma", "labels": ["Person"], "risk_score": 85},
            {"id": "PH001", "number": "+919876543210", "labels": ["Phone"]},
        ],
        "edges": [
            {"source": "P001", "target": "PH001", "type": "USES_PHONE", "properties": {}},
        ]
    }
    with patch("backend.app.api.graph_routes.get_graph_overview", return_value=mock_subgraph):
        resp = client.get("/api/graph/overview?limit=50")
        assert resp.status_code == 200
        data = resp.json()
        assert "nodes" in data
        assert "edges" in data
        assert len(data["nodes"]) == 2
        assert len(data["edges"]) == 1
        assert data["nodes"][0]["id"] == "P001"


def test_high_risk_suspects_endpoint():
    """Tests GET /api/graph/high-risk returns prioritized suspect dossiers."""
    mock_suspects = [
        {
            "id": "P001",
            "name": "Rahul Sharma",
            "risk_score": 92,
            "phones": ["+919876543210"],
            "crime_incidents": ["FIR-2024-001", "FIR-2024-002"],
            "crime_count": 2,
        },
        {
            "id": "P002",
            "name": "Vikram Malhotra",
            "risk_score": 78,
            "phones": ["+919876543211"],
            "crime_incidents": ["FIR-2024-001"],
            "crime_count": 1,
        }
    ]
    with patch("backend.app.api.graph_routes.get_high_risk_entities", return_value=mock_suspects):
        resp = client.get("/api/graph/high-risk?limit=5")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) == 2
        assert data[0]["id"] == "P001"
        assert data[0]["risk_score"] == 92
        assert data[0]["crime_count"] == 2


def test_universal_search_with_type_filter():
    """Tests GET /api/graph/search passes entity_type filtering to service layer."""
    with patch("backend.app.api.graph_routes.search_entities") as mock_search:
        mock_search.return_value = [{"id": "CW001", "address": "0xabc123", "labels": ["CryptoWallet"]}]
        
        resp = client.get("/api/graph/search?query=0xabc&type=CryptoWallet")
        assert resp.status_code == 200
        mock_search.assert_called_once_with(query="0xabc", limit=20, entity_type="CryptoWallet")
        results = resp.json()
        assert len(results) == 1
        assert results[0]["id"] == "CW001"


# =========================================================================
# 2. Cytoscape / Vis.js Graph Formatter Unit Tests
# =========================================================================

def test_format_investigation_graph_data():
    """Tests transformation of discovered state entities/edges into UI canvas specs."""
    entities = [
        {"id": "P001", "name": "Rahul Sharma", "labels": ["Person"], "risk_score": 85},
        {"id": "CW001", "address": "0x123456", "label": "CryptoWallet", "risk_score": 60},
        {"id": "V001", "registration_number": "DL01AB1234", "labels": ["Vehicle"]},
    ]
    relationships = [
        {"source": "P001", "target": "CW001", "type": "CONTROLS_WALLET"},
        {"source": "P001", "target": "V001", "type": "OWNS_VEHICLE"},
    ]

    formatted = format_investigation_graph_data(entities, relationships, subject_id="P001")
    assert "nodes" in formatted
    assert "edges" in formatted
    assert len(formatted["nodes"]) == 3
    assert len(formatted["edges"]) == 2

    # Verify primary subject node styling
    subject_node = next(n for n in formatted["nodes"] if n["id"] == "P001")
    assert subject_node["is_subject"] is True
    assert subject_node["color"] == "#dc2626"
    assert subject_node["size"] == 50

    # Verify crypto wallet styling
    wallet_node = next(n for n in formatted["nodes"] if n["id"] == "CW001")
    assert wallet_node["color"] == "#10b981"  # Emerald for crypto
    assert wallet_node["label"] == "0x123456"

    # Verify edges
    edge1 = formatted["edges"][0]
    assert edge1["source"] == "P001"
    assert edge1["target"] == "CW001"
    assert edge1["label"] == "CONTROLS_WALLET"


def test_format_investigation_summary():
    """Tests summary scorecard generator for dashboard cards."""
    final_state = {
        "subject_entity_id": "P001",
        "risk_analysis": {"risk_score": 88},
        "hypotheses": [{"id": "H1"}, {"id": "H2"}],
        "evidence_items": [{"id": "E1"}],
    }
    summary = format_investigation_summary(final_state, entities_count=6, edges_count=5)
    assert summary["subject_id"] == "P001"
    assert summary["threat_tier"] == "HIGH CRITICAL"
    assert summary["risk_score"] == 88
    assert summary["entities_mapped"] == 6
    assert summary["relationships_mapped"] == 5
    assert summary["hypotheses_evaluated"] == 2
    assert summary["evidence_corroborated"] == 1
    assert summary["bsa_65b_certified"] is True


# =========================================================================
# 3. Investigation Route Integration with UI Canvas
# =========================================================================

def test_investigate_route_returns_ui_graph_data():
    """Tests POST /api/investigate returns graph_data and summary scorecard."""
    headers = {
        "X-User-Id": "LEAD_OFFICER_01",
        "X-Role": "LEAD_INVESTIGATOR",
        "X-Badge-Number": "DEL-IPS-999",
    }
    payload = {
        "query": "Investigate Rahul Sharma P001",
        "subject_id": "P001",
        "mock_mode": True,
    }

    resp = client.post("/api/investigate", json=payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()

    assert "graph_data" in data
    assert "summary" in data
    assert "nodes" in data["graph_data"]
    assert "edges" in data["graph_data"]
    assert data["summary"]["subject_id"] == "P001"
    assert data["summary"]["bsa_65b_certified"] is True
    assert "dossier" in data


# =========================================================================
# 4. Role Clearance for Section 65B Audit Verification
# =========================================================================

def test_lead_investigator_can_verify_audit():
    """Tests that LEAD_INVESTIGATOR can call POST /api/audit/verify for UI court certification."""
    headers = {
        "X-User-Id": "LEAD_OFFICER_01",
        "X-Role": "LEAD_INVESTIGATOR",
        "X-Badge-Number": "DEL-IPS-999",
    }
    resp = client.post("/api/audit/verify", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "verified" in data
    assert "latest_hash" in data
    assert data["verified"] is True
