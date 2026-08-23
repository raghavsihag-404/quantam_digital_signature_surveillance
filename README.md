# QSENTINEL — Quantum-Inspired Cyber Threat Detection Dashboard

PS-141 runtime monitor for quantum-inspired digital signature verification. Advisory monitoring layer strictly separated from the authoritative QDS protocol engine.

> Full architecture specification: see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Architecture

- **`qds/`** — Authoritative 3-qubit statevector protocol (Bell pair → Teleportation → QS-L check)
- **`qsentinel_monitor/`** — Advisory-only monitoring (FSM, Stage 1/2, GLR-CUSUM, forensic log)
- **`attacks/`** — Modular attack simulation strategies
- **`api/`** — FastAPI backend with SSE streaming
- **`frontend/`** — React + Vite + Tailwind + Recharts dashboard

## Quick Start

### Backend

```bash
pip install -r requirements.txt
pip install pytest
python -m uvicorn api.main:app --reload --port 8001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/sessions/run` | Execute protocol + advisory analysis |
| GET | `/api/sessions/{id}/stream` | SSE real-time pipeline |
| POST | `/api/attacks/run` | Run attack simulation |
| GET | `/api/cusum/history` | CUSUM drift history |
| GET | `/api/forensics/log` | Forensic audit log |
| GET | `/api/forensics/verify` | Verify hash chain integrity |
| POST | `/api/experiments/calibrate` | Monte Carlo calibration |

## Tests

```bash
pytest tests/ -v
```

## Constraints

- No ML/AI libraries — NumPy/SciPy statistics only
- Protocol decisions are immutable; monitoring is advisory-only
- `qds/` must not import from monitoring or API layers
