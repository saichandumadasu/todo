# ── Stage 1: dependency install ───────────────────────────────────────────────
# Use the official uv image so we don't need to install uv manually.
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

WORKDIR /app

# Copy only the dependency manifest files first (layer-cache friendly).
COPY pyproject.toml uv.lock* ./

# Install dependencies into /app/.venv — no editable install yet.
RUN uv sync --frozen --no-install-project

# ── Stage 2: runtime image ────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# Copy the virtualenv from the builder stage.
COPY --from=builder /app/.venv /app/.venv

# Copy application source code.
COPY . .

# Make the virtualenv the active Python environment.
ENV PATH="/app/.venv/bin:$PATH"

# SQLite database will be stored here (mount a volume in docker-compose).
VOLUME ["/app/data"]
ENV DATABASE_URL="sqlite+aiosqlite:////app/data/todos.db"

EXPOSE 8000

# Run uvicorn directly — no shell wrapper needed.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
