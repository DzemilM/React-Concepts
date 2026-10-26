# Two-Way Binding — Spot the Bug

Four short components. Each one runs, but there's a bug in it. These cover three cases the
exercises and cold test never hit.

## Rules

- Read the code and the symptom **before** running anything. Write your guess first.
- Then paste it into StackBlitz (`src/App.js`) and check whether you were right.
- For each task, answer **all three** questions: which line, why it breaks, and the fixed
  component under `### My solution`. That's three parts, so count them before you answer.

---

## Task 1 — Search box

```jsx
import { useState } from 'react';

export default function App() {
  const [query, setQuery] = useState('');

  function handleQuery(event) {
    setQuery(event.target.value);
  }

  return (
    <>
      <input type="text" value={query} />
      <p>Searching for: {query}</p>
    </>
  );
}
```

**Symptom:** the user clicks into the box and types, but nothing appears. The console shows
a warning.

**Watch for:** a handler that's written but not wired is a name-discipline slip: the
function exists but nothing uses it.

1. Which line is the bug?
2. Why does typing do nothing? Say what React does with `value` on every render.
3. Fix it.

### My solution

```jsx
<input type="text" value={query} onChange={handleQuery} />
```

### My answer

The bug is the `<input>` line: it has `value` but no `onChange`. Without `onChange`, `query`
never changes from `''`. On every render `value={query}` sets the input back to `''`, so each
letter is wiped as soon as it's typed.

---

## Task 2 — Ticket order

```jsx
import { useState } from 'react';

export default function App() {
  const [tickets, setTickets] = useState(1);

  function handleTickets(event) {
    setTickets(event.target.value);
  }

  return (
    <>
      <input type="number" value={tickets} onChange={handleTickets} />
      <p>Tickets: {tickets}</p>
      <p>With a friend: {tickets + 1}</p>
      <p>Price: ${tickets * 20}</p>
    </>
  );
}
```

**Symptom:** on first load, `With a friend: 2` is correct. The user changes the box to `3`.
`Price` shows `$60`, which is correct, but `With a friend` shows `31`.

**Watch for:** what's in `tickets` *before* the user types versus *after*. Those are two
different types.

1. Which line causes it?
2. Why is `+ 1` wrong but `* 20` right? (Two parts.)
3. Fix it **where the value enters state**, not in the JSX.

### My solution

```jsx
function handleTickets(event) {
  setTickets(Number(event.target.value));
}
```

### My answer

The bug is `setTickets(event.target.value);`. `event.target.value` is always a string, even
on `type="number"`, so `tickets` starts as the number `1` and becomes the string `'3'` after
typing. `+` already means something for strings (joining), so `'3' + 1` gives `'31'`. `*` has
no meaning for text, so JavaScript converts `'3'` to a number first, and `'3' * 20` gives
`60`. It's right only by accident. Converting with `Number()` where the value enters state
means every later use of `tickets` gets a number.

---

## Task 3 — Terms checkbox

```jsx
import { useState } from 'react';

export default function App() {
  const [agreed, setAgreed] = useState(false);

  function handleAgreed(event) {
    setAgreed(event.target.value);
  }

  return (
    <>
      <label>
        <input type="checkbox" value={agreed} onChange={handleAgreed} />
        I accept the terms
      </label>
      <button disabled={!agreed}>Sign up</button>
    </>
  );
}
```

**Symptom:** the button starts disabled, which is right. The user ticks the box and the
button enables. Then they untick it, and the button **stays enabled**.

**Watch for:** what `event.target.value` actually is on a checkbox. Hint: it's a string,
and it's the same string every time.

1. Which **two** lines are wrong?
2. Why does the button never disable again? Trace it: what string lands in `agreed`, and
   what `!` does to it.
3. Fix it.

### My solution

```jsx
function handleAgreed(event) {
  setAgreed(event.target.checked);
}

<input type="checkbox" checked={agreed} onChange={handleAgreed} />
```

### My answer

The two wrong lines are `value={agreed}` and `event.target.value`. A checkbox's `value` is the
string `'on'` whether it's ticked or not, so both ticking and unticking store `'on'`. Non-empty
strings are always truthy, so `!'on'` is always `false`, the button gets `disabled={false}`, and
it stays enabled. A checkbox's true/false lives in `checked`: show it with `checked={agreed}`
and read it with `event.target.checked`.

(First attempt moved the handler to the button. That's wrong: the checkbox is what changes, and
the button only reads `agreed`.)

---

## Task 4 — Note editor

```jsx
import { useState } from 'react';

export default function App() {
  const [note, setNote] = useState('Remember to...');

  function handleNote(event) {
    setNote(event.target.value);
  }

  function clear() {
    setNote('');
  }

  return (
    <>
      <textarea onChange={handleNote}>{note}</textarea>
      <p>{note.length} characters</p>
      <button onClick={clear}>Clear</button>
    </>
  );
}
```

**Symptom:** typing works and the character count updates. Clicking `Clear` sets the count
to `0`, but the text stays in the textarea.

**Watch for:** this is the JS ↔ JSX boundary in a new place. Where does a controlled
textarea's text go: between the tags, or in an attribute?

1. Which line is the bug?
2. Why does the count clear but not the text? Say which one is reading state and which one
   isn't.
3. Fix it.

### My solution

```jsx
<textarea value={note} onChange={handleNote} />
```

### My answer

The bug is `<textarea onChange={handleNote}>{note}</textarea>`. In React, text between the
textarea tags only sets the starting text, so React reads it once, on the first render, and never
again. `Clear` does set `note` to `''`. The count reads `note` on every render, so it shows `0`,
but the textarea isn't reading `note` any more and keeps its own text. `value={note}` makes it
read state on every render.

---

<details>
<summary><strong>Answer key</strong>: open only after all four are done</summary>

### Task 1

`<input type="text" value={query} />` has no `onChange`. On every render React sets the
input to `query`, which is still `''`, so each keystroke is undone straight away. React warns
that a `value` without `onChange` makes the field read-only. Fix: `onChange={handleQuery}`.

### Task 2

`setTickets(event.target.value)`. `event.target.value` is **always a string**, even on
`type="number"`. Before typing, `tickets` is the number `1`. After typing it's the string
`'3'`. `+` with a string joins text (`'3' + 1` → `'31'`). `*` has no text meaning, so
JavaScript converts to a number (`'3' * 20` → `60`). That's why one is right only by
accident. Fix: `setTickets(Number(event.target.value))`.

### Task 3

`value={agreed}` should be `checked={agreed}`, and `event.target.value` should be
`event.target.checked`. A checkbox's `value` is the string `'on'` whether it's ticked or not,
so `agreed` becomes `'on'`, a non-empty string, which is truthy. `!'on'` is `false`, so the
button stays enabled forever. `checked` is the true/false a checkbox actually has.

### Task 4

`<textarea onChange={handleNote}>{note}</textarea>`. In React, a textarea's text goes in
`value`, not between the tags. Children only set the *starting* text, so the textarea isn't
controlled. `note.length` reads state, so it clears. The textarea isn't reading state, so it
keeps its own text. Fix: `<textarea value={note} onChange={handleNote} />`.

</details>
