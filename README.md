# app-template

Starter template for a full-stack app on my personal VPS. React + Vite frontend, Express + Node backend, PostgreSQL, deployed via GitHub Actions.

## Stack

- **Frontend**: React 19, Vite, TypeScript
- **Backend**: Express, TypeScript, PostgreSQL (`node-pg-migrate`)
- **Infra**: Docker, Caddy (via [infrastructure](https://github.com/waynezhu6/infrastructure)), GHCR

## Using this template

**1. Create a new repo from this template** on GitHub. The repo name becomes the app name everywhere: the server directory `~/<name>`, the container `<name>-backend`, the image `ghcr.io/<owner>/<name>-backend` and the frontend folder `sites/<name>`. Nothing in the files needs renaming.

**2. Add a Caddyfile block** to the infrastructure repo's `Caddyfile` by PR. Copy `Caddyfile` from this repo and replace `APP_NAME` with the repo name and the domain with yours. Don't edit the Caddyfile on the server directly; the infrastructure deploy pulls over it.

**3. Create the app's database and user** on the server (see "Adding a New Project" in the infrastructure README).

**4. Set GitHub Actions secrets:**

| Secret | Description |
|---|---|
| `DATABASE_URL` | `postgres://<user>:<password>@postgres:5432/<db>`. The host is `postgres`, the shared container's name on the `postgres-db` network, not `localhost`. |
| `SERVER_HOST` | VPS IP or hostname |
| `SERVER_USER` | SSH user on the server |
| `SSH_DEPLOY_KEY` | Private SSH key (same one used by the infrastructure repo) |

The server pulls the backend image using the GHCR login that the infrastructure repo's `bootstrap.sh --ghcr-user` sets up, so this repo needs no registry credentials.

Push to `main` and CI handles the rest. It never clones this repo onto the server; it copies `docker-compose.yml` and writes `.env` there.

## Local dev

```bash
npm install
docker compose -f docker-compose.dev.yml up -d   # local Postgres on 5432
cp backend/.env.example backend/.env
npm run dev                                      # frontend (5173) and backend (3001)
```

Frontend proxies `/api` to the backend in dev, matching production behavior.

## Database migrations

```bash
cd backend

# Migrations are ES modules (.js) in backend/migrations
# Create a new migration
npm run migrate:create -- my-migration-name

# Apply / roll back
npm run migrate:up
npm run migrate:down
```

The `migrate:*` commands read `DATABASE_URL` from your shell, e.g. `export $(cat .env)` first.

Migrations run automatically on backend startup, before it takes requests. If one fails the backend exits, so a broken migration shows up as a restarting container rather than an app running on the old schema.
