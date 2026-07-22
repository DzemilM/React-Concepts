# Props — Final Exam

No building, no StackBlitz. Read the code, answer in your own words, **write your answers
down before opening the key.** Guessing and then reading the answer teaches nothing — commit
to an answer first, even if you're unsure.

There are 14 questions in 3 sections. Answers are collapsed at the bottom.

---

## Section A — Predict the output

For each, say **exactly what appears on screen** (or what breaks, and why).

### A1

```jsx
function Hello({ name }) {
  return <p>Hi {name}</p>;
}

function App() {
  return <Hello nome="Sara" />;
}
```

What renders?

### A2

```jsx
function Price({ amount = 10 }) {
  return <p>{amount}</p>;
}

function App() {
  return (
    <div>
      <Price />
      <Price amount={0} />
      <Price amount={25} />
    </div>
  );
}
```

Three numbers render. Which three?

### A3

```jsx
function Box(props) {
  return <div>{props.children}</div>;
}

function App() {
  return <Box>Hello</Box>;
}
```

What is `props.children` here — a string, an element, or undefined? What renders?

### A4

```jsx
const NUMS = [1, 2, 3];

function App() {
  return <ul>{NUMS.map((n) => <li>{n * 2}</li>)}</ul>;
}
```

What renders, and what (if anything) does React complain about in the console?

### A5

```jsx
function Total({ items }) {
  return <p>{items.reduce((a, b) => a + b.cost)}</p>;
}

function App() {
  return <Total items={[{ cost: 5 }, { cost: 10 }]} />;
}
```

What renders? (Careful — look at what's missing.)

---

## Section B — Spot the bug

Each snippet is broken or wrong. Say **what's wrong, why, and how to fix it.**

### B1

```jsx
function User(name, age) {
  return <p>{name} is {age}</p>;
}
```

### B2

```jsx
function Cart({ cart }) {
  return (
    <ul>
      {cart.items.map((item) => (
        <li key={cart.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### B3

```jsx
function Stats({ data }) {
  return (
    <div>
      const average = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      <p>{average}</p>
    </div>
  );
}
```

### B4

```jsx
function List({ team }) {
  return (
    <div>
      {team.players.map((player) => (
        <ul>
          <li>{player.name}</li>
        </ul>
      ))}
    </div>
  );
}
```

### B5

```jsx
function Order({ order }) {
  const total = order.lines.reduce((sum, line) => sum + line.qty * line.price, 0);
  return (
    <div>
      <p>{order.customer.name}</p>
      <ul>
        {order.lines.map((line) => (
          <li key={line.sku}>{order.lines.qty} × {line.price}</li>
        ))}
      </ul>
      <p>{total}</p>
    </div>
  );
}
```

*(This one is subtle. Only one line is wrong.)*

---

## Section C — Explain it

No code. Answer in your own words, a few sentences each.

### C1
A component receives props. Where do props physically come from, and what *shape* does a
component receive them in (how many arguments does React pass)?

### C2
Why can you write `const x = 5` above a component's `return`, but **not** inside the JSX?
State the rule that governs where each kind of code goes.

### C3
Inside `array.map((thing) => ...)`, why is `thing.name` different from `outerObject.name`?
Explain as if to someone who just got it wrong.

### C4
You have a list of 5 items and a total computed from all 5. One of those goes inside the
`.map()` and one goes outside. Which is which, and what's the general rule?

---

<details>
<summary>Answer key — open only after writing your answers</summary>

## Section A

**A1** — Renders `Hi ` with nothing after it. The prop is passed as `nome` but the component
destructures `name`, so `name` is `undefined`, and React renders `undefined` as nothing. No
error — this is the silent-typo bug class.

**A2** — `10`, `0`, `25`. The key subtlety is the middle one: a default only kicks in when the
prop is **`undefined`** (missing). `0` is a real value that was explicitly passed, so it is
used, *not* replaced by the default. (If defaults triggered on "falsy" values, this would
wrongly print 10.)

**A3** — `props.children` is the **string** `"Hello"`. Renders `Hello` inside a div. `children`
is whatever is nested between the tags — a string, an element, several elements, anything.

**A4** — Renders `2`, `4`, `6` as list items. React logs a console **warning** about a missing
`key` prop on the list items. It still renders — a missing key is a warning, not a crash.

**A5** — It renders `NaN` (or misbehaves). The `reduce` has **no initial value**, so the first
call sets `a` to the first *object* `{cost: 5}` rather than a number, then does
`{cost:5} + 10`. Fix: add `, 0` as reduce's second argument. This is why you always seed a sum
with `0`.

## Section B

**B1** — The params are wrong. React passes **one** argument (the props object), so `name`
becomes the whole props object and `age` is `undefined`. Fix: destructure —
`function User({ name, age })`.

**B2** — The `key` is not unique. `cart.id` is the same for every item in the list, so all
siblings share a key. Fix: use something unique per item, e.g. `key={item.id}` (or another
field guaranteed distinct per item).

**B3** — A `const` **statement** is sitting inside JSX. JSX braces accept expressions (values),
not statements/declarations. Also, as written, that line has no braces at all so it would
render as literal text. Fix: move the `const average = ...` line **above the `return`**, then
use `<p>{average}</p>`.

**B4** — The `<ul>` is **inside** the map, so you get one `<ul>` per player, each containing a
single `<li>` — five separate one-item lists instead of one list of five. Fix: move `<ul>`
outside so it wraps the whole `.map()`. (Also missing a `key` on the repeated element.)

**B5** — The wrong line is `{order.lines.qty}`. `order.lines` is the **array**; it has no
`qty`. Inside the map you already have the single item, so it must be `line.qty`. Everything
else — the reduce with its `, 0`, the nested `order.customer.name`, the unique
`key={line.sku}` — is correct.

## Section C

**C1** — Props come from the attributes (and nested children) written on the component's tag
where it is used by a parent. React bundles them all into **one single object** and passes
that as the component's **one and only argument**. That is why `function C(a, b)` fails and
`function C({ a, b })` works — you are destructuring fields off that one object.

**C2** — `const x = 5` is a **statement**; JSX braces `{ }` only accept **expressions** (things
that evaluate to a value). The rule: **compute above the `return` in plain JavaScript, display
inside the `return` in JSX braces.** Corollary: in plain JS you do *not* wrap values in braces
— `const t = arr.reduce(...)`, never `const t = {arr.reduce(...)}`.

**C3** — `thing` is the **single element** the loop is currently on; the outer object is the
whole container. `.map` hands you one item at a time through the parameter you named, so
inside the callback that variable is the only thing holding this item's fields. Reaching for
the outer object gets you the container (or an unrelated sibling branch of the data), which
usually yields `undefined`.

**C4** — The per-item row goes **inside** the `.map()` (it repeats — once per item). The total
goes **outside** (it exists once for the whole list). General rule: **things that repeat go
inside the loop; things that exist once go outside it.** Same rule explains why `<ul>` wraps
the map rather than living inside it.

</details>

---

## Scoring yourself

- **Section A** (predicting) — tests whether you can run the code in your head.
- **Section B** (debugging) — tests whether you recognize failure modes. This is the one that
  best predicts real-world ability.
- **Section C** (explaining) — tests whether the model is actually in your head or just your
  fingers.

Rough read: 12+ correct with solid C answers → move on, no question. 9–11 → move on, revisit
whatever you missed. Under 9 → one more practice round on the specific things you missed.
