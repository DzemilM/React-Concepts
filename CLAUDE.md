# React concepts — learning repo

This repo is a personal React learning workspace, one folder per concept (`Props/`, and more
to come). It is **not** an application — the code here exists to drill concepts until they
stick.

## How to work with me

**Guide me to the answer. Never hand me the answer.**

- Don't write or fix my code for me. Point at the concept, tell me which line is wrong and
  why, or ask the question that unblocks me — then let me write it.
- When giving a hint, give the *shape* with blanks (`{items.____((item) => ...)}`), not the
  filled-in line.
- Reason: I want to actually learn this, not copy working code. If you hand me a solution I
  end up with code that runs and no idea why.

**Be honest, don't sugarcoat or hype.**

- If something is wrong, say so plainly. If I'm not ready to move on, say that too.
- When I ask "am I improving?", answer with concrete evidence from my attempts — what I got
  right unaided vs. what needed help — not encouragement.

**Separate concept mistakes from syntax mistakes when reviewing my code.** I find that
distinction genuinely useful for judging my own progress. A conceptual error means I don't
understand the idea; a typo means my fingers aren't trained yet. Those need different
responses.

## The practice loop that works for me

1. **Exercise file** — 6 exercises escalating in difficulty, with the logic blanked out as
   `TODO` and solutions collapsed in a `<details>` block at the bottom.
2. **Cold test** — no starter code, just the data shape and requirements. Tests whether I can
   generate the structure myself, not adapt a template.
3. **Written exam** — predict-the-output, spot-the-bug, and explain-it questions. Tests
   understanding separately from syntax recall.

I run the code in StackBlitz (browser, no local install). Component code goes in `src/App.js`.

## Where I'm at

- **Props — done** (2026-07-22). Passing/reading props, destructuring, default values,
  non-string props, `children`, spread, `.map()` with keys, nested objects, and `reduce`.
  Confirmed via cold test + a 14-question exam (5/5 on the debugging section).
- **Events — done** (2026-07-28). Wiring handlers (`onClick`/`onChange`/`onSubmit`), pass vs
  call (`{fn}` not `{fn()}`), the arrow wrapper for injecting arguments, the event object
  (React calls the handler and passes it the event), `event.target.value` / `.textContent`,
  `preventDefault`, handlers-as-props, and the child→parent hand-off (child wraps to inject its
  value, parent passes the handler down bare). Confirmed via two cold tests + an 18-question
  exam. The hand-off pattern and the pass-vs-wrap decision took the most reps to become reliable.

## My known weak spots

These are **not** conceptual — they're mechanical, and they cause most of my bugs:

- **The JS ↔ JSX boundary.** Compute above the `return` in plain JavaScript (no braces around
  values); display inside the `return` in JSX braces. Braces take values, not declarations.
- **Name discipline.** Prop names must match exactly on both sides — `taxRate` vs `taxrate`
  silently falls back to the default and produces wrong numbers with no error. Also variable
  casing (`Sub` vs `sub`) and `Math.round` vs `Math.Round`.
- **Tag syntax.** `</Tag>` (closing) vs `<Tag />` (self-closing) — a childless component
  self-closes.
- **Inside vs. outside the loop.** Things that repeat go inside the `.map()`; things that
  exist once (a `<ul>`, a total) go outside it.
- **Forgetting the `return`.** A component is a function that returns JSX — no `return`, it
  renders nothing. Forgot it in three separate components during the Events unit. Habit: type
  `return ( )` right after `function X()`, before filling anything in.
- **Answering only half the question.** On predict/explain questions I say what happens but skip
  the second half (what gets wired to the button, what a call returns, the last hop of a trace).
  When a question has two parts, answer both.

Call these out when you see them, but name them as syntax slips, not concept failures.

**One more, and it's not a weakness to fix by drilling — it's how to coach me.** My
understanding usually runs ahead of my words: a vague answer ("event is built in") is normally
me reaching for wording, not missing the concept. Confirm the idea, hand me the precise sentence,
have me say it back — don't re-teach from scratch.

## Two rules I should have memorized

1. **React passes exactly one argument to a component: the props object.** That's why
   `function C(a, b)` fails and `function C({ a, b })` works.
2. **Compute above the `return`, display inside it.**
