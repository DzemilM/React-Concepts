# State — Final Exam

No building, no StackBlitz. Read the code, answer in your own words, **write your answers down
before opening the key.** Guessing then reading teaches nothing — commit to an answer first, even
if you're unsure.

20 questions in 4 sections. Answers are collapsed at the bottom.

**When a question asks "what shows on screen," it means what the user sees after React has
finished** — not what a variable holds internally. Those two disagree more often than you'd think,
and telling them apart is most of this exam.

---

## Section A — Predict the output

### A1

```jsx
function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>Go</button>
    </div>
  );
}
```

You click **once**. What number is on screen? Explain what `count` is during that function run.

Answer:

### A2

```jsx
function handleClick() {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
}
```

Same component, this handler instead. You click once. What number now, and why is it different
from A1?

Answer:

### A3

```jsx
function App() {
  let count = 0;

  function handleClick() {
    count = count + 1;
    console.log(count);
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>Go</button>
    </div>
  );
}
```

You click five times. What does the **console** say, and what does the **screen** say? Both halves.

Answer:

### A4

```jsx
const [count, setCount] = useState(0);
```

The count is currently 7. React re-renders. That line runs again, with `0` written right there in
it. Why doesn't the count go back to 0?

Answer:

### A5

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count);
}
```

Count is 0. You click once. What does the console log — 0 or 1? Why?

Answer:

### A6

```jsx
function handleAdd() {
  items.push('milk');
  setItems(items);
}
```

`items` is `["apple"]`. You click Add. What's in the array afterwards, and what appears on screen?
Both halves — they don't match.

Answer:

### A7

```jsx
function handleDelayed() {
  setTimeout(() => {
    setScore(score + 1);
  }, 3000);
}
```

Score is 0. You click three times within one second, then wait. What's the score after three
seconds? What value did each callback capture, and when?

Answer:

---

## Section B — Spot the bug

Each of these has exactly one thing wrong. Name it, say what the user sees, and fix it.

### B1

```jsx
function handleReset() {
  setCount(count = 0);
}
```

Answer:

### B2

```jsx
<button onClick={handleClick()}>Save</button>
```

Answer:

### B3

```jsx
function handleIncrement() {
  useState(count + 1);
}
```

Answer:

### B4

```jsx
{isLoggedIn ? <p>Welcome back!</p>}
```

Answer:

### B5

```jsx
<input type="text" value={name} />
```

The user can't type in this box. Why?

Answer:

### B6

```jsx
function handleRemove(nameToRemove) {
  setGuests(guests.filter((guest) => guest === nameToRemove));
}
```

Answer:

### B7

```js
const subtotal = (quantity * price).toFixed(2);
const total = subtotal + shipping;
```

Quantity 4, price 10, shipping 5. What does `total` end up as, and why?

Answer:

### B8

```jsx
const visible = guests.filter((g) => g.toLowerCase().includes(query.toLowerCase()));

// ...
{visible.map((guest, index) => (
  <li key={index}>
    {guest}
    <button onClick={() => handleRemove(index)}>Remove</button>
  </li>
))}
```

`guests` is `["Alice", "Bob", "Carl"]` and the user has typed `"c"` in the search box. They click
Remove next to Carl. Who actually gets removed, and why?

Answer:

---

## Section C — Explain it

In your own words. One or two sentences each — but answer **both halves** where there are two.

### C1

Why can't a normal `let` variable inside a component be used to update the screen? Name the two
things `useState` does that a `let` can't.

Answer:

### C2

Where does the value in `useState` actually live? What happens to it when the component is removed
from the screen?

Answer:

### C3

After `setCount(5)` runs, the variable `count` is still the old value for the rest of that
function. Why? When does the new value become visible?

Answer:

### C4

When must you use `setX((prev) => ...)` instead of `setX(value)`? Give the rule, and one situation
where the plain form genuinely breaks.

Answer:

### C5

Why does `items.push(x)` fail to update the screen when `setItems([...items, x])` works? Your
answer must say what React does with the value you hand it.

Answer:

---

## Section D — State, derived, or constant?

For each value, say which of the three it is, and why in a few words.

A shop page where the user types a **quantity** and picks a **size** from three buttons.
Unit price is fixed at £9.99. VAT is 20%.

### D1
The quantity typed by the user.

Answer:

### D2
The unit price, £9.99.

Answer:

### D3
The subtotal (quantity × unit price).

Answer:

### D4
The selected size.

Answer:

### D5
Whether the "Add to basket" button is disabled because the quantity is 0.

Answer:

---

<details>
<summary><strong>Answer key</strong> — open only after you've written all 20</summary>

### A1 — **1**

`count` is a `const` belonging to that one run of the component function. `setCount` puts a value
in React's slot and requests a re-render; it cannot reach back and change your local variable. Both
lines read `count` as `0`, both compute `1`, and the second overwrites the first.

### A2 — **2**

You're handing React an instruction rather than a number. React runs each function in turn with the
latest value: 0 → 1, then 1 → 2. Each call builds on the one before instead of overwriting it.

### A3 — **Console: 1, 2, 3, 4, 5. Screen: 0.**

The variable really does increase — but nothing tells React to re-run `App()`, so the JSX on screen
is still the output of the first call, with `0` baked into it. And if something else *did* trigger a
re-render, `let count = 0` would run again and wipe all five clicks.

### A4 — Because it's the **initial** value, not *the* value.

React uses it once, on the very first render, to fill the slot. On every render after that it's
ignored — `useState` looks up what's already in the slot and hands that back. The `0` is dead weight
from render two onwards.

### A5 — **0**

Same reason as A1. `setCount` doesn't modify the local `count`; it schedules a new value for the
next render. During *this* run, `count` is still 0. The new value only appears when the component
function runs again and `useState` returns it fresh.

### A6 — **The array is `["apple", "milk"]`. The screen still shows only "apple".**

`push` modified the array in place and handed back the same array. React compares the value you gave
it against the one it already holds, sees the identical array, concludes nothing changed, and skips
the re-render. The data updated; React never looked again.

### A7 — **1**

All three clicks happened before any re-render, so all three `setTimeout` callbacks captured `score`
as `0` at the moment of their click. Three seconds later all three run `setScore(0 + 1)` — the same
value, three times. `setScore(prev => prev + 1)` would give 3, because `prev` is read when the
instruction runs, not when it was written.

### B1

Assignment to a state variable. `count` is a `const`, so `count = 0` throws
`TypeError: Assignment to constant variable` and the app crashes on click. The setter takes a value
— pass it directly: `setCount(0)`.

### B2

Called instead of passed. `handleClick()` runs during render, and whatever it returns (usually
`undefined`) gets wired to the button. So it fires on load and does nothing on click. Fix:
`onClick={handleClick}`.

### B3

`useState` is the setup call — once, at the top of the component. It doesn't change anything. The
setter is what updates state: `setCount(count + 1)`. As written, the button appears to do nothing.

### B4

A ternary needs three parts — `condition ? whenTrue : whenFalse`. This is a syntax error. For
"show it or show nothing," use `&&`: `{isLoggedIn && <p>Welcome back!</p>}`.

### B5

A controlled input with no `onChange`. `value={name}` makes the box display state, but nothing feeds
typing back into state — so the box is frozen at whatever `name` holds. Both halves are required:
`value` to display, `onChange` to update.

### B6

The filter is inverted. `.filter()` **keeps** what the test returns true for, so this keeps only the
person being removed and deletes everyone else. It needs `!==`.

### B7 — **`total` is the string `"40.005"`**

`.toFixed(2)` returns a **string**, not a number. So `subtotal` is `"40.00"`, and `"40.00" + 5` is
string concatenation, not addition. Formatting belongs at display time, in the JSX — the
calculations must stay real numbers.

### B8 — **Alice gets removed.**

With the search active, Carl is at index 0 of `visible` but index 2 of `guests`. The button reports
Carl's position in the *filtered* list, and you apply it to the *full* list, where index 0 is Alice.
Positions shift when you filter; identities don't. Remove by name.

(`key={index}` is a second, milder problem for the same reason.)

### C1

A `let` is created fresh every time the component function runs, so it can't remember anything
between renders — and changing it doesn't tell React to re-run the function. `useState` does both:
the value **survives** re-renders, and the setter **triggers** one.

### C2

In React, not in your function — React keeps a slot per component and `useState` asks for what's in
it. Your function only holds a copy for the length of one run. When the component is removed from
the screen, React discards the slot; mount it again and the initial value is used for real again.

### C3

`count` is a `const` belonging to that single run of the function. The setter stores a value in
React's slot and asks for a re-render — it has no way to reassign your local variable. The new value
becomes visible on the **next** render, when `useState` is called again and returns it.

### C4

**Rule:** when the new value is calculated *from* the old one. It genuinely breaks with the plain
form whenever there's a gap between reading the value and using it — several setter calls in one
handler, a `setTimeout`, a server response, or a user clicking faster than the screen updates. In
all of those, the captured value is stale by the time it's used.

### C5

React decides whether to re-render by comparing the value you hand the setter against the one it
already holds. `push` mutates the array in place and gives back the **same array**, so the
comparison finds no difference and React skips the re-render. `[...items, x]` is a brand-new array,
so the comparison finds a difference and React re-renders. The contents changing is invisible to
React — only the array itself is compared.

### D1 — **State.** The user changes it directly by typing.

### D2 — **Constant.** Fixed by you, calculated from nothing, never changes. A `const` above the `return`.

### D3 — **Derived.** Calculated from `quantity` and the unit price. Storing it would create a second source of truth that can drift.

### D4 — **State.** The user sets it directly by clicking a button.

### D5 — **Derived.** It's `quantity === 0` — a fact *about* the quantity, recalculated on every render.

</details>

---

## After you finish

1. Which section did you find hardest — predicting, debugging, explaining, or classifying?
2. Any question where you knew the answer but couldn't word it? Those are articulation gaps, not
   knowledge gaps — say which.
3. Any question you got wrong for a reason you now understand? Write the reason in one sentence.