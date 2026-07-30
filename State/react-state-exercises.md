# React State — Practice Exercises

Six exercises that gradually increase in difficulty. Each has a goal and starter code with the
logic blanked out as `TODO`. Solutions are collapsed at the bottom — try not to peek.

## Read this first

In the Events unit, nothing on screen ever changed. That was deliberate — events only *run your
code*, they don't redraw anything. **State is the missing half.** From here on, the screen
actually updates.

### The one loop to memorise

Your component is a function. React calls it, gets JSX, paints the screen. To change what's on
screen, React must **call your function again** — that second call is a **re-render**.

A normal variable can't help with that, because every time the function runs, the variable is
created fresh:

```js
function App() {
  let count = 0;   // this line runs again on EVERY render — always back to 0
}
```

So React needs something that can do two things a normal variable can't:

1. **Survive** across re-renders
2. **Trigger** a re-render when it changes

`useState` is exactly those two things:

```js
const [count, setCount] = useState(0);
//     │       └── the trigger: stores the new value AND asks React to re-run this function
//     └────────── the remembered value, as it is right now
```

The whole loop:

> click → setter runs → React re-runs your component function → `useState` hands back the **new**
> value → new JSX → screen updates

Everything in this file is a variation on that loop. When something confuses you, come back and
walk the six arrows.

### Three rules that prevent most state bugs

1. **`useState` returns an array of exactly two elements** — `[value, setterFunction]`. Not two
   different values. One value, plus the lever that changes it. Pull them out with array
   destructuring (square brackets, positional).
2. **Never assign to a state variable.** `count = 5` does nothing useful — no re-render, and
   React overwrites it on the next render anyway. Always go through the setter.
3. **The setter is not instant.** After `setCount(5)`, the variable `count` is *still the old
   value* for the rest of that function run. The new value only shows up on the **next** render.
   Exercise 4 makes you prove this.

### Setup

StackBlitz, `src/App.js`. Unlike the Udemy sandbox, you can import normally here:

```js
import { useState } from 'react';
```

Then call `useState(...)` directly — no `React.` prefix.

---

## Exercise 1: Your first counter

**Goal:** A number on screen starting at `0`, and a button that increases it by 1 each click.

```jsx
import { useState } from 'react';

function App() {
  const [value, setValue] = useState(0)

  function handleIncrement() {
    setValue(value + 1)
  }

  function minusIncrement(){
    if(value > 0) {
      setValue(value-1)
    }
  }

  function resetIncrement(){
    setValue(0)
  }

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <p>Count: {value}</p>
      <button onClick={handleIncrement}>+1</button>
      <button onClick={minusIncrement}>-1</button>
      <button onClick={resetIncrement}>Reset</button>
    </div>
  );
}

export default App;
```

**Two things to be careful about:**

- To increase the count you need to know what it currently is. You already have a variable
  holding that. What do you pass to the setter?
- `onClick={handleIncrement}` — passed, not called. Same rule as Events.

**Then extend it:** add a `-1` button and a `Reset` button. Reset puts it back to 0. Three
buttons, three handlers, one piece of state.

**Check yourself:** the number on screen must actually change. If it doesn't move, you assigned
instead of calling the setter.

---

## Exercise 2: Prove why state exists

**Goal:** Not to build something — to *see* the difference. This exercise is the reason the
whole concept exists, so don't skip it.

Two counters side by side. One uses a plain `let` variable, one uses state. Both buttons run
the same kind of code.

```jsx
import { useState } from 'react';

function App() {
  let plainCount = 0;
  const [count, setCount] = useState(0);


  function bumpPlain() {
    plainCount = plainCount + 1;
    console.log('plainCount is now:', plainCount);
  }

  function bumpState() {
    setCount(count + 1)
  }

  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <p>Plain variable: {plainCount}</p>
      <button onClick={bumpPlain}>Bump plain</button>

      <p>State: {count}</p>
      <button onClick={bumpState}>Bump state</button>
    </div>
  );
}

export default App;
```

**Do this with the console open.** Click "Bump plain" five times.

**Write down answers to these before moving on:**

1. What does the console say `plainCount` is after five clicks?
2. What does the *screen* say?
3. Those two disagree. Explain why in one sentence — what is React not doing?
4. Now click "Bump state" once. Watch the plain counter's number on screen at that exact moment.
   What happens to it, and why? (This one is the interesting question — think about what a
   re-render does to `let plainCount = 0;`.)

---

## Exercise 3: Boolean state and conditional output

**Goal:** A button that toggles between showing and hiding a paragraph of text.

- Start hidden.
- The button's own label changes too: `Show details` when hidden, `Hide details` when shown.

```jsx
import { useState } from 'react';

function App() {
    const [isVisible, setIsVisible] = useState(false);    // true or false to start?

    function handleToggle() {
      setIsVisible(!isVisible);                                 // flip it — one operator, no if
    }

    return (
      <div id="app">
        <h1>Exercise 3</h1>
        <button onClick={handleToggle}>{isVisible ? "Hide details" : "Show details"}</button>
        {isVisible && <p>Here are the secret details.</p>}
      </div>
    );

}

export default App;
```

**Hints:**

- To flip a boolean you don't need an `if`. There's a single JS operator that turns `true` into
  `false` and vice versa. What do you pass to the setter?
- For the label, a **ternary** is the tool: `condition ? valueIfTrue : valueIfFalse`. It's an
  expression, so it works inside JSX braces.
- For showing/hiding, `&&` works: `{condition && <p>...</p>}`. If the condition is false, React
  renders nothing.

**The rule this is testing:** *compute above the `return`, display inside it.* You can absolutely
work out the label as a plain variable above the `return` and then just drop `{buttonLabel}` in
the JSX. Try it both ways and decide which you find more readable.

---

## Exercise 4: The stale value trap

**Goal:** Break your Exercise 1 counter on purpose, understand why, then fix it properly.

Take a working counter and write this handler:

```jsx
function handleDoubleIncrement() {
  setCount(count + 1);
  setCount(count + 1);
}
```

**Predict before you run it.** Count is at 0. You click once. What number appears?

Now run it.

**If you were surprised, here's the reason:** `count` is a normal `const` for the duration of
this function run. `setCount` does not reach back and change it. Both lines read the *same* old
`count` and both compute the same result. The second call doesn't stack on the first — it
overwrites it.

**The fix.** React gives the setter a second form: instead of a value, pass it a **function**.
React calls that function for you and hands it the latest value:

```jsx
setCount((prev) => prev + 1);
```

Swap both lines to that form and run again. Now you get +2.

**Do all of this:**

1. Write the broken version and confirm the number it gives.
2. Fix it with the function form and confirm you get +2.
3. Answer in writing: `prev` — where does that value come from? Who calls that arrow function,
   and who supplies its argument? (You've met this exact pattern before — it's the same idea as
   the `event` parameter in Events. You never pass it yourself.)

---

## Exercise 5: State driven by an input

**Goal:** A text input where whatever you type appears live in a paragraph below it.

Then add a second input for a number, and show a computed result.

```jsx
import { useState } from 'react';

function App() {
  // TODO: state for the name text
  // TODO: state for the quantity number

  function handleNameChange(event) {
    // TODO
  }

  function handleQuantityChange(event) {
    // TODO
  }

  // TODO: compute the total here — quantity * 9.99, rounded to 2 decimals

  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <input type="text" onChange={handleNameChange} />
      <input type="number" onChange={handleQuantityChange} />

      <p>Hello, {/* TODO */}!</p>
      <p>You ordered {/* TODO */} items.</p>
      <p>Total: ${/* TODO */}</p>
    </div>
  );
}

export default App;
```

**This is where Events and State meet.** React passes the event to your handler; the typed text
is at `event.target.value`; you feed that to the setter; the setter re-renders; the paragraph
shows the new value.

**Watch out for two things:**

1. **The `$` belongs in the JSX as literal text, next to the braces — never inside the
   JavaScript.** State holds data (`9.99`), not display strings (`"$9.99"`).
2. `event.target.value` from an input is **always a string**, even from `type="number"`. `"3" * 9.99`
   happens to work because JS coerces it, but `"3" + 1` gives `"31"`. Convert it with `Number(...)`
   when you store it and you'll never think about this again.

**Then answer:** the total is *derived* from the quantity — it's just `quantity * 9.99`. Should
`total` be its own `useState`? Why or why not? (This is a real design question people get wrong
constantly. Think about what happens to a stored `total` if `quantity` changes.)

---

## Exercise 6: State that holds a list

**Goal:** A to-do list. One input, one Add button, and a `<ul>` of everything added so far.

```jsx
import { useState } from 'react';

function App() {
  // TODO: state for the list of items (what should it start as?)
  // TODO: state for the current input text

  function handleAdd() {
    // TODO: add the current text to the list
    // TODO: then clear the input text
  }

  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <input type="text" onChange={/* TODO */} />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {/* TODO: render one <li> per item */}
      </ul>
    </div>
  );
}

export default App;
```

**The new rule, and it's the one that bites everyone:**

**Never mutate state. Create a new value and pass that to the setter.**

```js
items.push(newItem);     // ✗ mutates the existing array — React sees the same array, no re-render
setItems([...items, newItem]);   // ✓ a brand-new array
```

React decides whether to re-render by asking "is this a different value than before?" `push`
changes the array's *contents* but it's still the same array — so React sees no change and does
nothing. Spread it into a new array instead.

**Also:** you're back in `.map()` territory from Props. Each `<li>` needs a `key`.

**Then extend it, in this order:**

1. Wrap it in a `<form>` so Enter works, and stop the page reloading. (Events, exercise 6.)
2. Show the count above the list: `3 items`. Does that need its own state?
3. Add a Delete button to each `<li>`. You'll need `.filter()` — and a way for each button to know
   *which* item it belongs to. That's the arrow-wrapper trick from Events.
4. Notice the input doesn't visually clear when you add an item, even though you reset the state.
   That's because the input isn't *controlled* yet — you're reading from it but never telling it
   what to show. Look up the `value` prop on `<input>` and wire it up.

---

<details>
<summary><strong>Solutions</strong> — only after you've attempted all six</summary>

### Exercise 1

```jsx
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  function handleIncrement() {
    setCount(count + 1);
  }

  function handleDecrement() {
    setCount(count - 1);
  }

  function handleReset() {
    setCount(0);
  }

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>+1</button>
      <button onClick={handleDecrement}>-1</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default App;
```

Three handlers, one piece of state. Nothing says a state value can only have one setter call.

### Exercise 2

```jsx
function bumpState() {
  setStateCount(stateCount + 1);
}
```

The answers:

1. The console says 1, 2, 3, 4, 5. The variable really is changing.
2. The screen still says 0.
3. Nothing told React to re-run `App()`. The JSX on screen is the output of the *first* call, and
   it has `0` baked into it. Changing a variable afterwards can't repaint anything.
4. When you bump the state counter, React re-runs `App()` — and the very first line of the
   function body is `let plainCount = 0;`. That runs again. All five of your clicks are wiped and
   the plain counter renders `0`. This is the clearest possible demonstration that a local
   variable cannot survive a render, which is precisely why `useState` exists.

### Exercise 3

```jsx
import { useState } from 'react';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  function handleToggle() {
    setIsVisible(!isVisible);
  }

  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <button onClick={handleToggle}>{isVisible ? 'Hide details' : 'Show details'}</button>
      {isVisible && <p>Here are the secret details.</p>}
    </div>
  );
}

export default App;
```

Or the compute-above version, which reads better once conditions get longer:

```jsx
const buttonLabel = isVisible ? 'Hide details' : 'Show details';
// ...
<button onClick={handleToggle}>{buttonLabel}</button>
```

Note the naming convention: boolean state usually reads as a yes/no question — `isVisible`,
`isOpen`, `hasError`.

### Exercise 4

The broken version gives **1**, not 2.

```jsx
function handleDoubleIncrement() {
  setCount(count + 1);   // count is 0 → schedules 1
  setCount(count + 1);   // count is STILL 0 → schedules 1 again
}
```

`count` is a `const` in this function run. `setCount` cannot reassign it — the new value only
appears on the next render, when `useState` returns it fresh. Both lines read 0.

The fix:

```jsx
function handleDoubleIncrement() {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
}
```

`prev` comes from React. You hand React a function; React calls it and passes in the most recent
value — including the one the previous line just scheduled. Exactly like `event`: you write the
parameter, React supplies the argument.

**Rule of thumb:** if the new value is calculated *from* the old value, use the function form.

### Exercise 5

```jsx
import { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleQuantityChange(event) {
    setQuantity(Number(event.target.value));
  }

  const total = (quantity * 9.99).toFixed(2);

  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <input type="text" onChange={handleNameChange} />
      <input type="number" onChange={handleQuantityChange} />

      <p>Hello, {name}!</p>
      <p>You ordered {quantity} items.</p>
      <p>Total: ${total}</p>
    </div>
  );
}

export default App;
```

**Should `total` be state? No.** It's derived — it can always be recalculated from `quantity`.
If you stored it in state you'd now have two sources of truth, and every place that changes
`quantity` would also have to remember to update `total`. Forget once and they disagree, with no
error to tell you.

The rule: **if you can calculate it from existing state or props, calculate it — don't store it.**
That's your "compute above the `return`" rule, and it's also the answer to a very common
interview question.

Note `total` is a plain `const` above the `return`, recalculated on every render. That's correct
and cheap.

### Exercise 6

```jsx
import { useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  function handleAdd(event) {
    event.preventDefault();
    setItems([...items, text]);
    setText('');
  }

  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <p>{items.length} items</p>
      <form onSubmit={handleAdd}>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        <button>Add</button>
      </form>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

With delete:

```jsx
function handleDelete(indexToRemove) {
  setItems(items.filter((item, index) => index !== indexToRemove));
}
```

Key points:

- `[...items, text]` builds a **new** array. `items.push(text)` would mutate the existing one and
  React would not re-render.
- `.filter()` returns a new array too — that's why it's the right tool for delete, and `.splice()`
  is the wrong one (it mutates).
- The count is `items.length` — derived, not state. Same rule as Exercise 5.
- `value={text}` is what makes the input **controlled**: state drives what's displayed, and the
  `onChange` feeds typing back into state. Without `value`, clearing the state doesn't clear the
  box, because nothing ever told the box what to show.
- `key={index}` is acceptable here but not ideal — if items get deleted or reordered, indexes
  shift and React can mismatch elements. A stable unique id per item is the real answer. Worth
  knowing now, worth doing properly later.

</details>
