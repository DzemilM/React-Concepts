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

Answer: output is 1, count is given a value of zero, setCount doesnt see eachother so its always count(0) plus 1

### A2

```jsx
function handleClick() {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
}
```

Same component, this handler instead. You click once. What number now, and why is it different
from A1?

Answer: now its 2 coz output is saved as prev so second counts prev is state plus 1 and that is added to 1

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

Answer: console logs 1, 2, 3, 4, 5 — one line per click, because the variable really does go up.
Screen says 0 and never changes. Nothing tells React to re-run App(), so the paragraph is still
the output of the first render with 0 baked into it.

### A4

```jsx
const [count, setCount] = useState(0);
```

The count is currently 7. React re-renders. That line runs again, with `0` written right there in
it. Why doesn't the count go back to 0?

Answer: because the 0 is the INITIAL value, not the value. React uses it once, on the first
render, to fill the slot. Every render after that it ignores it and hands back whatever is in the
slot now — so from render two onwards the 0 does nothing.

### A5

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count);
}
```

Count is 0. You click once. What does the console log — 0 or 1? Why?

Answer: 0. Not because it logs an old value — because count never changed. It's a const belonging
to this one run of the function, and setCount doesn't touch it. It stores the new value in React
and asks for a re-render, so 1 only appears on the next render.

### A6

```jsx
function handleAdd() {
  items.push('milk');
  setItems(items);
}
```

`items` is `["apple"]`. You click Add. What's in the array afterwards, and what appears on screen?
Both halves — they don't match.

Answer: the array is ["apple", "milk"] — push really did add it. The screen still shows only
"apple". push changes the array in place and hands back the SAME array, so when React compares
what it was given against what it already holds, it sees no difference and skips the re-render.

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

Answer: its still 1, score is 0 so its just plus 1 no matter how much u click it in one second

---

## Section B — Spot the bug

Each of these has exactly one thing wrong. Name it, say what the user sees, and fix it.

### B1

```jsx
function handleReset() {
  setCount(count = 0);
}
```

Answer: assigning to a state variable. count is a const, so `count = 0` throws
"TypeError: Assignment to constant variable" — the user clicks Reset and the app crashes.
The setter takes a value, so just pass it: setCount(0). Never put an `=` inside a setter call.

### B2

```jsx
<button onClick={handleClick()}>Save</button>
```

Answer: handleclick without () should be there, this one gets called immediately when it renders

### B3

```jsx
function handleIncrement() {
  useState(count + 1);
}
```

Answer:useState? it should be setCount or however its called you dont call useState there

### B4

```jsx
{isLoggedIn ? <p>Welcome back!</p>}
```

Answer: shouldnt be question mark, should be '&&' instead, then when both is true <p> gets printed

### B5

```jsx
<input type="text" value={name} />
```

The user can't type in this box. Why?

Answer: it needs onChange

### B6

```jsx
function handleRemove(nameToRemove) {
  setGuests(guests.filter((guest) => guest === nameToRemove));
}
```

Answer: this one removes EVERYTHING else except that what we should remove

### B7

```js
const subtotal = (quantity * price).toFixed(2);
const total = subtotal + shipping;
```

Quantity 4, price 10, shipping 5. What does `total` end up as, and why?

Answer: total is the string "40.005". toFixed(2) returns a STRING, so subtotal is "40.00", and
"40.00" + 5 is concatenation, not addition — the 5 gets glued on the end. The fix isn't Number(),
it's not formatting until display: keep subtotal and total as numbers and put .toFixed(2) in the
JSX where it's shown.

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

Answer: Alice gets removed INSTEAD of Carl — Carl stays. Nothing to do with Alice containing "c".
Carl is index 0 in `visible` but index 2 in `guests`. The button reports his position in the
filtered list (0), and handleRemove applies that number to the full list, where index 0 is Alice.
A position only means something relative to the list it came from; a name means the same thing in
every list. That's why you remove by name.

---

## Section C — Explain it

In your own words. One or two sentences each — but answer **both halves** where there are two.

### C1

Why can't a normal `let` variable inside a component be used to update the screen? Name the two
things `useState` does that a `let` can't.

Answer: a let is recreated every time the component function runs, so it can't remember anything
between renders, and changing it doesn't tell React anything. useState does the two things a let
can't: the value SURVIVES the re-render, and the setter TRIGGERS one.

### C2

Where does the value in `useState` actually live? What happens to it when the component is removed
from the screen?

Answer: it lives in react, when component is removed its thrown away and gets reseted when we load component again

### C3

After `setCount(5)` runs, the variable `count` is still the old value for the rest of that
function. Why? When does the new value become visible?

Answer: because count is a const belonging to that one run of the function, and setCount can't
reassign it — all it does is put the value in React's slot and ask for a re-render. The new value
becomes visible on the NEXT render, when useState is called again and returns it fresh.

### C4

When must you use `setX((prev) => ...)` instead of `setX(value)`? Give the rule, and one situation
where the plain form genuinely breaks.

Answer: the rule is use prev whenever the new value is calculated FROM the old one. If it doesn't
depend on the old value (reset, mute, clear), pass a plain value. The plain form genuinely breaks
when there's a gap between reading the value and using it — e.g. calling the setter several times
in one handler: setCount(count + 1) twice adds 1, not 2, because both lines read the same stale
count. Same in a setTimeout, or when the user clicks faster than the screen updates.

### C5

Why does `items.push(x)` fail to update the screen when `setItems([...items, x])` works? Your
answer must say what React does with the value you hand it.

Answer: push is still same array and react doesnt notice difference when its pointing to same array, ...item,s x makes a new array which react notices. React compares values, if we do push, react just sees same 2 arrays its pointing to, but destructuring makes new array and react notices when ocmparing

---

## Section D — State, derived, or constant?

For each value, say which of the three it is, and why in a few words.

A shop page where the user types a **quantity** and picks a **size** from three buttons.
Unit price is fixed at £9.99. VAT is 20%.

### D1
The quantity typed by the user.

Answer: state, we setQuantity with what user types and thats quantity then

### D2
The unit price, £9.99.

Answer: constant — it's fixed by us, calculated from nothing, and the user can never change it.
A plain const above the return.

### D3
The subtotal (quantity × unit price).

Answer: derived, we calculate from state and fixed price

### D4
The selected size.

Answer: state which we pick in buttons, setSize which setz size state to what we pick

### D5
Whether the "Add to basket" button is disabled because the quantity is 0.

Answer: its derived, we see what is state value and based on that its true or false

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