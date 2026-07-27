# Events — Pass-vs-Wrap Drill (+ scope)

This is not a build-a-component drill. It targets the **one decision** that cost you every task
in the cold test:

> When I give a function to `onClick`/`onChange`/`onSubmit`, do I pass it **bare** (`fn`) or
> **wrap** it (`() => fn(arg)`)?

Get this reflexive and the rest of Events falls into place.

## The rule (memorise this before starting)

- **Pass bare — `onClick={fn}`** — when you want React to run `fn` and hand it the **event**.
  You're not supplying any argument of your own. (typing handlers, submit handlers, forwarding a
  prop down)
- **Wrap — `onClick={() => fn(arg)}`** — when you need to call `fn` with **an argument you
  choose** (a word, a number, an id). The wrapper delays the call *and* lets you inject the
  argument.

**One-line test:** *"Am I feeding the function a value of my own?"*
Yes → wrap. No → bare.

Two traps that are always wrong:
- `onClick={fn()}` — runs on render, wires `undefined`. (calling, not passing)
- `onClick={() => fn()}` when `fn` needed the event — the wrapper swallows the event.

---

## Part A — Bare or wrap? (say it out loud, then check)

For each, decide what goes in the blank. Write the whole `onClick={...}` (or `onChange`/
`onSubmit`). Don't peek until you've committed to an answer for all ten.

**A1.** A handler `save` that logs `"saved"`. No argument needed.
```jsx
<button onClick={______}>Save</button>
```

**A2.** A handler `remove(id)` that deletes item `42`.
```jsx
<button onClick={______}>Delete</button>
```

**A3.** A typing handler `search(event)` that reads `event.target.value`.
```jsx
<input onChange={______} />
```

**A4.** A handler `pick(colour)` for a red button.
```jsx
<button onClick={______}>Red</button>
```

**A5.** A submit handler `submit(event)` that calls `event.preventDefault()`.
```jsx
<form onSubmit={______}>
```

**A6.** A component `Row` that received an `onDelete` prop and wants to forward it straight to a
real button (no argument added here).
```jsx
<button onClick={______}>x</button>
```

**A7.** A handler `greet(name)` for a button that should greet `"Sam"`.
```jsx
<button onClick={______}>Greet Sam</button>
```

**A8.** A handler `logClick(event)` that logs which element was clicked (`event.target`).
```jsx
<button onClick={______}>Where?</button>
```

**A9.** Inside a `StarButton({ value, onRate })`, the button must call `onRate` with its own
`value`.
```jsx
<button onClick={______}>{value}</button>
```

**A10.** Inside `App`, you hand `handleRate` down to `StarButton` as its `onRate` prop (you are
*giving* the function, not calling it here).
```jsx
<StarButton value={3} onRate={______} />
```

---

## Part B — Spot the bug

Each snippet has exactly one pass-vs-wrap mistake (or a "calling not passing" mistake). Name what
goes wrong **and when** (on load? on click? swallowed event?).

**B1.**
```jsx
<button onClick={remove(42)}>Delete</button>
```

**B2.**
```jsx
<form onSubmit={() => handleSubmit()}>   {/* handleSubmit needs event.preventDefault() */}
```

**B3.**
```jsx
<input onChange={() => search()} />      {/* search wants event.target.value */}
```

**B4.**
```jsx
<button onClick={() => save}>Save</button>   {/* save just logs "saved" */}
```

**B5.**
```jsx
<StarButton value={2} onRate={handleRate()} />
```

**B6.**
```jsx
<button onClick={pick}>Red</button>     {/* pick(colour) — should pass "red" */}
```

---

## Part C — Scope check (your other recurring slip)

No React here — just: **does this variable exist where it's being used?** Answer exists / does
not exist, and why.

**C1.**
```jsx
function Button({ label }) {
  return <button>{label}</button>;
}
function App() {
  return <p>{label}</p>;   // ← does `label` exist here?
}
```

**C2.**
```jsx
function RatingRow() {
  function handleRate(stars) {
    console.log(`You rated: ${value} stars`);   // ← does `value` exist here?
  }
  return <StarButton value={5} onRate={handleRate} />;
}
```

**C3.**
```jsx
function StarButton({ value, onRate }) {
  return <button onClick={() => onRate(value)}>{value}</button>;   // ← does `value` exist here?
}
```

**C4.** Why does `handleRate(stars)` log the right number when you write `${stars}`, but the
wrong thing (or undefined) when you write `${value}`? Answer in one sentence.

---

<details>
<summary>Solutions — after you've answered everything</summary>

### Part A

| # | Answer | Why |
|---|--------|-----|
| A1 | `{save}` | bare — no argument, no event needed |
| A2 | `{() => remove(42)}` | wrap — injecting the id `42` |
| A3 | `{search}` | bare — you want the event React provides |
| A4 | `{() => pick('red')}` | wrap — injecting the colour |
| A5 | `{submit}` | bare — you want the event (to call preventDefault) |
| A6 | `{onDelete}` | bare — forwarding the function untouched |
| A7 | `{() => greet('Sam')}` | wrap — injecting the name |
| A8 | `{logClick}` | bare — you want the event |
| A9 | `{() => onRate(value)}` | wrap — injecting `value` |
| A10 | `{handleRate}` | bare — handing the function down, not calling it |

Pattern to notice: **every "wrap" is a case where you typed an argument inside the parens.** Every
"bare" is a case where the only thing that should arrive is the event (or you're just forwarding).

### Part B

- **B1** — calling, not passing. `remove(42)` runs on **load**, deletes immediately, wires
  `undefined` to the button. Needs `() => remove(42)`.
- **B2** — the wrapper swallows the event. React passes the event to the arrow, but the arrow
  calls `handleSubmit()` with nothing → `event` is `undefined` inside → `preventDefault()`
  crashes on **click**. Needs bare `{handleSubmit}`.
- **B3** — same swallow. `search()` gets no event → `event.target.value` crashes. Needs bare
  `{search}`.
- **B4** — `() => save` **evaluates** `save` (the function object) and throws it away; it never
  calls it. Clicking does nothing. Needs `() => save()` — or just bare `{save}` (simpler, since
  no argument).
- **B5** — calling, not passing. `handleRate()` runs on **load**, logs `undefined`, wires
  `undefined`. Needs bare `{handleRate}` (the StarButton will call it with the value).
- **B6** — `pick` is passed bare, so it receives the **event** as `colour`, not `"red"`. Needs
  `() => pick('red')`.

### Part C

- **C1** — `label` does **not** exist in `App`. It's a parameter of `Button`; it lives only
  inside `Button`'s body. `App` has no `label` → `ReferenceError`.
- **C2** — `value` does **not** exist in `RatingRow`. `value` is a prop *inside* `StarButton`.
  `handleRate` should log `${stars}` — the parameter it actually receives.
- **C3** — `value` **does** exist here — it's destructured from this component's own props on the
  very first line. This is the one place `value` is legitimately in scope.
- **C4** — because `stars` is the parameter `handleRate` actually receives (the number the button
  passed up), while `value` was never defined in that function's scope.

</details>

---

## When you finish

If Part A came out clean without peeking, you've got the decision. If you missed any, the miss
tells you which direction you default wrong (over-wrapping or under-wrapping) — note it, then
re-run the cold test. Pass-vs-wrap reflexive is the thing that unlocks the rest.