# React Dynamic Lists — Written Exam

22 questions in four sections. **No running code, no looking at the other files.** Write your
answers out, then check them against the collapsed key at the bottom.

Section D is plain JavaScript with no React in it at all. It's there because that's where this unit
actually cost you time — array versus item versus field, and which method returns what.

**Mark yourself honestly.** For predict-the-output, "roughly right" is wrong — the point is whether
you know the exact value. And where a question has two parts, answer both; count the verbs before
you start.

---

## Section A — Predict the output

For each, say **what appears on screen**. If nothing appears, say so. If the console warns or
throws, say that too.

### A1

```jsx
const ITEMS = ['a', 'b'];

function App() {
  return <ul>{ITEMS.map((item) => { <li>{item}</li> })}</ul>;
}
```

### A2

```jsx
const ITEMS = [];

function App() {
  return (
    <div>
      <ul>{ITEMS.map((item) => <li key={item}>{item}</li>)}</ul>
      <p>Done</p>
    </div>
  );
}
```

### A3

```jsx
const PEOPLE = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Bo' },
];

function App() {
  return <p>{PEOPLE.name}</p>;
}
```

### A4

```jsx
const NUMS = [6, 11, 4];

function App() {
  return <p>{[...NUMS].sort().join(', ')}</p>;
}
```

### A5

```jsx
const BOOKS = [
  { id: 'b1', pages: 100 },
  { id: 'b2', pages: 250 },
];

function App() {
  const total = BOOKS.reduce((sum, book) => sum + book, 0);
  return <p>{total}</p>;
}
```

### A6

```jsx
const TAGS = ['react', 'js'];

function App() {
  return (
    <div>
      {TAGS.length && <p>You have tags</p>}
      {TAGS.map((tag, i) => <span key={tag}>{i}. {tag} </span>)}
    </div>
  );
}
```

### A7

```jsx
const ROWS = [
  { id: 'r1', label: 'one' },
  { id: 'r2', label: 'two' },
];

function Row({ label }) {
  return <li key={label}>{label}</li>;
}

function App() {
  return <ul>{ROWS.map((row) => <Row label={row.label} />)}</ul>;
}
```

Two parts: what renders, **and** what does the console say?

---

## Section B — Spot the bug

Each snippet is broken. Say **what's wrong**, **what you'd see on screen**, and **the fix**. Three
parts each.

### B1

```jsx
const TASKS = [
  { id: 't1', title: 'Wash up', done: false },
  { id: 't2', title: 'Email Ana', done: true },
];

const open = TASKS.filter(TASKS.done === false);
```

### B2

```jsx
function Card({ title }) {
  return <li key={title}>{title}</li>;
}

function App() {
  return <ul>{CARDS.map((card) => <Card title={card.title} />)}</ul>;
}
```

### B3

```jsx
const GROUP = { id: 'g1', name: 'Reds', members: ['Ana', 'Bo'] };

const sorted = [...GROUP].sort();
```

### B4

```jsx
{PLAYERS.map((player, index) => (
  <li key={player.id}>{player.index + 1}. {player.name}</li>
))}
```

### B5

```jsx
{CATEGORIES.map((cat) => (
  <section key={cat.id}>
    <h3>cat.label</h3>
  </section>
))}
```

### B6

```jsx
const MENU = [
  { id: 'm1', name: 'Soup', price: 6 },
  { id: 'm2', name: 'Pasta', price: 11 },
];

function App() {
  return (
    <ul>
      {MENU.map((dish) => (
        <li key={dish.id}>{dish.name} — ${dish}</li>
      ))}
    </ul>
  );
}
```

---

## Section C — Explain it

Full sentences. Where a question has two halves, answer both.

**C1.** What does React actually *do* with a `key`? Not "it wants one" — describe the job.

**C2.** `key={index}` is fine for one kind of list and a bug for another. Which is which, and what
specifically goes wrong in the bad case?

**C3.** `.filter()` and `.map()` both return a new array. Describe the difference in what ends up
inside it — mention length in your answer.

**C4.** Why can't you render a list with `forEach`?

**C5.** You write `<Row key={r.id} name={r.name} />`. Inside `Row`, what is `props.key`, and why?
If `Row` needs the id, what do you do?

**C6.** `.sort()` needs a copy first but `.map()` doesn't. Why the difference?

**C7.** You're mapping over categories, and inside each category mapping over its items. How many
keys, and on which elements? Explain what would break if you left the outer one off.

**C8.** In `SCHEDULE.map((day) => { … })`, where does a variable computed from `day` have to live,
and why can't it go above `App`'s `return` with the rest of your derived values?

---

## Section D — Plain JavaScript

No React. Give the exact value.

```js
const SHELF = {
  label: 'Fiction',
  books: [
    { id: 'b1', title: 'Dune', pages: 412 },
    { id: 'b2', title: 'Ubik', pages: 224 },
  ],
};
```

**D1.** `SHELF.length`

**D2.** `SHELF.books.title`

**D3.** `[1, 2, 3].map((n) => { n * 2 })`

**D4.** `SHELF.books.filter((book) => book.pages > 999)`

**D5.** `[...'hi']`

**D6.** In `arr.sort((a, b) => …)`, what do a negative return, a positive return, and `0` each mean?

**D7.** `SHELF.books.reduce((acc, book) => acc + book.pages, 0)` — and what does the `0` at the end
do?

---

<details>
<summary><strong>Answer key</strong> — after you've written all 22</summary>

### Section A

**A1 — nothing renders.** An empty `<ul>`. The `{` after the arrow made it a function body, so the
callback returns `undefined`; `.map()` gives back `[undefined, undefined]` and React draws nothing
for `undefined`. **No error.** This is the silent one.

**A2 — "Done" appears, and nothing else.** `[].map(…)` is `[]`, React draws nothing for an empty
array, and the `<ul>` renders empty. No crash, no warning.

**A3 — nothing appears.** `PEOPLE` is an array; `name` lives on the objects inside it, so
`PEOPLE.name` is `undefined`, and React draws nothing for `undefined`. The `<p>` is there and empty.

**A4 — `11, 4, 6`.** Bare `.sort()` compares as **strings**. `"11"` starts with `"1"`, which sorts
before `"4"` and `"6"`. The spread means `NUMS` itself is untouched.

**A5 — `0[object Object][object Object]`.** `sum + book` with a number and an object is string
concatenation, not arithmetic. No crash, no `NaN`. The fix would be `sum + book.pages` → `350`.

**A6 — "You have tags" appears, then `0. react 1. js`.** `TAGS.length` is `2`, truthy, so `&&`
returns its right operand. Note it would render a stray `0` if the array were empty — that's last
unit's trap sitting inside this unit's code.

**A7 — both rows render (`one`, `two`), and the console warns**: "Each child in a list should have a
unique key prop." The `key` on the `<li>` **inside** `Row` does nothing for this list — React is
tracking the `<Row />` elements the callback returns, and those have no key.

### Section B

**B1.** `.filter()` needs a **function**; this passes the *result* of an expression. Also `TASKS` is
the array — `done` is on the items. **On screen:** a crash, `TASKS.filter is not a function`-style
TypeError (the argument `false` isn't callable). **Fix:**
`TASKS.filter((task) => task.done === false)` or `!task.done`.

**B2.** The key is on the `<li>` inside `Card`, but the map returns `<Card />`. **On screen:** the
list renders fine, with a console warning about missing keys. **Fix:** move it —
`<Card key={card.id} title={card.title} />`.

**B3.** `GROUP` is an object, not an array, so it can't be spread into `[ ]`. **On screen:** a crash
— `TypeError: GROUP is not iterable`. **Fix:** spread the array inside it, `[...GROUP.members]`.

**B4.** `index` is the callback's second **parameter**, not a field on `player`. `player.index` is
`undefined`, and `undefined + 1` is `NaN`. **On screen:** `NaN. Ana`, once per row. **Fix:**
`{index + 1}`.

**B5.** No braces, so `cat.label` is literal text. **On screen:** the words `cat.label` printed in
every heading. **Fix:** `<h3>{cat.label}</h3>`.

**B6.** `${dish}` renders the whole object where a field belongs. **On screen:** React throws —
"Objects are not valid as a React child." (Unlike string concatenation, React refuses rather than
printing `[object Object]`.) **Fix:** `${dish.price}`.

### Section C

**C1.** React uses keys to **match the elements from the previous render against the current ones**
— to decide which item is the same item that moved, which are new, and which are gone. Without keys
it falls back to matching by position.

**C2.** Fine when the list never changes order or length — nothing moves, so slot and item mean the
same thing. A bug on insert, delete or reorder: an item's key changes, so React reuses the wrong
element, and per-element state (an input's text, a transition, focus) sticks to the *position*
instead of following the item.

**C3.** `filter` returns **some of the same items**, unchanged — same length or shorter. `map`
returns **the same number of different items** — always the same length, every item transformed.
Filter selects; map converts.

**C4.** `forEach` returns `undefined`. JSX braces need a value, and `undefined` renders as nothing.
`map` returns the array React can draw.

**C5.** `props.key` is **`undefined`**. React consumes `key` before building the props object — it's
an instruction about list identity, not data for the component. If `Row` needs the id, pass it
twice: `<Row key={r.id} id={r.id} name={r.name} />`.

**C6.** `.sort()` **mutates** — it reorders the array it was called on and returns that same array.
`.map()` and `.filter()` build new arrays and leave the original alone. So only `sort` can damage
your source data, and only `sort` needs the copy.

**C7.** **Two keys**, one per map, each on whatever *that* map's callback returns — the outer
element (say a `<section>`) and the inner one (say an `<li>`). They're two separate lists as far as
React is concerned. Leaving the outer one off means React can't track the categories: reorder or
remove a category and it'll match them by position, reusing the wrong section — plus a console
warning. The inner keys don't help, because they're keys within a different list.

**C8.** It has to live **above that callback's own `return`**, inside the callback body. It can't go
above `App`'s `return` because `day` doesn't exist up there — there's no "current day" until the map
is running. "Compute above the `return`" means *that function's* `return`, and a map callback is a
function.

### Section D

**D1.** `undefined` — `SHELF` is an object; objects have no `.length`.

**D2.** `undefined` — `books` is an array; `title` is on the books inside it.

**D3.** `[undefined, undefined, undefined]` — braces after the arrow, no `return`.

**D4.** `[]` — an empty array. `filter` always returns an array; nothing passed the test.

**D5.** `['h', 'i']` — spreading a string splits it into characters.

**D6.** Negative → `a` comes before `b`. Positive → `b` before `a`. `0` → treat them as equal, leave
their order alone.

**D7.** `636`. The `0` is the **initial value** of the accumulator — where `acc` starts before the
first item. Leave it out and `acc` starts as the first element of the array, which for objects is
how you end up concatenating.

</details>
