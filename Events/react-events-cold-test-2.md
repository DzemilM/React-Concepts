# Events — Cold Test 2

Fresh scenarios, same skills as Cold Test 1. New situations on purpose — you can't lean on
memory of the last set, you have to rebuild from the concept.

**Rules:**
- Look up *syntax* freely (how to spell `preventDefault`, template strings). Don't look up the
  *plan* — no peeking at the exercise or drill files for structure.
- Nothing changes on screen (that's State, later). All output goes to the **console** — keep it
  open.
- If you stall on "what do I do next" (not "how do I spell this"), note where. That note is the
  result.
- Do all three before opening solutions.

**Before you start, say the pass-vs-wrap rule out loud:** bare when you want the event or you're
handing a function down; wrap when you're injecting an argument of your own.

---

## Task 1 — Menu

Build a `Menu` component (no props) with three links styled as buttons: **Home**, **About**,
**Contact**.

- All three share **one single handler** — no three separate functions.
- Clicking logs `Navigating to: Home` (or About, or Contact).
- Nothing logs on page load.

`App` renders one `Menu`.

**Ask yourself:** where does the word come from, and what shape did each button need so the call
waited for the click instead of firing on load?

**My attempt:**

```jsx
function Menu(){
  function handler(where){
    console.log(`Navigating to: ${where}`)
  }

return(
  <ul>
  <li onClick={()=>handler("Home")}>Home</li>
  <li onClick={()=>handler("About")}>About</li>
  <li onClick={()=>handler("Contact")}>Contact</li>
  </ul>)
}

export default function App(){
  return(
    <Menu />
  )
}
```

---

## Task 2 — LoginForm

Build a `LoginForm` component: two inputs (a username field and a password field) and a `<form>`
with a **Sign in** button.

- Typing in the **username** field logs `User: <text>` on every keystroke.
- Typing in the **password** field logs `Pass length: <number>` — the *length* of what's typed,
  not the text itself. (Hint: a string has a `.length`.)
- Submitting the form logs `Signing in...` and must **not** reload the page.

`App` renders one `LoginForm`.

**Ask yourself:** the two typing handlers both receive the event — but they pull different things
off it. What does each one read? And which element carries the submit handler?

**My attempt:**

```jsx
function LoginForm() {
  function handleSubmit(event){
    event.preventDefault();
    console.log("Signing in...")
  }
  return(
    <form onSubmit={handleSubmit}>
      <input onChange={(event)=>console.log(`User: ${event.target.value}`)} type="text" />
      <input onChange={(event)=>console.log(`Pass length: ${event.target.value.length}`)} type="password" />
      <button>Sign in</button>
    </form>
  )
}

export default function App(){
  return(
    <LoginForm />
  )
}

```

---

## Task 3 — TagList (events meet props)

Build **two** components:

1. `Tag` — takes a `label` prop (a string) and an `onRemove` prop (a function). It renders a
   button showing the label, and when clicked, calls `onRemove` **with its own label**. `Tag`
   contains **no `console.log`** — it knows nothing about what removal does.

2. `TagList` — renders three `Tag`s with labels `"react"`, `"events"`, `"props"`. It defines what
   happens on removal: logging `Removing: <label>`. It passes that behaviour down to each `Tag`.

`App` renders one `TagList`.

**The hand-off (the hard part):** `Tag` doesn't know the message. `TagList` doesn't know which tag
was clicked until the tag tells it. So the label has to travel *up* from the tag to the list's
handler. Which end wraps to inject the label, and which end passes the function down bare?

**Ask yourself:** if you renamed `onRemove` to `onZap` everywhere, would anything break? Why or
why not?

**My attempt:**

```jsx
function Tag({label, onRemove}){
  return(
    <button onClick={()=>onRemove(label)}>{label}</button>
  )}

  function TagList(){
    function handleRemove(name){
      console.log(`Removing: ${name}`)
    }
    return(
      <div>
          <Tag label={"react"} onRemove={handleRemove} />
          <Tag label={"events"} onRemove={handleRemove} />
          <Tag label={"props"} onRemove={handleRemove} />
     </div>
    )
  }

  export default function App(){
    return(
      <TagList />
    )
  }
```

---

## After you finish

1. Did you open any other file for the **plan**, or only for syntax?
2. How many correction rounds did each task take, compared to Cold Test 1? (Task 3 took five last
   time — that's your benchmark.)
3. Task 3's label travels from child up to the parent's handler. Explain *how*, in one or two
   sentences.
4. Where, if anywhere, did you still hesitate on bare-vs-wrap?

---

<details>
<summary>Solutions — open only after finishing all three</summary>

### Task 1

```jsx
function Menu() {
  function navigate(page) {
    console.log('Navigating to: ' + page);
  }

  return (
    <div>
      <button onClick={() => navigate('Home')}>Home</button>
      <button onClick={() => navigate('About')}>About</button>
      <button onClick={() => navigate('Contact')}>Contact</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Task 1</h1>
      <Menu />
    </div>
  );
}

export default App;
```

One handler with a parameter; each button wraps to inject its own word. Wrap, because you're
supplying the argument.

### Task 2

```jsx
function LoginForm() {
  function handleUser(event) {
    console.log('User: ' + event.target.value);
  }

  function handlePass(event) {
    console.log('Pass length: ' + event.target.value.length);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('Signing in...');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleUser} />
      <input type="password" onChange={handlePass} />
      <button>Sign in</button>
    </form>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Task 2</h1>
      <LoginForm />
    </div>
  );
}

export default App;
```

All three handlers pass **bare** — each wants the event React provides. `handleUser` reads
`event.target.value`; `handlePass` reads `event.target.value.length`; `handleSubmit` calls
`event.preventDefault()`. Submit handler lives on the `<form>`, not the button.

### Task 3

```jsx
function Tag({ label, onRemove }) {
  return <button onClick={() => onRemove(label)}>{label}</button>;
}

function TagList() {
  function handleRemove(name) {
    console.log('Removing: ' + name);
  }

  return (
    <div>
      <Tag label="react" onRemove={handleRemove} />
      <Tag label="events" onRemove={handleRemove} />
      <Tag label="props" onRemove={handleRemove} />
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Task 3</h1>
      <TagList />
    </div>
  );
}

export default App;
```

The two ends:
- **`Tag`** (sending end) **wraps** — `() => onRemove(label)` — to inject its own label.
- **`TagList`** (handing down) **passes bare** — `onRemove={handleRemove}` — because `Tag` is the
  one that calls it with the label.

`handleRemove`'s parameter is `name`, and it logs `name` — the label the tag passed up. It must
**not** reference `label`, which lives only inside `Tag`.

`onRemove` is an invented prop — rename it to `onZap` on both sides and nothing breaks; only real
HTML tags (`<button>`) have built-in event props. If you rendered the three tags with a `.map()`
over `['react', 'events', 'props']` (each with a `key`), that's even better.

</details>