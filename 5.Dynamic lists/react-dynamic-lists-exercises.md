# React Dynamic Lists — Practice Exercises

Six exercises that gradually increase in difficulty. Each has a goal and starter code with the
logic blanked out as `TODO`. Solutions are collapsed at the bottom — try not to peek.

## Read this first

### The one idea underneath all of it

Last unit you learned **JSX is a value**. This unit is the sequel to that sentence:

> **React can render an *array* of JSX values.**

```jsx
const rows = [<li>a</li>, <li>b</li>, <li>c</li>];
return <ul>{rows}</ul>;   // legal. React unpacks the array and draws all three.
```

So the entire unit is one question: *how do you turn an array of **data** into an array of
**JSX**?* And that's plain JavaScript again — it's `.map()`. Nothing here is a React feature. React
just agreed to accept an array where it accepts a value.

### Why `.map()` and not a loop

| | returns |
|---|---|
| `arr.map(fn)` | **a new array** of whatever `fn` returned |
| `arr.forEach(fn)` | `undefined` — always |
| `for (…) { }` | it's a statement; it doesn't evaluate to anything |

You need a *value* inside JSX braces. Only `.map()` hands you one. `forEach` and `for` can't be
used here for the same reason `if` couldn't last unit.

### The trap that will get you: the arrow body

Three ways to write the callback. Two work, one silently renders nothing.

```jsx
items.map((item) => <li>{item}</li>)              // ✅ implicit return
items.map((item) => { return <li>{item}</li>; })  // ✅ braces + explicit return
items.map((item) => { <li>{item}</li> })          // ❌ returns undefined. Blank list, no error.
```

**The moment you type `{` after the arrow, you owe a `return`.** This is your forgotten-`return`
weak spot showing up in a new place — same bug, different scope. It doesn't throw. You just get an
empty list and no clue why.

### Keys

React needs to match the elements it drew last time against the ones you're giving it now. Without
help, it matches by position, which breaks the moment the list changes. A `key` is the item's
**identity**, so React can say "this is the same item, it just moved."

Three rules:

1. **Unique among its siblings.** Not globally unique — two different lists can both use `key={1}`.
2. **Stable.** The same item must get the same key on every render. Never `Math.random()`.
3. **From the data.** An `id` field is what you want. If your data has no id, that's usually a sign
   the data shape is wrong, not that you should invent one at render time.

In the Udemy exercise you wrote `key={item}` where `item` was the string `'Learn React'`. That was
correct — but only because those three strings happened to be unique. Two todos with the same text
and it breaks. **The string being unique was a property of that data, not a rule.**

### Where the key goes

On the **outermost element the callback returns** — the one `.map()` actually hands back.

```jsx
// key on the component, in the PARENT:
{todos.map((t) => <Todo key={t.id} text={t.text} />)}

// NOT on the <li> inside Todo. React never sees that as a list item — it sees <Todo />.
```

And one that surprises everyone: **`key` is not a prop.** React consumes it. Inside `Todo`,
`props.key` is `undefined`. If the child needs the id, pass it *twice*:
`<Todo key={t.id} id={t.id} />`.

### Index as a key

`.map()` gives the callback a second argument — the position:

```jsx
items.map((item, index) => …)
```

Using `index` as the key is the classic wrong answer. It's "unique" and "stable-looking," but it
identifies a **slot**, not an **item** — so when you delete the first item, every remaining item
gets a new key and React thinks the whole list changed. It's harmless for a list that never
changes, and a real bug the moment it does. Use it for *display* (numbering a leaderboard); don't
use it for *identity*.

### The empty list

`[].map(…)` returns `[]`, and React draws nothing for an empty array. So an empty list never
crashes — you get a `<ul>` with nothing in it. If you want a message instead, that's last unit's
job, not this one's. The two units meet in Exercise 4.

### Setup

`src/App.js`. No `useState` in this unit — every list here is a plain `const`. Lists you can add to
come later.

---

## Exercise 1: Shopping list

**Goal:**

- Render the array below as a `<ul>` with one `<li>` per item
- An `<h2>` above it reading `Shopping list`

**Constraint:** no child component. `<li>` directly.

```jsx
const ITEMS = ['Bread', 'Milk', 'Eggs', 'Coffee'];

function App() {
  return (
    <div id="app">
      <h2>Shopping list</h2>
      <ul>
       {ITEMS.map((item)=><li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export default App;
```

**Watch for:** the `<ul>` exists once, the `<li>` repeats. Inside vs. outside the loop.

**In writing:** what type of value does `ITEMS.map(…)` evaluate to? Not "the list" — the *type*.

---

## Exercise 2: Product list

**Goal:**

- Render each product as an `<li>` reading `Name — $Price`, e.g. `Keyboard — $49`
- Key off the `id` field

```jsx
const PRODUCTS = [
  { id: 'p1', name: 'Keyboard', price: 49 },
  { id: 'p2', name: 'Mouse', price: 25 },
  { id: 'p3', name: 'Monitor', price: 189 },
];

function App() {
  return (
    <div id="app">
      <h2>Products</h2>
      <ul>
        {PRODUCTS.map((product)=>
        <li key={product.id}>{product.name}-${product.price}</li>)}
      </ul>
    </div>
  );
}

export default App;
```

**Watch for:** two separate values inside one `<li>`. That's two sets of braces, not one.

**In writing:** why is `key={product.id}` better than `key={product.name}` here, given that all
three names happen to be different?

---

## Exercise 3: Extract the child

**Goal:** same output as Exercise 2, but each row is its own `Product` component.

- `Product` receives `name` and `price` as props and returns the `<li>`
- Put `Product` in the same file, above `App`

```jsx
const PRODUCTS = [
  { id: 'p1', name: 'Keyboard', price: 49 },
  { id: 'p2', name: 'Mouse', price: 25 },
  { id: 'p3', name: 'Monitor', price: 189 },
];

function Product(product){
  return(
    <li>{product.name}-${product.price}</li>
  )}

function App() {
  return (
    <div id="app">
      <h2>Products</h2>
      <ul>
        {PRODUCTS.map((product)=>
        <Product key={product.id} name={product.name} price={product.price} />)}
      </ul>
    </div>
  );
}

export default App;
```

**Watch for:** `Product` has no children, so it self-closes. And prop names must match on both
sides exactly.

**In writing:** you wrote `key={product.id}` in `App`. Inside `Product`, what is `props.key`?

---

## Exercise 4: Only what's left to do

**Goal:**

- Show only the tasks where `done` is `false`
- If there are none left, show `<p>All done!</p>` and **no `<ul>` at all**
- Above the list, an `<h2>` reading `N tasks left` with the real count

```jsx
const TASKS = [
  { id: 't1', title: 'Water the plants', done: false },
  { id: 't2', title: 'Reply to Sam', done: true },
  { id: 't3', title: 'Book the flight', done: false },
  { id: 't4', title: 'Renew passport', done: true },
];

function App() {
  const filtered = TASKS.filter((task) => task.done === false);
  const count = filtered.length 
  return (
    <div id="app">
      <h2>{count} tasks left</h2>
      {count <= 0 ? <p>All done!</p> : 
      <ul>
       {filtered.map((task)=><li key={task.id}>{task.title}</li>)}
      </ul>}
    </div>
  );
}

export default App;
```

**Constraint:** the `.filter()` must be a named variable above the `return`, not chained inline
inside the braces. Both work; this one is about the boundary.

**Then flip both remaining tasks to `done: true` and confirm you get the message and no empty
`<ul>`.**

**Watch for:** the count is *derived* — you already classified this distinction during State. Don't
compute it twice.

**In writing:** `.filter()` and `.map()` both return a new array. What's the difference between
what they put *in* it?

---

## Exercise 5: Leaderboard

**Goal:**

- Render `<li>` rows reading `1. Ana — 320 pts`, `2. Luis — 295 pts`, …
- The position number comes from the array order, not from the data
- Below the list, a `<p>` reading `Total: N pts` across all players

```jsx
const PLAYERS = [
  { id: 'u1', name: 'Ana', score: 320 },
  { id: 'u2', name: 'Luis', score: 295 },
  { id: 'u3', name: 'Mira', score: 240 },
];

function App() {
  const totalScore = PLAYERS.reduce((accumulator, currentPlayer) => {
  return accumulator + currentPlayer.score;
}, 0);

  return (
    <div id="app">
      <h2>Leaderboard</h2>
      <ol>
        {PLAYERS.map((player, index)=>
        <li key={player.id}>{index + 1}. {player.name} - {player.score} pts</li>)}
      </ol>
      <p>Total: {totalScore} pts</p>
    </div>
  );
}

export default App;
```

**Watch for:** `index` starts at `0` and the display starts at `1`. And the total is one thing, so
it lives outside the loop — the same inside/outside call you made in Exercise 1, now with a
computed value instead of a tag.

**In writing:** you're using `index` for the position number. Are you also using it as the `key`?
Say why not, in one sentence.

---

## Exercise 6: Menu with categories

**Goal:**

- Each category is a `<section>` with an `<h3>` for its name and a `<ul>` of its dishes
- Within each category, dishes are listed **cheapest first**
- `MENU` must not be modified

```jsx
const MENU = [
  {
    id: 'c1',
    category: 'Starters',
    dishes: [
      { id: 'd1', name: 'Soup', price: 6 },
      { id: 'd2', name: 'Bruschetta', price: 4 },
    ],
  },
  {
    id: 'c2',
    category: 'Mains',
    dishes: [
      { id: 'd3', name: 'Risotto', price: 14 },
      { id: 'd4', name: 'Steak', price: 22 },
      { id: 'd5', name: 'Pasta', price: 11 },
    ],
  },
];

function App() {
  return (
    <div id="app">
      <h2>Menu</h2>
      {/* TODO: map over the categories.
                Inside that callback, you'll need a second map over that category's dishes.
                Two maps means two keys — on which elements? */}
    </div>
  );
}

export default App;
```

**Watch for:** `.sort()` **mutates the array it's called on** and returns that same array. The
constraint says don't modify `MENU`, so sort a copy. You already know how to copy an array without
mutating it — it's the same operator you used for spreading props.

**In writing:** the outer map's callback returns a `<section>` containing an `<h3>` and a `<ul>`.
Does it need a Fragment? Why or why not?

---

## When you're done

Answer these without looking anything up:

1. Why can't you use `forEach` to render a list?
2. `items.map((i) => { <li>{i}</li> })` — what appears on screen, and why is there no error?
3. What is a key actually *for*? Not "React wants one" — what does React do with it?
4. When is `key={index}` fine, and what exactly breaks when it isn't?
5. You map to `<Row key={r.id} />` and inside `Row` you need that id. What do you do?

---

<details>
<summary><strong>Solutions</strong> — only after you've attempted all six</summary>

### Exercise 1

```jsx
const ITEMS = ['Bread', 'Milk', 'Eggs', 'Coffee'];

function App() {
  return (
    <div id="app">
      <h2>Shopping list</h2>
      <ul>
        {ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

One `<ul>`, four `<li>`. The `<ul>` is outside the map because the page has one list; the `<li>` is
inside because there's one per item.

`ITEMS.map(…)` evaluates to an **array** — specifically an array of four JSX values. React unpacks
it. That's the whole unit in one line.

`key={item}` is acceptable here for the same reason it was in the Udemy exercise: these four
strings are unique. It is not what you'd want in real data.

### Exercise 2

```jsx
const PRODUCTS = [
  { id: 'p1', name: 'Keyboard', price: 49 },
  { id: 'p2', name: 'Mouse', price: 25 },
  { id: 'p3', name: 'Monitor', price: 189 },
];

function App() {
  return (
    <div id="app">
      <h2>Products</h2>
      <ul>
        {PRODUCTS.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

Two braced expressions inside one `<li>`, with plain text (` — $`) between them. The `$` is literal
text, not syntax — it sits outside the braces.

`id` beats `name` because `id` is *guaranteed* unique by whoever designed the data. `name` is
unique here by accident — add a second `Mouse` and you have a duplicate-key bug in a list that
looked fine yesterday. Keys should rest on a guarantee, not on luck.

### Exercise 3

```jsx
const PRODUCTS = [
  { id: 'p1', name: 'Keyboard', price: 49 },
  { id: 'p2', name: 'Mouse', price: 25 },
  { id: 'p3', name: 'Monitor', price: 189 },
];

function Product({ name, price }) {
  return (
    <li>
      {name} — ${price}
    </li>
  );
}

function App() {
  return (
    <div id="app">
      <h2>Products</h2>
      <ul>
        {PRODUCTS.map((product) => (
          <Product key={product.id} name={product.name} price={product.price} />
        ))}
      </ul>
    </div>
  );
}

export default App;
```

The key goes on `<Product />`, because that's what the callback returns — that's what React is
keeping track of. The `<li>` inside `Product` isn't a list React is diffing; it's just what one
component happens to render.

`props.key` inside `Product` is **`undefined`**. React strips `key` out before the props object is
built. It's an instruction to React, not data for your component.

### Exercise 4

```jsx
const TASKS = [
  { id: 't1', title: 'Water the plants', done: false },
  { id: 't2', title: 'Reply to Sam', done: true },
  { id: 't3', title: 'Book the flight', done: false },
  { id: 't4', title: 'Renew passport', done: true },
];

function App() {
  const openTasks = TASKS.filter((task) => !task.done);

  return (
    <div id="app">
      <h2>{openTasks.length} tasks left</h2>
      {openTasks.length === 0 ? (
        <p>All done!</p>
      ) : (
        <ul>
          {openTasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
```

The count is `openTasks.length` — derived, not computed a second time. If you wrote a separate
`.filter().length`, you built the same array twice.

Why a ternary and not `&&`: `openTasks.length === 0 && <p>…</p>` would give you the message but
still leave the `<ul>` sitting there empty, and you'd need a second condition to hide it. Two
visible outcomes → ternary. That's last unit's table.

`.filter()` and `.map()` both return a new array. `filter` returns **some of the same items** —
same length or shorter, items unchanged. `map` returns **the same number of different items** —
same length always, every item transformed. Filter selects; map converts.

### Exercise 5

```jsx
const PLAYERS = [
  { id: 'u1', name: 'Ana', score: 320 },
  { id: 'u2', name: 'Luis', score: 295 },
  { id: 'u3', name: 'Mira', score: 240 },
];

function App() {
  const total = PLAYERS.reduce((sum, player) => sum + player.score, 0);

  return (
    <div id="app">
      <h2>Leaderboard</h2>
      <ol>
        {PLAYERS.map((player, index) => (
          <li key={player.id}>
            {index + 1}. {player.name} — {player.score} pts
          </li>
        ))}
      </ol>
      <p>Total: {total} pts</p>
    </div>
  );
}

export default App;
```

`total` is one value for the whole array, so it's computed above the `return` and rendered outside
the `<ol>`. Same inside/outside decision as Exercise 1.

`index` is used for the number and `player.id` for the key, and that pairing is the point:
`index + 1` is **where this row sits**, `player.id` is **who this row is**. Different questions,
different answers. Key by index and deleting Ana would hand Luis Ana's old key — React would reuse
Ana's element for him rather than removing one.

### Exercise 6

```jsx
function App() {
  return (
    <div id="app">
      <h2>Menu</h2>
      {MENU.map((cat) => (
        <section key={cat.id}>
          <h3>{cat.category}</h3>
          <ul>
            {[...cat.dishes]
              .sort((a, b) => a.price - b.price)
              .map((dish) => (
                <li key={dish.id}>
                  {dish.name} — ${dish.price}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default App;
```

Two maps, two keys: `cat.id` on the `<section>` (what the outer callback returns) and `dish.id` on
the `<li>` (what the inner one returns). Neither is optional and neither covers for the other —
React is diffing two separate lists here.

`[...cat.dishes]` is the same spread you used on props, doing the same job: a fresh array, so
`.sort()` has something of its own to scramble. `cat.dishes.sort(…)` would reorder the original
`MENU` data permanently.

`.sort((a, b) => a.price - b.price)` — numeric ascending. Bare `.sort()` compares as *strings*,
which puts `11` before `6`.

No Fragment needed. The callback returns a `<section>` — that's already one element, and the `<h3>`
and `<ul>` are its children. You'd need a Fragment only if you wanted to return the `<h3>` and
`<ul>` side by side with no wrapper.

### Answers to the closing questions

1. `forEach` returns `undefined`. JSX braces need a value, and `undefined` renders as nothing.
   `map` returns the array you need.
2. **Nothing appears, and there's no error.** The braces after the arrow made it a function *body*,
   so the callback returns `undefined` — `.map()` hands back `[undefined, undefined, undefined]`,
   and React draws nothing for `undefined`. A silently blank list.
3. React uses the key to **match the elements from the previous render to the current one** — to
   decide which items are the same item that moved, which are new, and which are gone. Without one
   it falls back to matching by position.
4. Fine when the list never changes order or length — nothing ever moves, so slot and item mean the
   same thing. It breaks on insert, delete, or reorder: the item's key changes, so React reuses the
   wrong element, and any per-element state (an input's text, a CSS transition) sticks to the
   position instead of following the item.
5. Pass it twice: `<Row key={r.id} id={r.id} />`. `key` is consumed by React and never reaches
   props.

</details>
