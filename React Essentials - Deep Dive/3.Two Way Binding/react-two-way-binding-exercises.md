# React Two-Way Binding — Practice Exercises

Six exercises that move from one controlled input to several inputs whose values
are passed through a component.

## The one idea underneath all of it

This unit combines two things you already know: state from the State unit and
event handlers from the Events unit. The new connection is that the same state
value is both displayed by an input and updated by that input.

An input has a value of its own in the browser. React can take control of that
value by making state the source of truth:

- `value` displays the current state value in the control.
- `onChange` receives the user's new value.
- The handler stores that new value with the setter.
- The state update causes a re-render, so the control displays the stored value.

That is **two-way binding**: data flows from state into the input, and the user's
change flows back from the input into state.

`textarea` follows the same pattern as `input`. Its text is supplied with
`value`, not as JSX children.

## Setup

Use `src/App.js`. Import `useState` normally:

```jsx
import { useState } from 'react';
```

Use one `App` component per exercise. Replace the previous exercise in `App` when
you start the next one. Exercise 6 also uses a separate child component.

## Three checks before you call an input controlled

1. Does its `value` come from the matching state variable?
2. Does its `onChange` store `event.target.value` in that state?
3. Is the handler passed, rather than called while rendering?

## Exercise 1: Controlled name

**Goal:**

- Start with an empty name.
- Show one text input and a paragraph below it.
- Whatever the user types should appear in the paragraph as `Name: ...`.

**Watch for:** the input needs both halves of two-way binding. An `onChange`
without `value` updates state, but it is not a controlled input.

**In writing:** explain what `value` does here and what `onChange` does here.

```jsx
import { useState } from 'react';

function App() {
  // TODO

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      {/* TODO */}
    </div>
  );
}

export default App;
```

### My solution

```jsx
import { useState } from 'react';

function App() {
  
  const [name, setName] = useState("");

  function handleName(event){
    setName(event.target.value);
  }

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <input type="text" value={name} onChange={handleName} />
      <p>Name: {name}</p>
    </div>
  );
}

export default App;
```

### My answer

`value` displays the current state value inside the input. `onChange` runs when
the user edits the input and updates state with the new value. The state update
then re-renders the input with that value.


## Exercise 2: Feedback textarea

**Goal:**

- Start with an empty feedback message.
- Use a controlled `<textarea>`.
- Show the current message below it.
- Show the current character count below the message.

**Watch for:** the value of a textarea is still a string from
`event.target.value`. The character count is derived from that string, not a
second piece of state.

**In writing:** why is the character count derived data instead of a second
piece of state?

```jsx
import { useState } from 'react';

function App() {
  // TODO

  return (
    <div id="app">
      <h1>Exercise 2</h1>
      {/* TODO */}
    </div>
  );
}

export default App;
```

### My solution

```jsx
import { useState } from 'react';

function App() {
  
  const [ feedback, setFeedback ] = useState("");

  function handleFeedback(event){
    setFeedback(event.target.value);
  }

  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <textarea value={feedback} onChange={handleFeedback} />
      <p>Message: {feedback}</p>
      <p>Character count:{feedback.length}</p>
    </div>
  );
}

export default App;
```

### My answer

The character count is derived from the current `feedback` value, so it should
not be separate state. Storing both would duplicate information and could let
the text and count get out of sync.


## Exercise 3: Search preview

Write the component from the goal. Do not copy a starter component.

**Goal:**

- Store a search term in state, initially `''`.
- Render a controlled text input with the placeholder `Search books`.
- Render this fixed array:

```js
const BOOKS = ['Dune', 'Emma', 'The Hobbit', 'Beloved'];
```

- Show only books whose names include the current search term, ignoring case.
- Show `No matches` when the filtered array is empty.

**Watch for:** the input value is state; the matching books are derived. Do not
store the filtered array in another state variable.

**In writing:** what changes when the user types, and what is recalculated from
that change?

### My solution

```jsx

```

### My answer


## Exercise 4: Profile form

Write the component from the goal. Use one state value for each field.

**Goal:**

- Start with an empty first name, last name, and email.
- Render three controlled inputs.
- Show a preview below them:
  - `First name: ...`
  - `Last name: ...`
  - `Email: ...`
- Add a button labelled `Clear`.
- Clicking `Clear` must reset all three fields to empty strings.

**Watch for:** each input needs its own matching state value and handler. The
button handler changes state directly; it is not an input change handler.

**In writing:** why does `Clear` need to update three state values instead of
trying to clear the DOM inputs directly?

### My solution

```jsx

```

### My answer


## Exercise 5: Shipping estimate

Write the component from the goal. This one combines text input, a select, and
derived output.

**Goal:**

- Start with an empty city and `standard` shipping selected.
- Render a controlled text input for the city.
- Render a controlled `<select>` with:
  - `standard` — Standard, $5
  - `express` — Express, $15
  - `overnight` — Overnight, $30
- Show `Shipping to: ...`.
- Show the selected method and its price.
- Show `Enter a city` instead of the city name until the city is non-empty.

**Watch for:** a `<select>` uses the same two-way binding pattern as an input.
The selected option is state; the displayed price is derived from that option.

**In writing:** what value does the `<select>` store, and how do you use that
value to determine the displayed shipping price?

### My solution

```jsx

```

### My answer


## Exercise 6: Comment form and preview component

Write the `App` component from the goal. Assume `CommentPreview` already exists
in `CommentPreview.js` and is imported into `App.js`; use it without changing
it. The reference below shows which props it expects.

**Goal:**

- Store controlled `comment` and `author` fields in `App`.
- Render a textarea for the comment and a text input for the author's name.
- Pass both current values to `CommentPreview` using the prop names it expects.
- Keep the preview output live while the user types.

```jsx
function CommentPreview({ comment, author }) {
  return (
    <figure>
      <blockquote>
        <p>{comment}</p>
      </blockquote>
      <figcaption>{author}</figcaption>
    </figure>
  );
}
```

If you are practicing in one file instead, leave this `CommentPreview` function
unchanged and place your `App` component below it. Do not create state inside
`CommentPreview`.

**Watch for:** state belongs in the component that owns the inputs. Props carry
the current values to the child; the child does not need its own copy of them.

**In writing:** why should `App` own these values instead of giving
`CommentPreview`
its own separate state?

### My solution

```jsx

```

### My answer


## Cold recall

1. What two props make a text input controlled?
2. What value does `event.target.value` represent during `onChange`?
3. Why should an event handler be passed instead of called in JSX?
4. Why is a character count derived data rather than state?
5. How does a child component receive the current value of a parent's input?

<details>
<summary>Answer key</summary>

1. `value` and `onChange`.
2. The input's new text value.
3. React must call the handler when the event happens; calling it during render
   runs it immediately.
4. It is calculated from the current state value and is not changed directly by
   the user.
5. The parent passes the current state value as a prop.

</details>
