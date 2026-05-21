# FastAPI — Complete Research Report

> **Source**: [https://github.com/fastapi/fastapi](https://github.com/fastapi/fastapi)  
> **Research Date**: 2026-05-18  
> **Latest Version**: `0.136.1`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Repository Stats](#repository-stats)
3. [Architecture & Core Design](#architecture--core-design)
4. [Key Features](#key-features)
5. [Source Code Structure](#source-code-structure)
6. [Dependencies](#dependencies)
7. [Installation](#installation)
8. [Quick Start Examples](#quick-start-examples)
9. [Core Concepts](#core-concepts)
10. [Security Features](#security-features)
11. [Middleware Support](#middleware-support)
12. [Testing](#testing)
13. [Tooling & Developer Experience](#tooling--developer-experience)
14. [Recent Releases](#recent-releases)
15. [Roadmap](#roadmap)
16. [Community & Adoption](#community--adoption)
17. [Notable Users](#notable-users)
18. [Comparison with Other Frameworks](#comparison-with-other-frameworks)
19. [Ecosystem](#ecosystem)

---

## Overview

**FastAPI** is a modern, high-performance web framework for building APIs with Python, based on **standard Python type hints**. It was created by **Sebastián Ramírez** ([@tiangolo](https://github.com/tiangolo)) and first published in December 2018.

- **Tagline**: "high performance, easy to learn, fast to code, ready for production"
- **Website**: https://fastapi.tiangolo.com
- **License**: MIT
- **Organization**: [fastapi](https://github.com/fastapi) (GitHub Organization)
- **Default Branch**: `master`
- **Python Support**: Python 3.10, 3.11, 3.12, 3.13, 3.14 (including free-threaded 3.14t)

---

## Repository Stats

| Metric | Value |
|--------|-------|
| ⭐ Stars | **98,307** |
| 🍴 Forks | **9,311** |
| 🐛 Open Issues | **181** |
| 📦 Latest Release | `0.136.1` |
| 🗓️ Created | December 8, 2018 |
| 🔄 Last Pushed | May 18, 2026 |
| 💻 Primary Language | Python |
| 📄 License | MIT |

---

## Architecture & Core Design

FastAPI is built on top of two foundational libraries:

### Starlette (Web Layer)
- Provides the ASGI (Asynchronous Server Gateway Interface) foundation
- Handles routing, middleware, requests, responses, WebSockets
- Provides static file serving, templating, sessions, and more
- Required version: `>=0.46.0`

### Pydantic (Data Layer)
- Data validation and serialization using Python type annotations
- Schema generation for OpenAPI/JSON Schema
- Required version: `>=2.9.0` (Pydantic v2 only as of current release)

### ASGI Server (Uvicorn)
- FastAPI runs on ASGI servers, most commonly **Uvicorn** (with optional `uvloop`)
- Can also run on **Hypercorn**, **Daphne**, etc.

### Design Philosophy
- **Type hint-first**: All validation, serialization, and documentation derive from type hints
- **Minimal overhead**: Thin layer over Starlette — nearly all Starlette features are accessible
- **OpenAPI native**: Auto-generates OpenAPI 3.x specs and interactive UI (Swagger + ReDoc)
- **Async-first**: Full support for `async def` and `def` route handlers

---

## Key Features

| Feature | Description |
|---------|-------------|
| ⚡ **High Performance** | On par with NodeJS and Go; one of the fastest Python frameworks |
| 🚀 **Fast Development** | ~200–300% faster feature development vs traditional frameworks |
| 🐛 **Fewer Bugs** | ~40% reduction in developer-induced errors via type safety |
| 🤖 **Auto Docs** | Automatic interactive Swagger UI and ReDoc documentation |
| ✅ **Validation** | Request/response validation via Pydantic v2 |
| 🔒 **Security** | OAuth2, JWT, API Key, HTTP Basic Auth built-in |
| 🔗 **Dependency Injection** | Powerful and composable DI system |
| 📡 **WebSocket Support** | Full WebSocket support via Starlette |
| 🌊 **Streaming** | SSE (Server-Sent Events), streaming responses, JSON Lines |
| 🧩 **Middleware** | CORS, GZip, HTTPS Redirect, Trusted Hosts, Sessions, and custom |
| 🗂️ **File Uploads** | Multipart form data and file upload handling |
| 📊 **Background Tasks** | Run tasks after response is sent |
| 🧪 **Test Client** | Sync/async test client via `httpx` |
| 📦 **CLI** | `fastapi dev` / `fastapi run` commands |

---

## Source Code Structure

```
fastapi/                         # Main package
├── __init__.py                  # Public API exports (version: 0.136.1)
├── __main__.py                  # Entry point for python -m fastapi
├── applications.py              # FastAPI application class (~181 KB)
├── routing.py                   # APIRouter, route handlers (~197 KB)
├── param_functions.py           # Query, Path, Body, Form, etc. (~69 KB)
├── params.py                    # Parameter class definitions (~26 KB)
├── dependencies/                # Dependency injection internals
├── security/                    # OAuth2, API key, HTTP auth classes
├── middleware/                  # Middleware utilities
├── openapi/                     # OpenAPI schema generation
├── _compat/                     # Pydantic compatibility layer
├── .agents/                     # Agent configuration
├── encoders.py                  # JSON encoding utilities
├── exceptions.py                # HTTPException, WebSocketException
├── exception_handlers.py        # Default exception handlers
├── concurrency.py               # Async/sync concurrency utilities
├── datastructures.py            # UploadFile, etc.
├── background.py                # BackgroundTasks
├── responses.py                 # Response type exports
├── requests.py                  # Request type export
├── websockets.py                # WebSocket, WebSocketDisconnect
├── sse.py                       # Server-Sent Events support
├── staticfiles.py               # Static file serving
├── templating.py                # Jinja2 templating
├── testclient.py                # Test client export
├── types.py                     # Type aliases
├── utils.py                     # Internal utilities
├── cli.py                       # CLI entry point
└── logger.py                    # Logger instance
```

### Public API (from `__init__.py`)
```python
from fastapi import (
    FastAPI, APIRouter, Request, Response,
    HTTPException, WebSocketException,
    Body, Cookie, Depends, File, Form, Header, Path, Query, Security,
    BackgroundTasks, UploadFile,
    WebSocket, WebSocketDisconnect,
    status
)
```

---

## Dependencies

### Core (Required)
| Package | Version | Purpose |
|---------|---------|---------|
| `starlette` | `>=0.46.0` | ASGI web framework |
| `pydantic` | `>=2.9.0` | Data validation |
| `typing-extensions` | `>=4.8.0` | Typing backports |
| `typing-inspection` | `>=0.4.2` | Type introspection |
| `annotated-doc` | `>=0.0.2` | Annotated type support |

### Standard Extras (`pip install "fastapi[standard]"`)
| Package | Purpose |
|---------|---------|
| `fastapi-cli[standard] >=0.0.8` | `fastapi dev` / `fastapi run` CLI |
| `httpx >=0.23.0,<1.0.0` | Test client |
| `jinja2 >=3.1.5` | Templates |
| `python-multipart >=0.0.18` | Forms & file uploads |
| `email-validator >=2.0.0` | Email field validation |
| `uvicorn[standard] >=0.12.0` | ASGI server with uvloop |
| `pydantic-settings >=2.0.0` | Settings management |
| `pydantic-extra-types >=2.0.0` | Extra Pydantic types |

### All Extras (`pip install "fastapi[all]"`)
Adds: `itsdangerous` (session middleware), `pyyaml` (YAML schema), and all standard extras.

### Build System
- **Build backend**: `pdm-backend`
- **Package manager**: `uv` (lockfile: `uv.lock`)

---

## Installation

```bash
# Standard install (recommended — includes server and CLI)
pip install "fastapi[standard]"

# Minimal install (core only, bring your own ASGI server)
pip install fastapi

# Full install with all optional dependencies
pip install "fastapi[all]"

# Slim variant (no CLI)
# Available as fastapi-slim on PyPI
```

---

## Quick Start Examples

### Minimal App
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

### Run the Server
```bash
fastapi dev main.py          # Development (auto-reload)
fastapi run main.py          # Production
uvicorn main:app --reload    # Uvicorn directly
```

### With Request Body (Pydantic Model)
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool | None = None

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}
```

### Async Route Handler
```python
@app.get("/users/{user_id}")
async def read_user(user_id: int):
    user = await db.get_user(user_id)  # async DB call
    return user
```

### Dependency Injection
```python
from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/items/")
def read_items(db: Session = Depends(get_db)):
    return db.query(Item).all()
```

### Query Parameter Models (Pydantic v2 feature)
```python
from typing import Annotated
from pydantic import BaseModel

class CommonFilters(BaseModel):
    skip: int = 0
    limit: int = 100

@app.get("/items/")
def read_items(filters: Annotated[CommonFilters, Query()]):
    return filters
```

### Background Tasks
```python
from fastapi import BackgroundTasks

def send_email(email: str, message: str):
    ...  # long-running task

@app.post("/send-notification/{email}")
async def send_notification(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email, email, message="Welcome!")
    return {"message": "Notification sent in the background"}
```

### WebSocket
```python
from fastapi import WebSocket

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message: {data}")
```

### Server-Sent Events (SSE)
```python
from fastapi.responses import StreamingResponse
import asyncio

async def event_generator():
    for i in range(10):
        yield f"data: Event {i}\n\n"
        await asyncio.sleep(1)

@app.get("/stream")
def stream():
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

---

## Core Concepts

### Parameter Types
FastAPI automatically detects parameter locations based on type and annotation:

| Parameter | Source | Annotation |
|-----------|--------|------------|
| `Query()` | URL query string `?key=val` | `Annotated[str, Query()]` |
| `Path()` | URL path `/items/{id}` | `Annotated[int, Path()]` |
| `Body()` | Request body JSON | `Annotated[Item, Body()]` |
| `Form()` | HTML form data | `Annotated[str, Form()]` |
| `File()` | File upload | `Annotated[bytes, File()]` |
| `Header()` | HTTP header | `Annotated[str, Header()]` |
| `Cookie()` | HTTP cookie | `Annotated[str, Cookie()]` |
| `Depends()` | Dependency injection | `Annotated[T, Depends(fn)]` |
| `Security()` | Security dependency | `Annotated[T, Security(fn)]` |

### Lifespan Events
```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    yield
    # Shutdown
    await disconnect_db()

app = FastAPI(lifespan=lifespan)
```

### Response Models
```python
class UserOut(BaseModel):
    id: int
    username: str
    # no password field exposed

@app.get("/users/{id}", response_model=UserOut)
def get_user(id: int):
    return db_get_user(id)  # password filtered automatically
```

### Routers (Modular Apps)
```python
from fastapi import APIRouter

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/")
def list_items(): ...

app.include_router(router)
```

---

## Security Features

FastAPI provides built-in security schemes via `fastapi.security`:

| Scheme | Class | Description |
|--------|-------|-------------|
| HTTP Basic | `HTTPBasic` | Username/password in Authorization header |
| Bearer Token | `HTTPBearer` | JWT/OAuth tokens |
| API Key (Header) | `APIKeyHeader` | Key in HTTP header |
| API Key (Query) | `APIKeyQuery` | Key in query string |
| API Key (Cookie) | `APIKeyCookie` | Key in cookie |
| OAuth2 Password | `OAuth2PasswordBearer` | OAuth2 with password flow |
| OAuth2 Client | `OAuth2AuthorizationCodeBearer` | OAuth2 authorization code flow |
| OpenID Connect | `OpenIdConnect` | OIDC discovery URL |

### JWT Auth Example
```python
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    user = decode_jwt(token)
    if not user:
        raise HTTPException(status_code=401)
    return user

@app.get("/me")
def read_me(current_user = Depends(get_current_user)):
    return current_user
```

---

## Middleware Support

```python
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

**Available Middleware (from Starlette):**
- `CORSMiddleware` — Cross-Origin Resource Sharing
- `GZipMiddleware` — Response compression
- `HTTPSRedirectMiddleware` — Force HTTPS
- `TrustedHostMiddleware` — Block invalid hosts
- `SessionMiddleware` — Cookie-based sessions
- Custom middleware via `BaseHTTPMiddleware`

---

## Testing

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}
```

### Test Dependencies
| Package | Purpose |
|---------|---------|
| `pytest >=9.0.0` | Test runner |
| `httpx` | Async-capable HTTP client (TestClient) |
| `anyio[trio]` | Async test support |
| `mypy >=1.14.1` | Static type checking |
| `ruff` | Linter + formatter |
| `coverage[toml]` | Code coverage |
| `pytest-xdist` | Parallel test execution |
| `pytest-cov` | Coverage plugin |
| `pytest-codspeed` | Benchmarking |

---

## Tooling & Developer Experience

### CLI Commands
```bash
fastapi dev main.py      # Hot-reload dev server
fastapi run main.py      # Production server
fastapi --help           # Show help
```

### Automatic API Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

### VS Code Extension
- Official FastAPI VS Code extension for enhanced development experience
- Documented in the official docs

### Code Quality Stack
| Tool | Purpose |
|------|---------|
| `ruff` | Linting and formatting (replaces flake8, isort, black) |
| `mypy` | Static type checking (strict mode) |
| `pre-commit` | Git hooks for quality enforcement |
| `ty` | Additional type checking |
| `zizmor` | GitHub Actions security auditing |
| `pdm` | Project/build management |
| `uv` | Fast Python package management |

### Documentation Stack
- **MkDocs Material** for the docs site
- **mkdocstrings** for API reference generation
- **griffe-typingdoc** for type doc extraction
- Multilingual docs: EN, ZH, ZH-Hant, JA, KO, ES, PT, FR, DE, RU, TR, UK

---

## Recent Releases

| Version | Date | Highlights |
|---------|------|-----------|
| **0.136.1** | 2026-04-23 | Pydantic v2 deprecation fixes, Starlette 1.0.0 bump, security fixes |
| **0.136.0** | 2026-04-16 | Support for free-threaded Python 3.14t |
| **0.135.4** | 2026-04-16 | Removed April Fool's `@app.vibe()` decorator |
| **0.135.3** | 2026-04-01 | Added `@app.vibe()` (April Fools 🎉), vibe coding docs |
| **0.135.2** | 2026-03-23 | Pydantic `>=2.9.0` lower bound, VS Code extension docs, multilingual doc updates |

---

## Roadmap

From the official [🚀 Roadmap Issue #10370](https://github.com/fastapi/fastapi/issues/10370):

### ✅ Completed
- Code reference (auto-generated API docs)
- Pydantic v2 used for serialization (performance boost)
- Starlette upgrade
- FastAPI CLI (`fastapi dev` / `fastapi run`)
- Support for Pydantic models in `Query()`, `Form()`, etc.
- Pydantic v1 + v2 co-existence migration support
- Drop Pydantic v1 support (after migration tools landed)
- Drop Python 3.8 / 3.9 (EOL versions)
- Clearer server errors and tracebacks

### 🔜 Planned / In Progress
- **Pydantic v2 parsing** (currently used for serialization only)
- **Router refactor**: reuse instances instead of cloning; enables per-router middleware
- **Security/Auth tools**: OAuth2 SSO server, cookie-based auth, better token docs
- **Improved dependency overrides** for testing
- **Kubernetes docs**: liveness/readiness probes
- **Customizable serialization** (non-JSON formats)
- **RFC 9457 error responses**
- **Internal code refactors**
- **Improved lifespan/middleware APIs**
- **Updated SQL tutorials** (SQLModel-based)
- **NoSQL tutorial**
- **Performance optimizations**
- **Batch processing experiments** (e.g., batch ML inference)

---

## Community & Adoption

- **98K+ GitHub Stars** — one of the most starred Python projects
- **9,300+ Forks**
- **FastAPI Conf '26** — October 28, 2026 in Amsterdam
- **FastAPI Mini Documentary** (YouTube, late 2025)
- Active Discussions, Issues, and Discord community
- [FastAPI People](https://fastapi.tiangolo.com/fastapi-people/) — recognized experts, contributors, and translators
- Managed by the FastAPI GitHub organization with multiple maintainers

---

## Notable Users

| Company | Use Case |
|---------|---------|
| **Microsoft** | ML services integrated into Windows & Office |
| **Netflix** | Crisis management orchestration framework (Dispatch) |
| **Uber** | REST server for Ludwig ML prediction |
| **Cisco** | Virtual TAC Engineer, API-first automation |

---

## Comparison with Other Frameworks

| Feature | FastAPI | Flask | Django REST | Tornado |
|---------|---------|-------|-------------|---------|
| Type hint-based | ✅ | ❌ | ❌ | ❌ |
| Auto OpenAPI docs | ✅ | ❌ (ext) | ❌ (ext) | ❌ |
| ASGI native | ✅ | ❌ (WSGI) | ✅ (partial) | ✅ |
| Pydantic validation | ✅ | ❌ | ❌ | ❌ |
| Async support | ✅ | ❌ | ✅ | ✅ |
| Performance | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡⚡ |
| Learning curve | Low | Low | High | Medium |
| Built-in CLI | ✅ | ❌ | ✅ (manage.py) | ❌ |
| WebSockets | ✅ | ❌ | ✅ (channels) | ✅ |

---

## Ecosystem

### Sibling Projects (by same author)
| Project | Description |
|---------|-------------|
| [Typer](https://typer.tiangolo.com) | FastAPI for CLIs — type-hint-based CLI framework |
| [SQLModel](https://sqlmodel.tiangolo.com) | SQLAlchemy + Pydantic ORM for FastAPI |
| [Asyncer](https://asyncer.tiangolo.com) | Async utilities built for FastAPI use cases |

### Popular FastAPI Extensions
| Library | Purpose |
|---------|---------|
| `fastapi-users` | User management & auth |
| `fastapi-cache` | Caching decorators |
| `fastapi-pagination` | Pagination utilities |
| `fastapi-mail` | Email sending |
| `fastapi-limiter` | Rate limiting |
| `orjson` | Fast JSON serialization |
| `strawberry-graphql` | GraphQL support |
| `fastmcp` | Model Context Protocol (MCP) server |

### Topics / Tags on GitHub
`api`, `async`, `asyncio`, `fastapi`, `framework`, `json`, `json-schema`, `openapi`, `openapi3`, `pydantic`, `python`, `python-types`, `python3`, `redoc`, `rest`, `starlette`, `swagger`, `swagger-ui`, `uvicorn`, `web`

---

## Links

| Resource | URL |
|----------|-----|
| 🏠 Homepage | https://fastapi.tiangolo.com |
| 📦 PyPI | https://pypi.org/project/fastapi |
| 💻 GitHub | https://github.com/fastapi/fastapi |
| 📖 Docs | https://fastapi.tiangolo.com/tutorial/ |
| 🔖 Changelog | https://fastapi.tiangolo.com/release-notes/ |
| 🐛 Issues | https://github.com/fastapi/fastapi/issues |
| 🔒 Security | https://github.com/fastapi/fastapi/security/policy |
| 🏗️ Contributing | https://fastapi.tiangolo.com/contributing/ |

---

*Research compiled from the GitHub repository `fastapi/fastapi` as of 2026-05-18.*
