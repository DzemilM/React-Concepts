# React State — Practice Exercises, Set 2

Second pass at the same concepts as Set 1, on different scenarios. The point is **not** to recall
Set 1's answers — it's to rebuild the same ideas from scratch so they stick.

Same rules: logic blanked as `TODO`, solutions collapsed at the bottom, don't peek until you've
tried. Unlike the Events sets, things **do** change on screen now — so watch the page, not the
console.

**What each exercise re-drills** (so you know what you're practising):

1. declaring state, and calculating the new value from the current one
2. boolean state — one value driving several things on screen
3. input → state, and derived values
4. the stale-value trap and the `prev` form of the setter
5. one piece of state, many calculated values
6. array state, and the never-mutate rule

**The four mistakes you made repeatedly in Set 1.** Check yourself against these:

1. **A literal where the current value belongs** — `setValue(1)`, `!true`, `!false`. If the new
   value depends on the old one, the old one's *name* must appear in the expression.
2. **Calling `useState` instead of the setter.** `useState` sets up the slot once, at the top.
   The setter changes it.
3. **Initial value of the wrong type.** Text state starts `""`. List state starts `[]`. Number
   state starts `0`.
4. **Storing what you could calculate.** A total, a count, a label — if it's derived from other
   state, it's a `const` above the `return`, not another `useState`.

---

## Exercise 1: Volume control

**Goal:** A volume level starting at `50`. Three buttons: `+10`, `-10`, and `Mute`.

- `+10` raises the volume by 10
- `-10` lowers it by 10
- `Mute` sets it straight to 0

```jsx
import { useState } from 'react';

function App() {
  const [volume, setVolume] = useState(50)

  function handleUp() {
    if(volume < 100) {
      setVolume(volume + 10)
    }
  }

  function handleDown() {
    if(volume > 0) {
    setVolume(volume - 10)
    }
  }

  function handleMute() {
    setVolume(0)
  }

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <p>Volume: {volume}</p>
      <button onClick={handleUp}>+10</button>
      <button onClick={handleDown}>-10</button>
      <button onClick={handleMute}>Mute</button>
    </div>
  );
}

export default App;
```

**Trap check:** two of these three handlers need the current volume inside the expression. One
doesn't. Work out which before you type — that's mistake #1, and it cost you the most last round.

**In writing:** why does `handleMute` not need to read the current volume, when the other two do?

**Then extend it:** stop it going above 100 or below 0.

---

## Exercise 2: Status badge

**Goal:** A button that toggles a user between **online** and **offline**. Start offline.

Three things change together on each click:

- a paragraph reads `Status: online` or `Status: offline`
- the button reads `Go offline` or `Go online`
- `Welcome back!` appears **only** when online

```jsx
import { useState } from 'react';

function App() {
  const [isOnline, setIsOnline] = useState(false);

  function handleToggle() {
    setIsOnline(!isOnline)
  }

  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <p>Status: {isOnline ? "online" : "offline"}</p>
      <button onClick={handleToggle}>{isOnline ? "Go offline" : "Go online"}</button>
      {isOnline && <p>Welcome back!</p>}
    </div>
  );
}

export default App;
```

**The trap:** three things change on screen. If your instinct is three `useState` calls, re-read
mistake #4. All three answer the *same* question, and that question has a yes/no answer.

**Reminders, not answers:** `!` flips a boolean. A ternary (`condition ? a : b`) picks between two
values. `&&` renders something only when the condition is true.

**In writing:** why is the button's label `Go offline` when the status is `online`? What is a
button label describing — what's currently true, or what clicking will do?

---

## Exercise 3: Live full name

**Goal:** Two text inputs — first name and last name. A paragraph below shows the full name as
you type. Before anything is typed it must read `Full name: ` — not `undefined`, not `0`.

```jsx
import { useState } from 'react';

function App() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  function handleFirstChange(event) {
    setFirstName(event.target.value)
  }

  function handleLastChange(event) {
    setLastName(event.target.value)
  }

  function handleClear() {
   setFirstName("");
   setLastName("")
  }

  const fullName = firstName + " " + lastName;

  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <input type="text" placeholder="First name" value={firstName} onChange={handleFirstChange} />
      <input type="text" placeholder="Last name" value={lastName} onChange={handleLastChange} />
      <p>Full name: {fullName}</p>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}

export default App;
```

**Reminders, not answers:** React hands your handler the event. The typed text is at
`event.target.value`. The full name is built from two values you already have.

**Then run Clear.** The state empties but the boxes still show the old text. That's the thing you
never reached in Set 1.

**The fix — controlled inputs.** Right now the input owns its own text and you only *listen* to
it. To take control, you must also *tell* it what to display:

```jsx
<input type="text" value={____} onChange={____} />
```

With `value` wired to state, state becomes the single source of truth — change the state, the box
changes. Add it to both inputs and try Clear again.

**In writing:** should `fullName` be its own `useState`? Give the reason, not just yes or no.

---

## Exercise 4: The bonus button

**Goal:** A score starting at `0`, and two buttons that both try to add 3.

**Predict in writing before you run it:** you click `Broken bonus` once, with the score at 0.
What number appears?

```jsx
import { useState } from 'react';

function App() {
  const [score, setScore] = useState(0);

  function handleBrokenBonus() {
    setScore(score + 1);
    setScore(score + 1);
    setScore(score + 1);
  }

  function handleRealBonus() {
    setScore((prev) => prev + 1);
    setScore((prev) => prev + 1);
    setScore((prev) => prev + 1)
  }

  return (
    <div id="app">
      <h1>Exercise 4</h1>
      <p>Score: {score}</p>
      <button onClick={handleBrokenBonus}>Broken bonus</button>
      <button onClick={handleRealBonus}>Real bonus</button>
    </div>
  );
}

export default App;
```

**Reminder, not an answer:** the setter accepts a *function* as well as a value. Hand it
`(prev) => ...` and React calls that function for you, passing in the latest value.

**In writing, two questions — answer both:**

1. In the broken version, why does the third line compute the same number as the first? What is
   `score` during that function run, and can `setScore` change it?
2. In the fixed version, who calls your arrow function, and where does its argument come from?

---

## Exercise 5: Order summary

**Goal:** One number input for quantity. Everything else is calculated.

- Unit price is fixed at `12.50`
- Subtotal = quantity × unit price
- Shipping is `4.99`, but **free** if the subtotal is over `50`
- Total = subtotal + shipping

Money shows to two decimals.

```jsx
import { useState } from 'react';

function App() {
  const [quantity, setQuantity] = useState(0)

  function handleQuantityChange(event) {
    setQuantity(Number(event.target.value))
  }
  
  const unitPrice = 12.5;
  const subTotal = quantity * unitPrice;
  const shipping = subTotal > 50 ? 0 : 4.99;
  const total = subTotal + shipping 

  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <input type="number" onChange={handleQuantityChange} />
      <p>Quantity: {quantity}</p>
      <p>Subtotal: ${(subTotal).toFixed(2)}</p>
      <p>Shipping: ${(shipping).toFixed(2)}</p>
      <p>Total: ${(total).toFixed(2)}</p>
    </div>
  );
}

export default App;
```

**The whole exercise is one decision:** how many `useState` calls? Count how many things the
*user* can change. That's your answer — everything else is a `const`.

**Two things that bit you last round:**

- `event.target.value` is a **string**, even from `type="number"`. Convert it with `Number(...)`.
- The `$` is display text and lives in the JSX, outside the braces. State holds `12.5`, never
  `"$12.50"`.

**Reminder for shipping:** it's one value or another depending on a condition. Same tool as the
button label in Exercise 2 — it works for numbers as well as strings.

**Reminder for the decimals:** `.toFixed(2)` turns `49.9` into `"49.90"`. Apply it at display
time, not in the state.

---

## Exercise 6: Guest list

**Goal:** A party guest list.

- A text input and an `Add guest` button
- Each guest appears in the `<ul>`
- Each guest has a `Remove` button beside them
- Above the list: `3 guests attending`
- Adding clears the input box

```jsx
import { useState } from 'react';

function App() {
  const [guests, setGuests] = useState([]);
  const [input, setInput] = useState("");

  function handleNameChange(event) {
    setInput(event.target.value)
  }

  function handleAdd(event) {
    event.preventDefault();
    if(input.length === 0) {return};
    setGuests([...guests, input]);
    setInput("")
  }

  function handleRemove(indexToRemove) {
    setGuests(guests.filter((guest, index)=> index !== indexToRemove))
}

  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <p>{guests.length} guests attending</p>
    <form onSubmit={handleAdd}>
      <input type="text" value={input} onChange={handleNameChange} />
      <button>Add guest</button>
    </form>
      <ul>
        {guests.map((guest, index)=>(
          <li key={index}>
            {guest}
            <button onClick={()=>handleRemove(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

**The rule that decides whether this works — never mutate state.**

```js
guests.push(name);            // ✗ same array, React sees no change, no re-render
setGuests([...guests, name]); // ✓ a new array
```

React compares the new value to the old. `push` changes the contents but hands back *the same
array*, so React concludes nothing happened. You must produce a **new** array.

Same reason `.splice()` is the wrong tool for Remove and `.filter()` is the right one — `filter`
returns a new array, `splice` edits the existing one.

**Three things to get right:**

1. The count is **not** state. Derive it.
2. Each `<li>` needs a `key`.
3. Each Remove button must know *which* guest it belongs to. That's the arrow wrapper from the
   Events unit — `onClick={() => ...}` lets you pass an argument without calling the function
   during render.

**Then extend it, in this order:**

- Wrap the input and button in a `<form>` so Enter works. Remember what a form does by default,
  and the method that stops it.
- Make the input controlled with `value` so it actually clears.
- Refuse to add an empty guest — clicking Add with an empty box should do nothing.

**In writing:** why does `guests.push(name)` fail to update the screen, even though the array
really does get longer?

---

<details>
<summary><strong>Solutions</strong> — only after you've attempted all six</summary>

### Exercise 1

```jsx
import { useState } from 'react';

function App() {
  const [volume, setVolume] = useState(50);

  function handleUp() {
    setVolume(volume + 10);
  }

  function handleDown() {
    setVolume(volume - 10);
  }

  function handleMute() {
    setVolume(0);
  }

  return (
    <div id="app">
      <h1>Exercise 1</h1>
      <p>Volume: {volume}</p>
      <button onClick={handleUp}>+10</button>
      <button onClick={handleDown}>-10</button>
      <button onClick={handleMute}>Mute</button>
    </div>
  );
}

export default App;
```

`handleUp` and `handleDown` need `volume` in the expression because the new value depends on the
old one. `handleMute` doesn't: 0 is 0 no matter what came before. That's the distinction behind
mistake #1.

With clamping:

```jsx
function handleUp() {
  setVolume(Math.min(volume + 10, 100));
}

function handleDown() {
  setVolume(Math.max(volume - 10, 0));
}
```

### Exercise 2

```jsx
import { useState } from 'react';

function App() {
  const [isOnline, setIsOnline] = useState(false);

  function handleToggle() {
    setIsOnline(!isOnline);
  }

  return (
    <div id="app">
      <h1>Exercise 2</h1>
      <p>Status: {isOnline ? 'online' : 'offline'}</p>
      <button onClick={handleToggle}>{isOnline ? 'Go offline' : 'Go online'}</button>
      {isOnline && <p>Welcome back!</p>}
    </div>
  );
}

export default App;
```

**One** piece of state, not three. All three visible things answer the same question — *is the
user online?* Three separate `useState` calls would let them disagree with each other.

The button label describes **what clicking will do**, not what's currently true. That's why it
reads `Go offline` while the status is `online`.

### Exercise 3

```jsx
import { useState } from 'react';

function App() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');

  function handleFirstChange(event) {
    setFirst(event.target.value);
  }

  function handleLastChange(event) {
    setLast(event.target.value);
  }

  function handleClear() {
    setFirst('');
    setLast('');
  }

  const fullName = first + ' ' + last;

  return (
    <div id="app">
      <h1>Exercise 3</h1>
      <input type="text" placeholder="First name" value={first} onChange={handleFirstChange} />
      <input type="text" placeholder="Last name" value={last} onChange={handleLastChange} />
      <p>Full name: {fullName}</p>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
}

export default App;
```

Both start as `''` — mistake #3. Start them at `0` and the paragraph reads `Full name: 0 0`
before anyone types.

`fullName` is a `const`, not state. It's derived from two values that already exist, so storing it
would create a third thing that could drift out of sync with the inputs.

**Controlled inputs:** `value={first}` is what makes `setFirst('')` actually empty the box.
Without `value`, the DOM input owns its own text and your state is only a passive copy — you can
read it but never change it.

### Exercise 4

The broken version gives **1**, not 3.

```jsx
function handleBrokenBonus() {
  setScore(score + 1);   // score is 0 → setScore(1)
  setScore(score + 1);   // score is STILL 0 → setScore(1)
  setScore(score + 1);   // score is STILL 0 → setScore(1)
}
```

`score` is a `const` belonging to this one run of the component function. `setScore` puts a value
in React's slot and requests a re-render — it cannot reach back and change your local variable.
All three lines read `0`, all three schedule `1`, and the last one wins.

Fixed:

```jsx
function handleRealBonus() {
  setScore((prev) => prev + 1);
  setScore((prev) => prev + 1);
  setScore((prev) => prev + 1);
}
```

You're handing React three *instructions* — "add 1 to whatever you've got" — instead of three
fixed numbers. React runs each in turn with the latest value: 0 → 1 → 2 → 3.

`prev` is supplied by React. You write the parameter name, React calls the function and fills in
the argument. Identical to `event` in the Events unit.

### Exercise 5

```jsx
import { useState } from 'react';

function App() {
  const [quantity, setQuantity] = useState(0);

  function handleQuantityChange(event) {
    setQuantity(Number(event.target.value));
  }

  const unitPrice = 12.5;
  const subtotal = quantity * unitPrice;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div id="app">
      <h1>Exercise 5</h1>
      <input type="number" value={quantity} onChange={handleQuantityChange} />
      <p>Quantity: {quantity}</p>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>Shipping: ${shipping.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}

export default App;
```

**One** `useState`. The user can change exactly one thing — the quantity. Everything else follows
from it, so everything else is a `const`.

`shipping` uses a ternary. It's an expression that produces a value, so it works for numbers just
as well as for strings.

`Number(...)` matters: without it `quantity` is `"4"`, and while `"4" * 12.5` happens to work,
addition would eventually surprise you.

`.toFixed(2)` is applied at **display** time, in the JSX. The state and the calculations stay real
numbers.

### Exercise 6

```jsx
import { useState } from 'react';

function App() {
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState('');

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleAdd(event) {
    event.preventDefault();
    if (name === '') {
      return;
    }
    setGuests([...guests, name]);
    setName('');
  }

  function handleRemove(indexToRemove) {
    setGuests(guests.filter((guest, index) => index !== indexToRemove));
  }

  return (
    <div id="app">
      <h1>Exercise 6</h1>
      <p>{guests.length} guests attending</p>
      <form onSubmit={handleAdd}>
        <input type="text" value={name} onChange={handleNameChange} />
        <button>Add guest</button>
      </form>
      <ul>
        {guests.map((guest, index) => (
          <li key={index}>
            {guest}
            <button onClick={() => handleRemove(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

Key points:

- `[...guests, name]` builds a **new** array. `guests.push(name)` mutates the existing one, so
  React compares the array to itself, sees no change, and skips the re-render. The array really
  did get longer — React just never looked again.
- `.filter()` returns a new array — right tool. `.splice()` mutates — wrong tool.
- `guests.length` is derived. Not state.
- `onClick={() => handleRemove(index)}` — the arrow wrapper. `onClick={handleRemove(index)}` would
  call it during render, for every guest, immediately.
- `value={name}` makes the input controlled, which is what lets `setName('')` clear it.
- `key={index}` works but isn't ideal — remove a guest from the middle and every index below
  shifts. A stable unique id per guest is the proper answer; worth knowing, not worth solving yet.
- The early `return` on an empty name is a **guard clause** — bail out before doing the work.

</details>