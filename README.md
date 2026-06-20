# Knowledge Galaxy

A generic interactive learning platform for building topic-based courses over time.

## Tech stack

- Vite
- React
- TypeScript
- Data-driven course and topic definitions

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL.

## Structure

- `src/data/topics.ts` defines the platform topic catalog.
- `src/data/courses/` contains course content by topic.
- `src/types/content.ts` defines reusable content models.
- `src/components/` contains page and course UI.
- `src/labs/` contains reusable interactive lab renderers.

## Current topics

- Algorithms: available now.
- Distributed Systems: planned.
- Data-Intensive Applications: planned.
- System Design: planned.
- ML Systems: planned.

## Adding a topic

1. Add the topic metadata in `src/data/topics.ts`.
2. Add a course file in `src/data/courses/`.
3. Register the course in `src/data/topics.ts`.
4. Add any new lab type to `src/types/content.ts` and implement it in `src/labs/`.
