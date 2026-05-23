# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Monorepo for the **Kalneslopene / Torsdagsløpet** site — a Norwegian running-race site. Three top-level apps:

- `backend/` — Kotlin + Spring Boot 4 REST API (JDK 24, Gradle Kotlin DSL, JPA, Liquibase, PostgreSQL).
- `frontend/` — React 19 SPA built with Vite (TypeScript, Tailwind 4, shadcn/ui, TanStack Query, react-router 7). Package manager is **bun**, not npm.
- `infra/` — OpenTofu/Terraform for Hetzner Cloud servers + MinIO/S3 buckets.

In production, `Dockerfile` runs a multi-stage build that compiles the frontend with bun and copies `frontend/dist` into `backend/src/main/resources/static/` before the Gradle build. The Spring Boot jar then serves the SPA itself (see `controller/SpaController.kt`, which forwards non-asset paths to `/index.html`). There is **no separate frontend deployment** — the backend serves it.

## Common commands

### Frontend (`cd frontend`)
- `bun install --frozen-lockfile` — install deps (CI and Docker use this; `bun.lock` is authoritative, do not introduce `package-lock.json` or `yarn.lock`).
- `bun run dev` — Vite dev server.
- `bun run build` — typecheck (`tsc -b`) then Vite build into `dist/`.
- `bun run check` / `bun run check:fix` — Biome lint+format check (this is what CI runs; there is no ESLint or Prettier).
- `npx shadcn add <component>` — add new shadcn/ui components. shadcn deps (`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `radix-ui`, `vaul`, `shadcn`) are already installed — don't reinstall them.

### Backend (`cd backend`)
- `./gradlew bootRun` — run the Spring Boot app. Pick a profile with `--args='--spring.profiles.active=local'` (or set `SPRING_PROFILES_ACTIVE`). Profiles: `local` (drops + reseeds DB with mock data, points at `localhost:5432/torsdagslopet` with `postgres/admin`), `dev` (env-var DB, schema-only changelog), `cloud` (prod env-var DB, schema-only changelog).
- `./gradlew clean build` — full build incl. tests (this is what CI runs).
- `./gradlew test --tests "ClassName.methodName"` — run a single test. (Note: no tests currently exist under `src/test/`.)

### Full stack
- `docker compose up` from repo root — runs the Dockerfile-built backend image against a Postgres 16 container. Requires `.env` with `POSTGRES_USER`/`POSTGRES_PASSWORD`. The DB is named `kalneslopene` here, but `application-local.yml` expects `torsdagslopet` — local dev against compose Postgres needs profile `dev` or `cloud` with `POSTGRES_URL` set, not `local`.
- `nix develop` — drops into a devshell with bun, node 24, JDK 24, and opentofu pinned via `flake.nix`. JDK 24 is pinned to an older nixpkgs commit because it was EOL'd from nixpkgs unstable.

## Architecture notes

### API contract (frontend ↔ backend)
- Backend exposes `/api/races`, `/api/organizers`, `/api/runners`, `/api/newsfeeds` (controllers in `backend/.../controller/`). All identifiers are `UUID`. Standard CRUD per resource.
- Frontend never hand-writes fetch calls inline. All endpoints live in `frontend/src/api/queries.ts` as a single `QUERIES` const object, called via `useQuery(QUERIES.race.getRaceByUuid(uuid))`. HTTP client is `ky`; the shared `kyClient` and `QueryClient` (with `staleTime: 2min`, `retry: false`, `keepPreviousData`) are in `frontend/src/api/queryClient.ts`. New endpoints go in `QUERIES`, not ad-hoc.
- DTO shapes are duplicated: Kotlin in `backend/.../model/dto/` and TypeScript in `frontend/src/model/DTO.ts`. Keep them in sync manually when changing the API.

### Backend layering
Controller → Service → Repository (Spring Data JPA). Entities live in `model/entities/` and expose `toDto()`. `RaceRunnerEntity` uses a composite key (`RaceRunnerKey`) for the race↔runner join table. Liquibase changelogs live in `src/main/resources/db/changelog/`; `changelog-master.yaml` is schema-only (used by `cloud`/`dev`), `changelog-local.yaml` additionally includes mock data (used by `local` with `drop-first: true`). Add new migrations under `db/changelog/sql/create/` and reference them from `schema-changelog.yaml`.

### Frontend conventions
- TypeScript path alias `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- Routes are declared in `src/routes.ts`. Route paths use Norwegian capitalization (`/Resultater`, `/Bilder`, `/Statistikk`, `/Historie`, `/Løypekart`) — match this style when adding routes.
- Biome ignores `src/App.css` and `src/components/ui/` (shadcn-generated code). Don't hand-edit generated shadcn components — regenerate them.
- Biome formatter: 2-space indent, double quotes (enforced by `biome.json`).

### Language and design
- **All user-facing copy is Norwegian (bokmål).** Component prop labels, route paths, page titles, button text — all Norwegian. Code identifiers can stay English.
- **Mobile-first.** Default Tailwind classes target mobile; use `sm:` / `md:` / `lg:` prefixes to scale up.

## CI / deployment

- `.github/workflows/pr-check.yml` — on every PR: frontend `bun run check` + `bun run build`, backend `./gradlew clean build`. Both jobs skipped for Dependabot.
- `.github/workflows/build-and-push.yml` — manual `workflow_dispatch` only (tag input). Builds the multi-stage Docker image and pushes to `${REGISTRY_HOST}/torsdagslopet:<tag>`. Branch/tag auto-push is currently commented out.
- Deployment target is a Dokploy-managed Hetzner Cloud server provisioned by `infra/` (see `servers.tf`, `dns.tf`, `buckets.tf`).
