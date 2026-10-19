# app-template

Starter for a service on Wayne's VPS: React + Vite frontend, Express + Postgres backend, deployed by `.github/workflows/deploy.yml`. Server-side details (Caddy, Postgres, registration, secrets) live in the [infrastructure](https://github.com/waynezhu6/infrastructure) repo, not here.

## Creating a new app from this template

When asked to start a new service from this template:

1. Create the new repo from this template (GitHub "Use this template"), named with lowercase letters, digits and dashes. The repo name is the app name everywhere; nothing in the files needs renaming.
2. Register it in the infrastructure repo in the same go: on a branch there, run `scripts/register-app.sh <name> <domain>` and open a PR with the new `apps/<name>.caddy`. Ask for the domain if you weren't given one. Tell the user to merge it and point DNS at the server.
3. Remind the user to set `SERVER_HOST`, `SERVER_USER` and `SSH_DEPLOY_KEY` on the new repo. There is no `DATABASE_URL` secret.
4. Then build the app in the new repo.

## Conventions

- Backend is ESM TypeScript (`backend/src`, imports end in `.js`). Routes go under `/api/*`; Caddy sends everything else to the frontend.
- The backend listens on port 3001 and must keep the `/api/health` route.
- Schema changes are migrations: `cd backend && npm run migrate:create -- <name>` (ES modules in `backend/migrations`). They run on startup before the server listens; never edit one that has shipped.
- Database access goes through the pool in `backend/src/db.ts`; config comes from `DATABASE_URL` only.
- Local dev: `docker compose -f docker-compose.dev.yml up -d`, `cp backend/.env.example backend/.env`, `npm run dev`.
- After adding or upgrading a package, commit the updated root `package-lock.json`; CI and the Docker build use `npm ci`.

## Don't change without a reason

- `docker-compose.yml`, the `deploy.yml` workflow and `backend/Dockerfile`. They carry the contract with the infrastructure repo: container `<name>-backend`, networks `caddy-web` and `postgres-db`, port 3001, image `ghcr.io/<owner>/<name>-backend`, frontend synced to `~/infrastructure/sites/<name>`.
- Don't add server details (hostnames, Caddy config, DB credentials) to this repo; they belong in infrastructure.
