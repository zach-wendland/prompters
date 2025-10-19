# Lumbridge RPG Prototype (Next.js + Phaser)

This folder contains a standalone Next.js sandbox that experiments with the Option B stack outlined in the Lumbridge RPG MVP design
 document. It mirrors the prototype that originally lived inside the root web app but is now isolated so that you can iterate on
 the RuneScape project without touching the rest of the repository.

## Getting Started

1. `cd games/lumbridge-rpg`
2. Install dependencies (Node 18+ recommended):
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the Phaser playground.

## What's Included

- **Next.js App Router** project skeleton with TypeScript + ESLint configured.
- **Phaser 3 scene** that rotates through the four MVP launch skills (Woodcutting, Fishing, Crafting, Combat) and awards XP for
  each click in the play area.
- **Zustand store** that tracks the player name, skill XP, and exposes helpers to reset progress.
- **Lightweight styling** via vanilla CSS to keep the UI readable without relying on Tailwind from the root project.

## Roadmap Ideas

- Replace the temporary grid with imported Lumbridge tilemaps exported from Tiled.
- Add NPC sprites and context menu interactions that mirror the MVP quests.
- Persist progress locally (e.g., `localStorage`) so resets between sessions are optional.
- Integrate audio cues for skill gains and combat loops.

If you prefer a different framework (Vite, plain Phaser, etc.), feel free to swap the scaffolding—this folder is your playground.
