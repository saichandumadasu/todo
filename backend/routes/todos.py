"""
routes/todos.py — All CRUD endpoints for the Todo resource.

Mounted at /api/todos in main.py.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Todo, TodoCreate, TodoResponse, TodoUpdate

router = APIRouter(prefix="/api/todos", tags=["todos"])


@router.get("", response_model=list[TodoResponse])
async def list_todos(db: AsyncSession = Depends(get_db)) -> list[Todo]:
    """Return all todos ordered by most recently created first."""
    result = await db.execute(select(Todo).order_by(Todo.created_at.desc()))
    return result.scalars().all()


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(payload: TodoCreate, db: AsyncSession = Depends(get_db)) -> Todo:
    """Create a new todo item."""
    todo = Todo(title=payload.title.strip())
    db.add(todo)
    await db.commit()
    await db.refresh(todo)
    return todo


@router.put("/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: int,
    payload: TodoUpdate,
    db: AsyncSession = Depends(get_db),
) -> Todo:
    """Update title and/or completed status of an existing todo."""
    todo = await db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    if payload.title is not None:
        todo.title = payload.title.strip()
    if payload.completed is not None:
        todo.completed = payload.completed

    await db.commit()
    await db.refresh(todo)
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: int, db: AsyncSession = Depends(get_db)) -> None:
    """Delete a todo by id."""
    todo = await db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    await db.delete(todo)
    await db.commit()
