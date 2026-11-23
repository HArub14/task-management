---
name: start-servers
description: >
  Use this skill whenever the user wants to start, restart, or run any server in this
  Task Management project — backend, frontend, database, or all together.
  Trigger on: "start servers", "run the app", "start backend", "start frontend",
  "サーバー起動", "起動して", "バックエンド起動", "フロントエンド起動", "サーバーを起動",
  "アプリを起動", "docker起動", "DBを起動". Also trigger when the user reports a
  port conflict or asks why a server won't start.
  Always check for port conflicts before starting any service, even if the user
  didn't explicitly ask for it.
---

# Server Startup Rules — Task Management Project

This project runs three services on fixed ports. Before starting anything, verify
each port is free. Attempting to start on a busy port wastes time and produces
cryptic errors — clearing the conflict first is always faster.

## Designated ports (never change these)

| Service | Port | Start command | Working directory |
|---------|------|--------------|-------------------|
| PostgreSQL (Docker) | 5432 | `docker compose up -d` | project root |
| Backend (Spring Boot) | 8080 | `.\gradlew.bat bootRun` | `backend/` |
| Frontend (Vite) | 5173 | `npm run dev` | `frontend/` |

**Never start a service on an alternative port** (e.g. 8081, 5174). If the
designated port is busy, kill the occupying process and start on the right port.

## Step 1 — Check ports

Run this in PowerShell to find any processes blocking the three ports:

```powershell
@(8080, 5173, 5432) | ForEach-Object {
    $port = $_
    $result = netstat -ano | findstr ":$port "
    if ($result) { Write-Host "Port $port OCCUPIED:`n$result" }
    else         { Write-Host "Port $port free" }
}
```

## Step 2 — Kill conflicts

For each occupied port, extract the PID from the rightmost column of the
`netstat` output and stop it:

```powershell
# Example: port 8080 is used by PID 12345
Stop-Process -Id 12345 -Force
```

For PostgreSQL conflicts (port 5432), prefer `docker compose down` over killing
the PID directly — it shuts down containers cleanly:

```powershell
Set-Location "c:\Users\N-har\OneDrive\Desktop\エンジニア\Task management"
docker compose down
```

## Step 3 — Start services in order

Always start in this order: **Database → Backend → Frontend**

The backend needs the DB to be ready before it can connect. The frontend can
start while the backend is warming up, but starting DB last would cause
backend connection errors on boot.

### 1. Database (Docker)

```powershell
Set-Location "c:\Users\N-har\OneDrive\Desktop\エンジニア\Task management"
docker compose up -d
```

Verify: `docker ps` should show `taskmanagement-db-1` as `Up`.

### 2. Backend (Spring Boot) — run in background

```powershell
Set-Location "c:\Users\N-har\OneDrive\Desktop\エンジニア\Task management\backend"
.\gradlew.bat bootRun
```

Run this in a background shell or a separate terminal. The backend is ready
when you see `Started TaskManagementApplication` in the output.
Verify: `Invoke-WebRequest http://localhost:8080/api/tasks` returns 200.

### 3. Frontend (Vite) — run in background

```powershell
Set-Location "c:\Users\N-har\OneDrive\Desktop\エンジニア\Task management\frontend"
npm run dev
```

Run in a separate terminal. Vite prints `Local: http://localhost:5173/` when ready.

## Common scenarios

**"Port 8080 is already in use"**
→ Find the PID with `netstat -ano | findstr :8080`, then `Stop-Process -Id <PID> -Force`.

**"Port 5173 is already in use" (Vite conflict)**
→ Same pattern: `netstat -ano | findstr :5173` → `Stop-Process -Id <PID> -Force`.

**Docker Desktop not running**
→ Start Docker Desktop manually from the Start menu, wait for the whale icon in
the taskbar to stop animating, then run `docker compose up -d`.

**Backend fails with "Connection refused" to DB**
→ Check DB first: `docker ps`. If the container is not running, start it with
`docker compose up -d` and wait a few seconds before retrying the backend.
