# Events — Cold Test

No starter code. No shapes, no blanks. Just the data and what it must do. Write **every line**
yourself in a blank StackBlitz.

**Rules:**
- Look up *syntax* freely (how to spell `preventDefault`, template-string syntax, whatever).
  Don't look up the *plan* — don't open the exercise files to see the structure.
- Reminder: nothing changes on screen (that's State, later). All results go to the **console**.
  Keep it open.
- If you get stuck on "what do I do next" (not "how do I spell this"), that's the signal you
  need another rep — write down where it happened.
- Solutions are collapsed at the bottom. Open them **only after** you've finished all three.

---

## Task 1 — Toolbar

Build a `Toolbar` component (no props) with three buttons: **Cut**, **Copy**, **Paste**.

- All three must share **one single handler function** — you do **not** write three separate
  functions.
- Clicking a button logs `Action: Cut` (or `Copy`, or `Paste`) to the console.
- Nothing should log when the page loads — only on click.

`App` renders one `Toolbar`.

**When you're done, ask yourself:** how does your one handler know *which* word to log? Where did
that word come from, and what had to wrap the call so it didn't fire on load?

**My attempt:**

```jsx
function Toolbar() {
  function handleAction(word) {
    console.log('Action: ' + word)
    }

  return (
    <div id="app">
      <button onClick={()=> handleAction("Cut")}>Cut</button>
      <button onClick={()=> handleAction("Copy")}>Copy</button>
      <button onClick={()=> handleAction("Paste")}>Paste</button>
    </div>
  )
}

function App() {
  return (
    <Toolbar />
  );
}

export default App;
```

---

## Task 2 — CommentForm

Build a `CommentForm` component: a text `<input>`, and a `<form>` with a **Post** button.

- As the user types in the input, log `Typing: <current text>` on every keystroke.
- When the form is submitted (Post button, or Enter in the field), log `Posted!`.
- The page must **not** reload when the form is submitted.

`App` renders one `CommentForm`.

**When you're done, ask yourself:** which element did you put the submit handler on — the button
or the form? Why does the submit handler need a parameter, but the typing handler's use of its
parameter is for something completely different?

**My attempt:**

```jsx

function CommentForm(){
  function submitted(event){
    event.preventDefault()
    console.log("Posted!")
  }

  function typing(event){
    console.log("Typing: " + event.target.value)
  }

  return (
    <form onSubmit={submitted}>
      <input type="text" onChange={typing} />
      <button type="submit">Post</button>
    </form>   
  )
}

function App() {
  return (
    <CommentForm />
  );
}

export default App;

```

---

## Task 3 — RatingRow (events meet props)

Build **two** components:

1. `StarButton` — takes a `value` prop (a number 1–5) and an `onRate` prop (a function). It
   renders a button showing the number, and when clicked, calls `onRate` **with its own value**.
   `StarButton` must contain **no `console.log`** — it knows nothing about what happens when
   it's rated.

2. `RatingRow` — renders five `StarButton`s (values 1 through 5). It defines what happens on
   rating: logging `You rated: N stars`. It passes that behaviour down to each `StarButton`.

`App` renders one `RatingRow`.

**The hard part is the hand-off:** `StarButton` doesn't know the message. `RatingRow` doesn't
know which star was clicked until it's told. So the value has to travel *up* from the button to
the row's handler. Work out how the button passes its own `value` back to the function it was
given.

**When you're done, ask yourself:** is `onRate` a built-in React thing or a name you invented?
If you renamed it to `foo` everywhere, would anything break?

**My attempt:**

```jsx

function StarButton({value, onRate}){
  return(
    <button onClick={()=>onRate(value)}>{value}</button>
  )
}

function RatingRow(){
  function handleRate(stars){
    console.log(`You rated: ${stars} stars`)
  }
  return (
    <div>
      <StarButton value={1} onRate={handleRate} />
      <StarButton value={2} onRate={handleRate} />
      <StarButton value={3} onRate={handleRate} />
      <StarButton value={4} onRate={handleRate} />
      <StarButton value={5} onRate={handleRate} />
    </div>
  )
}

function App() {
  return (
    <RatingRow />
  );
}

export default App;
```

---

## After you finish

1. Did you ever open the exercise files for the **plan**, or only for syntax?
2. Which of the three cost you the most "what do I do next" time?
3. Task 3 asked a value to travel from the child back up to the parent's function. Could you now
   explain to someone else *how* that works — in one or two sentences?

---

<details>
<summary>Solutions — open only after finishing all three</summary>

### Task 1

```jsx
function Toolbar() {
  function handleAction(name) {
    console.log('Action: ' + name);
  }

  return (
    <div>
      <button onClick={() => handleAction('Cut')}>Cut</button>
      <button onClick={() => handleAction('Copy')}>Copy</button>
      <button onClick={() => handleAction('Paste')}>Paste</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Task 1</h1>
      <Toolbar />
    </div>
  );
}

export default App;
```

One handler, three arrow wrappers. Each arrow supplies a different word and delays the call until
the click. Passing `handleAction('Cut')` directly would fire all three on load.

### Task 2

```jsx
function CommentForm() {
  function handleTyping(event) {
    console.log('Typing: ' + event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Posted!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleTyping} />
      <button>Post</button>
    </form>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Task 2</h1>
      <CommentForm />
    </div>
  );
}

export default App;
```

The submit handler goes on the `<form>`, not the button — a button inside a form submits it. Both
handlers take `event`, but for different reasons: `handleTyping` *reads* from it
(`event.target.value`), while `handleSubmit` *calls a method on it* (`event.preventDefault()`) to
stop the reload.

### Task 3

```jsx
function StarButton({ value, onRate }) {
  return <button onClick={() => onRate(value)}>{value}</button>;
}

function RatingRow() {
  function handleRate(stars) {
    console.log('You rated: ' + stars + ' stars');
  }

  return (
    <div>
      <StarButton value={1} onRate={handleRate} />
      <StarButton value={2} onRate={handleRate} />
      <StarButton value={3} onRate={handleRate} />
      <StarButton value={4} onRate={handleRate} />
      <StarButton value={5} onRate={handleRate} />
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Task 3</h1>
      <RatingRow />
    </div>
  );
}

export default App;
```

The hand-off: `RatingRow` passes `handleRate` down as `onRate`, but doesn't say which star. Each
`StarButton` calls `onRate(value)` — plugging *its own* value into the function it was handed. So
the value travels up: button knows its number, row knows what to do with it. `onRate` is an
invented prop — rename it to `foo` on both sides and nothing breaks; only the real `<button>`'s
`onClick` is built-in.

If you tried to render the five buttons with a `.map()` over `[1, 2, 3, 4, 5]` instead of writing
them out — that's even better, and it's correct as long as each has a `key`.

</details>