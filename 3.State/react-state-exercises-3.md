# React State — Practice Exercises, Set 3

Third and final pass before the cold test. Same concepts again, harder scenarios, and **much less
starter code** — you produce the structure, not just the logic.

## How this set is different

Sets 1 and 2 handed you the skeleton. This one doesn't. You get the goal and an empty component.
That's deliberate: the cold test gives you nothing at all, and this is the bridge.

### The rule for this set: plan the state before you type

Every exercise starts with a **state plan**. Write it out — on paper, in a comment, anywhere —
*before* you write a single line of code:

```
STATE:   (things the user can change directly)
DERIVED: (things calculated from state)
```

This is aimed at the one mistake that survived both previous sets. Three times now you've stored
the wrong thing and then spent four or five rounds patching the consequences:

- Set 1 Ex 3 — you stored the button label `"Show details"` instead of a boolean
- Set 2 Ex 5 — you stored the fixed price instead of the quantity the user types
- Set 2 Ex 6 — you stored `guest` as a string instead of the list of guests

Every one of those was decided in the first thirty seconds, before any React was involved.

**The two questions that prevent it:**

1. **What can the user change directly?** → that's state, and nothing else is
2. **Does the name say exactly what it holds?** → `price` holding a quantity is how you lose an
   hour

### The other rule: no `=` inside a setter call

You've done this three times across both sets:

```js
setValue(value = 0);              // ✗
setFirstName(firstName = event.target.value);   // ✗
setScore(score = score + 1);      // ✗
```

State variables are `const`. Assigning to one throws. The setter **takes a value** — just give it
the value. If you're typing `=` between the parentheses, stop.

```js
setValue(0);                      // ✓
setScore(score + 1);              // ✓
setScore((prev) => prev + 1);     // ✓
```

### What each exercise re-drills

1. two pieces of state, a chain of derived values
2. boolean state driving something other than text
3. one piece of state, three derived values
4. the `prev` form, in a situation where it genuinely matters
5. array state plus derived filtering
6. everything at once

---

## Exercise 1: Tip calculator

**Goal:**

- A number input for the bill amount
- Three buttons: `10%`, `15%`, `20%`
- Show the tip amount and the final total, both to two decimals
- Show which percentage is currently selected, e.g. `Tip: 15%`

Start with a bill of `0` and 15% selected.

```jsx
import { useState } from 'react';

function App() {
  const [bill, setBill] = useState(0);
  const [tip, setTip] = useState(15);

  const tipAmount = bill * (tip * 0.01);
  const total = bill + tipAmount;

  function handleBill(event){
    setBill(Number(event.target.value))
  }

  function handleTip(number){
    setTip(number)
  }

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <input type="number" value={bill} placeholder="Bill" onChange={handleBill} />
      <button onClick={()=>handleTip(10)}>10%</button>
      <button onClick={()=>handleTip(15)}>15%</button>
      <button onClick={()=>handleTip(20)}>20%</button>
      <p>Tip:{tip}%</p>
      <p>Tip amount:${(tipAmount).toFixed(2)}</p>
      <p>Total:${(total).toFixed(2)}</p>
    </div>
  );
}

export default App;
```

**Write your state plan first.** How many things can the user change? Everything else is a `const`.

**Watch for:** the three percentage buttons all do the same job with a different number. You don't
need three handlers — one handler that takes an argument works, and you know how to pass an
argument to a handler from the Events unit.

**In writing:** is the tip amount state or derived? What about the selected percentage? They feel
similar — explain why they're not.

---

## Exercise 2: Password field

**Goal:**

- A password input and a `Show` / `Hide` button beside it
- When hidden, the input is `type="password"` (dots). When shown, `type="text"`
- The button label flips between `Show` and `Hide`
- Below it: `Password length: 8`

Start hidden, with an empty password.

```jsx
import { useState } from 'react';

function App() {
  const [password, setPassword] = useState("");
  const [isHidden, setIsHidden] = useState(true);

  const passLength=password.length;

  function handlePass(event){
    setPassword(event.target.value)
  }

  function handleHidden(){
    setIsHidden(!isHidden)
  }

  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <input type={isHidden ? "password" : "text"} placeholder="Password" value={password} onChange={handlePass} />
      <button onClick={handleHidden}>{isHidden ? 'Show' : 'Hide'}</button>
      <p>Password length:{passLength}</p>
    </div>
  );
}

export default App;
```

**The interesting bit:** the boolean doesn't just decide what *text* to show — it decides an
**attribute value**. `type={...}` takes a value like anything else, so a ternary works there just
as well as it does for a label.

**Watch for:** the length is not state.

**In writing:** you have one boolean driving three things (the input's type, the button's label,
and nothing else — the length comes from elsewhere). What would go wrong if you stored the button
label in its own `useState` instead of deriving it?

---

## Exercise 3: Character counter

**Goal:** A `<textarea>` with a 100-character limit.

- Show `42 / 100 characters`
- Show `58 characters remaining`
- When over 100, show a warning line: `Too long!`
- When over 100, the Submit button is disabled

```jsx
import { useState } from 'react';

function App() {
  const [characters, setCharacters] = useState("");

  function handleChars(event){
    setCharacters(event.target.value)
  }

const used=characters.length;
const remaining= 100 - used;
const isTooLong= used > 100;

  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <textarea onChange={handleChars} value={characters}>
      </textarea>
      <p>{used}/100 characters</p>
      <p>{remaining} characters remaining</p>
      {isTooLong && <p>Too long!</p>}
      <button disabled={isTooLong}>Submit</button>
    </div>
  );
}

export default App;
```

**This exercise is the purest test of "don't store what you can calculate."** Four things are on
screen and **one** of them is state. Work out which before you type.

**Reminders, not answers:** `<textarea>` uses `onChange` and `value` exactly like `<input>`. A
button is switched off with the `disabled` attribute, which takes `true` or `false`.

**In writing:** you have a count, a remaining count, and an over-limit flag. Explain why none of
them is state, in one sentence that covers all three.

---

## Exercise 4: Rapid points

**Goal:** A score, and a `Score a hat-trick` button that adds 3 points — but the adding is done by
a separate helper function called three times.

```jsx
import { useState } from 'react';

function App() {
  const [score, setScore] = useState(0);

  function addPoint() {
    setScore((prev)=> prev + 1)
  }

  function handleHatTrick() {
    addPoint();
    addPoint();
    addPoint();
  }

  function delayed(){
    setTimeout(() => {
      // Functional update handles rapid clicks correctly
      setScore(prev => prev + 1);
    }, 3000);
  }

  return (
    <div id="app">
      <h1>Exercise 4</h1>
      <p>Score: {score}</p>
      <button onClick={handleHatTrick}>Score a hat-trick</button>
      <button onClick={addPoint}>Score once</button>
      <button onClick={delayed}>Delayed point</button>
    </div>
  );
}

export default App;
```

**Why this version is harder than Set 2's:** you can't cheat with `setScore(score + 3)`, because
`addPoint` has no idea it's being called three times. It has to work correctly whether it's called
once or a hundred times.

**Then extend it:** add a `Delayed point` button that adds a point three seconds later.

```jsx
function handleDelayedPoint() {
  setTimeout(() => {
    // TODO: add a point
  }, 3000);
}
```

Click it three times fast. With the wrong form you get **+1**; with the right one you get **+3**.
Try it both ways — this is the case where `prev` stops being academic and starts being the
difference between working and broken.

**In writing:** in the delayed version, why does the plain form only add 1? What value did each of
those three clicks capture, and when?

---

## Exercise 5: Searchable guest list

**Goal:** Set 2's guest list, plus a search box.

- Add and remove guests as before
- A second text input filters the list as you type
- Above the list: `Showing 3 of 12 guests`
- The filter must not delete anyone — clear the search box and everyone comes back

```jsx
import { useState } from 'react';

function App() {
  const [guests, setGuests] = useState([]);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const guestNumber = guests.length;
  const visibleGuests = guests.filter((guest)=>guest.toLowerCase().includes(query.toLowerCase()))

 function handleInputChange(event){
  setInput(event.target.value)
 }

 function addGuest(event){
  event.preventDefault();
  if (input === '') {
    return;                   
  }
  setGuests([...guests, input]);       
  setInput('');           
 }

 function handleQuery(event){
  setQuery(event.target.value)
 }

function handleRemove(name) {
  setGuests(guests.filter((guest)=>guest !== name));        
}
 

  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <form onSubmit={addGuest}>
      <input type="text" value={input} onChange={handleInputChange} />
      <button>Add</button>
      </form>
      <p>Showing {visibleGuests.length} of {guestNumber} guests</p>
      <input type="text" value={query} onChange={handleQuery} />
      <ul>
       {visibleGuests.map((guest)=>
        <li key={guest}>
          {guest}
          <button onClick={()=>handleRemove(guest)}>Remove</button>
        </li>
       )}
      </ul>
    </div>
  );
}

export default App;
```

**The trap, and it's a good one:** the obvious approach is to filter `guests` and store the result.
Don't. If you overwrite `guests` with the filtered version, the ones that didn't match are gone
forever.

The filtered list is **derived** — calculate it fresh on every render from the full list plus the
search text. The full list stays untouched.

**Reminders, not answers:** `.filter()` builds a new array. `.includes(x)` tells you whether a
string contains `x`. `.toLowerCase()` on both sides makes the search case-insensitive.

**Careful with Remove:** your Remove buttons now sit on the *filtered* list, but you're removing
from the *full* list. If you remove by index, you'll delete the wrong person as soon as a filter is
active. Work out why, then fix it — removing by name is the simplest fix here.

**In writing:** why must the filtered list be derived rather than stored? Describe exactly what
breaks if you store it.

---

## Exercise 6: Shopping cart

**Goal:** Everything from this unit in one component.

- A text input and an `Add item` button — adds an item name to the cart
- Each item shows in a list with a `Remove` button
- One number input for `quantity` that applies to the whole order
- Unit price is fixed at `4.25` per item
- Show: item count, subtotal (`count × quantity × unitPrice`), and total
- Free shipping over `40`, otherwise `5.99`
- An `Empty cart` button that removes everything
- Adding an empty name does nothing

```jsx
import { useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [quantity, setQuantity] = useState(0);

  const price = 4.25;
  const itemCount = items.length;
  const subtotal= itemCount * quantity * price;
  const shipping = subtotal > 40 ? 0 : 5.99
  const total =  subtotal + shipping

  function handleInput(event){
    setInput(event.target.value)
  }

  function handleAdd(event){
    event.preventDefault();
    if (input === '') {
    return;                   
    }
    setItems([...items, input]);       
    setInput('');
  }

  function handleRemove(name){
    setItems(items.filter((item)=>item !== name));
  }

  function handleQuantity(event){
    setQuantity(Number(event.target.value))
  }

 function handleEmpty(){
  setItems([])
 }

  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <form onSubmit={handleAdd}>
        <input type="text" value={input} onChange={handleInput} />
        <button>Add item</button>
      </form>
      <input placeholder="Quantity:" value={quantity} type="number" onChange={handleQuantity} />
        <p>Item count:{itemCount}</p>
        <p>Subtotal:${(subtotal).toFixed(2)}</p>
        <p>Shipping:${(shipping).toFixed(2)}</p>
        <p>Total:${(total).toFixed(2)}</p>
        <ul>
         {items.map((item)=>
          <li key={item}>
            {item}
            <button onClick={()=>handleRemove(item)}>Remove</button>
          </li>
         )}
        </ul>
        <button onClick={handleEmpty}>Empty Cart</button>
    </div>
  );
}

export default App;
```

**Write the state plan before anything else.** There are three pieces of state here and about six
derived values. If you start typing without the plan, you'll end up where Set 2 Exercise 5 ended
up.

**Everything in this exercise you've already done** — array state, controlled inputs, derived
money, a guard clause, `.filter()`, `.map()` with keys, ternaries. Nothing new. It's a test of
whether you can assemble them without being told which one to reach for.

---

<details>
<summary><strong>Solutions</strong> — only after you've attempted all six</summary>

### Exercise 1

```
STATE:   bill, tipPercent
DERIVED: tipAmount, total
```

```jsx
import { useState } from 'react';

function App() {
  const [bill, setBill] = useState(0);
  const [tipPercent, setTipPercent] = useState(15);

  function handleBillChange(event) {
    setBill(Number(event.target.value));
  }

  const tipAmount = bill * (tipPercent / 100);
  const total = bill + tipAmount;

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <input type="number" value={bill} onChange={handleBillChange} />
      <button onClick={() => setTipPercent(10)}>10%</button>
      <button onClick={() => setTipPercent(15)}>15%</button>
      <button onClick={() => setTipPercent(20)}>20%</button>
      <p>Tip: {tipPercent}%</p>
      <p>Tip amount: ${tipAmount.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}

export default App;
```

**Why `tipPercent` is state and `tipAmount` isn't:** the user picks the percentage directly — it's
an input, not a result. The amount is calculated from two things that already exist. The test isn't
"does it change?" (both change), it's **"can the user set it directly?"**

The arrow wrapper on the buttons is the Events pattern: `onClick={() => setTipPercent(10)}`. Writing
`onClick={setTipPercent(10)}` would call it during render.

### Exercise 2

```
STATE:   password, isVisible
DERIVED: input type, button label, length
```

```jsx
import { useState } from 'react';

function App() {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleToggle() {
    setIsVisible(!isVisible);
  }

  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <input
        type={isVisible ? 'text' : 'password'}
        value={password}
        onChange={handlePasswordChange}
      />
      <button onClick={handleToggle}>{isVisible ? 'Hide' : 'Show'}</button>
      <p>Password length: {password.length}</p>
    </div>
  );
}

export default App;
```

`type={isVisible ? 'text' : 'password'}` — a JSX attribute takes a value like anything else, so a
ternary works there as well as it does inside a tag's content.

**If you stored the button label in state:** you'd have two things that must be kept in step by
hand. Toggle the boolean and forget to update the label, and the button says `Show` while the
password is visible. No error — just a UI that lies.

### Exercise 3

```
STATE:   text
DERIVED: used, remaining, isTooLong
```

```jsx
import { useState } from 'react';

function App() {
  const [text, setText] = useState('');

  function handleChange(event) {
    setText(event.target.value);
  }

  const used = text.length;
  const remaining = 100 - used;
  const isTooLong = used > 100;

  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <textarea value={text} onChange={handleChange} />
      <p>{used} / 100 characters</p>
      <p>{remaining} characters remaining</p>
      {isTooLong && <p>Too long!</p>}
      <button disabled={isTooLong}>Submit</button>
    </div>
  );
}

export default App;
```

**One** piece of state. The one-sentence answer: *all three are calculated from `text`, so storing
them would create copies that can disagree with the text they came from.*

`disabled={isTooLong}` — an attribute taking a boolean directly. No ternary needed; the value is
already `true` or `false`.

### Exercise 4

```jsx
function addPoint() {
  setScore((prev) => prev + 1);
}
```

That's the whole fix. `addPoint` can't know how many times it's being called, so it must not depend
on the value it read at render time — it has to ask React for the latest value each time.

With the plain form, all three calls read the same stale `score` and all three schedule the same
number, so a hat-trick scores 1.

The delayed version:

```jsx
function handleDelayedPoint() {
  setTimeout(() => {
    setScore((prev) => prev + 1);
  }, 3000);
}
```

Three fast clicks all happen before any re-render, so with the plain form all three callbacks
captured `score` as `0` and all three run `setScore(1)` three seconds later — one point total.

`prev` isn't a snapshot; it's whatever React holds at the moment the instruction runs. So the three
callbacks see 0, 1, 2 and you end on 3.

### Exercise 5

```
STATE:   guests, input, query
DERIVED: visibleGuests, counts
```

```jsx
import { useState } from 'react';

function App() {
  const [guests, setGuests] = useState([]);
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  function handleAdd(event) {
    event.preventDefault();
    if (input === '') {
      return;
    }
    setGuests([...guests, input]);
    setInput('');
  }

  function handleRemove(nameToRemove) {
    setGuests(guests.filter((guest) => guest !== nameToRemove));
  }

  const visibleGuests = guests.filter((guest) =>
    guest.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <p>
        Showing {visibleGuests.length} of {guests.length} guests
      </p>
      <form onSubmit={handleAdd}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button>Add guest</button>
      </form>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {visibleGuests.map((guest) => (
          <li key={guest}>
            {guest}
            <button onClick={() => handleRemove(guest)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

**Why the filtered list must be derived:** if you stored it, you'd have to overwrite it on every
keystroke — and the only place the non-matching guests existed was that same array. Backspace and
they're gone permanently. Deriving it means the full list is never touched.

**The index bug:** with a filter active, `visibleGuests` index 0 might be `guests` index 7.
Removing "index 0" from the full list deletes the wrong person. Removing by **name** sidesteps it
entirely — and it's why `key={guest}` works here too (assuming no duplicate names).

### Exercise 6

```
STATE:   items, input, quantity
DERIVED: itemCount, subtotal, shipping, total, isEmpty
```

```jsx
import { useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [quantity, setQuantity] = useState(1);

  function handleAdd(event) {
    event.preventDefault();
    if (input === '') {
      return;
    }
    setItems([...items, input]);
    setInput('');
  }

  function handleRemove(indexToRemove) {
    setItems(items.filter((item, index) => index !== indexToRemove));
  }

  function handleEmpty() {
    setItems([]);
  }

  const unitPrice = 4.25;
  const itemCount = items.length;
  const subtotal = itemCount * quantity * unitPrice;
  const shipping = subtotal > 40 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <form onSubmit={handleAdd}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <button>Add item</button>
      </form>

      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </label>

      <p>{itemCount} items</p>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>Shipping: ${shipping.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>

      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button type="button" onClick={() => handleRemove(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleEmpty}>Empty cart</button>
    </div>
  );
}

export default App;
```

Three pieces of state — the three things the user can change directly. Five derived values, all
plain `const`s.

`handleEmpty` uses `setItems([])` — a literal is correct here, because emptying doesn't depend on
what was in the cart.

Note `type="button"` on Remove: it sits outside the form here so it isn't strictly needed, but it's
a good habit — it guarantees the button never submits anything.

</details>