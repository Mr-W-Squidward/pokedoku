# Pokédoku™ 🎮

> Sudoku, but make it Pokémon.

Built this for someone special who's simultaneously obsessed with Sudoku and Pokémon. Figured the least I could do was combine both obsessions into one app. The result: a fully playable Pokédoku where you drag-and-drop Pokémon sprites onto a 9×9 grid — each Pokémon appearing exactly once per row, column, and 3×3 box.

**[▶ Play it live](https://pokedoku-z.vercel.app)**

---

## What it does

- Generates a valid, unique Sudoku board on every new game using a backtracking algorithm with randomized number ordering
- 40 cells removed per puzzle, each with a verifiable correct answer checked against the solution (will add difficulties later)
- Drag-and-drop Pokémon/Bunnies (user-suggested) from the sidebar into cells (desktop), or tap-to-select + tap-to-place (mobile)
- 3 mistakes allowed before the board resets, erasure allowed, new game button, etc. — classic Sudoku rules
- Cell highlighting: selected row/column/box and matching Pokémon values all highlight in real-time
- Full audio system: background Pokémon music player (19 tracks, Spotify-style controls + volume slider), SFX for correct placements, mistakes, win, and game over — all mutable independently
- Fully responsive — plays on iPhone / mobile seamlessly!

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| State | useState / useReducer / Context API |
| Audio | Web Audio API (custom `useAudio` hook) |
| Deployment | Vercel |

---

## Architecture highlights

**Puzzle generation** (`src/logic/pokedoku_generator.ts`)  
Standard backtracking Sudoku solver with shuffled candidate numbers — guarantees a unique valid solution every run in O(n) average time. Removes 40 random cells to create the playable puzzle.

**Audio system** (`src/hooks/useAudio.ts`)  
Custom hook managing a single `HTMLAudioElement` ref initialized synchronously (not in an effect) to avoid React StrictMode double-invoke bugs. Three isolated `useEffect`s handle track-swap, play/pause, and volume independently — no state coupling, no ghost tracks.

**Mobile input** (`src/context/PokemonSelectContext.tsx`)  
Context-based tap selection layer sits alongside the existing HTML5 drag-and-drop system — mobile users tap a Pokémon to "hold" it (highlighted with a ring across all valid cells), then tap any cell to place. Zero changes to core game logic.

---

## Running locally

```bash
git clone https://github.com/Mr-W-Squidward/pokedoku
cd pokedoku
npm install
npm run dev
```

Drop your own audio files into `public/audio/` — see the `useAudio` hook for the expected paths.

---

## Why I built this

Someone I care about plays Sudoku every single day. When I found out they were also a Pokémon fan, I had to make something fun for them. This was also a good excuse to dig into browser audio APIs, drag-and-drop events with mobile fallbacks, and puzzle generation - things I wouldn't normally touch in a typical project.

---

*Made with TypeScript, Tailwind, and an unreasonable amount of Pokémon music.*