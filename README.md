# LedgerDB

A personal finance tracker built as a portfolio project. Track accounts, institutions, transactions, and savings goals, then review everything on a dashboard with spending charts and net worth.

## Features

- **Dashboard** — net worth, monthly income and spending, six-month spending trend, category breakdown, account balances, and goal progress
- **Accounts** — list, create, edit, and delete accounts with type badges and opening balances
- **Institutions** — CRUD with search; protected delete when accounts are linked
- **Transactions** — CRUD with category badges and filters by account or category
- **Goals** — savings targets linked to accounts with progress bars

## Tech stack

| Layer | Technologies |
|-------|--------------|
| API | Python 3.13, Django 6, Django REST Framework, PostgreSQL, uv |
| Web | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui, Recharts |
| Infra | Caddy (local proxy), Tilt (orchestration) |
| CI | Ruff, Django tests, Biome, ESLint, Next.js build |

## Repository structure

```
ledgerdb/
├── apps/
│   ├── api/          # Django REST API
│   └── web/          # Next.js frontend
├── infra/
│   ├── caddy/        # Local reverse proxy
│   └── tilt/         # Dev environment orchestration
└── .github/workflows/
```

### API (`apps/api`)

```
api/
├── config/           # Django settings and URLs
├── core/             # Shared models (UUIDModel, TimeStampedModel)
└── finance/
    ├── models/       # Institution, Account, Transaction, Goal
    ├── serializers/
    ├── views/
    ├── dashboard.py  # Dashboard aggregation logic
    └── tests/
```

### Web (`apps/web`)

```
web/src/
├── actions/          # Server actions — all API communication
├── app/              # App Router pages (Server Components)
├── components/     # Presentation components
├── config/           # Routes, navigation, API URL
├── lib/              # Utilities, Zod schemas, error helpers
└── types/            # TypeScript types per domain
```

## Architecture

Pages are Server Components with almost no logic. Data flows in one direction:

```
page.tsx → actions/* → Django API → components
```

- **Pages** fetch data via server actions and pass props to components
- **Actions** own all API calls (axios, one file per domain)
- **Components** are presentation-only — no fetching

Mutations use server actions with `useActionState`, Zod validation, and DRF error mapping.

## API endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/dashboard/` | Aggregated financial overview |
| `/api/institutions/` | Institution CRUD; `?search=` filter |
| `/api/accounts/` | Account CRUD |
| `/api/transactions/` | Transaction CRUD; `?account=`, `?category=` filters |
| `/api/goals/` | Goal CRUD; `?account=` filter |
| `/admin/` | Django admin for all models |

Serializers expose read-only related names (`institution_name`, `account_name`, `current_amount` on goals).

## Getting started

### Prerequisites

- Python 3.13+
- [uv](https://docs.astral.sh/uv/)
- Node.js 22+
- pnpm 10+
- PostgreSQL (local database named `ledgerdb`)
- Optional: [Tilt](https://tilt.dev/) and [Caddy](https://caddyserver.com/) for the proxied dev setup

### Database

Create a PostgreSQL database:

```bash
createdb ledgerdb
```

### API setup

```bash
cd apps/api
uv sync --dev
```

Create a local settings file (gitignored) that extends the defaults:

```python
# apps/api/config/settings.py
from .settings_default import *

DATABASES["default"].update({
    "USER": "your-postgres-user",
    "PASSWORD": "your-postgres-password",
})
```

Run migrations and start the server:

```bash
uv run python manage.py migrate
uv run python manage.py runserver
```

The API is available at [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/).

### Web setup

```bash
cd apps/web
pnpm install
cp .env.example .env
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to the dashboard.

Set `API_URL` in `.env` if the API is not at the default `http://127.0.0.1:8000/api`.

### Full stack with Tilt

From the project root, run API, web, and Caddy together:

```bash
tilt up -f infra/tilt/Tiltfile
```

Use [http://localhost:8080](http://localhost:8080) — Caddy routes `/` to Next.js and `/api` to Django.

## Development commands

### API

```bash
cd apps/api

# Run tests (SQLite in-memory)
DJANGO_SETTINGS_MODULE=config.settings_test uv run python manage.py test finance

# Lint and format
ruff check --config ruff.toml .
ruff format --config ruff.toml .
```

### Web

```bash
cd apps/web

pnpm format:check   # Biome
pnpm run lint       # ESLint
pnpm run build      # Production build
```

## CI

GitHub Actions runs on push and pull requests:

- **API** — Ruff lint/format, Django finance tests
- **Web** — Biome, ESLint, Next.js build

## Out of scope (for now)

- Authentication and multi-user support
- CORS (all API calls are server-side)
- Pagination and API filtering package
- Automatic account balance updates from transactions
