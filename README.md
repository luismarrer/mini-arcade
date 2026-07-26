# Mini Arcade

Mini Arcade is a public browser-game lab: a growing collection of small games I build to learn about interaction, state, logic, and the web.

**[Play Mini Arcade](https://mini-arcade-dev.vercel.app/)**

## The cabinet

Four games are currently playable:

- Pair Memory — a configurable matching game featuring DC characters
- Two Dots — a timed color-connection puzzle
- Hexapawn — a compact strategy game against a capture-first computer
- Hangman — a keyboard-friendly word game

Stack, MonkeyType, and Tetris remain visible as honest work-in-progress experiments.

## Built with

- Astro
- React
- TypeScript
- Tailwind CSS
- Supabase for optional player profiles

The site compiles and runs without Supabase credentials. Player accounts connect to Supabase when `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are configured.

## Local development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

This repository is linked directly to its Supabase Cloud project. Authenticate
with `pnpm supabase login` and run `pnpm supabase link --project-ref <ref>` when
setting up a new machine. Use `pnpm db:push:dry` before `pnpm db:push`, then run
`pnpm db:types` and `pnpm db:lint` after changing the remote schema.

Authenticated players receive a profile automatically at sign-up. Completed
games are saved idempotently, and global points are calculated by the database
rather than accepted from the browser. Guest results remain in local storage
when Supabase is unavailable or the player is signed out.

Run `pnpm build` before shipping changes.

## About

Made by [Luis Marrero](https://luismarrer.github.io/en). The project is available under the [MIT License](LICENSE).
