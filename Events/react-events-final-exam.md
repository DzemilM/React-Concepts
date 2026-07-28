# Events — Final Exam

No building, no StackBlitz. Read the code, answer in your own words, **write your answers down
before opening the key.** Guessing then reading teaches nothing — commit to an answer first, even
if you're unsure.

18 questions in 4 sections. Answers are collapsed at the bottom.

Reminder for this whole exam: **nothing updates the screen** (that's State, not Events). When a
question asks "what happens," it means *what logs to the console*, *what runs and when*, or *what
crashes* — not what the page shows.

---

## Section A — Predict the output

For each, say **what logs and when** (on load? on click? never?), or what breaks and why.

### A1

```jsx
function App() {
  function greet() {
    console.log('hi');
  }
  return <button onClick={greet()}>Go</button>;
}
```

When does `hi` log — on load, on click, both, or never? What ends up wired to the button?

Answer: logs on load

### A2

```jsx
function App() {
  function greet() {
    console.log('hi');
  }
  return <button onClick={greet}>Go</button>;
}
```

You click the button three times. How many times does `hi` log, and when?

Answer: logs 3 times, each time when i click the button

### A3

```jsx
function App() {
  function shout(word) {
    console.log(word + '!');
  }
  return <button onClick={() => shout('hey')}>Go</button>;
}
```

What logs when you click, and why didn't `shout` fire on load?

Answer: coz its wrapped by anonimous function which calls it when clicked it logs "hey!"

### A4

```jsx
function App() {
  function handleType(event) {
    console.log(event.target.value);
  }
  return <input onChange={handleType} />;
}
```

You type `hi` (two keystrokes). What logs, and how many lines appear? Where did `event` come from
— you never passed it?

Answer:it logs whetever i type, event is built in so to say, u dont need to pass arguments
i call handleType and hand it whatevers in input
### A5

```jsx
function App() {
  function submit() {
    console.log('sent');
  }
  return (
    <form onSubmit={submit}>
      <button>Send</button>
    </form>
  );
}
```

You press Send. `sent` logs — then what happens to the page, and what does that do to the console?

Answer:page reloads and console clears, we need preventDefault to prevent it 

---

## Section B — Spot the bug

Each snippet is broken or does the wrong thing. Say **what's wrong, why, and how to fix it.**

### B1

```jsx
function App() {
  function pick(colour) {
    console.log(colour);
  }
  return <button onClick={pick}>Red</button>;   // meant to log "red"
}
```
pick is wrong, it should be onClick={()=>pick("red")}, its wrong because pick needs an argument
### B2

```jsx
function App() {
  function handleSubmit(event) {
    event.preventDefault();
    console.log('ok');
  }
  return (
    <form onSubmit={() => handleSubmit()}>
      <button>Go</button>
    </form>
  );
}
```
it should just be handleSubmit without () next to it and without anonymous function because event is passed by React

### B3

```jsx
function Button({ onAction }) {
  return <button onClick={onAction}>Click</button>;
}

function App() {
  return <Button onClick={() => console.log('done')} />;
}
```
it should be onAction in App coz its the prop we called it in Button
### B4

```jsx
function App() {
  function handleClick(event) {
    console.log(event.target.value);
  }
  return <button onClick={handleClick}>Where</button>;   // wants the button's text
}
```
if u want text it should be event.target.value.text

### B5

```jsx
function StarButton({ value, onRate }) {
  return <button onClick={() => onRate(value)}>{value}</button>;
}

function RatingRow() {
  function handleRate(stars) {
    console.log(`Rated: ${value}`);
  }
  return (
    <div>
      <StarButton value={5} onRate={handleRate} />
    </div>
  );
}
```
in handleRate it should be Rated: stars not value coz value is in scope of StarButton, RatingRow doesnt see it
---

## Section C — Explain it

Short answers, your own words.

### C1
Why does `onClick={fn}` work but `onClick={fn()}` doesn't? Say what each one hands to the button.
fn hands function to the button as a value, fn() calls it immediately when loaded
### C2
When do you write `onClick={() => fn(x)}` (with the arrow) instead of `onClick={fn}` (bare)?
Give the one-line rule.
when i need to pass a function with arguments then i do it with arrow function, when my function has no arguments i pass it without arrows as a value
### C3
You never write `handleClick(event)` yourself anywhere, yet `event` has a value inside your
handler. Who puts it there, and when?
React puts it when i do something (click, hover, whatever, thats the event)
### C4
`onClick` is built-in but `onRate` (in the StarButton exercise) is not. What's the difference
between the two, and which kinds of tags get built-in event props?
onClick is builting used to build button on StarRate, and as onClick we put the onRate function, so in other prop i type onRate becuase thats onClick
### C5
What does `event.preventDefault()` stop, and why does a form need it in React?
it stops page from reloading and thats why form needs it, so if i submit i dont load and lose everything
---

## Section D — The hand-off

One question, because it's the one that took you the most reps.

### D1

In the `StarButton` / `RatingRow` pattern:

- Which component **wraps** its handler in an arrow, and which passes it **bare**? Say why each.
- The number the user clicked has to get from the button to the parent's handler. Trace the path
  in one or two sentences — where does the value start, and how does it arrive at the handler's
  parameter?
StarButton wraps its handler in an arrow and RatingRow passes it bare, StarButton does it like  that coz we are building the function and giving it our value, RatingRow i just handle it bare function coz its on the StarButton prop WHICH Wraps that in itself, i dont know how to explain
---

<details>
<summary>Answer key — open only after you've written all 18 down</summary>

### Section A

- **A1** — `hi` logs **once, on load** (`greet()` runs during render), and its return value
  `undefined` gets wired to the button — so clicking does nothing. The `()` is the bug.
- **A2** — three clicks → `hi` logs **three times, one per click**. Nothing on load. `greet` is
  passed bare, so React runs it each time the button is clicked.
- **A3** — click logs `hey!`. `shout` didn't fire on load because it's *inside* an arrow
  function; defining the arrow doesn't run its body — React only runs the arrow on click, and
  that's when `shout('hey')` fires.
- **A4** — typing `hi` logs `h` then `hi` — **two lines**, one per keystroke (`onChange` fires
  every keystroke, and `.value` is the whole current text each time). `event` came from React —
  it calls `handleType(event)` for you; you never pass it.
- **A5** — `sent` logs, then the browser's default form submit **reloads the page**, which wipes
  the console (so `sent` flashes and vanishes). Missing `event.preventDefault()`.

### Section B

- **B1** — `pick` is passed **bare**, so it receives the *event* as `colour`, not `"red"`. It'd
  log the event object. Fix: `onClick={() => pick('red')}` — wrap to inject the string.
- **B2** — the empty wrapper `() => handleSubmit()` **swallows the event**: `handleSubmit` gets
  `undefined`, so `event.preventDefault()` crashes on click. Fix: pass bare `onSubmit={handleSubmit}`.
- **B3** — name mismatch. `Button` reads `onAction`, but `App` passes `onClick`. `Button` isn't a
  real HTML tag, so `onClick` isn't built-in — it's just an unused prop. `onAction` arrives
  `undefined` → the inner button gets `onClick={undefined}` → nothing happens. Fix: pass
  `onAction={() => console.log('done')}`.
- **B4** — a `<button>` has no `.value` (that's for inputs); `event.target.value` is `undefined`.
  To read the button's text, use `event.target.textContent`.
- **B5** — scope bug. `handleRate`'s parameter is `stars`, but it logs `${value}` — and `value`
  doesn't exist in `RatingRow` (it's a prop inside `StarButton`). Fix: log `${stars}`.

### Section C

- **C1** — `onClick={fn}` hands the button **the function itself**, to run later on click.
  `onClick={fn()}` **runs `fn` now** (on render) and hands the button its *return value* — usually
  `undefined` — so nothing is wired for the click.
- **C2** — wrap when you need to call `fn` with **an argument of your own** (a word, a number).
  Pass bare when you just want the event React provides (or you're forwarding a function down).
  One-liner: *"Am I feeding the function a value of my own? Yes → wrap. No → bare."*
- **C3** — **React** puts it there. When the event fires, React calls your handler and passes the
  event object as the first argument. You only named the parameter so you'd have a handle on it.
- **C4** — `onClick` is a built-in event prop that React wires to a real DOM event — only
  **lowercase HTML tags** (`button`, `input`, `form`, `div`) have them. `onRate` is just a prop
  name you invented; your own **capitalised** components have no built-in props, only the ones you
  define. Rename `onRate` freely and nothing breaks.
- **C5** — it stops the browser's built-in default for that event. For a form, the default is to
  submit to a URL and **reload the page**; in React you handle everything in JS, so you call
  `preventDefault()` to stop the reload (which would otherwise wipe your state and console).

### Section D

- **D1** — **`StarButton` wraps** — `() => onRate(value)` — because it's injecting its own
  `value` as the argument. **`RatingRow` passes bare** — `onRate={handleRate}` — because it's just
  handing the function down; `StarButton` is the one that calls it. Path: the value starts as
  `StarButton`'s `value` prop → on click, `StarButton` calls `onRate(value)` → that runs
  `handleRate` with the value → it lands in `handleRate`'s `stars` parameter. The value rides *up*
  from child to parent through the call.

</details>

---

## After you finish

Score yourself honestly per section:

- **Section A + B (predict + debug)** — these are the real test. On the Props exam you went 5/5
  on debugging; that's the bar. If you miss ones here, note whether it was a *concept* miss or a
  careless read.
- **Section C (explain)** — if you can't say it in words, you don't fully own it, even if your
  code works.
- **Section D** — this is the pattern that took you the most reps. Getting it right *in writing*,
  with no code to lean on, is the proof it's finally yours.

If A, B, and D come out clean, Events is done — write it up in CLAUDE.md like Props.
