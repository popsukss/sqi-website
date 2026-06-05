# SUTD Quantum Initiatives (SQI) — Website

Official website for the SUTD Quantum Initiatives club. Built with the T3 Stack.

## Features

- **Homepage** — club mission, past events, team, and EXCO contact
- **Roadmap** — interactive React Flow tree sourced from [`quantum-roadmap`](https://github.com/popsukss/quantum-roadmap); per-node progress tracking (In Progress / Completed / Skipped) and per-concept checkboxes saved to DB for logged-in users
- **Forum** — Markdown + KaTeX posts and comments, Reddit-style upvoting, checkpoint tags, admin moderation
- **Resources** — community-submitted links (video/PDF/book/article) with upvoting and admin approval queue
- **Admin panel** — manage events, members, resources, forum posts, and users

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| API | tRPC v11 |
| Database | PostgreSQL (Neon) via Prisma v6 |
| Auth | better-auth (Google OAuth + email/password) |
| UI | Tailwind CSS v4 + shadcn/ui |
| Roadmap graph | @xyflow/react (React Flow) |
| Markdown/Math | react-markdown + remark-math + rehype-katex |

## Local Development

```bash
pnpm install
cp .env.example .env   # fill in your values
pnpm db:push           # push schema to your database
pnpm dev
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon (or any Postgres) connection string |
| `BETTER_AUTH_SECRET` | Yes (prod) | Random secret — `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | No | Production base URL e.g. `https://sqi.vercel.app` |
| `BETTER_AUTH_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `BETTER_AUTH_GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |

## Deployment (Vercel)

1. Create a [Neon](https://neon.tech) project and copy the connection string.
2. Push schema: `pnpm db:push` (or create a migration with `pnpm db:generate`).
3. Connect the GitHub repo to Vercel and set the env vars above.
4. Add the Google OAuth redirect URI: `https://<your-domain>/api/auth/callback/google`
5. Vercel runs `prisma migrate deploy && next build` on each deploy automatically.

## Roadmap Content

Checkpoint and track content is fetched from [`popsukss/quantum-roadmap`](https://github.com/popsukss/quantum-roadmap) at build/request time (1-hour cache). To update content, push to that repo — no redeployment needed.
