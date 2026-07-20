<h1 align="center">Kalneslopene / Torsdagsløpet</h1>

<p align="center">
    <img width="200" src="frontend/src/images/logo.svg" />
</p>

**Torsdagsløpet** ("the Thursday race") is a free, low-threshold 5.1 km recreational run held every
Thursday (Saturdays towards the end of the season) at Kalnesskogen, Sarpsborg, Norway, organized entirely by volunteers since 1978. There's no advance
registration — runners sign the participant list just before the start, and everyone gets free fruit
afterwards. Over more than four decades it's become a local tradition, with generations of regulars
logging times, chasing personal records, and treating it as a standing weekly meetup as much as a race.

This repository is the web app built around that event: a public results archive, personal statistics
and PRs, a race calendar, a course map, a history timeline with milestones, photos, and a news feed, plus
an admin area the organizers use to manage races, runners, and results after each event. It's a monorepo
with three parts:

- **`backend/`** — Kotlin + Spring Boot 4 REST API (JDK 25, JPA, Liquibase, PostgreSQL)
- **`frontend/`** — React 19 SPA (Vite, TypeScript, Tailwind 4, shadcn/ui, TanStack Query)
- **`infra/`** — OpenTofu/Terraform for Hetzner Cloud servers + MinIO/S3 buckets

In production the Spring Boot jar serves the built frontend directly (`frontend/dist` is copied into
`backend/src/main/resources/static/` during the Docker build) — there's no separate frontend deployment.

## Getting started

### Frontend (`cd frontend`)

```
bun install --frozen-lockfile
bun run dev         # start dev server
bun run build       # typecheck + production build
bun run check       # lint/format (Biome)
bun run check:fix   # fix linting and formatting issues (Biome)
```

### Backend (`cd backend`)

```
./gradlew bootRun --args='--spring.profiles.active=local'
./gradlew check   # ktlint + detekt + tests
```

Requires a local PostgreSQL at `localhost:5432/torsdagslopet` (user `postgres` / `admin`) for the `local` profile.

## 🚀 Deployment

| Trigger | Environment | Automatic? |
|---|---|---|
| Merge to `main` | `dev` | ✅ |
| Publish a GitHub release | `test` | ✅ |
| Run `deploy.yml` manually (Actions tab) | `dev` / `test` / `prod` | ❌ manual only |

- Merging to `main` and publishing a release are all you need for `dev`/`test` — no manual steps.
- `prod` **never** deploys automatically. Ship it by running `deploy.yml` from the Actions tab, choosing
  `prod` and a tag that's already been built (normally one already verified in `dev` and `test`).
- The same workflow also does rollbacks — run it again with an older tag.
- Deploys are just a pointer flip: Dokploy already has the image, the workflow just tells it which tag
  to run and asks it to redeploy. Watch actual rollout progress in Dokploy itself.

Hosting is a Dokploy-managed Hetzner Cloud server provisioned by `infra/` (OpenTofu/Terraform).
