# Prompter (TypeScript Edition)

Prompter is now a fully client-forward Next.js + TypeScript application that provides an operator-themed console for high-signal prompt engineering. The original Streamlit implementation has been replaced with a modern web experience that keeps the signature tactical aesthetic while enabling richer interactivity.

## Tech Stack

- [Next.js 14](https://nextjs.org/) with the App Router
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS](https://tailwindcss.com/) for rapid, theme-consistent styling
- [Framer Motion](https://www.framer.com/motion/) for subtle motion cues
- [OpenAI Node SDK](https://www.npmjs.com/package/openai) to request prompt refinements

## Repository Layout

- `apps/prompter` – Operator console with modular prompt engineering tools (default `npm run dev` target).
- `apps/lumbridge-rpg` – Standalone Lumbridge RPG Phaser prototype extracted from the main experience.
- `docs/` – Design documents and reference material.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set your OpenAI API key. You can either:
   - Provide it at runtime inside the application (stored in localStorage only), or
   - Export `OPENAI_API_KEY` in your shell before starting the dev server.

3. Launch the Prompter development server:

   ```bash
   npm run dev
   ```

   The console will be available at [http://localhost:3000](http://localhost:3000).

## Prompt Refinement Workflow

1. Configure your OpenAI API key from the **API Access** panel on the home screen. The key never leaves the browser unless you trigger a refinement request.
2. Navigate to the **Prompt Refiner** module and supply:
   - A raw prompt to enhance
   - Optional operational context and additional directives
   - A refinement style preset (precision, narrative, analysis, or creative)
3. Deploy the refinement to receive:
   - A rewritten prompt optimised for model execution
   - An explanation of the adjustments made
   - Follow-up questions for missing intelligence

> **Note:** The API route proxies requests to OpenAI using either the configured in-app key or `OPENAI_API_KEY`. Ensure usage complies with your organisation's security policies.

## Production Build

Create an optimised build and start the server:

```bash
npm run build
npm start
```

## Testing and Linting

- `npm run lint` uses `eslint-config-next`

Additional tests can be added as the project evolves.

## Design Documents

- [Lumbridge RPG MVP Design Document](docs/lumbridge-rpg-mvp.md)

## Lumbridge RPG Prototype

The Option B sandbox has been extracted into a standalone project under [`apps/lumbridge-rpg/`](apps/lumbridge-rpg/).

- `cd apps/lumbridge-rpg` and install dependencies to work on the RuneScape prototype in isolation from the core Prompter app.
- The Next.js + Phaser scene still rotates Woodcutting, Fishing, Crafting, and Combat XP awards to mirror the MVP skills.
- Update the adventurer name from the side panel and watch the Phaser banner refresh immediately.
