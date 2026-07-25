# React Events — Practice Exercises

Six exercises that gradually increase in difficulty. Each has a goal and starter code with the
logic blanked out as `TODO`. Solutions are collapsed at the bottom — try not to peek.

## Read this first

**Nothing on the screen will change in these exercises.** That is not a bug and it is not you
doing it wrong.

Making the page update when something changes is the *State* concept, which comes next. Events
on their own only run your code — they don't redraw anything. So here we observe results with
`console.log()` and watch the browser console, not the page.

Do all six with the console open.

---

## Exercise 1: The wiring (basics)

**Goal:** Make the button print `Button was clicked!` to the console when pressed.

Write a function called `handleClick` that logs that message, and attach it to the button.

```jsx
// TODO: write handleClick here
function handleClick(){
  console.log(`Button was clicked!`)
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default App;
```

**Check yourself:** click the button five times. The message should appear five times — not once
when the page loads.

---

## Exercise 2: Inline handlers, and the trap

**Goal:** Two buttons, no separate named function — write the handler directly in the JSX.

- The **Greet** button logs `Hello!`
- The **Farewell** button logs `Goodbye!`

```jsx
function App() {
  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <button onClick={console.log("Hello!")}>Greet</button>
      <button onClick={()=> console.log("Goodbye!")}>Farewell</button>
    </div>
  );
}

export default App;
```

**Then break it on purpose.** Change one of them so the function is *called* instead of passed.
Reload. What appears in the console before you touch anything, and what happens when you then
click? Write down what you saw — this is the mistake you'll make in real code.

---

## Exercise 3: Passing an argument to a handler

**Goal:** Three buttons — `Small`, `Medium`, `Large` — all using **one single** handler function.

`chooseSize` takes a `size` parameter and logs `You picked: Small` (or Medium, or Large).

```jsx
function chooseSize(size) {
  console.log('You picked: ' + size);
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <button onClick={() => chooseSize("Small")}>Small</button>
      <button onClick={() => chooseSize("Medium")}>Medium</button>
      <button onClick={() => chooseSize("Large")}>Large</button>
    </div>
  );
}

export default App;
```

**The whole difficulty of this exercise is in one question:** `onClick` needs a function handed
to it, but you need to supply an argument. Writing `chooseSize('Small')` calls it immediately —
you proved that in Exercise 2. So how do you hand over a function that, *when someone later runs
it*, calls `chooseSize` with the right size?

Shape, if you're stuck:

```jsx
onClick={() => ______}
```

---

## Exercise 4: The event object

**Goal:** React hands your event handler an argument automatically. Look at it.

- The text input logs whatever is currently typed in it, on every keystroke.
- The button logs the text of the button itself (`Press me`) — read from the event, not typed in
  by you.

```jsx
function handleTyping(event) {
  console.log(event.target.value)
}

function handleClick(event) {
  console.log(event.target.textContent)
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 4</h1>
      <input type="text" onChange={handleTyping} />
      <button onClick={handleClick}>Press me</button>
    </div>
  );
}

export default App;
```

**Hints:** the attribute for "the user typed something" is `onChange`. The parameter is
conventionally named `event` or `e`. The element the event happened on is `event.target`. An
input's typed text is on `.value`; an element's text is on `.textContent`.

Before writing anything, do this: log the *whole* `event` object and expand it in the console.
See what's actually in there.

---

## Exercise 5: Handlers as props

**Goal:** This is where events meet the Props concept you already drilled.

Build a reusable `Button` component that takes a `label` prop and an `onAction` prop. `Button`
renders a `<button>` with that label, and when clicked, runs whatever function was passed as
`onAction`.

`App` renders two of them: one that logs `Saved!` and one that logs `Deleted!`.

```jsx
function Button({label, onAction}) {
  return (
    <button onClick={onAction}>{label}</button>

  );
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <Button label="Save" onAction={()=>console.log("Saved!")} />
      <Button label="Delete" onAction={()=>console.log("Deleted!")} />
    </div>
  );
}

export default App;
```

**The thing to notice:** `Button` has no idea what happens when it's clicked. It just calls
whatever it was given. That's how every real React component works — the child owns the *what
it looks like*, the parent owns the *what it does*.

**Question to answer in writing:** is `onAction` a special React feature, or just an ordinary
prop that happens to hold a function? What would break if you renamed it to `bananas`?

---

## Exercise 6: Forms, and stopping the browser

**Goal:** A form with one input and a Submit button.

- On submit, log `Form submitted`.
- The page must **not** reload.
- Also log `mouse is over the form` when the pointer enters the `<form>` element.

```jsx
function handleSubmit(event) {
  event.preventDefault();
  console.log("Form submitted");     // what does submitting log?
}

function handleMouseEnter() {
  console.log("mouse is over the form");     // what does hovering log?
}


function App() {
  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <form onSubmit={handleSubmit} onMouseEnter={handleMouseEnter}>
        <input type="text" />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
```

**Do this first, before writing any code:** run it exactly as given and press Submit. Watch the
page. Something happens that has nothing to do with React — the browser has its own built-in
behaviour for forms, and it will wipe out your console. Find out what it is before you stop it.

**Hints:** the event attribute is `onSubmit`, on the `<form>` — not on the button. The method
that cancels the browser's default behaviour is on the event object, and is called
`preventDefault()`. The pointer-enters attribute is `onMouseEnter`.

---

<details>
<summary><strong>Solutions</strong> — only after you've attempted all six</summary>

### Exercise 1

```jsx
function handleClick() {
  console.log('Button was clicked!');
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default App;
```

### Exercise 2

```jsx
function App() {
  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <button onClick={() => console.log('Hello!')}>Greet</button>
      <button onClick={() => console.log('Goodbye!')}>Farewell</button>
    </div>
  );
}

export default App;
```

The broken version, `onClick={console.log('Hello!')}`, logs `Hello!` on page load (twice, thanks
to StrictMode) and then does nothing on click — because `console.log(...)` runs immediately and
its return value, `undefined`, is what gets attached to the button.

### Exercise 3

```jsx
function chooseSize(size) {
  console.log('You picked: ' + size);
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <button onClick={() => chooseSize('Small')}>Small</button>
      <button onClick={() => chooseSize('Medium')}>Medium</button>
      <button onClick={() => chooseSize('Large')}>Large</button>
    </div>
  );
}

export default App;
```

The arrow function is the wrapper. You hand `onClick` a brand-new function that takes no
arguments; when React later runs it, *that* is when `chooseSize('Small')` gets called.

### Exercise 4

```jsx
function handleTyping(event) {
  console.log(event.target.value);
}

function handleClick(event) {
  console.log(event.target.textContent);
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 4</h1>
      <input type="text" onChange={handleTyping} />
      <button onClick={handleClick}>Press me</button>
    </div>
  );
}

export default App;
```

You never pass `event` yourself — React passes it when it calls your handler. This is the same
argument that was silently landing in your parameter back in the Udemy exercise, when you wrote
`function clicked(user)`.

### Exercise 5

```jsx
function Button({ label, onAction }) {
  return <button onClick={onAction}>{label}</button>;
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <Button label="Save" onAction={() => console.log('Saved!')} />
      <Button label="Delete" onAction={() => console.log('Deleted!')} />
    </div>
  );
}

export default App;
```

`onAction` is an ordinary prop that happens to hold a function. Rename it to `bananas` on both
sides and everything still works. Only lowercase built-in elements (`<button>`, `<input>`) have
special attributes like `onClick`; your own components just get props. The `on...` naming is a
convention so other developers can tell at a glance that a prop is a callback.

### Exercise 6

```jsx
function handleSubmit(event) {
  event.preventDefault();
  console.log('Form submitted');
}

function App() {
  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <form onSubmit={handleSubmit} onMouseEnter={() => console.log('mouse is over the form')}>
        <input type="text" />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
```

Without `preventDefault()`, the browser does what it has done since 1995: submits the form to a
URL and reloads the page. The reload wipes the console, which is why your log appears to vanish.
A `<button>` inside a `<form>` submits it by default — you didn't have to add `type="submit"`.

</details>