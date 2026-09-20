"""
Law Enforcement Authentication & RBAC Routes
--------------------------------------------
Provides login, registration, session validation, and preset demo
officer accounts for the Nexxus Intelligence platform.
"""

from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field

from backend.app.auth.models import Role, UserSession, ROLE_PERMISSIONS, Permission
from backend.app.auth.rbac import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication & RBAC"])


# In-memory officer store initialized with standard law enforcement demo accounts
DEMO_OFFICERS = [
    {
        "user_id": "OFFICER_LEAD_01",
        "name": "DSP B. Banerjee",
        "badge_number": "WB-CID-0941",
        "email": "b.banerjee@cid.wb.gov.in",
        "role": Role.LEAD_INVESTIGATOR.value,
        "jurisdiction": "CID West Bengal (Cyber Crime Division)",
        "department": "State Cyber Directorate",
        "clearance_level": "Tier 1 Top Secret / Unmasked PII",
        "rank": "Deputy Superintendent of Police (DSP)"
    },
    {
        "user_id": "OFFICER_FIELD_02",
        "name": "Insp. Rajesh Sen",
        "badge_number": "DL-IPS-4491",
        "email": "r.sen@delhipolice.gov.in",
        "role": Role.INVESTIGATOR.value,
        "jurisdiction": "Delhi Special Cell",
        "department": "Cyber Telecommunications Ops",
        "clearance_level": "Tier 2 Confidential / Masked Aadhaar",
        "rank": "Inspector of Police"
    },
    {
        "user_id": "ANALYST_CYBER_03",
        "name": "Pooja Roy",
        "badge_number": "CY-SPEC-1092",
        "email": "p.roy@fiu.gov.in",
        "role": Role.ANALYST.value,
        "jurisdiction": "FIU-IND Tactical Cell",
        "department": "Financial Intelligence Unit",
        "clearance_level": "Tier 2 Analytical / Network Topology",
        "rank": "Senior Intelligence Analyst"
    },
    {
        "user_id": "AUDITOR_JUDICIAL_04",
        "name": "Adv. M. Mukherjee",
        "badge_number": "BAR-CAL-2018",
        "email": "m.mukherjee@highcourt.wb.gov.in",
        "role": Role.AUDITOR.value,
        "jurisdiction": "Calcutta High Court Registry",
        "department": "Judicial Vigilance & Section 65B Audit",
        "clearance_level": "Tier 3 Judicial / Read-Only Chain",
        "rank": "Court Evidence Commissioner"
    }
]

# Registered users list
USERS_DB = {u["email"].lower(): dict(u) for u in DEMO_OFFICERS}
# Also index by badge number
for u in DEMO_OFFICERS:
    USERS_DB[u["badge_number"].lower()] = dict(u)


class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Badge Number or Govt Email")
    password: Optional[str] = Field("demo123", description="Officer Password or PIN")
    role: Optional[str] = Field(None, description="Direct role selection for fast demo")


class RegisterRequest(BaseModel):
    name: str = Field(..., description="Officer Full Name")
    badge_number: str = Field(..., description="Police Badge / Govt ID")
    email: str = Field(..., description="Govt Email")
    department: str = Field(..., description="Police Dept or Investigative Cell")
    jurisdiction: str = Field("West Bengal State", description="Jurisdiction")
    role: str = Field(Role.INVESTIGATOR.value, description="Assigned RBAC role")
    password: str = Field(..., description="Password")


class AuthResponse(BaseModel):
    success: bool
    token: str
    user: dict
    permissions: List[str]
    message: str


@router.get("/demo-users")
def get_demo_users():
    """Returns pre-configured officer accounts across all 4 RBAC tiers for 1-click evaluation."""
    return {
        "success": True,
        "data": DEMO_OFFICERS
    }


@router.post("/login", response_model=AuthResponse)
def login_officer(req: LoginRequest):
    """Authenticates an officer by badge number, email, or role preset."""
    ident = req.identifier.strip().lower()

    # Fast role-based demo selection if matching demo account
    matched_user = None
    if ident in USERS_DB:
        matched_user = USERS_DB[ident]
    else:
        # Check by requested role fallback
        for u in DEMO_OFFICERS:
            if req.role and u["role"] == req.role:
                matched_user = u
                break

    # If still not found, create an active ad-hoc session with requested role
    if not matched_user:
        assigned_role = req.role if req.role in [r.value for r in Role] else Role.LEAD_INVESTIGATOR.value
        matched_user = {
            "user_id": f"OFFICER_{ident.replace(' ', '_').upper()[:12]}",
            "name": req.identifier.title(),
            "badge_number": f"ID-{ident.upper()[:8]}",
            "email": req.identifier if "@" in req.identifier else f"{ident}@police.gov.in",
            "role": assigned_role,
            "jurisdiction": "Central Law Enforcement Command",
            "department": "Cyber Crime Division",
            "clearance_level": "Tier 1 Lead Clearance" if assigned_role == Role.LEAD_INVESTIGATOR.value else "Field Clearance",
            "rank": "Officer on Duty"
        }
        USERS_DB[ident] = matched_user

    role_enum = Role(matched_user["role"])
    permissions = [p.value for p in ROLE_PERMISSIONS.get(role_enum, set())]
    token = f"nxt_{matched_user['user_id']}_{matched_user['role']}_sig"

    return {
        "success": True,
        "token": token,
        "user": matched_user,
        "permissions": permissions,
        "message": f"Welcome, {matched_user['name']} ({matched_user['badge_number']}). Logged in as {matched_user['role']}."
    }


@router.post("/register", response_model=AuthResponse)
def register_officer(req: RegisterRequest):
    """Registers a new law enforcement officer with specified department and RBAC role."""
    email_key = req.email.strip().lower()
    badge_key = req.badge_number.strip().lower()

    assigned_role = req.role if req.role in [r.value for r in Role] else Role.INVESTIGATOR.value

    new_officer = {
        "user_id": f"OFFICER_{req.badge_number.replace('-', '_').upper()}",
        "name": req.name.strip(),
        "badge_number": req.badge_number.strip().upper(),
        "email": req.email.strip(),
        "role": assigned_role,
        "jurisdiction": req.jurisdiction.strip(),
        "department": req.department.strip(),
        "clearance_level": "Tier 1 Top Secret" if assigned_role == Role.LEAD_INVESTIGATOR.value else "Authorized Personnel",
        "rank": "Investigative Officer"
    }

    USERS_DB[email_key] = new_officer
    USERS_DB[badge_key] = new_officer

    role_enum = Role(assigned_role)
    permissions = [p.value for p in ROLE_PERMISSIONS.get(role_enum, set())]
    token = f"nxt_{new_officer['user_id']}_{assigned_role}_sig"

    return {
        "success": True,
        "token": token,
        "user": new_officer,
        "permissions": permissions,
        "message": f"Officer {new_officer['name']} successfully registered with clearance {assigned_role}."
    }


@router.get("/me")
def get_current_officer(current_user: UserSession = Depends(get_current_user)):
    """Validates the active officer session and returns role permissions."""
    role_enum = current_user.role
    permissions = [p.value for p in ROLE_PERMISSIONS.get(role_enum, set())]

    # Look up in DB
    user_data = None
    for u in DEMO_OFFICERS:
        if u["badge_number"] == current_user.badge_number or u["role"] == current_user.role.value:
            user_data = u
            break

    if not user_data:
        user_data = {
            "user_id": current_user.user_id,
            "badge_number": current_user.badge_number,
            "role": current_user.role.value,
            "jurisdiction": current_user.jurisdiction,
            "name": "Active Officer",
            "department": "Law Enforcement"
        }

    return {
        "success": True,
        "user": user_data,
        "permissions": permissions
    }
