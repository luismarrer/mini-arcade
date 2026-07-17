# Repository Guidelines

## Project Structure & Module Organization

Mini Arcade is an Astro application with React-powered games. Route files live in `src/pages/`; shared page chrome is in `src/layouts/` and `src/components/sections/`. Reusable game UI belongs under `src/components/games/<game>/`, with game-specific hooks in a local `hooks/` directory. Keep shared constants, helpers, and types in `src/constants/`, `src/lib/`, and `src/types/` respectively.

Global and game-specific CSS is under `src/styles/`. Imported images belong in `src/images/`; files that must retain a stable public URL belong in `public/` (for example, `/images/avatars/batman.avif`). Design references are stored in `mockup/`.

## Build, Test, and Development Commands

Use pnpm; `pnpm-lock.yaml` is the source of truth.

- `pnpm install` installs exact project dependencies.
- `pnpm dev` starts Astro's local development server.
- `pnpm build` creates a production build in `dist/` and is the primary pre-PR validation.
- `pnpm preview` serves the built site locally for final browser checks.
- `pnpm astro -- <command>` runs Astro CLI utilities when needed.

## Coding Style & Naming Conventions

TypeScript uses Astro's strict configuration and the `@/` path alias for `src/`. Match the surrounding file's formatting; existing Astro and React code generally uses four-space indentation. Use `PascalCase` for components and component files (`GameBoard.tsx`), `camelCase` for functions and variables, and `useX` for hooks (`useMemoryGame.ts`). Keep route filenames lowercase and hyphenated. Prefer explicit TypeScript interfaces for component props and keep game logic in hooks rather than presentation components.

No formatter or linter is currently configured, so avoid unrelated formatting churn.

## Testing Guidelines

There is no automated test framework or coverage threshold yet. For every change, run `pnpm build` and manually exercise affected routes, responsive layouts, game reset/win/loss flows, and authentication behavior where applicable. If adding tests, colocate them as `*.test.ts` or `*.test.tsx` and add the runner command to `package.json`.

## Commit & Pull Request Guidelines

The available history uses Conventional Commit style, such as `refactor: remove redundant ...`. Use concise, imperative subjects with an appropriate prefix (`feat:`, `fix:`, `refactor:`, `docs:`). Pull requests should explain the user-visible impact, list validation performed, link related issues, and include screenshots or recordings for UI and gameplay changes. Keep each PR focused and document any new configuration requirements.

## Security & Configuration

Never commit secrets. Supabase client configuration is read from `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`; place local values in an ignored `.env` file. Remember that `PUBLIC_` variables are exposed to browser code, so never store service-role keys there.
