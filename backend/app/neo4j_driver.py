"""
Neo4j Database Driver & Connection Manager
------------------------------------------
Handles connection pooling, session lifecycle, health check verification,
and parameterized Cypher query execution for the Criminal Network Intelligence System.
"""

import os
from dotenv import load_dotenv
from neo4j import GraphDatabase, Driver

load_dotenv()


NEO4J_URL = os.getenv("NEO4J_URL", "bolt://127.0.0.1:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "passwordisneo4j")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "neo4j")


import time

class Neo4jConnection:
    """Manages connection lifecycle with Neo4j database."""

    def __init__(self, url: str = NEO4J_URL, user: str = NEO4J_USER, password: str = NEO4J_PASSWORD):
        self.url = url
        self.user = user
        self.password = password
        self.driver: Driver | None = None
        self._is_available: bool | None = None
        self._last_checked: float = 0.0
        self._check_ttl: float = 5.0  # Cache connectivity status for 5 seconds

    def connect(self) -> Driver:
        if self.driver is None:
            conn_timeout = float(os.getenv("NEO4J_CONNECTION_TIMEOUT", "1.0"))
            self.driver = GraphDatabase.driver(
                self.url,
                auth=(self.user, self.password),
                connection_timeout=conn_timeout,
            )
        return self.driver

    def close(self):
        if self.driver is not None:
            self.driver.close()
            self.driver = None
        self._is_available = None

    def is_available(self) -> bool:
        """Fast cached check if Neo4j is actively reachable."""
        now = time.time()
        if self._is_available is not None and (now - self._last_checked) < self._check_ttl:
            return self._is_available

        try:
            driver = self.connect()
            driver.verify_connectivity()
            self._is_available = True
        except Exception as e:
            self._is_available = False
        self._last_checked = now
        return self._is_available

    def verify_connectivity(self) -> bool:
        """Verifies if database is reachable."""
        return self.is_available()

    def query(self, cypher_query: str, parameters: dict | None = None, db: str = NEO4J_DATABASE):
        """Execute a read/write Cypher query and return list of records as dicts."""
        if not self.is_available():
            raise ConnectionError("Neo4j database is offline or unreachable.")
        driver = self.connect()
        with driver.session(database=db) as session:
            result = session.run(cypher_query, parameters or {})
            return [record.data() for record in result]


# Global singleton instance
db = Neo4jConnection()

