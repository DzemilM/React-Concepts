# React Events — Practice Exercises, Set 2

Second pass at the same concepts as Set 1, on different scenarios. The point is **not** to
recall Set 1's answers — it's to rebuild the same ideas from scratch so they stick.

Same rules: logic blanked as `TODO`, solutions collapsed at the bottom, don't peek until you've
tried. Still no State — nothing changes on screen. Keep the console open.

**What each exercise re-drills** (so you know what you're practising):

1. wiring a handler — `onClick`, pass don't call
2. passing an argument — the arrow-as-delay-wrapper
3. the event object — `event.target.value`
4. `preventDefault` — stopping the browser's default
5. handlers as props — parent owns the behaviour
6. several different event types on one element

---

## Exercise 1: A counter that doesn't count (wiring)

**Goal:** Log the message `+1` every time the button is clicked. (It won't actually count —
counting needs State. Just log.)

Write a named function `add` and attach it.

```jsx
function add(){
  console.log("+1")
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <button onClick={add}>Add one</button>   
    </div>
  );
}

export default App;
```

**Trap check:** did you write `onClick={add}` or `onClick={add()}`? Say out loud why one is right.
i wrote add, not add(), because i want it called when clicked not immediately when loaded, im passing it as a value
---

## Exercise 2: A keypad (passing arguments)

**Goal:** Three buttons — `1`, `2`, `3`. One single handler `press(digit)` that logs
`Pressed: 1` (or 2, or 3).

```jsx
function press(digit) {
  console.log('Pressed: ' + digit);
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <button onClick={()=> press(1)}>1</button>
      <button onClick={()=> press(2)}>2</button>
      <button onClick={()=> press(3)}>3</button>
    </div>
  );
}

export default App;
```

**In writing:** why can't you just write `onClick={press(1)}`? What does the arrow buy you?

---

## Exercise 3: Live search box (the event object)

**Goal:** A text input. On every keystroke, log `Searching for: <whatever is typed>`.

```jsx
function handleSearch(event) {
  console.log(`Searching for: ${event.target.value}`)
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <input type="text" placeholder="Search..." onChange={handleSearch} />
    </div>
  );
}

export default App;
```

**Reminders, not answers:** the "user typed" attribute is `onChange`. React hands your function
the event. The typed text is at `event.target.value`. You never pass the event yourself — React
does.

**In writing:** where does the value for your parameter come from? You didn't write it anywhere.

---

## Exercise 4: A search form that keeps reloading (preventDefault)

**Goal:** A form with a search input and a `Go` button. On submit, log `Submitted!` — and the
page must **not** reload.

**Do this first, before touching the code:** run it exactly as written below (the handler is
already correct except for ONE missing line). Press Go. Watch the page — what happens, and what
happens to your console? Then figure out which line stops it.

```jsx
function handleSubmit(event) {
  event.preventDefault();
  console.log('Submitted!');
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 4</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button>Go</button>
      </form>
    </div>
  );
}

export default App;
```

**In writing, two questions:**
1. What did the page do before you added the missing line?
2. Why does `handleSubmit` need the `event` parameter? What breaks without it?

---

## Exercise 5: A reusable IconButton (handlers as props)

**Goal:** Build a `IconButton` component that takes two props: `icon` (a string like `"🗑️"`) and
`onPress` (a function). It renders a button showing the icon, and runs `onPress` when clicked.

`App` renders three of them: a trash button that logs `delete`, a star button that logs
`favourite`, and a bell button that logs `notify`.

```jsx
function IconButton({icon, onPress}) {
  return <button onClick={onPress}>{icon}</button>;
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <IconButton icon="trash" onPress={()=>console.log("delete")} />
      <IconButton icon="star" onPress={()=>console.log("favourite")} />
      <IconButton icon="bell" onPress={()=>console.log("notify")} />
    </div>
  );
}

export default App;
```

**Rules to hold yourself to:**
- `IconButton` must not contain any `console.log`. It knows nothing about what it does.
- The three messages (`delete`, `favourite`, `notify`) are typed out in `App`, not derived from
  the icon.

**In writing:** `onPress` is your invented prop. `onClick` is built-in. Which tag types get
built-in event props, and which get only the props you invent?

---

## Exercise 6: One box, many events (event types)

**Goal:** A single `<div>` that reacts to several different events. Log a distinct message for
each:

- mouse enters the div → `entered`
- mouse leaves the div → `left`
- the div is clicked → `clicked`
- the div is double-clicked → `double!`

```jsx
function App() {
  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <div
        style={{ width: 200, height: 200, background: 'lightblue' }}
        /* TODO: four event attributes, each with its own handler */
      >
        Interact with me
      </div>
    </div>
  );
}

export default App;
```

**Hints (attribute names only — you write the handlers):** `onMouseEnter`, `onMouseLeave`,
`onClick`, `onDoubleClick`.

**Notice while testing:** double-clicking fires `onClick` too (twice), *and* `onDoubleClick`.
Watch the order in the console. Events aren't exclusive — one action can trigger several.

---

<details>
<summary><strong>Solutions</strong> — only after you've attempted all six</summary>

### Exercise 1

```jsx
function add() {
  console.log('+1');
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <button onClick={add}>Add one</button>
    </div>
  );
}

export default App;
```

`onClick={add}` hands the function over. `onClick={add()}` would run it on load and wire
`undefined` to the button.

### Exercise 2

```jsx
function press(digit) {
  console.log('Pressed: ' + digit);
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <button onClick={() => press(1)}>1</button>
      <button onClick={() => press(2)}>2</button>
      <button onClick={() => press(3)}>3</button>
    </div>
  );
}

export default App;
```

`press(1)` runs immediately. `() => press(1)` is a new function that *waits*; when React runs it
on click, that's when `press(1)` fires. The arrow is a delay wrapper.

### Exercise 3

```jsx
function handleSearch(event) {
  console.log('Searching for: ' + event.target.value);
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <input type="text" placeholder="Search..." onChange={handleSearch} />
    </div>
  );
}

export default App;
```

You wrote `onChange={handleSearch}` — no parentheses, no event. React calls `handleSearch(event)`
for you on every keystroke and fills the parameter. `event.target` is the input; `.value` is its
current text.

### Exercise 4

```jsx
function handleSubmit(event) {
  event.preventDefault();
  console.log('Submitted!');
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 4</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button>Go</button>
      </form>
    </div>
  );
}

export default App;
```

Without `event.preventDefault()`, the browser submits the form the old-fashioned way and reloads
the page — which wipes the console, so `Submitted!` flashes and vanishes. `preventDefault` is a
method *on the event*, so the handler must accept the `event` parameter to call it.

### Exercise 5

```jsx
function IconButton({ icon, onPress }) {
  return <button onClick={onPress}>{icon}</button>;
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <IconButton icon="🗑️" onPress={() => console.log('delete')} />
      <IconButton icon="⭐" onPress={() => console.log('favourite')} />
      <IconButton icon="🔔" onPress={() => console.log('notify')} />
    </div>
  );
}

export default App;
```

`IconButton` forwards `onPress` to the real `onClick` and knows nothing else. The behaviour lives
in `App`. `onPress` is your invented prop — only lowercase HTML tags (`button`, `input`, `form`,
`div`) have built-in event props like `onClick`; your own capitalised components get only the
props you define.

### Exercise 6

```jsx
function App() {
  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <div
        style={{ width: 200, height: 200, background: 'lightblue' }}
        onMouseEnter={() => console.log('entered')}
        onMouseLeave={() => console.log('left')}
        onClick={() => console.log('clicked')}
        onDoubleClick={() => console.log('double!')}
      >
        Interact with me
      </div>
    </div>
  );
}

export default App;
```

A double-click logs `clicked`, `clicked`, then `double!` — the two clicks fire first, then the
double-click. One physical action, several events.

</details>