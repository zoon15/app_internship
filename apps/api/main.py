from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Career Internship AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Models ---
class UserRegister(BaseModel):
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str
    role: str

# --- In-Memory Mock Database ---
# The single pre-authorized security admin is set here
users_db = [
    {"email": "admin@internhub.com", "password": "password123", "role": "security_admin", "status": "Active"},
    {"email": "l.fischer@company.com", "password": "password123", "role": "recruiter", "status": "Active"},
    {"email": "r.oduya@uni.edu", "password": "password123", "role": "student", "status": "Active"},
    {"email": "k.novak@company.com", "password": "password123", "role": "recruiter", "status": "Suspended"},
]

system_logs = [
    {"id": "1", "timestamp": "Just now", "level": "INFO", "message": "Admin dashboard initialized successfully.", "module": "SYS"},
    {"id": "2", "timestamp": "2m ago", "level": "WARN", "message": "Failed login attempt • k.novak@company.com", "module": "AUTH"},
    {"id": "3", "timestamp": "1h ago", "level": "INFO", "message": "Access request pending • new recruiter", "module": "USER"},
    {"id": "4", "timestamp": "3h ago", "level": "INFO", "message": "Role changed • r.oduya to student", "module": "MGMT"}
]

# Track metrics
failed_logins_count = 1

def add_log(level: str, message: str, module: str):
    system_logs.insert(0, {
        "id": str(len(system_logs) + 1),
        "timestamp": "Just now",
        "level": level,
        "message": message,
        "module": module
    })

# --- AUTH ROUTES ---

@app.post("/api/auth/register")
def register_user(payload: UserRegister):
    # CRITICAL SECURITY RULE: Block any attempt to register an admin account
    if payload.role == "security_admin":
         raise HTTPException(
             status_code=status.HTTP_403_FORBIDDEN,
             detail="System configuration violation: Admin accounts cannot be registered."
         )

    for u in users_db:
        if u["email"] == payload.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists."
            )
    
    new_user = {
        "email": payload.email,
        "password": payload.password,
        "role": payload.role,
        "status": "Active"
    }
    users_db.append(new_user)
    add_log("INFO", f"Registered new user: {payload.email} as {payload.role}", "AUTH")
    return {"message": "User registered successfully!", "email": payload.email}


@app.post("/api/auth/login")
def login_user(payload: UserLogin):
    global failed_logins_count
    for u in users_db:
        if u["email"] == payload.email and u["password"] == payload.password:
            if u["status"] == "Suspended":
                add_log("WARN", f"Blocked login attempt for suspended user: {payload.email}", "AUTH")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Your account has been suspended. Please contact support."
                )
            if u["role"] != payload.role:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied. Selected role does not match registered account."
                )
            add_log("INFO", f"User {payload.email} successfully logged in.", "AUTH")
            return {"message": "Login successful", "email": payload.email, "role": payload.role}
            
    failed_logins_count += 1
    add_log("WARN", f"Failed login attempt • {payload.email}", "AUTH")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password."
    )


# --- ADMIN PORTAL ENDPOINTS ---

@app.get("/api/admin/stats")
def get_admin_stats():
    """Generates clean system stats mapping to the design dashboard widgets."""
    active_users = len([u for u in users_db if u["status"] == "Active"])
    access_requests = len([l for l in system_logs if "pending" in l["message"].lower()])
    
    return {
        "active_users": active_users,
        "failed_logins": failed_logins_count,
        "access_requests": access_requests,
        "server_uptime": "99%",
        "api_health": "97%",
        "storage_used": "62%",
        "active_sessions": "41%"
    }


@app.get("/api/users")
def get_all_users():
    return users_db


@app.put("/api/users/status")
def update_user_status(email: str, status: str):
    for u in users_db:
        if u["email"] == email:
            u["status"] = status
            add_log("WARN" if status == "Suspended" else "INFO", 
                    f"User status for {email} was set to {status}.", "MGMT")
            return {"message": f"User status changed to {status}.", "email": email}
            
    raise HTTPException(status_code=404, detail="User not found")


@app.get("/api/logs")
def get_system_logs():
    return system_logs