"""
Graph Query Service Layer
--------------------------
Python functions wrapping reusable Cypher queries.
Used by API routes and LangGraph agents to query the criminal network graph.
"""

from typing import Optional, List, Dict, Any
from backend.app.neo4j_driver import db


def get_entity(entity_id: str) -> dict | None:
    """Fetches a single entity node (Person, Phone, Location, Vehicle, Organization) by ID."""
    cypher = """
    MATCH (e {id: $id})
    OPTIONAL MATCH (e)-[:OWNS_PHONE]->(ph:Phone)
    WITH e, labels(e) AS lbls, collect(ph.number) AS phones
    RETURN e {.*, labels: lbls, phones: phones} AS entity
    """
    try:
        result = db.query(cypher, {"id": entity_id})
        return result[0]["entity"] if result else None
    except Exception as e:
        print(f"[Neo4j Error] get_entity failed: {e}")
        return None


def get_neighbors(entity_id: str) -> list[dict]:
    """Returns all direct 1-hop connections of an entity."""
    cypher = """
    MATCH (e {id: $id})-[r]-(other)
    RETURN type(r) AS relationship,
           labels(other)[0] AS entity_type,
           other {.*} AS entity,
           properties(r) AS details
    """
    try:
        return db.query(cypher, {"id": entity_id})
    except Exception as e:
        print(f"[Neo4j Error] get_neighbors failed: {e}")
        return []


def get_subgraph(entity_id: str, depth: int = 2) -> dict:
    """Returns multi-hop subgraph around an entity up to given depth."""
    cypher = f"""
    MATCH path = (e {{id: $id}})-[*1..{min(depth, 5)}]-(connected)
    UNWIND nodes(path) AS n
    UNWIND relationships(path) AS r
    WITH DISTINCT n, r
    RETURN collect(DISTINCT n {{.*, labels: labels(n)}}) AS nodes,
           collect(DISTINCT {{
               source: startNode(r).id,
               target: endNode(r).id,
               type: type(r),
               properties: properties(r)
           }}) AS edges
    """
    try:
        result = db.query(cypher, {"id": entity_id})
        return result[0] if result else {"nodes": [], "edges": []}
    except Exception as e:
        print(f"[Neo4j Error] get_subgraph failed: {e}")
        return {"nodes": [], "edges": [], "error": str(e)}


def get_shortest_path(id1: str, id2: str) -> dict:
    """Finds the shortest path between two entities."""
    cypher = """
    MATCH path = shortestPath(
        (e1 {id: $id1})-[*]-(e2 {id: $id2})
    )
    UNWIND nodes(path) AS n
    UNWIND relationships(path) AS r
    WITH collect(DISTINCT n {.*, labels: labels(n)}) AS nodes,
         collect(DISTINCT {
             source: startNode(r).id,
             target: endNode(r).id,
             type: type(r),
             properties: properties(r)
         }) AS edges
    RETURN nodes, edges
    """
    try:
        result = db.query(cypher, {"id1": id1, "id2": id2})
        return result[0] if result else {"nodes": [], "edges": []}
    except Exception as e:
        print(f"[Neo4j Error] get_shortest_path failed: {e}")
        return {"nodes": [], "edges": [], "error": str(e)}


def get_shared_locations(entity_id: str) -> list[dict]:
    """Finds other entities/people present at the same locations as the given entity."""
    cypher = """
    MATCH (e {id: $id})-[:PRESENT_AT]->(l:Location)<-[:PRESENT_AT]-(other:Person)
    RETURN l.name AS location,
           collect(DISTINCT other {.id, .name}) AS co_located_persons
    """
    try:
        return db.query(cypher, {"id": entity_id})
    except Exception as e:
        print(f"[Neo4j Error] get_shared_locations failed: {e}")
        return []


def get_graph_stats() -> list[dict]:
    """Returns node/relationship counts for the dashboard."""
    cypher = """
    CALL () {
        MATCH (n)
        RETURN labels(n)[0] AS type, 'node' AS category, count(n) AS count
    UNION ALL
        MATCH ()-[r]->()
        RETURN type(r) AS type, 'relationship' AS category, count(r) AS count
    }
    RETURN type, category, count
    ORDER BY category, type
    """
    try:
        return db.query(cypher)
    except Exception as e:
        print(f"[Neo4j Error] get_graph_stats failed: {e}")
        return []


LABEL_MAP = {
    "person": "Person",
    "phone": "Phone",
    "vehicle": "Vehicle",
    "cryptowallet": "CryptoWallet",
    "crypto_wallet": "CryptoWallet",
    "crypto": "CryptoWallet",
    "wallet": "CryptoWallet",
    "ipaddress": "IPAddress",
    "ip_address": "IPAddress",
    "ip": "IPAddress",
    "imei": "IMEI",
    "location": "Location",
    "organization": "Organization",
    "org": "Organization",
    "crimeincident": "CrimeIncident",
    "crime_incident": "CrimeIncident",
    "fir": "CrimeIncident",
}


def search_entities(
    query: str,
    limit: int = 20,
    entity_type: Optional[str] = None,
) -> list[dict]:
    """Searches entities (Person, Phone, Location, Vehicle, Organization, CryptoWallet, IPAddress, IMEI, FIR)
    by name, alias, phone, vehicle plate, crypto address, IP, IMEI, FIR number, or entity ID.
    
    Optionally filter by entity_type (case-insensitive, e.g. 'Person', 'phone', 'vehicle', 'cryptowallet').
    """
    label_filter = ""
    if entity_type and entity_type.lower() not in ("all", "*"):
        clean = "".join(c for c in entity_type if c.isalnum() or c == "_").lower()
        normalized_label = LABEL_MAP.get(clean, clean.capitalize())
        if normalized_label:
            label_filter = f":{normalized_label}"

    cypher = f"""
    MATCH (e{label_filter})
    WHERE (e.id IS NOT NULL AND toLower(toString(e.id)) CONTAINS toLower($query))
       OR (e.name IS NOT NULL AND toLower(toString(e.name)) CONTAINS toLower($query))
       OR (e.normalized_name IS NOT NULL AND toLower(toString(e.normalized_name)) CONTAINS toLower($query))
       OR (e.number IS NOT NULL AND toLower(toString(e.number)) CONTAINS toLower($query))
       OR (e.normalized_number IS NOT NULL AND toLower(toString(e.normalized_number)) CONTAINS toLower($query))
       OR (e.registration_number IS NOT NULL AND toLower(toString(e.registration_number)) CONTAINS toLower($query))
       OR (e.address IS NOT NULL AND toLower(toString(e.address)) CONTAINS toLower($query))
       OR (e.city IS NOT NULL AND toLower(toString(e.city)) CONTAINS toLower($query))
       OR (e.fir_number IS NOT NULL AND toLower(toString(e.fir_number)) CONTAINS toLower($query))
       OR (e.ip IS NOT NULL AND toLower(toString(e.ip)) CONTAINS toLower($query))
       OR (e.imei IS NOT NULL AND toLower(toString(e.imei)) CONTAINS toLower($query))
       OR (e.exchange_tag IS NOT NULL AND toLower(toString(e.exchange_tag)) CONTAINS toLower($query))
       OR any(alias IN COALESCE(e.aliases, []) WHERE toLower(toString(alias)) CONTAINS toLower($query))
       OR any(ph IN [(e)-[:OWNS_PHONE|USES_PHONE]->(p:Phone) | p.number] WHERE toLower(toString(ph)) CONTAINS toLower($query))
    OPTIONAL MATCH (e)-[:OWNS_PHONE|USES_PHONE]->(ph:Phone)
    WITH e, labels(e) AS lbls, collect(DISTINCT ph.number) AS phones
    RETURN e {{.*, labels: lbls, phones: phones}} AS person
    LIMIT $limit
    """
    try:
        result = db.query(cypher, {"query": query, "limit": limit})
        return [r["person"] for r in result]
    except Exception as e:
        print(f"[Neo4j Error] search_entities failed: {e}")
        return []



def get_evidence(entity_id1: str, entity_id2: str) -> list[dict]:
    """Returns provenance data for relationships between two entities."""
    cypher = """
    MATCH (a {id: $id1})-[r]-(b {id: $id2})
    RETURN type(r) AS relationship,
           COALESCE(r.source_doc_id, r.source_doc) AS source_doc,
           r.confidence AS confidence,
           r.timestamp AS timestamp,
           properties(r) AS full_properties
    """
    try:
        return db.query(cypher, {"id1": entity_id1, "id2": entity_id2})
    except Exception as e:
        print(f"[Neo4j Error] get_evidence failed: {e}")
        return []


def get_review_queue() -> list[dict]:
    """Retrieves all pending entity pairs flagged with POSSIBLE_DUPLICATE
    for investigator review.
    """
    cypher = """
    MATCH (e1)-[r:POSSIBLE_DUPLICATE]->(e2)
    RETURN e1.id AS entity1_id,
           e1.name AS entity1_name,
           labels(e1)[0] AS entity1_type,
           e1 {.*} AS entity1_details,
           e2.id AS entity2_id,
           e2.name AS entity2_name,
           labels(e2)[0] AS entity2_type,
           e2 {.*} AS entity2_details,
           r.confidence_score AS confidence_score,
           r.reason AS match_reason,
           r.entity_type AS entity_type,
           r.flagged_at AS flagged_at
    ORDER BY r.confidence_score DESC
    """
    try:
        return db.query(cypher)
    except Exception as e:
        print(f"[Neo4j Error] get_review_queue failed: {e}")
        return []


def merge_duplicate_entities(target_id: str, duplicate_id: str) -> dict:
    """Merges a duplicate entity node into the target entity node.
    Transfers relationships, consolidates aliases, removes POSSIBLE_DUPLICATE flags,
    and removes the duplicate node.
    """
    from datetime import datetime, timezone
    ts = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    cypher = """
    MATCH (target {id: $target_id}), (dup {id: $duplicate_id})
    // 1. Consolidate aliases and metadata
    SET target.aliases = COALESCE(target.aliases, []) + [x IN COALESCE(dup.aliases, []) WHERE NOT x IN COALESCE(target.aliases, [])],
        target.updated_at = $ts

    // 2. Remove POSSIBLE_DUPLICATE link between them
    WITH target, dup
    OPTIONAL MATCH (target)-[pd:POSSIBLE_DUPLICATE]-(dup)
    DELETE pd

    // 3. Reroute relationships where dup is source
    WITH target, dup
    OPTIONAL MATCH (dup)-[r:MEMBER_OF]->(o:Organization)
    WHERE o.id <> target.id
    MERGE (target)-[:MEMBER_OF]->(o)

    WITH target, dup
    OPTIONAL MATCH (dup)-[r:OWNS_PHONE]->(ph:Phone)
    MERGE (target)-[:OWNS_PHONE]->(ph)

    WITH target, dup
    OPTIONAL MATCH (dup)-[r:PRESENT_AT]->(l:Location)
    MERGE (target)-[:PRESENT_AT]->(l)

    WITH target, dup
    OPTIONAL MATCH (dup)-[r:OWNS_VEHICLE]->(v:Vehicle)
    MERGE (target)-[:OWNS_VEHICLE]->(v)

    WITH target, dup
    OPTIONAL MATCH (dup)-[r:TRANSACTED_WITH]->(other)
    WHERE other.id <> target.id
    MERGE (target)-[:TRANSACTED_WITH]->(other)

    // 4. Reroute relationships where dup is target
    WITH target, dup
    OPTIONAL MATCH (p:Person)-[r:MEMBER_OF]->(dup)
    WHERE p.id <> target.id
    MERGE (p)-[:MEMBER_OF]->(target)

    WITH target, dup
    OPTIONAL MATCH (other)-[r:TRANSACTED_WITH]->(dup)
    WHERE other.id <> target.id
    MERGE (other)-[:TRANSACTED_WITH]->(target)

    // 5. Delete duplicate node
    WITH dup
    DETACH DELETE dup
    RETURN true AS merged
    """
    try:
        result = db.query(cypher, {"target_id": target_id, "duplicate_id": duplicate_id, "ts": ts})
        return {
            "success": True,
            "target_id": target_id,
            "merged_duplicate_id": duplicate_id,
            "message": f"Entity {duplicate_id} successfully merged into {target_id}",
        }
    except Exception as e:
        print(f"[Neo4j Error] merge_duplicate_entities failed: {e}")
        return {
            "success": False,
            "target_id": target_id,
            "duplicate_id": duplicate_id,
            "error": str(e),
        }


def get_graph_overview(limit: int = 100) -> dict:
    """Returns the primary connected network perimeter formatted for UI graph canvases (Cytoscape / Vis.js)."""
    cypher = """
    MATCH (n)
    OPTIONAL MATCH (n)-[r]->(m)
    WITH n, r, m
    LIMIT $limit
    WITH collect(DISTINCT n {.*, labels: labels(n)}) + 
         collect(DISTINCT CASE WHEN m IS NOT NULL THEN m {.*, labels: labels(m)} END) AS raw_nodes,
         collect(DISTINCT CASE WHEN r IS NOT NULL THEN {
             source: startNode(r).id,
             target: endNode(r).id,
             type: type(r),
             properties: properties(r)
         } END) AS raw_edges
    RETURN [node IN raw_nodes WHERE node IS NOT NULL] AS nodes,
           [edge IN raw_edges WHERE edge IS NOT NULL] AS edges
    """
    try:
        result = db.query(cypher, {"limit": limit})
        return result[0] if result else {"nodes": [], "edges": []}
    except Exception as e:
        print(f"[Neo4j Error] get_graph_overview failed: {e}")
        return {"nodes": [], "edges": [], "error": str(e)}


def get_high_risk_entities(limit: int = 10) -> list[dict]:
    """Retrieves top suspects sorted by risk_score descending with connected phones and crimes."""
    cypher = """
    MATCH (p:Person)
    OPTIONAL MATCH (p)-[:USES_PHONE|OWNS_PHONE]->(ph:Phone)
    OPTIONAL MATCH (p)-[:INVOLVED_IN]->(c:CrimeIncident)
    WITH p, 
         collect(DISTINCT ph.number) AS phones,
         collect(DISTINCT COALESCE(c.fir_number, c.id)) AS crime_incidents
    RETURN p {
        .*,
        labels: labels(p),
        phones: phones,
        crime_incidents: crime_incidents,
        crime_count: size(crime_incidents)
    } AS suspect
    ORDER BY COALESCE(p.risk_score, 0) DESC, suspect.crime_count DESC
    LIMIT $limit
    """
    try:
        result = db.query(cypher, {"limit": limit})
        return [r["suspect"] for r in result]
    except Exception as e:
        print(f"[Neo4j Error] get_high_risk_entities failed: {e}")
        return []


