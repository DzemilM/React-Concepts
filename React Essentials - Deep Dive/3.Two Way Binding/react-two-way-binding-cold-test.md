# Two-Way Binding — Cold Test

No starter code. No shapes, no blanks. Write every line yourself in a blank
StackBlitz.

## Rules

- Look up syntax freely. Do not look up the plan or open the exercise file for
  the structure.
- Write this plan in a comment at the top of each task before coding:

```js
// STATE:
// DERIVED:
```

- Run each task before asking for help. Check both what appears on screen and
  what happens when you type, select, clear, and submit.
- Tick off every requirement before calling a task done.
- Solutions are collapsed at the bottom. Open them only after all three tasks
  are finished.

---

## Task 1 — Contact card

Build a `ContactCard` component and have `App` render one.

- A controlled text input for a person's name, initially empty
- A controlled email input, initially empty
- A live preview below the inputs:
  - `Name: ...`
  - `Email: ...`
- A `Clear` button that empties both inputs
- The preview must update while the user types

Before you code, decide: how many pieces of state are there, and which values
are derived?

### My solution

```jsx
import { useState } from 'react';

function ContactCard(){

   const [ name, setName ] = useState("");
   const [ email, setEmail ] = useState("");

   function handleName(event){
      setName(event.target.value);
   }

   function handleEmail(event){
      setEmail(event.target.value);
   }

   function reset(){
      setName("");
      setEmail("");
   }

   return(
      <>
      <input type="text" value={name} onChange={handleName} />
      <input type="email" value={email} onChange={handleEmail} />
      <p>Name:{name}</p>
      <p>Email:{email}</p>
      <button onClick={reset}>Clear</button>
      </>
   )
}

export default function App(){
   return(
      <ContactCard />
   )
}
```

### My answer

1. Why must the `Clear` button update state instead of changing the input DOM
   values directly?
2. What are the two halves that make each input controlled?

`Clear` updates state because state is React's source of truth for the inputs.
The state update causes React to re-render the DOM with empty values. `value`
and `onChange` together make an input controlled.

---

## Task 2 — Product finder

Build a `ProductFinder` component and have `App` render one.

```js
const PRODUCTS = [
  { id: 'p1', name: 'Keyboard', category: 'office' },
  { id: 'p2', name: 'Notebook', category: 'school' },
  { id: 'p3', name: 'Desk lamp', category: 'office' },
  { id: 'p4', name: 'Backpack', category: 'school' },
];
```

- A controlled search input, initially empty
- A controlled `<select>` with `all`, `office`, and `school` options
- Show products matching both the search text and selected category
- Matching must ignore letter case
- Show `No products found` when nothing matches
- Show `Showing X of 4 products`, where `X` is the visible count
- Use each product's `id` as its key
- The fixed `PRODUCTS` array must not be changed

Before you code, decide: which values can the user change directly, and which
values can be recalculated from them?

### My solution

```jsx

```

### My answer

1. What exact value does the `<select>` store when the user chooses `office`?
2. Why is the matching product list derived data rather than another state
   value?
3. If the search is cleared, why should products return instead of being
   permanently removed?

---

## Task 3 — Draft and preview

Build a `DraftForm` component and have `App` render one. Also build the
`DraftPreview` child component.

- `DraftForm` owns controlled `title` and `body` state, both initially empty
- Render a text input for the title
- Render a textarea for the body
- Pass both current values to `DraftPreview` as props
- `DraftPreview` displays:
  - `Title: ...`
  - `Body: ...`
- Add a `Clear draft` button that resets both fields
- The preview must update live while the user types
- `DraftPreview` must not have its own copy of the title or body in state

Before you code, decide which component owns the changing data and why.

### My solution

```jsx

```

### My answer

1. Why does `DraftForm` own the state instead of `DraftPreview`?
2. Trace the update after the user types one character into the body:
   name the event value, the state update, the prop update, and what the child
   displays.

---

## After you finish

1. Which task took the most time to plan, rather than type?
2. For each task, list the state values and derived values you actually used.
3. Which controlled element was different from a text input in syntax, but the
   same in concept?
4. Did you ever call a handler during render instead of passing it?
5. Did any value get duplicated in state even though it could be calculated?

<details>
<summary><strong>Answer key</strong> — open only after all three tasks are done</summary>

### Task 1

1. Controlled inputs take their displayed values from React state. Updating the
   state causes React to re-render both inputs with empty strings.
2. `value` displays state in the input; `onChange` receives the event and stores
   the new value in state.

### Task 2

1. The select stores the option's value, so it stores `'office'`.
2. The visible list is calculated from the current search and category state.
   It is not directly changed by the user.
3. Searching only calculates a visible subset. The original `PRODUCTS` data is
   unchanged, so clearing the search recalculates the full matching list.

### Task 3

1. `DraftForm` owns the inputs and needs their current values both to control
   them and to pass them to the child. `DraftPreview` only displays props.
2. The event contains the new body text; the handler stores it in `DraftForm`
   state; the parent re-renders and passes the new body as a prop; the child
   displays the updated prop.

</details>
