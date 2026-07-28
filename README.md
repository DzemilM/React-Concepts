# React Concepts

A personal workspace for learning React, one folder per concept. This is **not** an
application — the code here exists to drill a single idea until it sticks, then move on.

## Structure

| Folder | Concept | Status |
| --- | --- | --- |
| [`Props/`](Props/) | Passing data into components | Done |
| [`Events/`](Events/) | Reacting to user interaction | Cold test cleared — written exam next |

## How each concept gets drilled

Three passes, in order. Each one tests something the previous one doesn't:

1. **Exercise file** — six exercises escalating in difficulty, with the logic blanked out as
   `TODO` and solutions collapsed at the bottom. Tests recall with scaffolding.
2. **Cold test** — no starter code. Just a data shape and a list of requirements. Tests
   whether I can generate the structure myself instead of adapting a template.
3. **Written exam** — predict-the-output, spot-the-bug, and explain-it questions. Tests
   understanding separately from syntax, because passing the first two by pattern-matching is
   possible and worth catching.

A concept is "done" when I clear the cold test and the exam without help — not when the
exercises run.

## Running the code

Everything runs in [StackBlitz](https://stackblitz.com) — browser only, no local install.
Component code goes in `src/App.js`.

## A note on the AI in this repo

[`CLAUDE.md`](CLAUDE.md) configures Claude Code to **refuse to write or fix my code**. It
gives hints as shapes with blanks, points at the wrong line and explains why, and separates
concept mistakes from syntax slips — but I type every solution myself.

The point of the repo is understanding, not working code. Code that runs and can't be
explained is a failure here.