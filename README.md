# Tetris (Phase 2)

Modern, TypeScript-first implementation of classic Tetris using React, Vite, and Zustand. Phase 1 delivered the full visual shell; Phase 2 focuses entirely on gameplay systems. The repository currently contains the completed core logic layer (randomizer, collision, pieces, gravity, line clearing, and scoring) along with unit tests and an initial global game store.

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **State:** Zustand (game store), TanStack Query (Phase 1 UI foundation)
- **Testing:** Jest + ts-jest
- **Styling & Assets:** Retro-themed CSS system from Phase 1, design specs in `tmp/`

## Getting Started

```bash
npm install     # install dependencies
npm run dev     # start Vite dev server
npm run build   # production build
npm test        # run unit tests
```

The Jest run currently prints a warning about `moduleNameMapping`; gameplay tests still pass.

## Code Map

| Path | Purpose |
| --- | --- |
| `src/core/constants` | Spec-complete constants for pieces, SRS, scoring, layout |
| `src/core/types` | Strong TypeScript models for board, pieces, audio, etc. |
| `src/core/utils` | Core utilities (7-bag randomizer, collision helpers) |
| `src/game` | Phase‑2 game systems (Piece, Gravity, LineClear, Score, Zustand store) |
| `tests/unit` | Jest test suites covering each game system |
| `tmp/` | Design + project management documents supplied by the PM |

## Phase 2 Progress

✅ **Card 1 — 7-Bag Randomizer**: Implemented with singleton helpers, deep peek support, and distribution tests.

✅ **Card 2 — Collision Detection**: Complete boundary + board collision helpers with comprehensive unit coverage.

✅ **Card 3 — Piece Movement & SRS**: `Piece` class implements movement, rotations (I/O special cases), wall kicks, hard drop, and cloning.

✅ **Card 4 — Gravity & Lock Delay**: `GravitySystem` drives timed descent, lock delay, hard-drop locking, and exposes instrumentation for the loop.

✅ **Card 5 — Line Clearing Mechanics**: `LineClearSystem` detects/removes lines, returning animation metadata for UI gating.

✅ **Card 6 — Scoring System**: `ScoreManager` handles line clears, combos, back-to-back, drops, persistence, and level progression.

✅ **Card 7 — Game State Management**: `gameStore` now powers the live game loop with Zustand, wiring gravity/clears/scoring into the React UI (board, previews, hold, score HUD, controls, touch buttons).

⬜ **Card 8 — Keyboard Input System**: Not started.

⬜ **Card 9 — Touch Controls Integration**: Not started.

⬜ **Card 10 — UI-Game State Integration**: Not started.

## Outstanding Work for a 100% Playable Game

1. **Input Systems (Keyboard & DAS/ARR)**
   - Implement `InputManager` handling key bindings, DAS (170 ms) + ARR (70 ms), soft/hard drop, rotations, pause, and hold.
   - Provide configurable timings via settings in accordance with design docs.

2. **Touch Controls**
   - Add mobile interaction layer (swipes, tap-to-rotate, hold-to-repeat) with haptic feedback and shared DAS/ARR logic.

3. **UI & Animation Polish**
   - Animate line clear flashes using `pendingClear` metadata and pause input during effects.
   - Add overlays for countdowns, level-ups, and ensure responsive layout states stay synced with gameplay.

4. **Audio & FX Hooks**
   - Trigger existing sfx assets on line clears, drops, moves, level-ups, and game state changes.

5. **Persistence Enhancements**
   - Persist high scores (already supported by `ScoreManager`) and extend to broader game stats/settings via designated storage keys.

6. **Testing & Tooling**
   - Add integration tests for full game flow once UI wiring is complete.
   - Resolve Jest `moduleNameMapping` warning by updating configuration (likely `moduleNameMapper`).

7. **Polish & Accessibility**
   - Align UI animations and transitions with design timing specs.
   - Ensure keyboard navigation, focus traps, and screen-reader labels meet accessibility goals.

## Project Scripts

- `npm run dev` — Vite dev server with hot reload
- `npm run build` — TypeScript compile + production bundle
- `npm run preview` — Preview production build
- `npm test` — Jest test suites
- `npm run test:watch` — Watch mode
- `npm run test:coverage` — Coverage report
- `npm run lint` — ESLint (TypeScript + React rules)

## Contributing Notes

- Keep code ASCII unless the file already contains Unicode.
- Favor immutable updates and explicit types in the game layer.
- Tests are colocated in `tests/unit`; mirror system names for easy discovery.
- Use the `resetGameStore` helper in tests to avoid cross-suite state bleed.

## Credits

- Game design and UX specs by the PM team (`tmp/PROJECT_MASTER_DESIGN.md`).
- Engineering implementation by the Phase 2 build crew.
