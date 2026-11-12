# Lifting State Up — Written Exam

20 questions in four sections. **No running code, no looking at the other files.** Write your answer
under each question, then check against the collapsed key at the bottom.

This exam tests lifting state up and nothing else. There's no syntax, and nothing asks you to read
back code you wrote. Sections C and D are aimed at the two points that were still shaky after the
cold test: state that belongs in **one** component, and what `.find()` gives you when nothing
matches.

**Mark yourself honestly.** For predict-the-output, "roughly right" is wrong. For explain-it, a right
idea in fuzzy words is half marks.

---

## Section A — Predict what happens

### A1

```jsx
function Counter({ count, onAdd }) {
  return <button onClick={onAdd}>{count}</button>;
}

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Counter count={count} onAdd={() => setCount(count + 1)} />
      <Counter count={count} onAdd={() => setCount(count + 1)} />
    </>
  );
}
```

The user clicks the **first** button twice. What does each button show?

**My answer:**

### A2

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

export default function App() {
  return (
    <>
      <Counter />
      <Counter />
    </>
  );
}
```

The user clicks the **first** button twice. What does each button show? And why is it different from
A1?

**My answer:**

### A3

```jsx
const COLORS = [
  { id: 'c1', name: 'Red' },
  { id: 'c2', name: 'Green' },
  { id: 'c3', name: 'Blue' },
];

function Swatch({ name, isChosen, onChoose }) {
  return (
    <li className={isChosen ? 'chosen' : ''}>
      <button onClick={onChoose}>{name}</button>
    </li>
  );
}

export default function App() {
  const [chosenId, setChosenId] = useState('c2');

  return (
    <ul>
      {COLORS.map((c) => (
        <Swatch
          key={c.id}
          name={c.name}
          isChosen={c.id === chosenId}
          onChoose={() => setChosenId(c.id)}
        />
      ))}
    </ul>
  );
}
```

1. On the first render, which `<li>` has the class `chosen`?
2. The user clicks `Blue`. What is `chosenId` now, and which `<li>` has the class?

**My answer:**

### A4

```jsx
const ITEMS = [
  { id: 'i1', name: 'Pen' },
  { id: 'i2', name: 'Cup' },
];

function Details({ item }) {
  return <p>{item ? item.name : 'Nothing selected'}</p>;
}

export default function App() {
  const [selectedId, setSelectedId] = useState('');
  const selected = ITEMS.find((i) => i.id === selectedId);

  return <Details item={selected} />;
}
```

1. On the first render, what is `selected`, and what does `Details` show?
2. Someone changes the last line to `<Details name={selected.name} />` (and `Details` to read
   `name`). What happens on the first render?

**My answer:**

### A5

```jsx
function Row({ key, label }) {
  return <li>{label} ({key})</li>;
}

<Row key="r1" label="First" />
```

What does the `<li>` show? Why?

**My answer:**

---

## Section B — Spot the bug

For each one: what goes wrong **on screen**, and the one-line fix.

### B1

```jsx
function Item({ id, label, onPick }) {
  return <button onClick={() => onPick(id)}>{label}</button>;
}

// inside App's map:
<Item key={item.id} id={item.id} label={item.label} onPick={handlePick(item.id)} />
```

**My answer:**

### B2

```jsx
function Card({ title, isSelected, onSelect }) {
  return (
    <div className={isSelected ? 'selected' : ''}>
      {title} <button onClick={onSelect}>Select</button>
    </div>
  );
}

export default function App() {
  const [isSelected, setIsSelected] = useState(false);

  return CARDS.map((card) => (
    <Card
      key={card.id}
      title={card.title}
      isSelected={isSelected}
      onSelect={() => setIsSelected(true)}
    />
  ));
}
```

**My answer:**

### B3

```jsx
function Switch({ on, toggle }) {
  return <button onClick={toggle}>{on ? 'On' : 'Off'}</button>;
}

export default function App() {
  const [isOn, setIsOn] = useState(false);

  function handleToggle() {
    setIsOn((prev) => !prev);
  }

  return <Switch on={isOn} onToggle={handleToggle} />;
}
```

**My answer:**

### B4

```jsx
function Row({ label }) {
  return <li>{label}</li>;
}

// inside App's map:
<Row key={row.id} label={row.label} className={row.id === openId ? 'open' : ''} />
```

The comparison is right, but the open row never gets the class.

**My answer:**

### B5

```jsx
function Display({ initial }) {
  const [value] = useState(initial);
  return <p>{value}</p>;
}

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Display initial={count} />
    </>
  );
}
```

**My answer:**

---

## Section C — Where does the state go?

For each one: **which component** owns the state, and **why**, in terms of who reads it and who
changes it.

### C1

```
App
└── Page
    ├── Sidebar
    │   └── ThemeButton   (toggles dark mode)
    └── Content
        └── Article       (uses dark mode for its class)
```

**My answer:**

### C2

```
App
└── FaqList
    └── FaqItem × 5   (each has its own Show/Hide button for its answer)
```

Any number of answers can be open at once.

**My answer:**

### C3

The same tree as C2, but now **only one answer can be open at a time.** Opening one closes the others.

**My answer:**

### C4

```
App
├── Signup
│   ├── NameInput   (a text input for the name)
│   └── Preview     (shows "Hi, Ana" and "3 letters")
└── Footer          (static text)
```

1. Where does the typed name live?
2. Is the letter count state? Why or why not?

**My answer:**

### C5

```
App
├── ProductList
│   └── ProductCard × 10   (a quantity picker, 1–5, plus an Add to cart button)
└── CartSummary            (shows how many items are in the cart)
```

The quantity picker's number only matters on its own card until **Add to cart** is clicked.

1. Where does each card's chosen quantity live?
2. Where does the cart live?

**My answer:**

---

## Section D — Explain it

### D1

Props only flow down. So how does a child change state that lives in its parent? Use the words
**prop** and **argument**.

**My answer:**

### D2

A row needs to know whether it's the selected one. Why store the selected item's **id**, and not a
`true`/`false`? And why not the whole object? One problem for each.

**My answer:**

### D3

Why isn't "put all state in `App`" a good default? Two costs.

**My answer:**

### D4

C2 and C3 have the same components, but the state goes in a different place. What changed, and why
does that move the state?

**My answer:**

### D5

When does a child wrap the function it gets (`() => onPick(id)`), and when can it pass it bare
(`onClick={onClear}`)? Give the rule and the reason behind it.

**My answer:**

---

<details>
<summary>Answer key</summary>

**A1.** Both show `2`. There's one `count`, in `App`. Clicking either button updates it, `App`
re-renders, and both `Counter`s receive the same new value.

**A2.** The first shows `2`, the second `0`. Each `Counter` has its own `useState`, so there are two
separate counts. Clicking one never touches the other. In A1 there was one count in the parent.

**A3.** 1: Green (`'c2'`). 2: `chosenId` is `'c3'`, and only Blue's `<li>` has `chosen`. Green loses
it, because every row's comparison is worked out again on the new render.

**A4.** 1: `selected` is `undefined`, because no id matches `''`. `Details` shows `Nothing selected`.
2: It crashes. `App` evaluates `selected.name` while building the props, and you can't read a field
of `undefined`. Passing the whole object (or `undefined`) and checking it inside the child avoids
that.

**A5.** `First ()`. React keeps `key` for itself and never passes it to the component, so `key` is
`undefined` inside `Row`, and `undefined` prints nothing. Pass the id again under another name if
the child needs it.

**B1.** `handlePick(item.id)` runs **during render**, for every item. It calls the setter while
rendering, which triggers another render, and so on. React stops it with an error. Even without
that, `onPick` would be the return value (`undefined`), so clicks would do nothing. Fix:
`onPick={handlePick}`. The child already wraps and sends its id.

**B2.** After any click, **every** card is selected. One `true`/`false` can't say which card. Fix:
store the id (`useState('')`), use `isSelected={card.id === selectedId}`, and
`onSelect={() => setSelectedId(card.id)}`.

**B3.** Clicking does nothing. `App` passes `onToggle`, but `Switch` reads `toggle`, which is
`undefined`, so the button has no handler. Fix: name it `onToggle` in `Switch` (or pass `toggle=` from
`App`). The names must match on both ends.

**B4.** `className` on a component tag is only a prop, and `Row` never uses it. Fix: have `Row`
receive it (or an `isOpen` true/false) and put the class on its `<li>`.

**B5.** `Display` stays at `0`. `useState(initial)` uses `initial` only on the first render, so later
values of the prop are ignored. Fix: no state in `Display`; just show the prop
(`function Display({ value }) { return <p>{value}</p>; }`).

**C1.** `Page`. `ThemeButton` changes it and `Article` reads it. They're in different branches, and
`Page` is the closest component that contains both. `App` is higher than needed, and `Sidebar` or
`Content` would each miss one of them.

**C2.** In each `FaqItem`. Each item is the only one that reads and changes its own open/closed
value, so nothing needs to be shared.

**C3.** `FaqList`. Opening one item has to close the others, so all five depend on **one** value
(the open item's id). Their closest common parent is `FaqList`.

**C4.** 1: `Signup`. `NameInput` changes it, `Preview` reads it, and `Signup` contains both.
`Footer` doesn't need it, so not `App`. 2: No. It's derived from the name (`name.length`), so it's
worked out on every render.

**C5.** 1: In each `ProductCard`. Until Add is clicked, only that card reads and changes it.
2: In `App`. `ProductCard` changes it (through a function passed down via `ProductList`), and
`CartSummary` reads it. `App` is the closest common parent.

**D1.** The parent passes a **function** down as a **prop**. The child calls it and gives the value
as an **argument**. The function runs in the parent, so it can call the parent's setter. Values and
functions go down as props, and the user's choice goes up as an argument.

**D2.** `true`/`false` can't say **which** item, so every row would look selected. A whole object
copies data that's already in the array, so it can go stale if the array changes. The id points at
one item, and everything else (`isSelected`, the details) is derived from it.

**D3.** Components in between have to pass props they never use. And every change re-renders more of
the tree than it needs to, including parts like a `Header` that don't care.

**D4.** The "only one open" rule. Opening one item now affects the others, so they share one value.
Shared state goes in the closest common parent. When the items are independent, each one is the only
reader and changer of its own state, so it stays inside.

**D5.** The child wraps when it has a value to add that the parent doesn't know, like which seat or
which option. It passes the function bare when it has nothing to add (`Clear`, `Stop`, a toggle), or
when the event itself is what the parent wants, as with an input's `onChange`.

</details>
