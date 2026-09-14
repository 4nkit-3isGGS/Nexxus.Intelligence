"""
LLM Provider Integration (Groq Engine)
---------------------------------------
Connects LangGraph autonomous agents to Groq's high-speed Llama-3.3-70B / Llama-3.1-8B
models for dynamic criminal syndicate reasoning, hypothesis generation, and executive dossiers.

Implements graceful fallback: if GROQ_API_KEY is not configured or network drops,
all agents fall back cleanly to deterministic graph-algorithmic evaluation without errors.
"""

import os
import json
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

load_dotenv()


def get_llm(temperature: float = 0.1, model_name: Optional[str] = None):
    """Returns an initialized ChatGroq model instance if GROQ_API_KEY is present, else None."""
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        return None

    try:
        from langchain_groq import ChatGroq
        default_model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
        return ChatGroq(
            groq_api_key=api_key,
            model_name=model_name or default_model,
            temperature=temperature,
            max_tokens=1500,
            max_retries=2,
            timeout=15.0,
        )
    except Exception as e:
        print(f"[NexxusDB LLM] Warning: Could not initialize ChatGroq: {e}")
        return None


def is_llm_available() -> bool:
    """Returns True if GROQ_API_KEY is set and ChatGroq can be instantiated."""
    return get_llm() is not None


def generate_llm_dossier(
    subject_id: str,
    subject_name: str,
    user_query: str,
    threat_tier: str,
    risk_score: float,
    entities: List[Dict[str, Any]],
    relationships: List[Dict[str, Any]],
    hypotheses: List[Dict[str, Any]],
    evidence: List[Dict[str, Any]],
    fallback_dossier: str,
) -> str:
    """Uses Groq LLM to synthesize verified discoveries into a command-level intelligence dossier."""
    llm = get_llm(temperature=0.1)
    if not llm:
        return fallback_dossier

    system_prompt = (
        "You are an Elite Criminal Intelligence Officer and Senior Analyst with Indian Law Enforcement. "
        "Your task is to write a commanding, authoritative, court-grade Criminal Network Intelligence Dossier "
        "under Section 65B of the Bharatiya Sakshya Adhiniyam (BSA 2023).\n\n"
        "STRICT GROUNDING RULES:\n"
        "1. Only state facts directly present in the provided entities, relationships, risk analysis, and evidence.\n"
        "2. Do NOT invent phone numbers, names, crypto wallets, or criminal offenses not in the data.\n"
        "3. Cite verified document IDs (e.g. FIR numbers, CDR records) for all evidentiary findings.\n"
        "4. Format in professional Markdown with clear section headers, bullet points, and high-impact executive summaries."
    )

    facts_payload = {
        "subject_id": subject_id,
        "subject_name": subject_name,
        "query": user_query,
        "threat_tier": threat_tier,
        "risk_score": risk_score,
        "entities_count": len(entities),
        "relationships_count": len(relationships),
        "entities_summary": [
            {"id": e.get("id"), "label": e.get("label") or e.get("type"), "name": e.get("name") or e.get("number") or e.get("registration_number")}
            for e in entities[:20]
        ],
        "relationships_summary": [
            {"source": r.get("source"), "target": r.get("target"), "type": r.get("type")}
            for r in relationships[:30]
        ],
        "hypotheses": [
            {"statement": h.get("statement"), "status": h.get("status"), "confidence": h.get("confidence")}
            for h in hypotheses
        ],
        "evidence_count": len(evidence),
    }

    user_prompt = (
        f"Generate the official intelligence dossier based on this verified multi-modal case file:\n"
        f"```json\n{json.dumps(facts_payload, indent=2)}\n```"
    )

    try:
        from langchain_core.messages import SystemMessage, HumanMessage
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]
        response = llm.invoke(messages)
        content = response.content
        if content and len(content.strip()) > 100:
            return content.strip()
    except Exception as exc:
        print(f"[NexxusDB LLM] Warning: LLM dossier synthesis failed ({exc}), falling back to deterministic template.")

    return fallback_dossier
