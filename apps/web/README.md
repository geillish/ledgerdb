# LedgerDB Web

Next.js frontend for LedgerDB. Source lives under `src/`.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app expects the Django API at `http://127.0.0.1:8000/api` (configure via `API_URL` in `.env`).

For the full stack with Caddy proxy:

```bash
tilt up -f infra/tilt/Tiltfile
```

Then use [http://localhost:8080](http://localhost:8080).

## Structure

```
src/
├── actions/     # Server actions (API communication)
├── app/         # Next.js App Router pages
├── components/  # UI and layout components
├── config/      # Routes, API URL, navigation
├── lib/         # Utilities, schemas, error helpers
└── types/       # TypeScript types per domain
```
