# R3LAY

R3LAY is split into two processes:

- `frontend/`: Next.js/React UI
- `backend/`: Python FastAPI + SQLAlchemy + OR-Tools

The original TypeScript API/database layer has been removed from the active project. The UI talks to FastAPI through `src/lib/api.ts`.

See `backend/README.md` for backend setup.
