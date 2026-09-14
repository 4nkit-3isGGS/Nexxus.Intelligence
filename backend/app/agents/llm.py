"""
LLM Provider Integration (OpenAI Engine)
----------------------------------------
Connects LangGraph autonomous agents to OpenAI models (e.g. gpt-4o, gpt-4o-mini)
via the official OpenAI API for dynamic criminal syndicate reasoning, hypothesis
generation, and executive court-certified dossiers.

Implements graceful fallback: if OPENAI_API_KEY is not configured or network drops,
all agents fall back cleanly to deterministic graph-algorithmic evaluation without errors.
"""

import os
import json
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

load_dotenv()


def get_llm_model_name() -> str:
    """Returns the configured OpenAI model name (default: gpt-4o-mini)."""
    return os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip() or "gpt-4o-mini"


def get_llm(temperature: float = 0.1, model_name: Optional[str] = None):
    """Returns an initialized ChatOpenAI model instance if OPENAI_API_KEY is present, else None."""
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return None

    try:
        from langchain_openai import ChatOpenAI
        chosen_model = model_name or get_llm_model_name()
        base_url = (
            os.getenv("OPENAI_API_BASE", "").strip()
            or os.getenv("OPENAI_BASE_URL", "").strip()
            or None
        )

        init_kwargs = {
            "api_key": api_key,
            "model": chosen_model,
            "temperature": temperature,
            "max_tokens": 2048,
            "max_retries": 2,
            "timeout": 30.0,
        }
        if base_url:
            init_kwargs["base_url"] = base_url

        return ChatOpenAI(**init_kwargs)
    except Exception as e:
        print(f"[NexxusDB LLM] Warning: Could not initialize ChatOpenAI: {e}")
        return None


def is_llm_available() -> bool:
    """Returns True if OPENAI_API_KEY is set and ChatOpenAI can be instantiated."""
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
    """Uses OpenAI LLM to synthesize verified discoveries into a command-level intelligence dossier."""
    llm = get_llm(temperature=0.1)
    if not llm:
        return fallback_dossier

    system_prompt = (
        "You are an Elite Criminal Intelligence Officer and Senior Analyst with Indian Law Enforcement. "
        "Your task is to write a commanding, authoritative Executive Intelligence Assessment for a "
        "Criminal Network Intelligence Dossier under Section 65B of the Bharatiya Sakshya Adhiniyam (BSA 2023).\n\n"
        "STRICT GROUNDING RULES:\n"
        "1. Only state facts directly present in the provided entities, relationships, risk analysis, and evidence.\n"
        "2. Do NOT invent phone numbers, names, crypto wallets, or criminal offenses not in the data.\n"
        "3. Synthesize the operational role of the target subject, network cut-outs, and syndicate links.\n"
        "4. Format in professional Markdown with concise, high-impact executive paragraphs and analytical bullet points."
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
            {
                "id": e.get("id"),
                "label": e.get("label") or e.get("type"),
                "name": e.get("name") or e.get("number") or e.get("registration_number"),
            }
            for e in entities[:25]
        ],
        "relationships_summary": [
            {"source": r.get("source"), "target": r.get("target"), "type": r.get("type")}
            for r in relationships[:35]
        ],
        "hypotheses": [
            {"statement": h.get("statement") or h.get("claim"), "status": h.get("status"), "confidence": h.get("confidence")}
            for h in hypotheses
        ],
        "evidence_count": len(evidence),
    }

    user_prompt = (
        f"Generate a commanding Executive Intelligence Synthesis based on this verified case file:\n"
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
        if content and len(content.strip()) > 80:
            exec_summary = content.strip()
            # Strip redundant top-level H1 if generated
            lines = exec_summary.split("\n")
            if lines and lines[0].startswith("# "):
                lines = lines[1:]
            clean_exec_summary = "\n".join(lines).strip()

            # Insert executive LLM assessment into the certified dossier structure
            marker = "## 1. 👤 Target Subject Profile"
            if marker in fallback_dossier:
                parts = fallback_dossier.split(marker, 1)
                llm_section = (
                    "## 🤖 Executive Intelligence Assessment (OpenAI Engine)\n"
                    f"{clean_exec_summary}\n\n"
                    f"{marker}"
                )
                return parts[0] + llm_section + parts[1]
            else:
                return (
                    f"# 🚨 CRIMINAL NETWORK INTELLIGENCE DOSSIER\n\n"
                    f"## 🤖 Executive Intelligence Assessment (OpenAI Engine)\n"
                    f"{clean_exec_summary}\n\n---\n\n"
                    f"{fallback_dossier}"
                )
    except Exception as exc:
        print(f"[NexxusDB LLM] Warning: OpenAI dossier synthesis failed ({exc}), falling back to deterministic template.")

    return fallback_dossier
