"""
models.py — SQLAlchemy ORM table + Pydantic request/response schemas.
"""
from datetime import datetime

from pydantic import BaseModel, Field
from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


# ── SQLAlchemy ORM model (maps to the 'todos' table) ─────────────────────────

class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


# ── Pydantic schemas (request / response shapes) ──────────────────────────────

class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, examples=["Buy groceries"])


class TodoUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    completed: bool | None = None


class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime

    model_config = {"from_attributes": True}
