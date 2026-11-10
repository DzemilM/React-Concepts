# Lifting State Up — Cold Test

No starter code. No shapes, no blanks. Write every line yourself in a blank StackBlitz.

## Rules

- Look up syntax freely. Don't open the exercise files for the structure.
- Run each task. Click everything, type in everything, and read any error before asking for help.
- If you ask for help, it counts, and it goes in the review.
- Small slips are fine. The test is whether you can work out the structure yourself.
- When a task is finished, copy your code into its `### My solution`.

Before writing each task: **who reads each value, and who changes it?** After writing it: compare
what each child expects with what its parent passes, and run the three checks:

1. **Every prop I named — did I use it?**
2. **Is `children` named, and placed between the tags?** (Only if the component wraps content.)
3. **Every fixed class — is it written in *this* component, not inside a child?**

---

## Task 1: Tip calculator

```js
const TIPS = [10, 15, 20];
```

- A `BillInput` component with a controlled number input for the bill, starting empty.
- A `TipPicker` component with one button per tip in `TIPS`, labelled `10%`, `15%`, `20%`. The chosen
  tip's button has the class `active`. The tip starts at `10`.
- A `Total` component that shows `Total: 55` for a bill of `50` and a tip of `10`.
- `App` renders all three. None of the children has `useState`.

### My solution

```jsx
import { useState } from 'react';

const TIPS = [10, 15, 20];

function BillInput({ val, handleValue }) {
  return <input type="number" value={val} onChange={handleValue} />;
}

function TipPicker({ pickTip, chosenTip }) {
  return (
    <>
      {TIPS.map((tip) => {
        return (
          <button
            key={tip}
            onClick={() => pickTip(tip)}
            className={chosenTip === tip ? 'active' : ''}
          >
            {tip}%
          </button>
        );
      })}
    </>
  );
}

function Total({ bill, tip }) {
  const total = bill + (bill * tip) / 100;

  return (
    <>
      <p>Total: {total}</p>
    </>
  );
}

export default function App() {
  const [value, setValue] = useState('');
  const [tip, setTip] = useState(10);

  function handleVal(event) {
    setValue(Number(event.target.value));
  }

  function handleTip(t) {
    setTip(t);
  }

  return (
    <>
      <BillInput val={value} handleValue={handleVal} />
      <TipPicker pickTip={handleTip} chosenTip={tip} />
      <Total tip={tip} bill={value} />
    </>
  );
}
```

### My answer

1. The bill and the tip are state. Is the total? Why or why not?
2. What does `TipPicker` send up when `15%` is clicked, and how does it get there?

**Answers:**

1. No. The total is derived from the bill and the tip, so it's worked out on every render instead
   of being stored.
2. `15`, the `tip` from `TipPicker`'s `.map()` over `TIPS`. The button calls `pickTip(15)`, and
   `pickTip` is `App`'s `handleTip`, so `15` arrives there as an argument and gets stored.

---

## Task 2: Room booking

```js
const ROOMS = [
  { id: 'r1', name: 'Garden Room', beds: 2, price: 80 },
  { id: 'r2', name: 'Attic Room', beds: 1, price: 55 },
  { id: 'r3', name: 'Family Suite', beds: 4, price: 140 },
];
```

- A `RoomRow` component renders one `<li>` with the room's name and a `Book` button. The booked
  room's row has the class `booked`, and its button says `Booked` instead of `Book`.
- `App` renders the rows inside a `<ul>`.
- A `BookingSummary` component below the list shows `Garden Room: 2 beds, 80 per night` for the
  booked room, with a `Cancel` button that removes the booking. Before anything's booked, it shows
  `No room booked` and no button.
- Only one room can be booked at a time.
- State stores only the booked room's `id`.

### My solution

```jsx
import { useState } from 'react';

```

### My answer

1. `RoomRow` needs the room's id. Why can't it read it from `key`?
2. Does `Book` wrap its function? Does `Cancel`? Why is the answer different?

---

## Task 3: Music library

```js
const SONGS = [
  { id: 's1', title: 'Blue Train', genre: 'jazz' },
  { id: 's2', title: 'So What', genre: 'jazz' },
  { id: 's3', title: 'Paranoid', genre: 'rock' },
  { id: 's4', title: 'Black Dog', genre: 'rock' },
  { id: 's5', title: 'Teardrop', genre: 'other' },
];
```

The tree:

```
App
├── Header        (shows the app's name, nothing else)
└── Library
    ├── SearchBar     (a text input)
    ├── GenreButtons  (All, Jazz, Rock, Other)
    ├── SongRow       (one per matching song, with a Play button)
    ├── NowPlaying    (see below)
    └── HelpTip       (see below)
```

- The list shows only songs that match **both** the search text (ignoring case) and the chosen genre.
  If none match, it shows `No songs found` instead of the `<ul>`.
- The playing song's row has the class `playing`.
- `NowPlaying` shows `Now playing: Blue Train` with a `Stop` button, or `Nothing playing` and no
  button.
- `HelpTip` has a `Help` button that shows or hides the text `Click Play on any song.`
- Put every piece of state where the rule says. Not all of it belongs in the same component.

### My solution

```jsx
import { useState } from 'react';

```

### My answer

1. List each piece of state and the component it lives in. For each one, say who reads it and who
   changes it.
2. Why isn't any of this state in `App`?
3. If the playing song gets filtered out of the list, does `NowPlaying` still show it? Why?
