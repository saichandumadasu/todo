"""
main.py — FastAPI application entry point.

Responsibilities:
  - Create the FastAPI app instance
  - Add CORS middleware (browser at port 3000 calls port 8000)
  - Initialise the database on startup
  - Mount the todos router
  - Expose a /health endpoint
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routes.todos import router as todos_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup logic (create DB tables) then yield to serve requests."""
    await init_db()
    yield


app = FastAPI(
    title="Todo API",
    version="1.0.0",
    description="Microservice that manages todo items stored in SQLite.",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow the frontend (served from port 3000) to call this API in the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(todos_router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["ops"])
async def health() -> dict:
    return {"status": "ok"}
