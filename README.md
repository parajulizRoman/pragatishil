# Pragatishil Next.js Project

The official production web app for **pragatishil.org.np**.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (Stable, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with `lucide-react` icons)
- **Database**: Supabase (PostgreSQL + Storage)
- **Auth**: Supabase Auth
- **AI**: Google Gemini (Flash 1.5/2.5) for OCR and Chat

## Getting Started

### 1. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the values:
```env
# Public (Client)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Private (Server Only)
GEMINI_API_KEY=your_gemini_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Installation
```bash
npm install
```
*Note: We strictly use standard `npm install` without `--legacy-peer-deps`.*

### 3. Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Build & Production
```bash
npm run build
npm run build
npm start
```

## Supabase: Migrations & CLI

We use the standard Supabase CLI structure. Migrations are stored in `supabase/migrations/`.

### Quickstart for New Devs

```bash
# 1. Login to Supabase CLI (if not already logged in)
npx supabase login

# 2. Link to the Remote Project (First time only)
# Project Ref: ivlpnaxrefpihtgdlidc
npx supabase link --project-ref ivlpnaxrefpihtgdlidc

# 3. Push Migrations
# This applies local SQL files to the remote database
npx supabase db push
```

### Production Safety Notes
> [!IMPORTANT]  
> **Never run destructive SQL directly in the Supabase Dashboard.**

1.  **Always Backup**: Backup your production DB via the dashboard before applying major changes.
2.  **Use Migrations**: All schema changes must be written as SQL files in `supabase/migrations/`.
3.  **Review Changes**: Use `npx supabase db diff` (if local Docker is running) or carefully review SQL files before pushing.

### Common Commands
- **`npx supabase db push`**: Applies pending migrations to the linked remote project.
- **`npx supabase start`**: Starts a local Supabase instance (requires Docker) for testing.
- **`npx supabase stop`**: Stops the local instance.

## Engineering Standards

### Versioning
- **Strict Stability**: We do not use "Release Candidate" (RC) versions of core libraries (React, Next.js) in production branches.
- **Dependencies**: New dependencies must be peer-compatible with Next.js 14 and React 18.

### Git Strategy
- **`main`**: Production code. Deployed automatically to Vercel Production.
- **`develop`** (or feature branches): Active development.
- **Pull Requests**:
  - All changes must go through a PR to `main`.
  - Vercel automatically creates a **Preview Deployment** for every PR.
  - Merge only after the Preview build passes and QA is verified.

### Code Hygiene
- **Linting**: Run `npm run lint` before committing.
- **Styling**: Use **Tailwind tokens** (`bg-brand-blue`, `text-brand-red`) defined in `tailwind.config.ts` instead of hardcoded hex values.
- **Types**: Avoid `any`. Define interfaces in `src/types/`.

## Deployment (Vercel)

This project is optimized for Vercel.

**Settings:**
- **Framework Preset**: Next.js
- **Root Directory**: `pragatishil-nextjs` (if monorepo, otherwise root)
- **Node Version**: 18.x or 20.x

**Environment Variables**:
Configure these in the Vercel Dashboard (Settings > Environment Variables), **NOT** in the repository. see `env.local` example above.

## Branding
See [branding.md](branding.md) for detailed color palettes and font usages.
