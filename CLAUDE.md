# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Ask your docs" — a Next.js (App Router) RAG chat app. Users create a chat, upload a PDF/DOCX, and ask questions answered from the document's content via embeddings + a Gemini chat model.

## Commands

Package manager is **pnpm** (see `pnpm-workspace.yaml` / `pnpm-lock.yaml`).

```bash
pnpm dev              # start dev server (Next.js)
pnpm build            # production build
pnpm start            # run production build
pnpm lint             # eslint (eslint-config-next, flat config)
```

There is no test suite/runner configured in this repo.

Database (Drizzle + Neon Postgres):

```bash
pnpm drizzle-kit generate   # generate a migration from db/schema.ts changes
pnpm drizzle-kit push       # push schema directly (no migration file)
pnpm drizzle-kit migrate    # apply migrations in ./drizzle
```

Ad-hoc script:

```bash
pnpm tsx scripts/test-embedding.ts   # sanity-check embedding generation against Google's API
```

## Environment variables

Required (see `.env`, values not committed): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

## Architecture

**Route groups** under `app/`: `(home)` marketing pages, `(auth)` sign-in/sign-up, `(dashboard)` the authenticated app (chat list, chat view, new chat, settings, upgrade). Auth gating between them is done in `proxy.ts` (this project's Next.js middleware — note the file is literally named `proxy.ts`, not `middleware.ts`), which redirects unauthenticated users away from non-public routes and authenticated users away from public ones, based on the better-auth session cookie only (no DB check at the edge).

**Auth**: `better-auth` (`lib/auth.ts`) with the Drizzle Postgres adapter, email/password + GitHub/Google OAuth. `lib/session-helper.ts` wraps it for server usage: `getSession()` reads the session from request headers, `requireUser()` redirects to `/` if there is none. API routes call `getSession()` directly and check `session?.user` themselves (no shared middleware wrapper for API auth).

**Database** (`db/schema.ts`, Drizzle ORM, Postgres/Neon via `db/index.ts`): `user`/`session`/`account`/`verification` are better-auth's own tables. Domain tables: `chats` (belongs to a user) → `documents` (belongs to a chat, has `status` enum pending/processing/ready/error and a Supabase Storage `storagePath`) → `chunks` (belongs to a document, stores `content` + a 768-dim `vector` embedding + `chunkIndex`). `messages` belong to a chat with a `role` enum (`ai`/`user`). Note `documents.status` is set but currently always written as `"ready"` synchronously — there's no background job queue.

**Document ingestion pipeline** (`lib/documents/`), triggered from `app/api/chats/[chatId]/documents/upload/route.ts`:

1. `process.ts` extracts text (`pdf-parse` for PDFs, `mammoth` for DOCX), uploads the original file buffer to Supabase Storage bucket `"documents"` under `${userId}/${sanitizedFileName}`, inserts the `documents` row, then chunks and embeds synchronously in the same request (no queue/background worker).
2. `chunk.ts` — paragraph-aware chunking (`chunkText(text, maxSize)`), splitting only on `\n\n`, falling back to sentence-boundary splitting for any single paragraph longer than `maxSize`.
3. `embed.ts` — `generateEmbedding()` calls Google's `gemini-embedding-001` via the Vercel AI SDK (`@ai-sdk/google`), fixed at 768 dimensions (must match `chunks.embedding`'s vector dimension in the schema — changing one requires changing the other and re-embedding existing rows).
4. `search.ts` — `findRelevantChunks(chatId, queryEmbedding, limit)` does cosine-similarity search scoped to a single chat's chunks via a join on `documents.chatId`.

**Chat/RAG request flow** (`app/api/chats/[chatId]/messages/route.ts`): verifies the chat belongs to the session user → saves the user's message → embeds the question → retrieves relevant chunks for that chat only → calls `streamText` (Vercel AI SDK) with the chat model from `lib/ai-config.ts` (`CHAT_MODEL`), stuffing retrieved chunk content directly into the system prompt (no message-history summarization or reranking) → streams the response as plain text (`createTextStreamResponse`/`toTextStream`, not the AI SDK's default data-stream protocol) → persists the assistant reply in `onFinish`. The client (`components/dashboard/chat/chat-panel.tsx`) uses `@ai-sdk/react`'s `useChat` with `TextStreamChatTransport` to match this plain-text streaming format — if the streaming response format on the server ever changes to the default AI SDK protocol, the transport on the client needs to change too.

**File storage**: Supabase Storage only (`lib/supabase.ts`, service-role client), used purely as a blob store for original document files — it is not used for auth or the database. Signed URLs for viewing a document are minted on demand in `app/api/documents/[id]/url/route.ts` (360s expiry) and consumed by `components/dashboard/document-viewer.tsx` / `pdf-viewer.tsx` / `docx-viewer.tsx`.

**Client data fetching**: TanStack Query (`components/providers.tsx` sets up a single `QueryClient` for the app). Hooks in `hooks/` (`use-chats.ts`, `use-messages.ts`, `use-document.ts`, `use-chat-documents.ts`, `use-upload.ts`) each fetch one of the corresponding `app/api/*` routes — there's no shared API client, each hook has its own inline `fetch`.

**UI**: shadcn/ui (`components.json`, style `base-nova`, base color `neutral`, no Tailwind prefix) generating into `components/ui/`. Tailwind v4 (CSS-based config in `app/globals.css`, no `tailwind.config.*` file). Icons from `lucide-react`.

## Conventions to know

- Path alias `@/*` maps to the repo root (see `tsconfig.json`), matching shadcn's aliases in `components.json`.
- User-facing API error strings in existing routes are written in Spanish (e.g. `"No autenticado"`, `"No se encontro el parametro chat"`) — match this if adding to the same routes; don't assume the whole codebase is Spanish-first, this is localized per-route.
- IDs across `documents`, `chunks`, `messages`, and other app-owned rows are generated with `nanoid()` in application code, not DB-generated (`text` primary keys, not serial/uuid columns).
- Ownership checks are always done by joining through `chats.userId` (a document/message has no direct `userId` column) — any new query touching documents/chunks/messages must join back to `chats` to scope by the current user.

# Coding Rules

## General

- Write clean, maintainable code.
- Prefer simple solutions over complex ones.
- Do not use `any` in TypeScript.
- Use proper TypeScript types.
- Create reusable components.
- Avoid duplicated code.
- Follow existing project architecture.
- Do not add dependencies without asking.

## React / Next.js

- Prefer Server Components when possible.
- Use Client Components only when needed.
- Keep components small and focused.
- Extract repeated logic into hooks.
- Use meaningful names.

## UI

- Use existing components before creating new ones.
- Follow the current design system.
- Avoid unnecessary styling duplication.

## Before finishing

Always:

1. Run lint.
2. Run typecheck.
3. Fix errors.
4. Explain what changed.

## Workflow

Before large changes:

- Analyze the codebase.
- Explain the plan.
- Wait for confirmation.
