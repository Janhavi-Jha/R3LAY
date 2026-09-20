# R3LAY Python Backend

This backend replaces the TypeScript/Next.js API layer with **Python + FastAPI + SQLAlchemy + SQLite + Google OR-Tools CP-SAT**.

The frontend remains Next.js/React because it is the UI. It now calls this FastAPI service instead of `src/app/api/*`.

## Local stack

- Python 3.11+
- FastAPI + Uvicorn
- SQLAlchemy
- SQLite for zero-config local development
- Google OR-Tools CP-SAT for seat optimization
- boto3 included for optional AWS Cognito/DynamoDB/EventBridge/Bedrock integration
- CORS for the Next.js frontend

## Demo login

Email: `rajesh.kumar@irctc.gov.in`
Password: `r3lay123`

Also accepted as username: `IR-TTE-4821`, `rajesh`, or `tte`.

## Run

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
copy .env.example .env
python run.py
```

Backend: http://127.0.0.1:8000  
Swagger: http://127.0.0.1:8000/docs

The SQLite database `r3lay.db` is created and seeded automatically on first start.

## Frontend

From the project root:

```powershell
npm install
copy .env.local.example .env.local
npm run dev
```

Frontend: http://localhost:3000

The frontend `.env.local` points to `http://127.0.0.1:8000/api`.

## Important

Do not run the old TypeScript API routes as your backend. The frontend's `src/lib/api.ts` now targets FastAPI.

AWS integrations are intentionally optional for local development. Add valid AWS/Cognito settings in `.env` when you are ready to connect the deployed system.
