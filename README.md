# HQ OS

The operating system for your headquarters — a lightweight internal ops dashboard.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS.

## Getting started

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

## API

The app ships with a small in-memory task API used by the dashboard:

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/tasks` | List tasks |
| `POST` | `/api/tasks` | Create a task (`{ "title": string, "owner"?: string }`) |
| `PATCH` | `/api/tasks/:id` | Toggle a task between open/done |
| `DELETE` | `/api/tasks/:id` | Delete a task |

> Data is stored in memory and resets when the server restarts. Swap `src/lib/store.ts` for a real database when you're ready.

## Project structure

```
src/
  app/
    api/            Route handlers (health + tasks)
    page.tsx        Dashboard home
    layout.tsx      Root layout + metadata
  components/
    task-board.tsx  Interactive client component
  lib/
    store.ts        In-memory task store
```

## Cloud Agent environment

This repo includes `.cursor/environment.json` so Cursor Cloud Agents boot with dependencies installed and the dev server running on port 3000.
