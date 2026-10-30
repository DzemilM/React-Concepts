# React Lifting State Up — Exercise Set 3

Third pass. This one is about the **connection** between `App` and its children.

## The one idea underneath all of it

Same as sets 1 and 2:

> **The child can't change the parent's state itself. So the parent passes it a function that
> does.**

## Why this file exists

In set 2 you wrote the components well. The hand-off (pass bare, wrap in the child) is now
yours. What kept stalling was the moment of **connecting** them: writing the props in `App`, and
matching them in the child's `{ }`. Questions like "where do I put that", "do I write it in
`MovieDetails` or", and "do I need more props" all come from that moment. So does the per-row
value (`isOpen`, `isActive`), which needed blanks in Ex 3 and Ex 6.

So this file builds up to it:

- **Ex 1:** `App` is given. You write the children to match it.
- **Ex 2:** the children are given. You write `App` to match them.
- **Ex 3:** the connections are broken. Find which end doesn't match.
- **Ex 4:** both sides yourself, small.
- **Ex 5–6:** full exercises, set 2 size.

## Two facts to have in your head

**1. Every prop has two ends.**

```
App's tag:        <Seat  label={seat.label}  onPick={handlePick} />
                          ↓                   ↓
Child's { }:      function Seat({ label,      onPick })
```

The names must match exactly. If `App` doesn't pass one, the child gets `undefined`. If the child
doesn't list one, it never sees it. When you get lost, write the two lines side by side:

```
Seat expects:   label   seatId   isPicked   onPick
App passes:     label            isPicked   onPick     ← gap
```

**2. Everything in `App`'s JSX goes down.**

```
App → child:    props       (values AND functions)
child → App:    arguments   (when the child calls the function: onPick('s2'))
```

When you're writing `App`'s JSX, the only question is: **what does this child need from me?**

## Setup

`src/App.js`, with `import { useState } from 'react';`. All components go in the same file.

## Three checks, after writing each component

1. **Every prop I named — did I use it?**
2. **Is `children` named, and placed between the tags?** (Only if the component wraps content.)
3. **Every fixed class — is it written in *this* component, not inside a child?**

And for this file: **the side-by-side check** (fact 1) for every child, before you call it done.

---

## Exercise 1: Write the children

`App` is finished. Don't change it.

```jsx
export default function App() {
  const [volume, setVolume] = useState(5);

  function handleChange(newVolume) {
    setVolume(newVolume);
  }

  return (
    <>
      <VolumeButtons current={volume} onChange={handleChange} />
      <VolumeLabel level={volume} />
    </>
  );
}
```

**Goal:**

- `VolumeButtons` renders two buttons, `-` and `+`. Clicking `-` sets the volume one lower, and
  `+` sets it one higher.
- `VolumeLabel` renders `<p>Volume: 5</p>` with the current volume.
- Use exactly the prop names `App` passes.

**Watch for:** name discipline. Read the names off `App`'s tags, letter for letter.

**In writing:** the volume is `5` and the user clicks `+`. What value goes up to `App`, and where
does `VolumeButtons` get the `5` from to work it out?

### My solution

```jsx
import { useState } from 'react';

```

### My answer

---

## Exercise 2: Write `App`

The children are finished. Don't change them.

```jsx
const SEATS = [
  { id: 's1', label: 'A1' },
  { id: 's2', label: 'A2' },
  { id: 's3', label: 'A3' },
  { id: 's4', label: 'A4' },
];

function Seat({ seatId, label, isPicked, onPick }) {
  return (
    <button className={isPicked ? 'picked' : ''} onClick={() => onPick(seatId)}>
      {label}
    </button>
  );
}

function Summary({ seat }) {
  return <p>{seat ? `Your seat: ${seat.label}` : 'No seat picked'}</p>;
}
```

**Goal:**

- Write `App`. It shows all four seats as `Seat` buttons, and a `Summary` below them.
- Clicking a seat picks it. The picked seat has the class `picked`, and `Summary` shows
  `Your seat: A2`.
- State stores only the picked seat's `id`.

**Before writing:** list what `Seat` expects and what `Summary` expects. That's your to-do list
for `App`.

**Watch for:** `key` isn't a prop. `Seat` needs `seatId` **and** React needs `key`. That's two
separate things, even though they hold the same value.

**In writing:** `isPicked` isn't stored anywhere. Where does each seat's `true` or `false` come
from?

### My solution

```jsx
import { useState } from 'react';

```

### My answer

---

## Exercise 3: Fix the broken connections

All the logic is correct. The bugs are **only at the connections**, where a prop leaves `App` or
arrives in a child. There are **four**.

Symptoms: no tab is ever highlighted, the heading always says `No tab`, and clicking a tab crashes
the page.

```jsx
import { useState } from 'react';

const TABS = [
  { id: 't1', label: 'Home' },
  { id: 't2', label: 'Profile' },
  { id: 't3', label: 'Settings' },
];

function Tab({ label, tabId, isActive, onSelect }) {
  return (
    <button className={isActive ? 'active' : ''} onClick={() => onSelect(tabId)}>
      {label}
    </button>
  );
}

function TabTitle({ tab }) {
  return <h2>{tab ? tab.label : 'No tab'}</h2>;
}

export default function App() {
  const [activeId, setActiveId] = useState('t1');
  const activeTab = TABS.find((t) => t.id === activeId);

  function handleSelect(id) {
    setActiveId(id);
  }

  return (
    <>
      <menu>
        {TABS.map((tab) => {
          return (
            <Tab
              key={tab.id}
              label={tab.label}
              isActive={tab.id === activeTab}
              onSelected={handleSelect}
            />
          );
        })}
      </menu>
      <TabTitle title={activeTab} />
    </>
  );
}
```

**Goal:** fix all four. Write the side-by-side check for `Tab` and for `TabTitle` first. Three of
the four bugs show up there.

**Watch for:** fixing only half the list. Number your fixes 1–4.

**In writing:** the fourth bug doesn't show up in the side-by-side check. Which one is it, and what
are the two values being compared on the first render?

### My solution

```jsx
import { useState } from 'react';

```

### My answer

---

## Exercise 4: Light and dark

**Goal:**

- A `ModeToggle` component renders one button: `Switch to dark` in light mode, `Switch to light` in
  dark mode.
- A `Box` component renders a `<div>` with the class `light` or `dark`, containing the text
  `Light mode` or `Dark mode`.
- Clicking the button switches the mode. It starts in light mode.
- `App` owns the mode and renders both. Neither child has `useState`.

**Watch for:** pass vs wrap. Does the button need to send a value up, or does `App` already know
what to do?

**In writing:** write the side-by-side check for both children.

### My solution

```jsx
import { useState } from 'react';

```

### My answer

---

## Exercise 5: Quiz question

```js
const QUESTION = {
  text: 'What does useState return?',
  options: ['A number', 'An array with a value and a setter', 'A component'],
  correct: 'An array with a value and a setter',
};
```

**Goal:**

- A `Question` component shows `QUESTION.text` in an `<h2>`.
- `App` maps `QUESTION.options` to `AnswerButton` components. Each `AnswerButton` is a button
  showing the option. The picked one has the class `picked`.
- A `Result` component below the buttons shows:
  - `Pick an answer` before anything is picked,
  - `Correct!` if the picked option is the correct one,
  - `Wrong. The answer is: ...` otherwise.
- `Result` also has a `Try again` button that clears the pick. It only shows once something is
  picked.
- The options are strings, and each one is different, so the option itself can be the key.

**Watch for:** array vs item vs field. `QUESTION` is an object, `QUESTION.options` is the array,
and inside the `.map()` the parameter is **one option**, a plain string.

**In writing:** what is stored in state? Name two things derived from it.

### My solution

```jsx
import { useState } from 'react';

```

### My answer

---

## Exercise 6: Recipe browser

```js
const RECIPES = [
  { id: 'r1', name: 'Lentil soup', type: 'veg', minutes: 40 },
  { id: 'r2', name: 'Chicken wrap', type: 'meat', minutes: 15 },
  { id: 'r3', name: 'Mushroom risotto', type: 'veg', minutes: 35 },
  { id: 'r4', name: 'Beef stew', type: 'meat', minutes: 90 },
];
```

**Goal:**

- A `TypeFilter` component renders three buttons: `All`, `Veg`, `Meat`.
- `App` maps the **filtered** recipes to `RecipeRow` components inside a `<ul>`. Each row is an
  `<li>` with the recipe name and a `View` button. The viewed recipe's row has the class `active`.
- A `RecipeCard` component below the list shows `Lentil soup — 40 min` for the viewed recipe,
  plus a `Close` button that un-views it. Before anything is viewed, it shows `Pick a recipe` and
  no button.
- Two pieces of state, both in `App`: the filter, and the viewed recipe's `id`.

**Before writing:** list the children and, for each one, what it needs from `App`. Then write the
side-by-side check after each child.

**Watch for:** three hand-offs, and you have to decide for each one whether it wraps. And two
different arrays: the `.map()` uses the filtered one, but `.find()` can search all of `RECIPES`.

**In writing:** why do both pieces of state live in `App`, and not one in `TypeFilter`?

### My solution

```jsx
import { useState } from 'react';

```

### My answer

---

## Cold recall

1. A prop has two ends. Where are they?
2. `App` forgets to pass a prop that the child lists in its `{ }`. What does the child get?
3. Each row needs to know whether it's the picked one. Where is that worked out, and how does it
   reach the row?
4. Inside `App`'s JSX, is anything going up?
5. You pass `key={item.id}`. Can the child read the id from `key`? What do you do if it needs it?

<details>
<summary>Answer key</summary>

1. In `App`'s tag (`name={value}`) and in the child's parameter list (`{ name }`). The names must
   match exactly.
2. `undefined`, with no error until something tries to use it.
3. In `App`, inside the `.map()`, by comparing this row's id with the state
   (`item.id === pickedId`). The `true`/`false` goes down as a prop.
4. No. Everything in `App`'s JSX goes down as props. Values only go up as arguments, when the child
   calls a function `App` passed it.
5. No. React keeps `key` for itself, so `props.key` is `undefined`. Pass the id again as a separate
   prop.

</details>
