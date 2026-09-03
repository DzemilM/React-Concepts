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
- **State (single component) — done** (2026-08-07). `useState` returning `[value, setter]`, the
  render loop (setter → re-render → `useState` returns the new value), initial value used once
  only, never assigning to state, the stale-value trap and `setX(prev => ...)`, controlled inputs
  (`value` + `onChange` are a pair), array state and the never-mutate rule, and — the big one —
  telling **state** from **derived** from **constant**. Confirmed via three exercise sets, a
  plain-JS array-methods drill, a three-task cold test, and a 20-question exam (5/5 on the
  classify section, which was the weakest thing at the start).
  **Not yet covered:** state shared between components (lifting state up), and objects / arrays of
  objects in state. Waiting for the Udemy course's deep-dive section rather than pre-drilling them.
- **Conditional content — done** (2026-08-22). The four forms and when each fits:
  `{cond ? <A/> : <B/>}`, `{cond ? <A/> : null}`, `{cond && <A/>}`, and a variable built with
  `if`/`else if`/`else` above the `return` for three or more outcomes. The idea underneath all of
  them: **JSX is a value**, so choosing between two pieces of JSX is plain JavaScript, not a React
  feature. What React draws for each value — nothing for `null`, `undefined`, `false` or `''`, but
  a visible `0` for zero — and the `&&` rule that explains it: **`&&` returns an operand, never a
  boolean** (falsy left → the left operand unchanged, truthy left → the right one), which is why a
  raw number on the left of `&&` paints a stray `0`. Also conditional **attributes**
  (`className`, `disabled`) as well as conditional elements, Fragments (`<>...</>`) to group two
  elements into one value, and the fact that conditional rendering **removes the element from the
  DOM** rather than hiding it. Confirmed via the Udemy warning-box exercise, a five-exercise set,
  and a 22-question exam.
- **Dynamic lists — done** (2026-09-03). `.map()` turning an array of data into an array of JSX,
  and the idea underneath it: **React renders an array of values**, so this is plain JavaScript
  again — `map` returns an array whatever the callback returns, numbers or elements alike. Keys:
  what React does with them (matches elements from the previous render against the current ones),
  the three rules (unique among siblings, stable, from the data), where they go (on whatever the
  callback **returns** — `<Todo />` in the parent, not the `<li>` inside it), and the fact that
  `key` is **not a prop** — React consumes it, so `props.key` is `undefined`. Index for *position*
  versus id for *identity*. `filter` then `map`, an empty state that removes the `<ul>` instead of
  leaving it empty, `reduce` for a total computed outside the loop, nested maps with a key at each
  level, and `.sort()` — the only one of these that **mutates**, so it needs `[...arr]` first while
  `map` and `filter` never do. Confirmed via the Udemy todo exercise, a six-exercise set, a
  three-task cold test, a plain-JS binding drill, and ten blank-file reps (10/10 first try, one bug
  found and fixed unaided).
  **The format lesson, which matters more than the unit:** scaffolded exercises were flattering me.
  With the data, parameter names and surrounding JSX already on screen I scored near-perfect; the
  moment the scaffold came off I dropped to 1/7 at writing expressions from English. Ten small
  blank-file reps closed that in one sitting. Next unit: fewer scaffolded exercises, more blank-file
  tasks, earlier.
  **Loose end:** the exam's explain-it section was done tired (3½/8) and never re-run rested. The
  code is the evidence, so I left it. The exam itself was badly weighted — 13 of 22 questions were
  about what specific error messages JavaScript produces, which is a different subject from dynamic
  lists. Exams should test the unit.

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
  When a question has two parts, answer both. **Habit: count the verbs in the question before
  answering — the word "and" is where the second half hides.**
- **Fixing only half the list.** The same pattern applied to code review, and during State it was
  my single biggest time cost — given four numbered fixes I'd apply two or three and paste back.
  One typo survived three rounds that way. **Habit: reply against the numbers and tick each one
  off.**
- **Renames leave orphans.** Every rename during State left the old name somewhere — `celsius`
  after switching to `temp`, `playList` vs `playlist` vs `setPlaylist`. **Habit: after renaming
  anything, search the file for the old name.**
- **Array vs. item vs. field.** The biggest one from Dynamic lists — seven instances in a day:
  `task === false` (the object, not its field), `TASKS.done` (the array, not an item),
  `player.index` (a standalone parameter, not a property), `[...cat]` (the object, not the array
  inside it). Three checks before typing a `.`: is this the array or one item? the object or the
  field? a parameter or a property? Underneath it was one wrong belief, now fixed: I thought an
  array *forwarded* field access to its contents — that `shelves.label` collects the labels. It
  doesn't. An array owns `length`, `map`, `filter`, `sort` and nothing else.

Call these out when you see them, but name them as syntax slips, not concept failures.

**One more, and it's not a weakness to fix by drilling — it's how to coach me.** My
understanding usually runs ahead of my words: a vague answer ("event is built in") is normally
me reaching for wording, not missing the concept. Confirm the idea, hand me the precise sentence,
have me say it back — don't re-teach from scratch.

## Two rules I should have memorized

1. **React passes exactly one argument to a component: the props object.** That's why
   `function C(a, b)` fails and `function C({ a, b })` works.
2. **Compute above the `return`, display inside it.**
