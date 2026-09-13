
# NexxusDB — Frontend & UI Integration Guide
**Team Members:** Bishal & Jayanta (UI & Agent Platform Leads)  
**Backend & Graph Lead:** Ankit  
**System Version:** NexxusDB v1.0.0 (SIH 2026 — SIH26189)  
**Backend Base URL:** `http://localhost:8000`

---

## 1. Overview & Architecture
This guide provides the complete API specification for connecting your React / Next.js UI to the NexxusDB backend.
All endpoints support **CORS (`*`)** and return standard JSON.

### Authentication & Role Headers
For law enforcement RBAC and tamper-evident audit logging, pass the following HTTP headers with your requests:

```http
X-User-Id: OFFICER_LEAD_01
X-Role: LEAD_INVESTIGATOR
X-Badge-Number: DL-IPS-2026
X-Jurisdiction: Central Crime Branch
```

> **Note:** If you omit these headers during local UI development, the backend automatically defaults to `LEAD_INVESTIGATOR` clearance (full unmasked PII, merge approval, and audit verification permitted).

---

## 2. API Reference

### 🚀 Autonomous Multi-Agent Investigation
#### `POST /api/investigate`
Dispatches the 7-agent autonomous task force (Supervisor, Graph Investigator, Risk Analyst, Evidence Verifier, Cyber/Financial Forensics, Analysis Agent, Critic / Verifier, Report Agent).

- **Request Body (`application/json`):**
```json
{
  "query": "Investigate Rahul Sharma and identify crypto laundering links",
  "subject_id": "P001",
  "mock_mode": false
}
```
> Set `"mock_mode": true` to use fast offline worker stubs during rapid UI prototyping without needing a running Neo4j container.

- **Response (`200 OK`):**
```json
{
  "subject_id": "P001",
  "query": "Investigate Rahul Sharma and identify crypto laundering links",
  "status": "COMPLETED",
  "iterations": 3,
  "summary": {
    "subject_id": "P001",
    "threat_tier": "HIGH CRITICAL",
    "risk_score": 85,
    "entities_mapped": 14,
    "relationships_mapped": 22,
    "hypotheses_evaluated": 3,
    "evidence_corroborated": 4,
    "bsa_65b_certified": true
  },
  "graph_data": {
    "nodes": [
      {
        "id": "P001",
        "label": "Rahul Sharma",
        "type": "Person",
        "is_subject": true,
        "risk_score": 85,
        "color": "#dc2626",
        "size": 50,
        "properties": { "id": "P001", "name": "Rahul Sharma", "risk_score": 85 }
      },
      {
        "id": "CW001",
        "label": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "type": "CryptoWallet",
        "is_subject": false,
        "risk_score": 60,
        "color": "#10b981",
        "size": 46,
        "properties": { "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "network": "BTC" }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "P001",
        "target": "CW001",
        "label": "CONTROLS_WALLET",
        "properties": { "network": "BTC" }
      }
    ]
  },
  "dossier": "# 🚨 CRIMINAL NETWORK INTELLIGENCE DOSSIER\n...",
  "hypotheses": [
    {
      "id": "H1",
      "statement": "Subject controls foreign crypto cash-out gateway",
      "status": "CONFIRMED",
      "confidence": 0.88,
      "supporting_evidence": ["TX_BTC_9901"]
    }
  ],
  "discovered_entities": [ ... ],
  "discovered_relationships": [ ... ],
  "evidence_items": [ ... ],
  "verification_audit": [ ... ],
  "tool_history": [ ... ]
}
```

---

### 🕸️ Graph Canvas & Network Explorer
#### `GET /api/graph/overview?limit=100`
Returns the core network graph to display on the visual canvas immediately upon dashboard load.
- **Query Params:** `limit` (int, default: 100, min: 10, max: 500)
- **Response Format:** Directly compatible with Cytoscape.js, Vis.js, React Force Graph, or React Flow (`{ nodes: [...], edges: [...] }`).

#### `GET /api/entity/{entity_id}/subgraph?depth=2`
Returns the multi-hop neighborhood around a specific entity.
- **Path Param:** `entity_id` (e.g. `P001`, `PH001`)
- **Query Param:** `depth` (int, 1 to 5, default: 2)

#### `GET /api/graph/path?id1=P001&id2=P005`
Calculates and returns the shortest path between two suspects for link analysis.

---

### 🔍 Omnisearch & Threat Intelligence Cards
#### `GET /api/graph/search?query=...&type=...&limit=20`
Universal search across the entire knowledge graph.
- **Query Params:**
  - `query`: Text string (name, alias, phone `987...`, vehicle plate `DL01...`, crypto address `0x...`, FIR number `FIR-102`).
  - `type` *(optional)*: Label filter (`Person`, `Phone`, `Vehicle`, `CryptoWallet`, `CrimeIncident`, `Organization`).
  - `limit`: Max results (default: 20).

#### `GET /api/graph/high-risk?limit=10`
Returns the top high-threat suspects for the dashboard "Top Wanted / High Threat Intelligence" card.
- **Sample Item:**
```json
{
  "id": "P001",
  "name": "Rahul Sharma",
  "risk_score": 92,
  "phones": ["+919876543210"],
  "crime_incidents": ["FIR-2024-001", "FIR-2024-002"],
  "crime_count": 2
}
```

#### `GET /api/graph/stats`
Returns total node counts, edge counts, and entity breakdown for the dashboard counters.

---

### 🛡️ Section 65B BSA Tamper-Evident Court Audit
#### `GET /api/audit/logs?limit=50&offset=0`
Retrieves paginated cryptographic log blocks from the append-only ledger.

#### `POST /api/audit/verify`
Performs a live cryptographic verification of the SHA-256 hash-chain ($H_n = \text{SHA-256}(H_{n-1} + \dots)$).
- **Response:**
```json
{
  "verified": true,
  "record_count": 42,
  "latest_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "message": "Cryptographic ledger integrity verified. All 42 blocks match SHA-256 chain under BSA Section 65B standards."
}
```

---

### 👥 Entity Resolution & Duplicate Review Queue
#### `GET /api/entities/review-queue`
Returns all suspect pairs flagged with `POSSIBLE_DUPLICATE` (e.g. fuzzy alias match, cloned vehicle plate) waiting for investigator approval.

#### `POST /api/entities/merge`
Executes manual merge of an approved duplicate entity into the target entity:
```json
{
  "target_id": "P001",
  "duplicate_id": "P002"
}
```

---

## 3. Cytoscape.js Integration Quickstart

In your React / Cytoscape component:

```typescript
import CytoscapeComponent from 'react-cytoscapejs';

async function runInvestigation(query: string, subjectId?: string) {
  const res = await fetch('http://localhost:8000/api/investigate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, subject_id: subjectId, mock_mode: false })
  });
  const data = await res.json();

  // Convert graph_data to Cytoscape elements
  const cytoscapeElements = [
    ...data.graph_data.nodes.map((node: any) => ({
      data: {
        id: node.id,
        label: node.label,
        color: node.color,
        size: node.size,
        risk: node.risk_score
      }
    })),
    ...data.graph_data.edges.map((edge: any) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label
      }
    }))
  ];

  return { cytoscapeElements, summary: data.summary, dossier: data.dossier };
}
```
