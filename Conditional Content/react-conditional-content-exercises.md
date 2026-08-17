# React Conditional Content — Practice Exercises

Five exercises that gradually increase in difficulty. Each has a goal and starter code with the
logic blanked out as `TODO`. Solutions are collapsed at the bottom — try not to peek.

## Read this first

### The one idea underneath all of it

**JSX is a value.** Not special syntax, not a template — a value, like a number or a string.

```js
const greeting = <p>Hello</p>;   // this is legal. it's just a variable holding a value.
```

Once you accept that, conditional rendering stops being a React topic and becomes a plain
JavaScript one: *how do you pick between two values?* You already know four ways, and all four
work here for exactly that reason.

### The four forms

| Form | Use it when |
|---|---|
| `{cond ? <A /> : <B />}` | two outcomes, both visible |
| `{cond ? <A /> : null}` | one outcome or nothing |
| `{cond && <A />}` | one outcome or nothing — shorter version of the line above |
| `let x; if (...) { x = <A /> } ... {x}` | three or more outcomes, or the JSX is long |

None of these is more "correct." The last one exists because nested ternaries become unreadable
fast, and because it lets you use `if`/`else if`/`else`, which reads better than `? :` chains.

### Why `if` doesn't work inside the braces

This is your JS↔JSX boundary again, stated precisely:

> **JSX braces take an *expression* — something that evaluates to a value.**
> `if` is a *statement*. It doesn't evaluate to anything.

That's the whole reason the ternary exists in JSX and `if` doesn't. Same rule, said the other way:
**compute above the `return`, display inside it.** An `if` is computing, so it lives above.

### What React draws for non-JSX values

Drop a value in braces and React has to decide what to paint:

| Value | React draws |
|---|---|
| `null` | nothing |
| `undefined` | nothing |
| `false` / `true` | nothing |
| `0` | **`0`** — an actual zero on screen |
| `''` | nothing |

That table is not trivia. Exercise 4 turns on it.

### Setup

`src/App.js`. Import normally:

```js
import { useState } from 'react';
```

---

## Exercise 1: Welcome message

**Goal:**

- One button, label `Toggle login`
- When logged in, a `<p>Welcome back!</p>` appears
- When logged out, nothing appears in its place

Start logged out.

**Constraint:** use `&&`. No ternary in this one.

```jsx
import { useState } from 'react';

function App() {
  // TODO: one boolean state — what's its starting value?
  const [isLogged, setIsLogged] = useState(false);

  function handleLogin(){
    setIsLogged(!isLogged)
  }

  // TODO: one handler. This is the one case where flipping the current value is right.
  //       Why is it right here but wrong for the Delete button in the Udemy exercise?

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      {isLogged && <p>Welcome back!</p>}
      <button onClick={handleLogin}>Toggle login</button>
    </div>
  );
}

export default App;
```

**Watch for:** the button needs an `onClick`. Pass the handler, don't call it.

**In writing:** `{isLoggedIn && <p>Hi</p>}` — what does this whole expression evaluate to when
`isLoggedIn` is `false`? Not "nothing appears" — what *value* does it produce? Look at the table
above for why that value is safe here.

---

## Exercise 2: Follow button

**Goal:**

- One button that starts as `Follow` and becomes `Following` after a click (and back again)
- The button gets `className="active"` while following, and `className=""` while not
- Below it, a paragraph reading either `You follow this user.` or `You are not following.`

**Constraint:** nothing appears or disappears in this exercise. Everything is always on screen —
only the *contents* and the *attribute* change.

```jsx
import { useState } from 'react';

function App() {
  const [following, setFollowing] = useState(false);

  function handleFollowing(){
    setFollowing(!following)
  }

  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <button className={following ? "active" : ""} onClick={handleFollowing}>
        {following  ? "Following" : "Follow"}
      </button>
      <p>{following ? "You follow this user." : "You are not following."}</p>
    </div>
  );
}

export default App;
```

Add this to `src/index.css` so you can see the class working:

```css
.active { background: #2f6feb; color: white; }
```

**Watch for:** a ternary works in three different positions here — inside an attribute, as a
child of an element, and as text. It's the same braces rule every time: an expression goes in.

**In writing:** why can't you write `className="active"` conditionally with an `if` right there in
the JSX? Answer using the word *expression*.

---

## Exercise 3: Request status

**Goal:**

- Three buttons: `Idle`, `Loading`, `Success`
- A status area below them showing:
  - idle → `<p>Nothing happening yet.</p>`
  - loading → `<p>Loading…</p>`
  - success → an `<h2>Done!</h2>` **and** a `<p>Your data has arrived.</p>` (two elements)

Start on idle.

**Constraint:** no ternary anywhere. Build a variable above the `return` with `if` / `else if` /
`else`, then render that variable.

```jsx
import { useState } from 'react';

function App() {

  const [status, setStatus] = useState('idle')

  // TODO: declare a variable for the content, then if / else if / else to assign JSX to it.
  //       Think: does it need `let` or `const`? Why?
  let show;
  
  if(status === 'idle'){
    show = <p>Nothing happening yet.</p>
  }else if(status==='loading'){
    show = <p>Loading…</p>
  } else {
  show = (
    <div>
      <h2>Done!</h2>
      <p>Your data has arrived.</p>
    </div>
  )
}


function handleIdle(){
  setStatus('idle')
}

function handleLoading(){
  setStatus('loading')
}

function handleSuccess(){
  setStatus('success')
}

  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <button onClick={handleIdle}>Idle</button>
      <button onClick={handleLoading}>Loading</button>
      <button onClick={handleSuccess}>Success</button>
      {show}
    </div>
  );
}

export default App;
```

**Watch for:** the success case needs to produce *two* sibling elements as one value. A variable
holds one value. What do you wrap them in? You have two options — a real element, or the empty
one you may have seen written `<>...</>`.

**In writing:** you have three buttons doing the same job with a different string. From the Events
unit — do you need three handlers, or one? Write whichever you like, but say which and why.

---

## Exercise 4: Shopping list with an empty state

**Goal:**

- A text input and an `Add` button that appends the typed item to a list
- When the list is empty → `<p>No items yet.</p>` and no `<ul>` at all
- When it has items → the `<ul>` of items and no "No items yet" message
- A line reading `You have 3 item(s).` that appears **only when there is at least one item**

Start with an empty list and an empty input.

```jsx
import { useState } from 'react';

function App() {
  const [list, setList] = useState([]);
  const [input,setInput] = useState('');
  const listLength = list.length;

  function handleChange(event){
    setInput(event.target.value)
  }

  function handleAdd(){
    setList([...list, input]);
    setInput('')
  }

  return (
    <div id="app">
      <h1>Exercise 4</h1>
      <input value={input} onChange={handleChange} placeholder="Item" />
      <button onClick={handleAdd}>Add</button>

      {listLength === 0 ?  <p>No items yet.</p> :
        <ul>
         {list.map((item)=>(
          <li key={item}>{item}</li>
         ))}
        </ul>
      }

      {listLength >= 1 && <p>You have {listLength} item(s).</p>}
    </div>
  );
}

export default App;
```

**Watch for — do this deliberately:** write the count line as `{items.length && <p>...</p>}` first
and look at the screen while the list is empty. Something shows up that shouldn't. **Work out why
before you fix it** — the value table at the top of this file has the answer, and this is the
single most common `&&` bug in React. Then fix it so the condition is a real boolean.

**Watch for:** `<ul>` exists once, `<li>` repeats. Inside vs outside the `.map()`, and every `<li>`
needs a `key`.

**In writing:** the count `3` — state, derived, or constant? Say why in one sentence.

---

## Exercise 5: Email form

**Goal:**

- A form with an email input and a `Submit` button
- The button is **disabled** unless the input is a valid email (non-empty **and** contains `@`)
- An error `<p>Please enter a valid email.</p>` shows only when the user has typed something
  that isn't valid — it must **not** show while the input is still empty
- After a successful submit, the **entire form disappears** and is replaced by
  `<p>Thanks, someone@example.com!</p>`

```jsx
import { useState } from 'react';

function App() {
  // TODO: two pieces of state — what did they type, and have they submitted?

  // TODO: derived values above the return. Two of them:
  //       one for "is this a valid email", one for "should the error show".
  //       They are NOT the same condition — an empty input is invalid but shows no error.

  // TODO: handleChange

  // TODO: handleSubmit — the form's onSubmit. What's the one line you must never forget
  //       in a submit handler?

  return (
    <div id="app">
      <h1>Exercise 5</h1>
      {/* TODO: if submitted, the thank-you paragraph INSTEAD of everything below */}
      <form onSubmit={/* TODO */}>
        <input value={/* TODO */} onChange={/* TODO */} placeholder="Email" />
        {/* TODO: the error paragraph */}
        <button disabled={/* TODO */}>Submit</button>
      </form>
    </div>
  );
}

export default App;
```

**Watch for:** this exercise has three separate conditionals, and they're three *different* forms —
one swaps a whole block, one shows-or-nothing, one is an attribute. Pick the right form for each
instead of using a ternary everywhere.

**Watch for:** the `<h1>` stays on screen in both cases. Only the form/thank-you swaps. Decide what
is always visible before you write the conditional.

**In writing:** `disabled={...}` takes a boolean. You already computed "is this valid." What's the
relationship between that variable and what `disabled` needs?

---

## When you're done

Answer these without looking anything up:

1. Why does `if` work above the `return` but not inside `{}`?
2. `{count && <p>Items</p>}` — when `count` is `0`, what appears on screen and why?
3. You need to pick between three different blocks of JSX. Which form, and why not a ternary?
4. What's the difference between `{cond ? <A/> : null}` and `{cond && <A/>}`?

---

<details>
<summary><strong>Solutions</strong> — only after you've attempted all five</summary>

### Exercise 1

```jsx
import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleToggle() {
    setIsLoggedIn(!isLoggedIn);
  }

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      {isLoggedIn && <p>Welcome back!</p>}
      <button onClick={handleToggle}>Toggle login</button>
    </div>
  );
}

export default App;
```

Flipping is correct here because the button's job is literally "make it the opposite." In the
Udemy exercise, Delete's job was "make it shown" — a fixed outcome, not a flip. That's the test:
does this button have one fixed result, or does its result depend on where you are now?

When `isLoggedIn` is `false`, the expression `isLoggedIn && <p>Hi</p>` evaluates to `false` — `&&`
returns the left side when it's falsy. React draws nothing for `false`, so it works. That's luck of
the value table, not magic, which is exactly why exercise 4 breaks.

### Exercise 2

```jsx
import { useState } from 'react';

function App() {
  const [isFollowing, setIsFollowing] = useState(false);

  function handleFollow() {
    setIsFollowing(!isFollowing);
  }

  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <button className={isFollowing ? 'active' : ''} onClick={handleFollow}>
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      <p>{isFollowing ? 'You follow this user.' : 'You are not following.'}</p>
    </div>
  );
}

export default App;
```

`if` can't go in `className={...}` for the same reason it can't go anywhere else in braces: braces
need an expression, and `if` is a statement — it produces no value to hand to the attribute.

### Exercise 3

```jsx
import { useState } from 'react';

function App() {
  const [status, setStatus] = useState('idle');

  let content;

  if (status === 'idle') {
    content = <p>Nothing happening yet.</p>;
  } else if (status === 'loading') {
    content = <p>Loading…</p>;
  } else {
    content = (
      <>
        <h2>Done!</h2>
        <p>Your data has arrived.</p>
      </>
    );
  }

  function handleStatus(next) {
    setStatus(next);
  }

  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <button onClick={() => handleStatus('idle')}>Idle</button>
      <button onClick={() => handleStatus('loading')}>Loading</button>
      <button onClick={() => handleStatus('success')}>Success</button>
      {content}
    </div>
  );
}

export default App;
```

`let`, not `const` — you declare it empty and assign inside the branches, and `const` can't be
reassigned. (`const content = status === 'idle' ? ... : ...` would work, but that's the ternary
this exercise banned.)

`<>...</>` is a **Fragment**: a wrapper that groups elements into one value without adding a real
element to the DOM. A `<div>` would also work but leaves a pointless div behind.

One handler taking an argument beats three handlers — same call as the tip buttons in the State
unit. The arrow wrapper is needed because you're injecting an argument.

### Exercise 4

```jsx
import { useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleAdd() {
    if (text === '') return;
    setItems([...items, text]);
    setText('');
  }

  return (
    <div id="app">
      <h1>Exercise 4</h1>
      <input value={text} onChange={handleChange} placeholder="Item" />
      <button onClick={handleAdd}>Add</button>

      {items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      {items.length > 0 && <p>You have {items.length} item(s).</p>}
    </div>
  );
}

export default App;
```

**The trap.** `{items.length && <p>...</p>}` with an empty list: `items.length` is `0`, `&&`
returns the left side when it's falsy, so the expression evaluates to `0` — and React draws `0`
as an actual character. A stray zero appears on your page.

The rule: **`&&` only renders the left side away safely when it's a real boolean.** `0` and `''`
are falsy but visible-ish; `false` and `null` are not. So never put a raw number or string on the
left of `&&` in JSX — compare it into a boolean first (`items.length > 0`).

The count is **derived**. It's computable from `items` at any moment, so storing it separately
would just give you two things to keep in sync.

### Exercise 5

```jsx
import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValid = email.length > 0 && email.includes('@');
  const showError = email.length > 0 && !isValid;

  function handleChange(event) {
    setEmail(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <div id="app">
      <h1>Exercise 5</h1>
      {isSubmitted ? (
        <p>Thanks, {email}!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input value={email} onChange={handleChange} placeholder="Email" />
          {showError && <p>Please enter a valid email.</p>}
          <button disabled={!isValid}>Submit</button>
        </form>
      )}
    </div>
  );
}

export default App;
```

`isValid` and `showError` are deliberately different. An empty input is invalid — but the user
hasn't done anything wrong yet, so shouting at them is bad. "Has typed something" is the extra
condition. Two related-but-distinct booleans is normal and correct; collapsing them into one
would break one of the two requirements.

`disabled={!isValid}` — `disabled` wants "should this be off," `isValid` says "is this good."
Opposites, hence the `!`. Both are derived, not state.

`event.preventDefault()` is the line you can't forget in a submit handler — without it the browser
reloads the page and your state resets.

### Answers to the closing questions

1. Braces take an **expression** (something producing a value). `if` is a **statement** — it
   produces nothing to hand over. Above the `return` you're in plain JavaScript, where statements
   are fine.
2. `0` appears on screen. `&&` returns its left operand when that operand is falsy, so the whole
   expression is `0`, and React renders `0` as text.
3. A variable assigned with `if`/`else if`/`else` above the `return`. Nested ternaries for three
   branches are technically valid and genuinely hard to read.
4. Behaviourally nothing, as long as the left side of `&&` is a real boolean. `? : null` is
   explicit and immune to the `0` trap; `&&` is shorter. Use `&&` for booleans, the ternary when
   the left side is a number or string.

</details>