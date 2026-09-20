"""
graph_loader.py
Single entry point analytics.py and risk_engine.py call to get the graph.
Toggle DATA_SOURCE to switch between the built-in mock graph, a real
Person 1/2 JSON export, or a live Neo4j instance -- nothing else in this
folder needs to change when you switch.
"""

import os

import networkx as nx
from pathlib import Path
try:
    from graph.data_sources.mock_graph import build_mock_graph
    from graph.data_sources.json_loader import load_from_json_file
    from graph.data_sources.neo4j_loader import load_from_neo4j
except ImportError:
    from backend.app.analytics.data_sources.mock_graph import build_mock_graph
    from backend.app.analytics.data_sources.json_loader import load_from_json_file
    from backend.app.analytics.data_sources.neo4j_loader import load_from_neo4j

# "mock" for the built-in test graph, "json" for Person 1/2's JSON export
# file, "neo4j" for Person 2's live graph DB.
DATA_SOURCE = os.environ.get("GRAPH_DATA_SOURCE", "neo4j")
JSON_DATA_PATH = str(Path(__file__).resolve().parent.parent / "sample_data" / "ground_truth_case.json")  # used when DATA_SOURCE == "json"


def load_graph() -> nx.MultiDiGraph:
    from backend.app.neo4j_driver import db
    if DATA_SOURCE == "neo4j" and db.is_available():
        try:
            return load_from_neo4j()  # reads NEO4J_URI/NEO4J_USER/NEO4J_PASSWORD env vars, see neo4j_loader.py
        except Exception as e:
            print(f"[Neo4j Fallback] Connection to Neo4j unavailable ({e}). Falling back to sample dataset.")
    if os.path.exists(JSON_DATA_PATH):
        try:
            return load_from_json_file(JSON_DATA_PATH)
        except Exception:
            pass
    return build_mock_graph()


