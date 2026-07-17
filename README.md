# Mini Arcade

Mini Arcade is a public browser-game lab: a growing collection of small games I build to learn about interaction, state, logic, and the web.

**[Play Mini Arcade](https://mini-arcade-dev.vercel.app/)**

## The cabinet

Four games are currently playable:

- Pair Memory — a configurable matching game featuring DC characters
- Two Dots — a timed color-connection puzzle
- Hexapawn — a compact strategy game against a learning computer
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
pnpm dev
```

Run `pnpm build` before shipping changes.

## About

Made by [Luis Marrero](https://luismarrer.github.io/en). The project is available under the [MIT License](LICENSE).
