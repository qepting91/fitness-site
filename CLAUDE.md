# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
```

### Exercise Data Script

```bash
node scripts/fetch-exercises.js         # Fetch all exercises from free-exercise-db
node scripts/fetch-exercises.js --test  # Test mode - fetch only 3 exercises
```

## Architecture Overview

This is an Astro static site for displaying fitness workout routines. It uses Astro Content Collections for type-safe data management.

### Data Flow

```
free-exercise-db (GitHub) → fetch-exercises.js → src/content/exercises/*.json
                                                          ↓
src/content/workouts/*.json  ──────────────────→  Pages reference exercises by slug
```

### Content Collections

**Exercises** (`src/content/exercises/`): Individual exercise data (name, target muscle, equipment, instructions, GIF URL) fetched from the free-exercise-db GitHub repository.

**Workouts** (`src/content/workouts/`): Workout routines that reference exercises by slug. Each workout has a `path` type:
- `hybrid` - Dumbbell/free weight focused
- `machine` - Machine-based exercises
- `optional` - Supplementary arm workouts
- `core` - Core/ab exercises

### Page Structure

- `src/pages/index.astro` - Home page showing all workouts grouped by path type
- `src/pages/search.astro` - Client-side exercise search with muscle group filters
- `src/pages/workouts/[workout].astro` - Dynamic workout detail pages

### Key Components

- `BaseLayout.astro` - Shared layout with dark theme, mobile viewport settings, bottom nav
- `WorkoutCard.astro` - Workout preview cards with path-based color coding
- `ExerciseAccordion.astro` - Expandable exercise details using native `<details>` element
- `BottomNav.astro` - Fixed mobile navigation

### Styling

Uses Tailwind CSS 4 with dark theme only. Color scheme: slate grays with accent colors (violet=hybrid, sky=machine, emerald=optional, amber=core). Custom component classes defined in `src/styles/global.css`.

## Adding New Exercises

1. Add the exercise search term to `ALL_EXERCISES` array in `scripts/fetch-exercises.js`
2. Run `node scripts/fetch-exercises.js`
3. Check `src/content/exercises/_exercise-mapping.json` for success/failure

## Adding New Workouts

Create a JSON file in `src/content/workouts/` following this schema:

```json
{
  "name": "Workout Name",
  "path": "hybrid|machine|optional|core",
  "dayOfWeek": "monday",
  "structure": "circuit|supersets|straight sets",
  "restBetweenSets": "90 seconds",
  "rounds": 3,
  "exercises": [
    {
      "slug": "exercise-filename-without-json",
      "sets": "3",
      "reps": "10-12",
      "notes": "Optional tips",
      "supersetGroup": "1A"
    }
  ]
}
```
