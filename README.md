# 🌐 Nexxus.Intelligence — AI-Powered Criminal Network Analysis & Autonomous Multi-Agent Investigation Platform

<div align="center">

[![SIH 2026](https://img.shields.io/badge/Smart%20India%20Hackathon-SIH%202026-orange.svg?style=for-the-badge)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-SIH26189-blue.svg?style=for-the-badge)](https://www.sih.gov.in/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Neo4j](https://img.shields.io/badge/Database-Neo4j%205+-008CC1.svg?style=for-the-badge&logo=neo4j&logoColor=white)](https://neo4j.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![LangGraph](https://img.shields.io/badge/Multi--Agent-LangGraph%20%2B%20LangChain-1C3C3C.svg?style=for-the-badge)](https://langchain-ai.github.io/langgraph/)
[![Legal Compliance](https://img.shields.io/badge/Legal-BSA%20§65B%20Compliant-green.svg?style=for-the-badge)](#-7-law-enforcement-security-legal-compliance--rbac)
[![Test Suite](https://img.shields.io/badge/Tests-161%20Items%20(149%20Passed)-brightgreen.svg?style=for-the-badge)](#-9-testing--verification)

**Nexxus.Intelligence** is an enterprise-grade, end-to-end intelligence and cyber-forensics platform designed for law enforcement agencies, cyber cells, and criminal intelligence directorates. It ingests multi-source data (FIRs, CDRs, banking ledgers, vehicle registries, crypto wallets), resolves obfuscated identities, computes graph centrality metrics, executes autonomous multi-agent investigations, and guarantees legal admissibility under Section 65B of the Bharatiya Sakshya Adhiniyam (BSA), 2023.

[Key Features](#-2-core-capabilities--subsystems) •
[Architecture](#-3-system-architecture--end-to-end-pipeline) •
[Frontend Workspaces](#-4-tactical-frontend-command-center) •
[Knowledge Graph Schema](#-5-knowledge-graph-schema) •
[Multi-Agent Engine](#-6-langgraph-multi-agent-investigation-engine) •
[Security & BSA §65B](#-7-law-enforcement-security-legal-compliance--rbac) •
[Repo Structure](#-8-repository-structure) •
[Quickstart](#-9-quickstart--installation) •
[API Reference](#-10-rest-api-reference)

</div>

---

## 📌 1. Mission & Operational Background

Modern criminal organizations, terror cells, and cyber syndicates operate through deliberately fragmented, highly obfuscated networks:
- **Identity Obfuscation:** Suspects use aliases, forged Aadhaar/PAN cards, typo-ridden names, and burner identities across jurisdictions.
- **Layered Financial & Crypto Trails:** Criminal proceeds are rapidly laundered through smurfing chains, shell companies, mule bank accounts, and multi-hop Bitcoin / USDT TRC-20 transfers.
- **Telecom & Device Hopping:** Burner SIM cards are rapidly rotated through multi-slot SIM-boxes on shared IMEIs, generating brief, high-intensity call spikes.
- **Jurisdictional Silos:** Crime reports (FIRs) remain trapped in local station records without automated inter-district cross-referencing.
- **Legal Admissibility Barriers:** Digital evidence and intelligence visualizations are often thrown out of court due to broken chains of custody or unverifiable algorithmic conclusions.

**Nexxus.Intelligence** solves these challenges by combining an **NLP extraction pipeline**, an **enterprise Neo4j Knowledge Graph**, **automated fuzzy entity resolution & fraud detection**, **cyber anomaly analytics**, an **autonomous LangGraph multi-agent team**, and a **React-based tactical command center** backed by a **BSA §65B cryptographic audit ledger**.

---

## ⚡ 2. Core Capabilities & Subsystems

| Subsystem | Description | Key Modules |
| :--- | :--- | :--- |
| **🧠 NLP Extraction Pipeline** | Parses unstructured FIR text documents, extracts entities (People, Locations, Orgs, Phones, Vehicles, Bank Accounts, IPC sections), and formats validated relationship contracts. | `backend/app/ingestion/document_extractor.py`, `data/raw/` |
| **🗄️ Knowledge Graph Engine** | Enterprise Neo4j graph model supporting both live Neo4j database connections and in-memory offline mock fallback with index constraints. | `backend/app/neo4j_driver.py`, `cypher/` |
| **🔍 Multi-Stage Entity Resolution** | `RapidFuzz` token sort/set fuzzy matching with alias boosting, Aadhaar/PAN cross-referencing, and cloned vehicle plate fraud detection. | `backend/app/resolution/` |
| **📊 Graph & Cyber Analytics** | Computes PageRank (kingpin identification), Betweenness Centrality (brokers/bridges), Louvain community clusters, circular transaction detection, and call burst analysis. | `backend/app/analytics/` |
| **🤖 LangGraph Multi-Agent Engine** | 7-agent compiled StateGraph (Supervisor, Graph Investigator, Risk Analyst, Evidence Verifier, Financial/Cyber Analyst, Critic, Report Agent) with 12 bounded tools. | `backend/app/agents/` |
| **🛡️ Law Enforcement Security** | Field-level AES-256 (Fernet) encryption, HMAC-SHA256 blind indexing for zero-knowledge querying, and multi-tier RBAC with dynamic PII masking. | `backend/app/security/`, `backend/app/auth/` |
| **📜 BSA §65B Legal Audit Vault** | Cryptographic SHA-256 hash-chain ledger ($H_n = \text{SHA-256}(H_{n-1} + \dots)$) with SECP256R1 ECDSA digital signatures guaranteeing tamper-evident court admissibility. | `backend/app/audit/`, `backend/app/api/audit_routes.py` |
| **🖥️ Tactical Command Center** | High-performance React 18 + Vite frontend with Cytoscape/Vis canvas, 7 specialized workspace consoles, and 1-click forensic playbooks. | `frontend/` |

---

## 🏗️ 3. System Architecture & End-to-End Pipeline

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       1. DATA INGESTION & NLP TIER                                     │
│  Unstructured FIRs (101, 102, 103) ──> spaCy Transformer NER (en_core_web_trf) + Heuristics Regex      │
│  CDRs (cdr.csv) & Bank Ledgers    ──> Relationship Extraction Contract (Abhidha_output_contract_enriched.json)          │
└──────────────────────────────────────────────────┬─────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   2. RESOLUTION & INGESTION ENGINE                                     │
│  - Exact Match (Aadhaar, PAN, Phone)   - Cloned Vehicle Plate Detection                                │
│  - RapidFuzz Token-Sort Matching       - Auto-Merge (≥0.85) vs. Review Queue (0.60-0.85)               │
│  - Field-Level AES-256 Encryption      - HMAC-SHA256 Blind Indexing                                    │
└──────────────────────────────────────────────────┬─────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   3. KNOWLEDGE GRAPH & ANALYTICS CORE                                  │
│  Neo4j 5+ Database (or Offline Mock Graph Engine)                                                      │
│  ├── Graph Analytics: PageRank (Kingpin), Betweenness Centrality (Bridge), Louvain Community Clusters  │
│  └── Cyber Analytics: Circular Money Loops (A→B→C→A), Burner SIM Bursts (≥10 calls), SIM-Box Prolif.   │
└──────────────────────────────────────┬───────────────────────────────────┬─────────────────────────────┘
                                       │                                   │
                                       ▼                                   ▼
┌────────────────────────────────────────────────┐  ┌───────────────────────────────────────────────────┐
│     4. LANGGRAPH MULTI-AGENT REASONING         │  │        5. BSA §65B AUDIT & SECURITY LEDGER        │
│  Supervisor Agent ➔ Dynamic Investigation Plan  │  │  SHA-256 Append-Only Hash Chain Ledger           │
│  ├── Graph Investigator (3-hop traversals)     │  │  SECP256R1 ECDSA Mathematical Tamper Detection   │
│  ├── Risk & Financial/Cyber Analyst Nodes      │  │  Law Enforcement RBAC + Dynamic PII Masking       │
│  ├── Critic / Verifier Node (Hash Validation)  │  │  Section 65B Bharatiya Sakshya Adhiniyam Cert.   │
│  └── Court-Admissible Report Generator Node    │  │                                                   │
└───────────────────────┬────────────────────────┘  └─────────────────────┬─────────────────────────────┘
                        │                                                 │
                        └────────────────────────┬────────────────────────┘
                                                 │
                                                 ▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           6. TACTICAL FRONTEND COMMAND CENTER (REACT + VITE)                           │
│  [Overview Dashboard] ➔ [Graph Canvas] ➔ [Agent Console] ➔ [Resolution Queue] ➔ [Financial Flows]       │
│  [CDR Telemetry]      ➔ [FIR Corpus NER] ➔ [Legal Audit Vault] ➔ [Court Dossier Export Modal]         │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🖥️ 4. Tactical Frontend Command Center

The frontend (`frontend/`) is a comprehensive single-page application built with **React 18**, **Vite**, **TailwindCSS**, and **Lucide Icons**, offering an executive dashboard and 7 specialized tactical investigation workspaces:

### 🏠 1. Executive Intelligence Dashboard (`/`)
- Real-time KPI summaries: Total Suspect Nodes, Tracked Relationships, Laundering Capital Flagged (₹14.85 Lakhs+).
- 1-Click Role Switcher for instant testing across clearance levels.
- Direct launchpad into active crime syndicates, threat intelligence summaries, and the Officer Field Guide.

### 🕸️ 2. Interactive Knowledge Graph Canvas (`/workspace/graph`)
- **Multi-Layout Canvas:** Dynamic force-directed, hierarchical, circular, and grid layouts powered by Cytoscape / Vis rendering concepts.
- **Forensic Investigation Playbooks:** 1-click forensic scenarios (e.g., *Smurfing Ring*, *Burner Phone Cluster*, *Mule Bank Hub*).
- **Temporal Timeline Scrubber & Auto-Player:** Filter events and communications chronologically to reconstruct incident sequences.
- **Slide-Over Evidence Drawer (`EvidenceDrawer.jsx`):** Deep inspection card displaying suspect aliases, risk scores, connected FIRs, PII decryption (clearance-aware), 1-click **Trace to Kingpin** shortest-path calculation, and subgraph expansion.

### 🤖 3. Autonomous Multi-Agent Investigation Console (`/workspace/investigation`)
- Direct interaction with the LangGraph multi-agent runtime.
- Preset tactical prompts (*"Find all associates within 2 hops of Kabir Khan"*, *"Identify money laundering loops and mule accounts"*, *"Detect burner phone call spikes around FIR 101"*).
- Visual Hypothesis Board, Tool Execution Timeline, Chain-of-Custody Evidence Citations, and Subgraph Highlighter.

### ⚖️ 4. Entity Resolution & Review Queue (`/workspace/resolution`)
- Interactive review queue for flagged pairs (`0.60 ≤ match_score < 0.85`).
- Side-by-side attribute comparison (Aadhaar, PAN, phone number, vehicle registration).
- Cloned vehicle plate fraud alerts (same registration number appearing on conflicting vehicle makes/models).
- 1-click manual merge and rejection with audit logging.

### 💸 5. Financial Forensics & AML Flow (`/workspace/financial`)
- Automated detection of circular round-tripping money laundering loops (`A → B → C → A`).
- Smurfing pattern detection (splitting large funds across multiple mule accounts).
- Crypto-fiat gateway mapping across Bitcoin and USDT TRC-20 wallet addresses.

### 📡 6. CDR Telemetry & Cell-Tower Matrix (`/workspace/cdr`)
- Telemetry analyzer flagging call frequency spikes (≥ 10 calls/day around incident dates).
- SIM-box proliferation detector (single IMEI hosting abnormal rotations of burner SIMs).
- Tower location mapping and duration-weighted interaction graphs.

### 📄 7. FIR Corpus & In-Text NER Highlighter (`/workspace/fir`)
- Interactive text reader for raw FIRs (`fir_101.txt`, `fir_102.txt`, `fir_103.txt`).
- Inline colored entity tagging for Persons, Locations, Organizations, Vehicles, and IPC Sections.
- Direct 1-click cross-navigation from FIR text mentions into the Knowledge Graph.

### 🏛️ 8. BSA Section 65B Legal Audit Vault (`/workspace/audit`)
- Cryptographic hash-chain ledger viewer displaying timestamped SHA-256 blocks.
- Real-time SECP256R1 ECDSA digital signature verification.
- Tamper-detection test runner and generator for legal 65B Certificate affidavits.

---

## 🗄️ 5. Knowledge Graph Schema

### Node Labels & Attributes
- `:Person`: `id`, `name`, `normalized_name`, `aliases`, `aadhaar`, `pan`, `father_name`, `age`, `gender`, `risk_score`
- `:Phone`: `id`, `number`, `carrier`, `imei`
- `:Location`: `id`, `name`, `address`, `city`, `coordinates`, `location_type`
- `:Organization`: `id`, `name`, `normalized_name`, `org_type`, `reg_number`
- `:Vehicle`: `id`, `registration_number`, `make`, `model`, `color`, `vehicle_type`
- `:CrimeIncident` / `:FIR`: `id`, `fir_number`, `incident_type`, `description`, `timestamp`, `ipc_sections`
- `:CryptoWallet`: `id`, `address`, `currency`, `network`, `wallet_type`, `risk_score`
- `:IPAddress`: `id`, `ip`, `is_tor`, `is_vpn`, `isp`, `country`, `city`
- `:IMEI`: `id`, `imei_number`, `model`, `tac`

### Relationship Types & Metadata
- `(:Phone)-[:CALLED {duration, timestamp, tower_id, evidence_hash}]->(:Phone)`
- `(:Person|Organization)-[:TRANSACTED_WITH {amount, timestamp, tx_id, type}]->(:Person|Organization)`
- `(:Person)-[:PRESENT_AT {timestamp, confidence}]->(:Location)`
- `(:Person)-[:OWNS_VEHICLE]->(:Vehicle)`
- `(:Person)-[:USES_PHONE]->(:Phone)`
- `(:Person)-[:CONTROLS_WALLET]->(:CryptoWallet)`
- `(:CryptoWallet)-[:TRANSFERRED_FUNDS {amount, network, tx_hash}]->(:CryptoWallet)`
- `(:Phone)-[:BOUND_TO_IMEI]->(:IMEI)`
- `(:Person)-[:SUSPECTED_DUPLICATE_OF {match_score, reason, flagged_at}]->(:Person)`
- `(:Person)-[:INVOLVED_IN]->(:CrimeIncident)`

---

## 🤖 6. LangGraph Multi-Agent Investigation Engine

The backend runs a compiled 7-node **LangGraph StateGraph** pipeline (`backend/app/agents/`) with a strict iterative loop guardrail (`MAX_ITERATIONS = 5`):

```text
               ┌───────────────────────┐
               │    INVESTIGATION      │
               │        START          │
               └──────────┬────────────┘
                          │
                          ▼
               ┌───────────────────────┐
               │   Supervisor Agent    │ ◄───┐
               │   Dynamic Dispatch    │     │ (Iteration < 5)
               └──────────┬────────────┘     │
                          │                  │
         ┌────────────────┼────────────────┐ │
         │                │                │ │
         ▼                ▼                ▼ │
  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
  │    Graph    │  │    Risk     │  │  Financial   │
  │Investigator │  │   Analyst   │  │   & Cyber    │
  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                          ▼
               ┌───────────────────────┐
               │    Evidence Verifier  │
               └──────────┬────────────┘
                          │
                          ▼
               ┌───────────────────────┐
               │    Analysis Agent     │
               └──────────┬────────────┘
                          │
                          ▼
               ┌───────────────────────┐
               │   Critic / Verifier   ├─────┘ (Trigger Re-plan if single-source
               │    (BSA §65B Audit)   │        or unverified evidence)
               └──────────┬────────────┘
                          │ (Evidence Verified)
                          ▼
               ┌───────────────────────┐
               │     Report Agent      │
               │  Court Dossier Output │
               └──────────┬────────────┘
                          │
                          ▼
                     [ COMPLETED ]
```

### Specialized Worker Tools (`backend/app/agents/tools/`)
The multi-agent system uses 12 strictly validated LangChain tools:
1. `expand_node_tool`: Traversing entity relations up to $N$ hops.
2. `find_paths_tool`: Finding shortest communication or transaction paths between suspects.
3. `get_entity_details_tool`: Fetching encrypted profiles and blinded indexes.
4. `calculate_centrality_tool`: Executing PageRank & Betweenness Centrality.
5. `detect_syndicate_tool`: Running Louvain modularity community detection.
6. `detect_circular_transactions_tool`: Flagging AML round-tripping loops.
7. `detect_call_bursts_tool`: Isolating burner phone spikes around incident dates.
8. `detect_sim_box_tool`: Detecting multiple SIM cards tied to single IMEIs.
9. `detect_crypto_layering_tool`: Tracing Bitcoin and USDT multi-hop fund flows.
10. `verify_evidence_hash_tool`: Validating SHA-256 evidence integrity.
11. `fetch_fir_corroboration_tool`: Cross-referencing source police reports.
12. `generate_audit_log_tool`: Emitting immutable audit records.

---

## 🔒 7. Law Enforcement Security, Legal Compliance & RBAC

### Bharatiya Sakshya Adhiniyam (BSA), 2023 §65B Chain of Custody
Under Indian criminal law, electronic records are admissible only when accompanied by an immutable certificate of authenticity.
- **Append-Only Hash Chain Ledger:** Each query, merge, or node expansion generates a cryptographic block where:
  $$H_n = \text{SHA-256}(H_{n-1} \,\|\, \text{Timestamp} \,\|\, \text{OfficerID} \,\|\, \text{Action} \,\|\, \text{DataHash})$$
- **Digital Signatures:** Ledger heads are signed with SECP256R1 ECDSA keys.
- **Court Certificate Generator:** Generates exportable, tamper-verified Section 65B affidavits.

### Multi-Tier Role-Based Access Control (RBAC) & PII Masking
| Role | Clearance Level | Permissions | PII Visibility |
| :--- | :---: | :--- | :--- |
| `ADMIN` | Tier 5 | Full system administration, encryption key rotation, user management | Cleartext (Unmasked) |
| `LEAD_INVESTIGATOR` | Tier 4 | Multi-agent dispatch, manual entity merge, legal vault access, dossier export | Cleartext (Unmasked) |
| `INVESTIGATOR` | Tier 3 | Graph exploration, multi-agent query, CDR/financial view | PII Masked (`XXXX-XXXX-1234`) |
| `ANALYST` | Tier 2 | Graph exploration, anomaly detection, read-only analytics | PII Masked |
| `AUDITOR` | Tier 1 | Legal audit vault review, chain of custody verification | PII Masked |

### Field-Level Cryptography & Zero-Knowledge Querying
- **Data-at-Rest:** Master AES-256 (Fernet) field-level encryption for Aadhaar numbers, PAN IDs, and banking account numbers.
- **Zero-Knowledge Blind Indexing:** HMAC-SHA256 blind indexing allows deterministic exact queries on encrypted fields without ever decrypting the database on disk.

---

## 📁 8. Repository Structure

```text
Nexxus.Intelligence/
├── backend/                             # High-Performance FastAPI & Graph Engine
│   ├── app/
│   │   ├── main.py                      # FastAPI application entrypoint & middleware
│   │   ├── neo4j_driver.py              # Neo4j driver lifecycle, query pooling & mock fallback
│   │   ├── api/                         # REST API route controllers
│   │   │   ├── health_routes.py         # Service health & database connectivity
│   │   │   ├── ingestion_routes.py      # Contract & document ingestion endpoints
│   │   │   ├── entity_routes.py         # Entity details, neighbors, subgraphs & merge routes
│   │   │   ├── graph_routes.py          # Overview, high-risk, shortest path & search endpoints
│   │   │   ├── investigation_routes.py  # Multi-agent investigation endpoints
│   │   │   ├── audit_routes.py          # BSA §65B audit log verification & tampering check
│   │   │   └── auth_routes.py           # RBAC demo users, registration, login & profile
│   │   ├── agents/                      # LangGraph Multi-Agent Platform
│   │   │   ├── state.py                 # InvestigationState & Blackboard typed schemas
│   │   │   ├── supervisor.py            # Supervisor agent & iterative dispatch coordinator
│   │   │   ├── analysis_agent.py        # Hypothesis formulation & pattern analysis agent
│   │   │   ├── critic_verifier.py       # BSA §65B auditor & quality loop agent
│   │   │   ├── report_agent.py          # Court-admissible intelligence report generator
│   │   │   ├── graph.py                 # Compiled 7-agent StateGraph pipeline
│   │   │   ├── nodes/                   # Specialized worker nodes (Graph, Risk, Evidence, Cyber)
│   │   │   └── tools/                   # 12 strictly bounded LangChain investigative tools
│   │   ├── analytics/                   # Risk, Centrality & Cyber Forensic Anomaly Engine
│   │   ├── audit/                       # BSA §65B append-only SHA-256 hash-chain ledger
│   │   ├── auth/                        # Law enforcement RBAC models & PII masking rules
│   │   ├── ingestion/                   # Graph ingestor, schema validator & relationship builders
│   │   ├── models/                      # Pydantic v2 schemas & request/response contracts
│   │   ├── resolution/                  # RapidFuzz fuzzy matcher & cloned plate fraud detector
│   │   ├── security/                    # AES-256 encryption, HMAC blind indexes, ECDSA signatures
│   │   └── services/                    # Graph query service layer (Cypher wrappers)
│   ├── tests/                           # 161 Test items across 14 comprehensive test modules
│   └── requirements.txt                 # Backend Python dependencies
│
├── frontend/                            # Tactical React 18 + Vite Web Application
│   ├── src/
│   │   ├── main.jsx                     # React application bootstrap
│   │   ├── App.jsx                      # Master router, RBAC state & layout controller
│   │   ├── index.css                    # Tactical styling & Tailwind directives
│   │   ├── components/                  # Tactical Workspace Views & UI Modals
│   │   │   ├── AccessDeniedView.jsx     # Tier-based clearance restriction fallback screen
│   │   │   ├── AgentQueryBar.jsx        # Autonomous LangGraph investigation console
│   │   │   ├── AuthModal.jsx            # Officer authentication & clearance login
│   │   │   ├── AwaitingDirective.jsx    # Agent placeholder & idle directive state
│   │   │   ├── CdrTelemetryView.jsx     # Burner phone & SIM-box burst matrix
│   │   │   ├── DemoVideoModal.jsx       # Google Drive / YouTube video walkthrough modal
│   │   │   ├── EntityResolutionView.jsx # Fuzzy duplicate review queue & vehicle fraud view
│   │   │   ├── EvidenceDrawer.jsx       # Slide-over suspect dossier & kingpin trace inspector
│   │   │   ├── ExportDossierModal.jsx   # Court-admissible dossier PDF/JSON exporter
│   │   │   ├── FilterBar.jsx            # Entity type, risk threshold & timeline scrubber
│   │   │   ├── FinancialFlowView.jsx    # Circular money trail & AML flow visualizer
│   │   │   ├── FirCorpusView.jsx        # In-text NER highlighter for raw FIR documents
│   │   │   ├── GraphCanvas.jsx          # Cytoscape/Vis network graph visualization canvas
│   │   │   ├── Header.jsx               # Tactical header with clearance status & case info
│   │   │   ├── HomePage.jsx             # Executive Command Center homepage
│   │   │   ├── IngestModal.jsx          # New incident & document ingestion modal
│   │   │   ├── InvestigationPlaybook.jsx# 1-click forensic scenario quick-leads
│   │   │   ├── LegalAuditVault.jsx      # BSA §65B cryptographic audit vault
│   │   │   ├── NotFoundPage.jsx         # 404 Route handling screen
│   │   │   ├── OfficerFieldGuideModal.jsx# SOP manual & field investigation playbook
│   │   │   ├── RbacRoute.jsx            # Route guard enforcing officer clearance tiers
│   │   │   └── Sidebar.jsx              # Workspace navigation menu
│   │   ├── config/                      # Global Configuration & Environment Constants
│   │   │   └── constants.js             # Platform thresholds & demo video URL config
│   │   ├── context/                     # Application Context Providers
│   │   │   ├── AuthContext.jsx          # Clearance session state & login persistence
│   │   │   └── ToastContext.jsx         # Global notifications & tactical toast feedback
│   │   ├── data/                        # Static & Seeded Intelligence Assets
│   │   │   └── mockIntelligenceData.js  # Offline fallback graph nodes & edges
│   │   ├── services/                    # API Client Bridge & Integrations
│   │   │   ├── api.js                   # Axios/Fetch client with 90s timeout headroom
│   │   │   ├── apiService.js            # Modular API service exports
│   │   │   └── googleDriveService.js    # Google Drive picker & integration bridge
│   │   └── utils/                       # Utility Functions & Formatters
│   │       └── formatters.js            # Cryptographic hash truncation & date formatters
│   ├── package.json                     # Frontend dependencies & scripts
│   ├── tailwind.config.js               # Tailwind theme configuration
│   └── vite.config.js                   # Vite bundler configuration
│
├── backend/app/ingestion/               # Unified Case Ingestion & Risk Scoring Engine
│   ├── document_extractor.py            # Multi-format NLP extraction, BSA §65B hashing & risk scoring
│   └── graph_ingestor.py                # Entity resolution, PII encryption & Neo4j persistence
│
├── cypher/                              # Graph Database Scripts
│   ├── schema.cypher                    # Constraints, indexes & uniqueness rules
│   ├── seed.cypher                      # Synthetic criminal network seed data
│   └── queries.cypher                   # Pre-built investigative Cypher queries
│
├── data/                                # Datasets & Documents
│   └── raw/                             # Raw FIR documents (101, 102, 103), CDRs, and Bank records
│
├── docs/                                # Technical Documentation
│   └── UI_INTEGRATION_GUIDE.md          # UI-Backend integration contract documentation
│
├── .env.example                         # Environment variable configuration template
├── output_contract.json                 # Validated JSON ingestion contract
├── pytest.ini                           # Pytest configuration
└── requirements.txt                     # Root/NLP Python dependencies
```

---

## 🚀 9. Quickstart & Installation

### System Prerequisites
- **Python:** Version 3.10+ (Recommended: Python 3.12)
- **Node.js:** Version 18.0+ & `npm`
- **Neo4j:** Version 5+ (Optional: System runs seamlessly in offline mock mode if Neo4j is not installed)

---

### Step 1: Clone Repository & Setup Virtual Environment
```bash
git clone https://github.com/4nkit-3isGGS/Nexxus.Intelligence.git
cd Nexxus.Intelligence

# Create & activate Python virtual environment
python -m venv .venv

# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# On Linux / macOS:
source .venv/bin/activate
```

---

### Step 2: Install Python Dependencies
```bash
# Install backend dependencies
pip install -r backend/requirements.txt

# (Optional) Install NLP extraction dependencies & spaCy transformer model
pip install -r requirements.txt
python -m spacy download en_core_web_trf
```

---

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key configuration settings in `.env`:
```ini
# Neo4j Database Configuration
NEO4J_URL=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=passwordisneo4j
NEO4J_DATABASE=neo4j

# Graph Source: 'neo4j' (for live database) or 'mock' (for standalone offline testing)
GRAPH_DATA_SOURCE=neo4j

# Field-Level Cryptography
NEXXUS_MASTER_ENCRYPTION_KEY=
NEXXUS_BLIND_INDEX_SALT=NEXXUS_INDIAN_LAW_ENFORCEMENT_SALT_2026

# OpenAI Key for Multi-Agent Reasoning (Optional: Mock fallback available)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

---

### Step 4: Run the Test Suite
Verify backend health, agent tools, cryptographic ledgers, and entity resolution:
```bash
pytest backend/tests -v
```
> **Test Status:** 161 test items (**149 passed**, 12 live-database tests safely skipped in mock mode, **0 failures**).

---

### Step 5: Start the FastAPI Backend
```bash
uvicorn backend.app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- Redoc Documentation: `http://localhost:8000/redoc`

---

### Step 6: Start the Frontend Tactical Command Center
Open a new terminal session:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:5173
```

---

### Step 7: (Optional) Run the Unified Document Extraction & Risk Engine
To re-process raw FIRs, PDFs, Word docs, or CSVs and run extraction directly:
```bash
python -m backend.app.ingestion.document_extractor data/raw/fir_101.txt --export output_contract.json
```

---

## 📡 10. REST API Reference

The FastAPI backend exposes modular, OpenAPI-compliant endpoints:

| Domain | Method | Endpoint | Description | Clearance Required |
| :--- | :---: | :--- | :--- | :--- |
| **System** | `GET` | `/health` | Live Neo4j connection & mock fallback status | Public |
| **Ingestion** | `POST` | `/api/ingest/contract` | Ingest validated entity extraction JSON contract | `INVESTIGATOR` |
| **Graph** | `GET` | `/api/graph/overview` | Zero-friction full graph dataset formatted for UI | `ANALYST` |
| **Graph** | `GET` | `/api/graph/high-risk` | Suspect leaderboard ranked by composite risk | `ANALYST` |
| **Graph** | `GET` | `/api/graph/search` | Universal omnisearch across Person, Phone, Vehicle, FIR | `ANALYST` |
| **Graph** | `GET` | `/api/graph/node/{id}/neighbours` | 1-hop and 2-hop neighborhood expansion | `ANALYST` |
| **Investigation**| `POST` | `/api/investigate` | Triggers LangGraph multi-agent team investigation | `INVESTIGATOR` |
| **Resolution** | `GET` | `/api/entities/review-queue` | Returns duplicate entities requiring manual review | `LEAD_INVESTIGATOR` |
| **Resolution** | `POST` | `/api/entities/merge` | Merges secondary entity into master canonical entity | `LEAD_INVESTIGATOR` |
| **Resolution** | `POST` | `/api/entities/reject` | Dismisses duplicate flag between two entities | `LEAD_INVESTIGATOR` |
| **Audit** | `GET` | `/api/audit/logs` | Retrieves BSA §65B append-only SHA-256 hash log | `AUDITOR` |
| **Audit** | `GET` | `/api/audit/verify` | Validates hash-chain integrity & ECDSA signatures | `AUDITOR` |
| **Auth** | `POST` | `/api/auth/login` | Authenticates officer and issues RBAC token | Public |
| **Auth** | `GET` | `/api/auth/me` | Returns current clearance tier & PII masking profile | Token-authenticated |

---

## 👥 11. Task Force Team (SIH 2026 — Team Nexxus)

| Member | Subsystem Ownership | Core Deliverables |
| :--- | :--- | :--- |
| **Abhidha** | NLP Pipeline & Information Extraction | • spaCy & RoBERTa unstructured NER<br>• JSON output contract normalization<br>• FIR & CDR document text extraction |
| **Ankit** | Knowledge Graph, Resolution & Security | • Neo4j database lifecycle & driver pool<br>• Multi-stage fuzzy entity resolution<br>• AES-256 field encryption & HMAC blind indexing<br>• Append-only SHA-256 cryptographic audit |
| **Arnish** | Risk Analytics & Forensic Cyber Algorithms | • NetworkX PageRank & Betweenness modeling<br>• Circular transaction & laundering scans<br>• SIM-box & burner call burst detection<br>• Time-decayed risk engine formulation |
| **Bishal** | Multi-Agent Systems, APIs & Agent Tooling | • LangGraph 7-agent orchestration engine<br>• Agent tool wrappers & function registry (`@tool`)<br>• FastAPI endpoints (Graph, Search, Agent Copilot)<br>• 12 validated bounded agent execution tools |
| **Jayanta** | Frontend Architecture & UI Canvas Visualization | • React.js application shell & layout<br>• Cytoscape.js interactive force graph canvas<br>• Dynamic PII masking presentation layers<br>• Suspect profile drawers, evidence audit & filtering |
| **Tanushka** | Intelligence Reporting & Legal Compliance | • Court-admissible dossier generation<br>• BSA §65B admissibility verification docs<br>• Case summary scorecards & evidence trails |

---

<div align="center">

**Nexxus.Intelligence** — *Transforming Fragmented Crime Data into Actionable, Court-Admissible Intelligence.*  
Developed for **Smart India Hackathon (SIH 2026)** | Problem Statement **SIH26189**

</div>
