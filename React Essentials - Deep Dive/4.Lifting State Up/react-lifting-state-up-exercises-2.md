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
import { useState } from 'react';

function Stars({ pickStar }) {
  return (
    <>
      <button onClick={() => pickStar(1)}>1</button>
      <button onClick={() => pickStar(2)}>2</button>
      <button onClick={() => pickStar(3)}>3</button>
      <button onClick={() => pickStar(4)}>4</button>
      <button onClick={() => pickStar(5)}>5</button>
    </>
  );
}

function RatingText({ pickedStars }) {
  return <p>{pickedStars ? `You rated ${pickedStars}/5` : 'Not rated yet'}</p>;
}

export default function App() {
  const [stars, setStars] = useState(0);

  function handleStar(picked) {
    setStars(picked);
  }

  return (
    <>
      <Stars pickStar={handleStar} />
      <RatingText pickedStars={stars} />
    </>
  );
}
```

### My answer

`Stars` knows the `4` first: the button's arrow function calls `pickStar(4)`. The `4` goes up as an
**argument** to `App`'s function (`pickStar` is `handleStar`), arrives as the parameter `picked`, and
`setStars` stores it.

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
import { useState } from 'react';

function ColorButtons({ onPick }) {

  return (
    <div>
      <button onClick={() => onPick('red')}>Red</button>
      <button onClick={() => onPick('green')}>Green</button>
      <button onClick={() => onPick('blue')}>Blue</button>
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

### My answer

Fixes: wrapped each button in an arrow function, and deleted the unused `useState` in
`ColorButtons`.

`onClick={onPick('red')}` **calls** `onPick` while React draws the button, so `onClick` receives
its return value, `undefined`, and clicking does nothing. That call is `handlePick('red')`, which
runs `setColor` straight away. All three buttons do it during render, so the last one wins and
`Colour: blue` shows before any click.

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
import { useState } from 'react';

const FAQS = [
  {
    id: 'q1',
    question: 'Do you ship abroad?',
    answer: 'Yes, to most of Europe.',
  },
  { id: 'q2', question: 'Can I return items?', answer: 'Within 30 days.' },
  { id: 'q3', question: 'Do you have a shop?', answer: 'Only online.' },
];

function Panel({ question, answer, isOpen, clickQuestion }) {
  return (
    <>
      <button onClick={() => clickQuestion(question)}>{question}</button>
      {isOpen && <p>{answer}</p>}
    </>
  );
}

export default function App() {
  const [ openQuestion, setOpenQuestion] = useState('');

  function handleQuestion(par) {
    setOpenQuestion(par);
  }

  return (
    <ul>
      {FAQS.map((q) => {
        return (
          <li key={q.id}>
            <Panel
              question={q.question}
              clickQuestion={handleQuestion}
              answer={q.answer}
              isOpen={q.question === openQuestion}
            />
          </li>
        );
      })}
    </ul>
  );
}
```

### My answer

`App` holds **one** value, `openQuestion`, and every panel's `isOpen` is a comparison against it.
One value can only match one question, so only one panel can be open. If each `Panel` had its own
state, there would be three separate values that can't see each other, so opening one couldn't close
the others.

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
import { useState } from 'react';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleToggle() {
    setMenuOpen((prev) => !prev);
  }

  return (
    <nav>
      <button onClick={handleToggle}>{menuOpen ? 'Close' : 'Menu'}</button>
      {menuOpen && (
        <ul>
          <li>Home</li>
          <li>About</li>
        </ul>
      )}
    </nav>
  );
}

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <h1>Welcome</h1>
    </Layout>
  );
}
```

### My answer

`Navbar` reads `menuOpen` (the button label and the menu) and `Navbar`'s button changes it. Only one
component uses it, so the state goes in `Navbar` itself. Lifting is for when several components
share a value. `Layout` no longer has to receive `menuOpen` and `onToggle` and pass them on to
`Navbar` without using them.

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
import { useState } from 'react';

function AddItemForm({ submitAdd }) {
  const [item, setItem] = useState('');

  function handleItem(event) {
    setItem(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitAdd(item);
    setItem('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={item} onChange={handleItem} />
      <button>Add</button>
    </form>
  );
}

function ItemList({ listItems }) {
  return (
    <div>
      {listItems.length ? (
        <ul>
          {listItems.map((item) => {
            return <li key={item}>{item}</li>;
          })}
        </ul>
      ) : (
        'Nothing on the list'
      )}
    </div>
  );
}

export default function App() {
  const [groceries, setGroceries] = useState([]);

  function handleAdd(newItem) {
    setGroceries([...groceries, newItem]);
  }

  return (
    <>
      <AddItemForm submitAdd={handleAdd} />
      <ItemList listItems={groceries} />
    </>
  );
}

```

### My answer

The typed text (`item`) stays in `AddItemForm`, because only the form reads and changes it. The
list (`groceries`) goes up to `App`, because `AddItemForm` changes it (through `submitAdd`) and
`ItemList` reads it, and `App` is their closest common parent. Each piece of state goes in the
closest component that contains everyone using that piece.

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
import { useState } from 'react';

const MOVIES = [
  { id: 'm1', title: 'Arrival', year: 2016 },
  { id: 'm2', title: 'Heat', year: 1995 },
  { id: 'm3', title: 'Up', year: 2009 },
];

function MovieRow({ title, titleId, clickShow, isActive }) {
  return (
    <li className={isActive ? 'active' : ''}>
      {title}
      <button onClick={() => clickShow(titleId)}>Show</button>
    </li>
  );
}

export default function App() {
  const [shownId, setShownId] = useState(null);
  const shownMovie = MOVIES.find((m) => m.id === shownId);

  function handleShow(par) {
    setShownId(par);
  }

  function handleClear() {
    setShownId(null);
  }

  return (
    <>
      <ul>
        {MOVIES.map((movie) => {
          return (
            <MovieRow
              title={movie.title}
              key={movie.id}
              titleId={movie.id}
              clickShow={handleShow}
              isActive={movie.id === shownId}
            />
          );
        })}
      </ul>
      <MovieDetails shownMovie={shownMovie} clickClear={handleClear} />
    </>
  );
}

function MovieDetails({ shownMovie, clickClear }) {
  return (
    <>
      <p>
        {shownMovie
          ? `${shownMovie.title} (${shownMovie.year})`
          : 'Choose a movie'}
      </p>
      {shownMovie ? <button onClick={clickClear}>Clear</button> : null}
    </>
  );
}
```

### My answer

`MovieRow` wraps because it has to send a value up as an argument: the movie's id
(`clickShow(titleId)`). `Clear` doesn't send anything. `App` already knows what to do (set the id
back to `null`), so `MovieDetails` can pass the function bare and React calls it on click.

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
