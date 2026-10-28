# React Lifting State Up — Exercise Set 2

Second pass. Fresh problems, same idea.

## The one idea underneath all of it

Same as set 1:

> **The child can't change the parent's state itself. So the parent passes it a function that
> does.**

Values go **down** as props. The user's choice goes **up** as an **argument** to that function.

## Why this file exists

Set 1 got finished, but with a lot of help. Deciding *where* the state goes was mostly solid. The
help went to three places:

- **The hand-off.** Who passes the function bare, and who wraps it. You needed blanks for it in
  Ex 2 and Ex 4. You got it unaided in Ex 5, but then wrote `select={handleSelect(...)}` in Ex 6.
- **Array vs item inside a `.map()`.** `PLAYERS.id` instead of `player.id`.
- **Deriving from an id.** `.find()` was new, and showing the text `'(selected)'` needed quotes.

This set is weighted toward those three, and it has two refactor tasks (fix broken code), since
that format was new in Ex 4.

## Two facts to have in your head before starting

**1. Wrap only where the value is.**

```jsx
<Child onPick={handlePick} />              // parent: passes the function itself
<button onClick={() => onPick('red')}>     // child: wraps, because the child knows 'red'
```

If the child has nothing to add, it doesn't need to wrap: `onClick={onClear}` is fine. With
brackets and no arrow, `onPick('red')` **runs during render**, and what gets passed is its return
value, usually `undefined`.

**2. `filter` gives an array, `find` gives one item.**

```js
ITEMS.filter((i) => i.id === 'a2')   // [ { id: 'a2', ... } ]   ← array
ITEMS.find((i) => i.id === 'a2')     //   { id: 'a2', ... }     ← the item
ITEMS.find((i) => i.id === '')       //   undefined             ← nothing matched
```

## Setup

`src/App.js`, with `import { useState } from 'react';`. All components for an exercise go in the
same file, above `App`. Start each exercise from a blank file.

## Three checks, after writing each component

1. **Every prop I named — did I use it?**
2. **Is `children` named, and placed between the tags?** (Only if the component wraps content.)
3. **Every fixed class — is it written in *this* component, not inside a child?**

And before writing anything:

- **Who reads this value, and who changes it?** The state goes in the closest component that
  contains all of them.

---

## Exercise 1: Star rating

**Goal:**

- A `Stars` component renders five buttons labelled `1` to `5`.
- A `RatingText` component renders `You rated 3/5`, or `Not rated yet` before any click.
- `App` owns the rating and renders both.
- `Stars` gets **one** function prop.
- Neither child has `useState`.

**Watch for:** forgetting the `return`. Three components, so type `return ( )` three times
before you fill anything in.

**In writing:** the user clicks `4`. Which component knows the number `4` first, and how does it
get to `App`? (Two parts.)

### My solution

```jsx

```

### My answer

---

## Exercise 2: Fix the colour picker

This doesn't work. A colour shows up before anything is clicked, clicking the buttons does
nothing, and React prints a warning in the console.

```jsx
import { useState } from 'react';

function ColorButtons({ onPick }) {
  const [color, setColor] = useState('');

  return (
    <div>
      <button onClick={onPick('red')}>Red</button>
      <button onClick={onPick('green')}>Green</button>
      <button onClick={onPick('blue')}>Blue</button>
    </div>
  );
}

function Swatch({ color }) {
  return <p>{color ? `Colour: ${color}` : 'Pick a colour'}</p>;
}

export default function App() {
  const [color, setColor] = useState('');

  function handlePick(newColor) {
    setColor(newColor);
  }

  return (
    <>
      <ColorButtons onPick={handlePick} />
      <Swatch color={color} />
    </>
  );
}
```

**Goal:** fix it so clicking a button shows that colour in `Swatch`. There are **two** problems in
`ColorButtons`. One breaks it, the other is just leftover.

**Watch for:** fixing only half the list. When you think you're done, count your fixes. There
should be two.

**In writing:** in the broken code, what does `onClick` actually receive on the `Red` button? And
why does a colour show up before any click? (Two parts.)

### My solution

```jsx

```

### My answer

---

## Exercise 3: One panel open at a time

```js
const FAQS = [
  { id: 'q1', question: 'Do you ship abroad?', answer: 'Yes, to most of Europe.' },
  { id: 'q2', question: 'Can I return items?', answer: 'Within 30 days.' },
  { id: 'q3', question: 'Do you have a shop?', answer: 'Only online.' },
];
```

**Goal:**

- A `Panel` component shows one FAQ: the question as a button, and the answer below it **only if
  the panel is open**.
- `App` maps `FAQS` to `Panel`s.
- Only one panel can be open at a time. Opening one closes the others.
- No panel is open at the start.
- `Panel` has no `useState`.

**Watch for:** array vs item. Inside the `.map()`, the callback parameter is one FAQ. `FAQS` is the
whole array, and `FAQS.answer` is `undefined`.

**In writing:** why can't each `Panel` own its own `isOpen` state, given the "only one open" rule?

### My solution

```jsx

```

### My answer

---

## Exercise 4: Fix the state that's too high

This works, but the state sits higher than it needs to.

```jsx
import { useState } from 'react';

function Navbar({ menuOpen, onToggle }) {
  return (
    <nav>
      <button onClick={onToggle}>{menuOpen ? 'Close' : 'Menu'}</button>
      {menuOpen && (
        <ul>
          <li>Home</li>
          <li>About</li>
        </ul>
      )}
    </nav>
  );
}

function Layout({ menuOpen, onToggle, children }) {
  return (
    <div className="layout">
      <Navbar menuOpen={menuOpen} onToggle={onToggle} />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleToggle() {
    setMenuOpen((prev) => !prev);
  }

  return (
    <Layout menuOpen={menuOpen} onToggle={handleToggle}>
      <h1>Welcome</h1>
    </Layout>
  );
}
```

**Goal:** move the state to where the rule says. Nothing else in the app reads or changes
`menuOpen`. The page must still work the same.

**Watch for:** renames leave orphans. When props stop being passed, search each component for
the names it no longer receives.

**In writing:** who reads `menuOpen`, and who changes it? So where does it go, and what does
`Layout` no longer have to do?

### My solution

```jsx

```

### My answer

---

## Exercise 5: Shopping list

**Goal:**

- An `AddItemForm` component has a controlled text input and an `Add` button, inside a `<form>`.
- An `ItemList` component renders the items in a `<ul>`, or `Nothing on the list` when it's empty.
- Submitting adds the typed text to the list and clears the input.
- `App` renders both.
- Assume every item is different, so the text can be the key.

**Before writing:** there are two pieces of state here, the text being typed and the list of
items. Ask the question for **each one separately**: who reads it, and who changes it?

**Watch for:** never mutate. Adding to an array in state means a new array, not `.push()`.

**In writing:** which component owns each piece of state, and why are they different?

### My solution

```jsx

```

### My answer

---

## Exercise 6: Pick a movie

```js
const MOVIES = [
  { id: 'm1', title: 'Arrival', year: 2016 },
  { id: 'm2', title: 'Heat', year: 1995 },
  { id: 'm3', title: 'Up', year: 2009 },
];
```

**Goal:**

- A `MovieRow` component renders one `<li>` with the title and a `Show` button.
- `App` maps `MOVIES` to `MovieRow`s inside a `<ul>`.
- The shown movie's row has the class `active`. The others have no class.
- A `MovieDetails` component below the list shows `Heat (1995)` for the chosen movie, plus a
  `Clear` button that un-chooses it. Before anything is chosen, it shows `Choose a movie` and no
  button.
- **State stores only the chosen movie's `id`.**

**Watch for:** pass vs wrap, twice. `Show` needs to send a value up, but does `Clear`? Decide each
one separately.

**In writing:** `MovieRow` wraps its function and `MovieDetails` doesn't need to. Why?

### My solution

```jsx

```

### My answer

---

## Cold recall

1. A child calls `onPick('red')`. Is `'red'` travelling as a prop or as an argument? Which way is
   it going?
2. What's the difference between `onClick={onPick}`, `onClick={onPick('red')}`, and
   `onClick={() => onPick('red')}`?
3. State holds an id. What do you use to get the whole item back, and what does it give you if
   nothing matches?
4. Two pieces of state in the same feature can live in different components. When?
5. State sits higher than it needs to. Name one cost.

<details>
<summary>Answer key</summary>

1. An argument, going up. Props only go down.
2. `{onPick}` passes the function, and React calls it on click (with the event). `{onPick('red')}`
   calls it during render and passes whatever it returns. `{() => onPick('red')}` passes a new
   function that calls `onPick('red')` on click.
3. `.find()`. It returns the first matching item, or `undefined` if nothing matches.
4. When different components read and change them. Each piece goes in the closest component that
   contains everyone using *that* piece (e.g. the draft text stays in the form, while the list goes
   up to the parent).
5. Components in between pass props they never use, and more of the tree re-renders on every
   change.

</details>
