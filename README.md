# React Concepts

A personal workspace for learning React, one folder per concept. This is **not** an
application — the code here exists to drill a single idea until it sticks, then move on.

## Structure

The folders follow the two parts of the Udemy course I'm working through.

### React Essentials

| Folder | Concept | Status |
| --- | --- | --- |
| [`1.Props/`](React%20Essentials/1.Props/) | Passing data into components | Done |
| [`2.Events/`](React%20Essentials/2.Events/) | Reacting to user interaction | Done |
| [`3.State/`](React%20Essentials/3.State/) | Data that changes and redraws the screen | Done (single component) |
| [`4.Conditional Content/`](React%20Essentials/4.Conditional%20Content/) | Showing different JSX depending on a condition | Done |
| [`5.Dynamic lists/`](React%20Essentials/5.Dynamic%20lists/) | Turning arrays of data into arrays of JSX with `.map()` and keys | Done |

`3.State/` covers state inside one component. Sharing state between components (lifting state
up) and holding objects or arrays of objects in state are still to come.

### React Essentials — Deep Dive

| Folder | Concept | Status |
| --- | --- | --- |
| [`0.Fragments/`](React%20Essentials%20-%20Deep%20Dive/0.Fragments/) | Returning several elements without adding a wrapper to the DOM | Done (short: 3 exercises) |
| [`1.Forwarding Props/`](React%20Essentials%20-%20Deep%20Dive/1.Forwarding%20Props/) | A wrapper component using its own props and passing the rest on to the element inside | Done (6 exercises + 4 reps) |

## How each concept gets drilled

Three passes, in order. Each one tests something the previous one doesn't:

1. **Exercise file** — six exercises escalating in difficulty, with the logic blanked out as
   `TODO` and solutions collapsed at the bottom. Tests recall with scaffolding. Repeated as
   numbered sets (`-2`, `-3`) with fresh problems until I can do a set without help, thinning
   the starter code each round.
2. **Cold test** — no starter code. Just a data shape and a list of requirements. Tests
   whether I can generate the structure myself instead of adapting a template.
3. **Written exam** — predict-the-output, spot-the-bug, and explain-it questions. Tests
   understanding separately from syntax, because passing the first two by pattern-matching is
   possible and worth catching.

A concept is "done" when I clear the cold test and the exam without help — not when the
exercises run.

**Small concepts get less.** Fragments is one idea, so it got three unscaffolded exercises with
an explain-it question under each instead of the full loop. My answers are written under each
question for anyone reading.

**Scaffolding flatters.** During Dynamic lists I scored near-perfect on exercises that had the
data, names and surrounding JSX already on screen, then dropped to 1 of 7 writing the same
expressions from a blank file. Ten small blank-file reps
([`react-dynamic-lists-reps.md`](React%20Essentials/5.Dynamic%20lists/react-dynamic-lists-reps.md))
closed the gap. Since then: fewer scaffolded exercises, more blank-file tasks, earlier.

If the same mistake keeps costing rounds and it isn't really the concept's fault, it gets its
own targeted drill instead of another exercise set —
[`js-array-methods-drill.md`](React%20Essentials/3.State/js-array-methods-drill.md) is one,
twenty plain-JS problems on `.map()`/`.filter()`/spread with no React in the way.

## Running the code

Everything runs in [StackBlitz](https://stackblitz.com) — browser only, no local install.
Component code goes in `src/App.js`.

## A note on the AI in this repo

[`CLAUDE.md`](CLAUDE.md) configures Claude Code to **refuse to write or fix my code**. It
gives hints as shapes with blanks, points at the wrong line and explains why, and separates
concept mistakes from syntax slips — but I type every solution myself.

The point of the repo is understanding, not working code. Code that runs and can't be
explained is a failure here.
