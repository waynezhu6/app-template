# app-template

Starter template for a full-stack app on my personal VPS. React + Vite frontend, Express + Node backend, PostgreSQL, deployed via GitHub Actions.

## Stack

- **Frontend**: React 19, Vite, TypeScript
- **Backend**: Express, TypeScript, PostgreSQL (`node-pg-migrate`)
- **Infra**: Docker, Caddy (via [infrastructure](https://github.com/waynezhu6/infrastructure)), GHCR

## Using this template

**1. Create a new repo from this template** on GitHub.

**2. Replace `APP_NAME`** in `docker-compose.yml` (3 places) with your app name (e.g. `notes`).

**3. Add a Caddyfile block** to the infrastructure repo — copy `Caddyfile` from this repo, fill in your domain, and paste the block into `~/infrastructure/Caddyfile` on the server.

**4. Set GitHub Actions secrets:**

| Secret | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string (e.g. `postgres://user:pass@localhost/myapp`) |
| `SERVER_HOST` | VPS IP or hostname |
| `SERVER_USER` | SSH user on the server |
| `SSH_DEPLOY_KEY` | Private SSH key (same one used by the infrastructure repo) |

Push to `main` and CI handles the rest.

## Local dev

```bash
# Install dependencies
npm run dev --workspace=frontend  # or just run both:
npm run dev                       # starts frontend (5173) and backend (3001) concurrently
```

Frontend proxies `/api` to the backend in dev, matching production behavior.

## Database migrations

```bash
cd backend

# Create a new migration
npm run migrate:create -- my-migration-name

# Apply / roll back
npm run migrate:up
npm run migrate:down
```

Migrations run automatically on backend startup in production.
