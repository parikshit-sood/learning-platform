# Algorithm Galaxy

An interactive learning platform prototype for algorithm concepts.

## What this is

- A static, dependency-free web app.
- A first course called **Algorithm foundations**.
- A cinematic mission-map experience where learners explore concept nodes.
- Original summaries, labs, boss-gate questions, XP, and progress signals based on common algorithm topics from the PDF outline.
- Local progress tracking through `localStorage`.

## What this is not

This is not a replacement for the source book and does not reproduce its chapters. The PDF is used only as a topic map so the platform can teach concepts through original interactive missions.

## Run locally

From this folder:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Current modules

1. Search & Complexity
2. Lists & Sorting
3. Recursion & Stack
4. Divide & Conquer
5. Hash Tables
6. Graph Search
7. Weighted Paths
8. Greedy Choices

## Next useful steps

- Add user accounts and saved progress on a backend.
- Add authoring tools for importing topic maps from future PDFs.
- Add adaptive quizzes and spaced-repetition review.
- Add richer visualization canvases for graph and sorting modules.
