# app-template

Starter template for a full-stack app on my personal VPS. React + Vite frontend, Express + Node backend, PostgreSQL, deployed via GitHub Actions.

## Stack

- **Frontend**: React 19, Vite, TypeScript
- **Backend**: Express, TypeScript, PostgreSQL (`node-pg-migrate`)
- **Infra**: Docker, Caddy (via [infrastructure](https://github.com/waynezhu6/infrastructure)), GHCR

## Using this template

**1. Create a new repo from this template** on GitHub. The repo name becomes the app name everywhere: the server directory `~/<name>`, the container `<name>-backend`, the image `ghcr.io/<owner>/<name>-backend`, the frontend folder `sites/<name>` and the database. Nothing in the files needs renaming. Use lowercase letters, digits and dashes.

**2. Register the app** in the [infrastructure](https://github.com/waynezhu6/infrastructure) repo: Actions → Register app, with the repo name. Merge the PR it opens. That serves the app at `/apps/<name>/` (frontend) and `/api/<name>/` (backend) on the server's domain and creates its database; see "Adding a New Project" there, which also covers app-specific secrets.

**3. Set GitHub Actions secrets:**

| Secret | Description |
|---|---|
| `SERVER_HOST` | VPS IP or hostname |
| `SERVER_USER` | SSH user on the server |
| `SSH_DEPLOY_KEY` | Private SSH key (same one used by the infrastructure repo) |

There's no database secret: the deploy reads `DATABASE_URL` from the server, which created it at registration. It fails with a clear message if the app isn't registered yet.

Push to `main` and CI handles the rest. It never clones this repo onto the server; it copies `docker-compose.yml`, writes `.env`, and starts the container.

This template repo itself doesn't deploy (the jobs skip when the repo is a template), so changes to it don't need server secrets.

## Local dev

```bash
npm install
docker compose -f docker-compose.dev.yml up -d   # local Postgres on 5432
cp backend/.env.example backend/.env
npm run dev                                      # http://localhost:5173/apps/<name>/, backend on 3001
```

Dev uses the production paths: the frontend is at `/apps/<name>/` and proxies `/api/<name>/...` to the backend as `/api/...`, as Caddy does. `<name>` is the checkout's folder name locally and the repo name in CI.

## Paths

The app is served under a prefix, so never hardcode `/` or `/api` URLs:

- Frontend: call the backend with `api('/things')` or `apiUrl('/things')` from `frontend/src/api.ts`. Assets and imports are handled by Vite's `base`.
- Backend: routes stay under `/api/*` (Caddy strips the prefix). For URLs the backend sends to the browser (redirects, links, cookie paths), use `API_BASE` and `APP_BASE` from `backend/src/paths.ts`. Set cookies with `path: API_BASE` so they only go to this app's backend; all apps share one domain.

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
