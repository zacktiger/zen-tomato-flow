# Zen Tomato Flow

A calming, focus-oriented Pomodoro app that pairs the classic tomato timer with
gentle wellbeing tools — guided breathing, a mood journal, and simple task
tracking — so work sessions feel less like a grind and more like flow.

## Features

- **Pomodoro timer** — configurable focus and break intervals with start / break controls.
- **Breathing circle** — an animated breathing guide to reset between sessions.
- **Todo manager** — capture and check off tasks for the current session.
- **Mood journal & prompts** — log how a session felt and reflect with gentle prompts.
- **Stats dashboard** — visualize completed sessions and focus trends over time.
- **Productivity quotes** — a rotating bit of motivation while you work.
- **Settings** — tune timer durations and preferences to your own rhythm.

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- [React Router](https://reactrouter.com/), [TanStack Query](https://tanstack.com/query), and [Recharts](https://recharts.org/)

## Getting started

Requires [Node.js](https://nodejs.org/) (18+) and npm.

```sh
# Install dependencies
npm install

# Start the dev server (http://localhost:8080)
npm run dev
```

## Available scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reload.   |
| `npm run build`   | Build the production bundle to `dist/`.      |
| `npm run preview` | Preview the production build locally.        |
| `npm run lint`    | Run ESLint over the project.                 |

## Project structure

```
src/
  components/      # Timer, BreathingCircle, MoodJournal, TodoManager, StatsDashboard, ...
  components/ui/   # shadcn/ui primitives
  hooks/           # Custom hooks (localStorage, toast, ...)
  pages/           # Route-level views
  types/           # Shared TypeScript types
```
