# React Props — Practice Exercises (Set 2)

Six more exercises in the same style, covering the same concepts as Set 1 but with fresh
scenarios (and a couple that push a bit harder). Each has a **goal** and **starter code**
with the prop logic left as `TODO` for you to fill in. Don't skip to the bottom — the
solutions are collapsed down there only for when you're genuinely stuck.

Rule for yourself: type them out by hand, run them if you can, and don't move to the next
one until the current one renders exactly what the goal describes.

---

## Exercise 1: BookItem (basics)

**Goal:** Make `BookItem` reusable. It should accept a `title` and an `author` prop and
render them inside the `<h2>` and `<p>`. `App` must render **at least three** books, and one
of them **must** have the title `"1984"` and the author `"George Orwell"`.

```jsx
export function BookItem(props) {
  return (
    <div className="book">
      <h2>{props.title}</h2>
      <p>{props.author}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>My Shelf</h1>
      <BookItem title = "1984" author = "George Orwell" />
      <BookItem title = "Animal Farm" author = "George Orwell" />
      <BookItem title = "Alchemist" author = "Paolo Coello" />
    </div>
  );
}

export default App;
```

---

## Exercise 2: StatCard (non-string props + conditional)

**Goal:** Create a `StatCard` that accepts a `label` (string), a `value` (number), and a
`trend` (string — either `"up"` or `"down"`).

- Render the label in an `<h3>`.
- Render the value rounded to a whole number (hint: `Math.round`).
- If `trend` is `"up"`, render `"▲"` in green-ish text; if `"down"`, render `"▼"`. (You
  decide the markup — the point is the boolean/string-driven branch.)

`App` should render one "up" stat and one "down" stat. Remember numbers get curly braces:
`value={1234.6}`.

```jsx
export function StatCard(props) {
  return (
    <div className="stat">
      <h3>{props.label}</h3>
      <p>{Math.round(props.value)}</p>
      <span>{props.trend === "up" ? "▲" : "▼"}</span>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Dashboard</h1>
      <StatCard label="labell" value={234.96} trend = "up" />
      <StatCard label="second" value={1234.6} trend = "down" />
    </div>
  );
}

export default App;
```

---

## Exercise 3: Badge (destructuring + default values)

**Goal:** Build a `Badge` that accepts `text` and `color`. Use **destructuring in the
parameter list** (not `props.xxx`) and give `color` a **default value** of `"gray"`.

- Apply `color` as the `className`.
- `App` should render three badges: one `"green"`, one `"red"`, and one with **no color prop
  at all** (must fall back to `"gray"`).

```jsx
export function Badge({text, color="gray"}) {
  return <span className={color}>{text}</span>;
}

function App() {
  return (
    <div id="app">
      <Badge color="green" text="some text" />
      <Badge color="red" text="heres another text" />
      <Badge text="some text" />
    </div>
  );
}

export default App;
```

---

## Exercise 4: EmployeeRow (spread + map)

**Goal:** Render one `EmployeeRow` per entry in the data array **without writing each prop
by hand** — use the spread operator (`{...employee}`), and build the list with `.map()`
(don't forget `key`).

- `EmployeeRow` accepts `name`, `role`, and `salary` and renders them.
- Format `salary` with a `$` and thousands separators if you can (hint:
  `salary.toLocaleString()`), otherwise just render the number.

```jsx
const EMPLOYEES = [
  { id: "e1", name: "Nadia", role: "Designer", salary: 62000 },
  { id: "e2", name: "Omar", role: "Engineer", salary: 88000 },
  { id: "e3", name: "Lena", role: "PM", salary: 75000 },
];

export function EmployeeRow({name, role, salary}) {
  return (
    <div className="row">
      <p>{name}</p>
      <p>{role}</p>
      <p>{salary.toLocaleString()}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Team</h1>
      {EMPLOYEES.map((employee) => (
        <EmployeeRow key={employee.id} {...employee} />
      ))}
    </div>
  );
}

export default App;
```

---

## Exercise 5: Card (children + composition)

**Goal:** Create a generic `Card` that uses the special **`children`** prop, so *any* JSX
placed between its tags shows up inside it. Then use it to wrap other content.

- `Card` accepts a `title` and `children`. It renders the title in an `<h2>`, then the
  `children` below it.
- `App` must use `Card` **at least twice**, and the children must be **different each time**
  (e.g. one wraps a paragraph, another wraps a `<ul>` or a `<button>`). This proves the
  children slot is truly generic.

```jsx
export function Card({title, children}) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <Card title="About">
        <p>I am the Children</p>
      </Card>
      <Card title="Sup">
        <h1>I am the Children</h1>
      </Card>
    </div>
  );
}

export default App;
```

---

## Exercise 6: OrderSummary (nested objects + arrays of objects — challenge)

**Goal:** Build an `OrderSummary` that accepts a single `order` prop, an **object** shaped
like this:

```js
{
  id: "A-100",
  customer: { name: "Priya", city: "Boston" },
  items: [
    { name: "Keyboard", qty: 1, price: 45 },
    { name: "Mouse", qty: 2, price: 20 },
  ],
}
```

- Render the order id and the customer's name **and** city (note the nested object:
  `order.customer.name`).
- Render each item as an `<li>` showing `name`, `qty`, and line total (`qty * price`). Use
  `.map()` with a `key`.
- Compute and render the **grand total** across all items. (Hint: `reduce`, or sum inside a
  loop — your call.)
- `App` must render **at least two** orders. Bonus: pass a `discount` prop (a number like
  `0.1` for 10%) with a **default of `0`**, and apply it to the grand total.

```jsx
export function OrderSummary({ order, discount=0}) {
  return (
    <div className="order">
      <p>id={order.id}</p>
      <p>Name={order.customer.name}</p>
      <p>City={order.customer.city}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.name}>
            {item.name} — qty {item.qty} — total {item.qty * item.price}
          </li>
        ))}
      </ul>
      <h2>Total: {order.items.reduce((runningTotal, item) => runningTotal + item.qty * item. price, 0)}
      </h2>
    </div>
  );
}

function App() {
  const orderA = {
    id: "A-100",
    customer: { name: "Priya", city: "Boston" },
    items: [
      { name: "Keyboard", qty: 1, price: 45 },
      { name: "Mouse", qty: 2, price: 20 },
    ],
  };
  const orderB = {
    id: "A-230",
    customer: { name: "Dude", city: "Vegas" },
    items: [
      { name: "Mis", qty: 4, price: 25 },
      { name: "Tastature", qty: 2, price: 20 },
    ],
  };

  return (
    <div id="app">
      <h1>Orders</h1>
      <OrderSummary order={orderA} />
      <OrderSummary order={orderB} />
    </div>
  );
}

export default App;
```

---

## Self-check questions (answer these in your head before peeking)

1. Why do `price={9.99}` and `inStock={true}` need curly braces, but `name="Ada"` doesn't?
2. What does the `children` prop actually contain, and where does React get its value from?
3. What breaks if you forget the `key` prop in a `.map()`, and *why* does React want it?
4. `{...user}` — what exactly is it expanding into, and what would it look like written out
   by hand?
5. When you write `function Badge({ color = "gray" })`, when does the default `"gray"`
   actually kick in — is it when `color` is missing, or when it's `null`, or both?

<details>
<summary>Self-check answers</summary>

1. **Quotes make a string; braces mean "this is JavaScript."** `name="Ada"` is already the string
   you want. `9.99` is a number and `true` is a boolean, so they need braces to arrive as those
   types — `price="9.99"` would hand over the *text* `"9.99"`, which breaks arithmetic.
2. **Whatever sits between the opening and closing tags.** `<Box>Hello</Box>` gives
   `children === "Hello"`. React fills it in automatically — you never write `children=` as an
   attribute.
3. React logs *"Each child in a list should have a unique key prop."* It's a warning, not an
   error, so it still renders. React uses keys to tell **which item is which** between renders; without
   them it can reuse the wrong DOM node when the list is reordered or something is removed from
   the middle.
4. `{...user}` spreads the object's own properties into separate props. If `user` is
   `{ name: "Ada", age: 36 }`, then `<Card {...user} />` is identical to
   `<Card name="Ada" age={36} />`.
5. **Only when the prop is `undefined`** — either not passed at all, or passed as literal
   `undefined`. It does **not** kick in for `null`, `0`, `""` or `false`; those are real values, so
   they're used as-is. That's why `<Price amount={0} />` renders `0`, not the default.

</details>

---

<details>
<summary>⚠️ Solutions — only open when you've truly given each one a real attempt</summary>

### 1. BookItem

```jsx
export function BookItem(props) {
  return (
    <div className="book">
      <h2>{props.title}</h2>
      <p>{props.author}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>My Shelf</h1>
      <BookItem title="1984" author="George Orwell" />
      <BookItem title="Dune" author="Frank Herbert" />
      <BookItem title="The Hobbit" author="J.R.R. Tolkien" />
    </div>
  );
}

export default App;
```

### 2. StatCard

```jsx
export function StatCard(props) {
  return (
    <div className="stat">
      <h3>{props.label}</h3>
      <p>{Math.round(props.value)}</p>
      <span style={{ color: props.trend === "up" ? "green" : "red" }}>
        {props.trend === "up" ? "▲" : "▼"}
      </span>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Dashboard</h1>
      <StatCard label="Revenue" value={1234.6} trend="up" />
      <StatCard label="Churn" value={87.2} trend="down" />
    </div>
  );
}

export default App;
```

### 3. Badge

```jsx
export function Badge({ text, color = "gray" }) {
  return <span className={color}>{text}</span>;
}

function App() {
  return (
    <div id="app">
      <Badge text="Active" color="green" />
      <Badge text="Error" color="red" />
      <Badge text="Neutral" />
    </div>
  );
}

export default App;
```

### 4. EmployeeRow

```jsx
const EMPLOYEES = [
  { id: "e1", name: "Nadia", role: "Designer", salary: 62000 },
  { id: "e2", name: "Omar", role: "Engineer", salary: 88000 },
  { id: "e3", name: "Lena", role: "PM", salary: 75000 },
];

export function EmployeeRow({ name, role, salary }) {
  return (
    <div className="row">
      <strong>{name}</strong> — {role} — ${salary.toLocaleString()}
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Team</h1>
      {EMPLOYEES.map((employee) => (
        <EmployeeRow key={employee.id} {...employee} />
      ))}
    </div>
  );
}

export default App;
```

Note: spreading `{...employee}` also passes `id` as a prop. `EmployeeRow` just ignores it,
which is fine. If it bugs you, you can destructure only what you need (as above).

### 5. Card

```jsx
export function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <Card title="About">
        <p>This card wraps a paragraph.</p>
      </Card>
      <Card title="Tasks">
        <ul>
          <li>Learn props</li>
          <li>Drill props</li>
        </ul>
      </Card>
    </div>
  );
}

export default App;
```

### 6. OrderSummary

```jsx
export function OrderSummary({ order, discount = 0 }) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );
  const grandTotal = subtotal * (1 - discount);

  return (
    <div className="order">
      <h2>Order {order.id}</h2>
      <p>
        {order.customer.name} — {order.customer.city}
      </p>
      <ul>
        {order.items.map((item) => (
          <li key={item.name}>
            {item.name} × {item.qty} = ${item.qty * item.price}
          </li>
        ))}
      </ul>
      <p>Total: ${grandTotal.toFixed(2)}</p>
    </div>
  );
}

function App() {
  const orderA = {
    id: "A-100",
    customer: { name: "Priya", city: "Boston" },
    items: [
      { name: "Keyboard", qty: 1, price: 45 },
      { name: "Mouse", qty: 2, price: 20 },
    ],
  };
  const orderB = {
    id: "A-101",
    customer: { name: "Sam", city: "Denver" },
    items: [
      { name: "Monitor", qty: 2, price: 150 },
      { name: "Cable", qty: 3, price: 8 },
    ],
  };

  return (
    <div id="app">
      <h1>Orders</h1>
      <OrderSummary order={orderA} discount={0.1} />
      <OrderSummary order={orderB} />
    </div>
  );
}

export default App;
```

</details>
```
