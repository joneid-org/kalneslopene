# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Monorepo for the **Kalneslopene / Torsdagsløpet** site — a Norwegian running-race site. Three top-level apps:

- `backend/` — Kotlin + Spring Boot 4 REST API (JDK 25, Gradle Kotlin DSL, JPA, Liquibase, PostgreSQL).
- `frontend/` — React 19 SPA built with Vite (TypeScript, Tailwind 4, shadcn/ui, TanStack Query, react-router 7). Package manager is **bun**, not npm.
- `infra/` — OpenTofu/Terraform for Hetzner Cloud servers + MinIO/S3 buckets.

In production, `Dockerfile` runs a multi-stage build that compiles the frontend with bun and copies `frontend/dist` into `backend/src/main/resources/static/` before the Gradle build. The Spring Boot jar then serves the SPA itself (see `controller/SpaController.kt`, which forwards non-asset paths to `/index.html`). There is **no separate frontend deployment** — the backend serves it.

## Common commands

### Frontend (`cd frontend`)
- `bun install --frozen-lockfile` — install deps (CI and Docker use this; `bun.lock` is authoritative, do not introduce `package-lock.json` or `yarn.lock`).
- `bun run dev` — Vite dev server.
- `bun run build` — typecheck (`tsc -b`) then Vite build into `dist/`.
- `bun run check` / `bun run check:fix` — Biome lint+format check (there is no ESLint or Prettier).
- `bun run react-doctor` — dead-code/unused-export scan; config at `frontend/doctor.config.ts` ignores `src/components/ui/**`. CI runs `check` + `tsc` + `react-doctor` as required PR gates (not `build`).
- `npx shadcn add <component>` — add new shadcn/ui components. shadcn deps (`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `radix-ui`, `vaul`, `shadcn`) are already installed — don't reinstall them.

### Backend (`cd backend`)
- `./gradlew bootRun` — run the Spring Boot app. Pick a profile with `--args='--spring.profiles.active=local'` (or set `SPRING_PROFILES_ACTIVE`). Profiles: `local` (`drop-first: true`, points at `localhost:5432/torsdagslopet` with `postgres/admin`), `dev` (env-var DB, no drop), `cloud` (prod env-var DB, no drop). All three run the same schema changelog — mock data is seeded separately, see `MockDataGenerator` below.
- `./gradlew check` — runs ktlint + detekt + tests (this is what CI runs). `./gradlew clean build` additionally produces the jar.
- `./gradlew ktlintFormat` — auto-fix formatting; `./gradlew ktlintCheck` / `./gradlew detekt` run them individually. ktlint style is configured in `backend/.editorconfig`; detekt overrides (on top of defaults, `buildUponDefaultConfig`) live in `backend/config/detekt/detekt.yml`. detekt is pinned to `dev.detekt` `2.0.0-alpha.4` for Kotlin 2.3 compatibility. The Docker image build runs `./gradlew assemble`, so lint does not gate prod images.
- `./gradlew test --tests "ClassName.methodName"` — run a single test.

### Full stack
- `docker compose up` from repo root — runs the Dockerfile-built backend image against a Postgres 16 container. Requires `.env` with `POSTGRES_USER`/`POSTGRES_PASSWORD`. The DB is named `kalneslopene` here, but `application-local.yml` expects `torsdagslopet` — local dev against compose Postgres needs profile `dev` or `cloud` with `POSTGRES_URL` set, not `local`.
- `nix develop` — drops into a devshell with bun, node, JDK 25, and opentofu from nixpkgs `nixos-unstable`, pinned via `flake.nix`.

## Architecture notes

### API contract (frontend ↔ backend)
- Backend exposes `/api/races`, `/api/organizers`, `/api/runners`, `/api/newsfeeds`, `/api/milestones` (standard CRUD, `UUID` ids), plus `/api/statistics` and `/api/config` (read-only), `/api/s3` (presigned upload URLs), and `/api/auth` (login/setup — see Authentication below). Controllers live in `backend/.../controller/`.
- Frontend never hand-writes fetch calls inline. All endpoints live in `frontend/src/api/queries.ts` as a single `QUERIES` const object, called via `useQuery(QUERIES.race.getRaceByUuid(uuid))`. HTTP client is `ky`; the shared `kyClient` and `QueryClient` (with `staleTime: 2min`, `retry: false`, `keepPreviousData`) are in `frontend/src/api/queryClient.ts`. New endpoints go in `QUERIES`, not ad-hoc.
- DTO shapes are duplicated: Kotlin in `backend/.../model/dto/` and TypeScript in `frontend/src/model/DTO.ts`. Keep them in sync manually when changing the API.
- `backend/bruno/collections/` is a Bruno API collection (Local/Dev/Test/Prod environments) mirroring the REST surface — useful as a live reference for request/response shapes.

### Authentication
- Spring Security + HTTP Basic, one role (`UserRole.ADMIN`) — see `SecurityConfig`. All `GET`s are public except `GET /api/s3/presigned-url`; `POST /api/auth/login` and `POST /api/auth/setup` are public; everything else requires `ADMIN`. `GET /api/auth/setup/needed` tells the frontend whether to show first-run setup (true when the `users` table is empty).
- Frontend stores base64 `username:password` in `sessionStorage` (`AuthProvider`/`AuthContext`); `kyClient` attaches it as an `Authorization: Basic` header on every request automatically (`beforeRequest` hook in `queryClient.ts`) — new admin-only endpoints need no extra frontend auth wiring. `AuthGuard` gates the `/admin/*` route subtree in `routes.ts`.
- File uploads go through `/api/s3` presigned URLs (MinIO-backed, see `infra/buckets.tf`): the frontend requests a presigned PUT URL (admin-gated), then uploads the file directly to the bucket from the browser (`frontend/src/api/s3.ts`).

### Backend testing conventions
- Organize tests using JUnit 5 `@Nested` inner classes within a single test file — do not split into multiple files.

### Backend layering
Controller → Service → Repository (Spring Data JPA). Entities live in `model/entities/` and expose `toDto()`. `RaceRunnerEntity` uses a composite key (`RaceRunnerKey`) for the race↔runner join table. Liquibase changelogs live in `src/main/resources/db/changelog/`; every profile shares the same `changelog-master.yaml` → `schema-changelog.yaml` chain (schema/migrations only). Add new migrations under `db/changelog/sql/create/` (or `sql/migrate/` for alterations) and reference them from `schema-changelog.yaml`. Mock data is not Liquibase-managed: `MockDataGenerator` (`mockdata/`, a `CommandLineRunner` gated to `@Profile("local | dev")`) seeds runners/races/newsfeeds/organizers/milestones on startup, but only if the `runners` table is empty — safe against a persistent `dev` DB.

### Frontend conventions
- TypeScript path alias `@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- Routes are declared in `src/routes.ts`. Top-level public pages are capitalized Norwegian (`/Resultater`, `/Bilder`, `/Statistikk`, `/Historie`, `/Løypekart`, `/Løpskalender`); `nyheter/*`, `logg-inn`, and `admin/*` are lowercase — match whichever group a new route belongs to.
- Biome ignores `src/App.css` and `src/components/ui/` (shadcn-generated code). Don't hand-edit generated shadcn components — regenerate them.
- Biome formatter: 2-space indent, double quotes (enforced by `biome.json`).
- Utils are split by domain rather than dumped into one file: `timeUtils.ts`, `statisticsUtils.ts`, `newsUtils.ts`, `photoUtils.ts`, `organizerOrder.ts`, `fileUploadUtils.ts`, plus a general `utils.ts`. Extend the matching file, or genericize an existing helper, before adding a near-duplicate one-off.
- Race dates are parsed as literal `YYYY-MM-DDTHH:MM:SS` strings (`timeUtils.ts`) with no timezone conversion — never route them through `Date`-based local-time conversion.
- Fetch data as high in the component tree as reasonable and pass it down as props, rather than calling `useQuery` again further down — avoids redundant backend calls.
- `arrayExtensions.ts` polyfills `Array.prototype.partition` globally (side-effect import in `main.tsx`) — don't reimplement it inline.

### Language and design
- **All user-facing copy is Norwegian (bokmål).** Component prop labels, route paths, page titles, button text — all Norwegian. Code identifiers can stay English.
- **Mobile-first.** Default Tailwind classes target mobile; use `sm:` / `md:` / `lg:` prefixes to scale up.

### Code style
- **Minimal comments.** Prefer self-explanatory code. Only add a comment when something is genuinely complex and hard to grasp quickly by reading the code.

## CI / deployment

- `pr-check.yml` — on every PR (and reused by workflows below): frontend `check` + `tsc` + `react-doctor`, backend `./gradlew check`. Both jobs skipped for Dependabot.
- `merge-to-main.yml` — on push to `main`: reruns `pr-check`, then `build-and-push` (tag = commit SHA), then **auto-deploys to `dev`**.
- `release.yml` — on a published GitHub release: `build-and-push` (tag = release tag), then **auto-deploys to `test`**.
- `build-and-push.yml` — reusable. Builds the multi-stage Docker image and pushes `${REGISTRY_HOST}/joneid-org/torsdagslopet:<tag>`.
- `deploy.yml` — reusable, and manually dispatchable (choose `dev`/`test`/`prod` + an already-pushed tag). Sets `IMAGE_TAG` on the target Dokploy compose app via the Dokploy API and triggers a redeploy. **`prod` only ever deploys via manual dispatch** — nothing in the automated pipeline targets it.
- Hosting is a Dokploy-managed Hetzner Cloud server provisioned by `infra/` (see `servers.tf`, `dns.tf`, `buckets.tf`).
