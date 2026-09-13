# 🌐 Nexxus DB — AI-Powered Criminal Network Analysis System

> **Smart India Hackathon (SIH 2026)** | Problem Statement: **SIH26189**  
> **Topic:** *AI-Powered Criminal Network Analysis & Autonomous Multi-Agent Investigation Platform*

---

## 📌 1. Project Mission & Overview

Law enforcement agencies frequently collect fragmented data across First Information Reports (FIRs), Call Detail Records (CDRs), financial transaction ledgers, vehicle registrations, crypto transfers, and intelligence dossiers. Traditional investigation methods struggle with:
- **Identity Obfuscation**: Criminals operating under multiple aliases, misspelled names, forged Aadhaar/PAN cards, and burner SIMs.
- **Layered Financial & Crypto Trails**: Rapid smurfing, mule bank routing, and multi-hop crypto transfers across blockchains.
- **Disconnected Jurisdictions**: Crime incidents scattered across police stations without automated linkage.
- **Legal Admissibility Barriers**: Presenting digital evidence without an immutable chain of custody compliant with Indian law (**Section 65B Bharatiya Sakshya Adhiniyam, 2023**).

**Nexxus DB** is an enterprise-grade **Knowledge Graph, Entity Resolution, Cyber Forensics & Multi-Agent Investigation Engine** designed for SIH26189. It fuses multi-source intelligence into an interconnected Neo4j graph, automatically resolves duplicate and fraudulent entities, computes mathematical risk profiles, and deploys autonomous **LangGraph multi-agent investigators** to uncover syndicates, money laundering loops, and court-admissible evidence trails.

---

## 🏗️ 2. End-to-End Pipeline & Team Roles

> **Abhidha (NLP)** ➔ **Ankit (Neo4j + Ingestion + Resolution + Multi-Agent Engine)** ➔ **Arnish (Risk/Analytics)** ➔ **Bishal & Jayanta (LangGraph/UI)** ➔ **Tanushree (Reporting)**

```text
┌──────────────────────────────┐       ┌─────────────────────────────────────────────────────────┐
│   1. NLP Extraction Pipeline │ ────> │ 2. Nexxus DB Core (Ankit)                               │
│   (Abhidha)                  │       │    - Multi-Layer Entity Resolution & Fraud Detection    │
│   - Unstructured FIRs & CDRs │       │    - Neo4j Knowledge Graph & Cypher Query Engine        │
│   - JSON Entity Extractor    │       │    - Field-Level AES-256 Encryption & Blind Indexing    │
└──────────────────────────────┘       │    - Automated BSA §65B Chain-of-Custody Ingestion      │
                                       └───────────────────────────┬─────────────────────────────┘
                                                                   │
                                                                   ▼
┌──────────────────────────────┐       ┌─────────────────────────────────────────────────────────┐
│   4. Multi-Agent & UI Engine │ <──── │ 3. Risk & Cyber Analytics Engine                        │
│   (Bishal, Jayanta & Ankit)  │       │    (Arnish & Ankit)                                     │
│   - LangGraph Investigation  │       │    - PageRank & Betweenness Centrality                  │
│   - Supervisor & 4 Workers   │       │    - Louvain Community / Syndicate Detection            │
│   - Cytoscape Graph Canvas   │       │    - Multi-Hop Crypto Laundering & SIM-Box Bursts       │
│   - RBAC & Audit Verification│       │    - Circular Transaction & Round-Tripping Scans        │
└──────────────────────────────┘       └─────────────────────────────────────────────────────────┘
```

---

## ⚡ 3. Key Subsystems & Current Capabilities

### 🔍 A. Multi-Stage Entity Resolution & Fraud Engine (`backend/app/resolution/`)
- **Person Matching**: Token sort & token set fuzzy matching via `RapidFuzz`, alias booster, Aadhaar/PAN cross-referencing, and phone ownership linking.
- **Organization Matching**: Corporate suffix normalization (`Pvt Ltd`, `LLC`, `Corp`) with fuzzy title matching.
- **Vehicle Fraud & Cloned Plate Detection**: Automatically flags cloned license plate fraud when identical registration numbers appear with conflicting make, model, or color attributes.
- **Decision Thresholds**:
  - `AUTO_MERGE` (Score ≥ 0.85): Automatically consolidated into a single master entity.
  - `REVIEW_QUEUE` (0.60 ≤ Score < 0.85): Flagged with `:SUSPECTED_DUPLICATE_OF` for manual review (`GET /api/entities/review-queue`, `POST /api/entities/merge`).
  - `CREATE_NEW` (Score < 0.60): Ingested as a distinct entity.

### 📊 B. Graph & Cyber Analytics Engine (`backend/app/analytics/`)
- **Centrality Metrics**: Computes **PageRank** (identifying influential kingpins) and **Betweenness Centrality** (identifying communication brokers/bridges connecting criminal cells).
- **Syndicate Community Detection**: Uses Louvain modularity to cluster suspects into operational gangs.
- **Forensic Anomaly Detection**:
  - *Circular Transactions*: Detects round-tripping money laundering loops (`A → B → C → A`).
  - *Call Bursts*: Flags burner SIM activity (≥ 10 calls/day around incident dates).
  - *SIM-Box Proliferation*: Detects single IMEI devices hosting abnormal rotations of burner SIMs.
  - *Multi-Hop Crypto Layering*: Traces high-velocity fund movements across Bitcoin and USDT TRC-20 addresses.

### 🤖 C. LangGraph Multi-Agent Investigation Platform (`backend/app/agents/`)
- **7-Agent Compiled StateGraph Pipeline**:
  1. **Supervisor Agent (`supervisor.py`)**: Evaluates evidence, generates hypothesis plans, coordinates iterative dispatch (bounded loop guardrail: `MAX_ITERATIONS = 5`).
  2. **Graph Investigator Node**: Expands suspect networks and discovers hidden co-conspirators up to 3 hops.
  3. **Risk Analyst Node**: Computes graph metrics, syndicates, and behavioral anomalies.
  4. **Evidence Verifier Node**: Validates multi-source corroboration and cross-references source FIRs/CDRs.
  5. **Financial & Cyber Analyst Node**: Tracks fiat mule accounts, crypto laundering rings, and Tor/VPN endpoints.
  6. **Analysis Agent (`analysis_agent.py`)**: Hypothesizes syndicate hierarchies, bridges, burner phone usage, and financial smurfing.
  7. **Critic / Verifier Node (`critic_verifier.py`)**: Rigorous quality auditor enforcing BSA §65B hash validation, detecting single-source bias, and conditionally triggering re-planning loops.
  8. **Report Agent (`report_agent.py`)**: Synthesizes court-admissible threat intelligence briefings.
- **12 Production Tool Boundaries** (`backend/app/agents/tools/`): Bounded, strictly typed tools for Graph traversals, Risk analytics, and Evidence verification.

### 🔒 D. Law Enforcement RBAC & Tamper-Evident Audit Ledger (`backend/app/auth/`, `backend/app/audit/`)
- **Multi-Tier Authorization Matrix**: Role-based access control supporting `ADMIN`, `LEAD_INVESTIGATOR`, `INVESTIGATOR`, `ANALYST`, and `AUDITOR`.
- **Dynamic PII Masking**: Automatic redacting of sensitive identity fields (Aadhaar, PAN, phone numbers) for non-administrative roles.
- **BSA §65B Cryptographic Ledger**: Append-only SHA-256 hash-chain ledger ($H_n = \text{SHA-256}(H_{n-1} + \dots)$) storing all investigations, queries, and evidence accesses.
- **Digital Signatures & Anti-Tampering**: Mathematical tamper detection with SECP256R1 ECDSA signatures to guarantee legal admissibility in Indian courts.

### 🛡️ E. Field-Level Cryptography & Cyber Defense (`backend/app/security/`)
- **Data-at-Rest Protection**: AES-256 (Fernet) field-level encryption for critical identifiers.
- **Zero-Knowledge Indexing**: HMAC-SHA256 blind indexing allowing deterministic exact searches over encrypted database fields without leaking plaintext.

### 🖥️ F. Frontend & UI Canvas Integration Suite (`backend/app/api/`)
- **Graph Canvas Formatter**: `POST /api/investigate` augmented with pre-formatted Cytoscape.js and Vis.js nodes/edges and an executive intelligence summary card.
- **Perimeter Overview**: `GET /api/graph/overview` for zero-friction graph rendering on dashboard load.
- **Threat Intelligence Ranking**: `GET /api/graph/high-risk` for suspect risk leaderboards.
- **Universal Omnisearch**: `GET /api/graph/search` across Person, Phone, Vehicle, CryptoWallet, and FIR nodes.
- Full UI integration contract documented in [`docs/UI_INTEGRATION_GUIDE.md`](docs/UI_INTEGRATION_GUIDE.md).

---

## 🗄️ 4. Knowledge Graph Schema

### Node Labels
- `:Person` (`id`, `name`, `normalized_name`, `aliases`, `aadhaar`, `pan`, `father_name`, `age`, `gender`, `risk_score`)
- `:Phone` (`id`, `number`, `carrier`, `imei`)
- `:Location` (`id`, `name`, `address`, `city`, `coordinates`, `location_type`)
- `:Organization` (`id`, `name`, `normalized_name`, `org_type`, `reg_number`)
- `:Vehicle` (`id`, `registration_number`, `make`, `model`, `color`, `vehicle_type`)
- `:CrimeIncident` / `:FIR` (`id`, `fir_number`, `incident_type`, `description`, `timestamp`, `ipc_sections`)
- `:CryptoWallet` (`id`, `address`, `currency`, `network`, `wallet_type`, `risk_score`)
- `:IPAddress` (`id`, `ip`, `is_tor`, `is_vpn`, `isp`, `country`, `city`)
- `:IMEI` (`id`, `imei_number`, `model`, `tac`)

### Relationship Types
- `:CALLED` (`duration`, `timestamp`, `tower_id`, `evidence_hash`)
- `:TRANSACTED_WITH` (`amount`, `timestamp`, `transaction_id`, `type`)
- `:PRESENT_AT` (`timestamp`, `confidence`)
- `:OWNS_VEHICLE`, `:ASSOCIATED_WITH`, `:INVOLVED_IN`, `:OPERATES_FROM`, `:USES_PHONE`
- `:CONTROLS_WALLET`, `:TRANSFERRED_FUNDS` (`amount`, `network`, `tx_hash`)
- `:BOUND_TO_IMEI`, `:ACCESSED_VIA`
- `:SUSPECTED_DUPLICATE_OF` (`match_score`, `reason`, `flagged_at`)

---

## 📁 5. Repository Structure

```text
nexxus-db/
├── backend/
│   ├── app/
│   │   ├── neo4j_driver.py           # Neo4j connection lifecycle & query pooling
│   │   ├── main.py                   # FastAPI application entrypoint & middleware
│   │   ├── api/                      # REST endpoints (entities, investigate, graph, audit)
│   │   │   ├── entity_routes.py      # Review queue & manual merge endpoints
│   │   │   ├── investigation_routes.py # LangGraph investigation & Cytoscape canvas APIs
│   │   │   ├── graph_routes.py       # Overview, high-risk, & omnisearch endpoints
│   │   │   └── audit_routes.py       # Section 65B audit log verification & tampering check
│   │   ├── auth/                     # Law enforcement RBAC models & PII masking engine
│   │   ├── audit/                    # Append-only SHA-256 hash-chain ledger
│   │   ├── security/                 # AES-256 encryption, HMAC blind indexes, ECDSA signatures
│   │   ├── services/                 # Graph query service layer (Cypher wrappers)
│   │   ├── models/                   # Pydantic v2 schemas & request/response contracts
│   │   ├── ingestion/                # Graph ingestor & relationship builders
│   │   ├── resolution/               # Multi-stage entity resolution engine
│   │   ├── analytics/                # Risk, Centrality, Anomaly & Cyber Analytics Engine
│   │   └── agents/                   # LangGraph Multi-Agent Investigation Platform
│   │       ├── state.py              # InvestigationState & Blackboard schemas
│   │       ├── supervisor.py         # Dynamic planning & iterative dispatch supervisor
│   │       ├── analysis_agent.py     # Hypothesis formulation & financial/cyber pattern agent
│   │       ├── critic_verifier.py    # BSA 65B hash validation & quality auditor agent
│   │       ├── report_agent.py       # Court-admissible threat intelligence report generator
│   │       ├── graph.py              # Compiled 7-agent StateGraph pipeline
│   │       ├── tools/                # 12 Bounded, validated LangChain tools
│   │       └── nodes/                # Specialized worker nodes (Graph, Risk, Evidence, Cyber)
│   ├── tests/                        # 159 comprehensive unit & integration tests
│   │   ├── test_agent_tools.py       # Tool boundaries & BSA 65B tests
│   │   ├── test_analysis_and_critic.py # Hypothesis & critic quality loop tests
│   │   ├── test_cyber_and_blockchain.py # Crypto, IP, IMEI, AES-256, HMAC tests
│   │   ├── test_fraud_detection.py   # Cloned vehicle plate fraud tests
│   │   ├── test_matcher.py           # RapidFuzz similarity tests
│   │   ├── test_normalizer.py        # Standardization tests
│   │   ├── test_rbac_and_audit.py    # RBAC permissions & BSA hash chain tests
│   │   ├── test_resolver.py          # Auto-merge & review queue decision tests
│   │   ├── test_supervisor.py        # Planning & loop guardrail tests
│   │   ├── test_ui_api_suite.py      # Cytoscape formatting & graph endpoints
│   │   ├── test_validator.py         # Ingestion JSON schema validation tests
│   │   ├── test_worker_nodes.py      # Graph, Risk, Evidence, Cyber worker tests
│   │   └── test_graph_queries.py     # Live Neo4j Cypher query tests
│   └── requirements.txt              # Production dependencies
├── cypher/
│   ├── schema.cypher                 # Constraints, indexes & uniqueness rules
│   ├── seed.cypher                   # Synthetic criminal network seed data
│   └── queries.cypher                # Pre-built investigative Cypher queries
├── docs/
│   └── UI_INTEGRATION_GUIDE.md       # Frontend developer integration contract
├── pytest.ini                        # Pytest runner configuration
└── README.md                         # Root project documentation
```

---

## 🚀 6. Getting Started

### Prerequisites
- Python 3.10+ (Recommended: Python 3.12 or 3.14)
- [Neo4j Desktop](https://neo4j.com/download/) or Neo4j Community Edition (v5+)

### 1. Setup Virtual Environment
```powershell
# Windows PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```ini
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password
NEO4J_DATABASE=neo4j
GRAPH_DATA_SOURCE=neo4j  # or 'mock' for standalone offline mode
ENCRYPTION_KEY=your_fernet_256_key_here
BLIND_INDEX_SALT=your_hmac_salt_here
```

### 4. Run Test Suite
Execute the comprehensive test suite across all 12 test modules:
```powershell
pytest backend/tests -v
```
> **Current Test Status:** **159 items** (**147 passed**, 12 live-database tests safely skipped in offline mode, **0 failures**).

### 5. Launch FastAPI Backend
```powershell
uvicorn backend.app.main:app --reload --port 8000
```
Interactive OpenAPI documentation will be accessible at `http://localhost:8000/docs`.

---

## 👥 7. Task Force Team (SIH 2026 — Team Nexxus)

- **Ankit (Me)** — *Graph Database, Neo4j Engine, Ingestion & Entity Resolution Lead*
- **Abhidha** — *Data Pipeline, NLP & Information Extraction*
- **Arnish** — *Risk Analytics, Centrality Modeling & Community Detection*
- **Bishal & Jayanta** — *LangGraph Multi-Agent Platform & Cytoscape UI Integration*
- **Tanushree** — *Intelligence Reporting & Legal Validation*
