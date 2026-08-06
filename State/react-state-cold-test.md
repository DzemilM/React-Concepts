# State — Cold Test

No starter code. No shapes, no blanks. Just the requirements. Write **every line** yourself in a
blank StackBlitz.

**Rules:**

- Look up *syntax* freely (how to spell `toFixed`, what `.includes` returns, whatever). Don't look
  up the *plan* — don't open the exercise files to see the structure.
- **Write the state plan first**, in a comment at the top of each task:
  ```
  // STATE:
  // DERIVED:
  ```
  That's part of the test, not a warm-up.
- Keep the browser console open. React's warnings will catch things I'd otherwise have to.
- If you get stuck on "what do I do next" (not "how do I spell this"), that's the signal you need
  another rep — write down where it happened.
- Solutions are collapsed at the bottom. Open them **only after** you've finished all three.

---

## Task 1 — StepTracker

Build a `StepTracker` component (no props) that tracks steps walked today.

- Starts at `0`
- Three buttons: **+100**, **+500**, **Reset**
- Shows `Steps: 2400`
- Shows `Percent of goal: 24%` — the goal is 10,000 steps, no decimals
- When the goal is reached, and only then, shows `Goal reached!`

`App` renders one `StepTracker`.

**When you're done, ask yourself:** how many `useState` calls did you write? Of your three buttons,
which ones needed the current step count inside the expression, and which didn't — and why?

**My attempt:**

```jsx
import { useState } from 'react';

export function StepTracker(){
    const [steps, setSteps] = useState(0);
    const goal = 10000;
    const percentage = (steps / goal) * 100;

function handleSteps(num){
      setSteps(steps + num)
    }

    function reset(){
      setSteps(0)
    }

  return(
    <div>
      <p>Steps:{steps}</p>
      <p>Percent of goal: {Math.round(percentage)}%</p>
      <button onClick={()=>handleSteps(100)}>+100</button>
      <button onClick={()=>handleSteps(500)}>+500</button>
      <button onClick={reset}>Reset</button>
      {steps >= goal && <h2>Goal reached!</h2>}
    </div>
  )
}

export default function App(){
  return(
  <StepTracker />
)}
```

---

## Task 2 — TempConverter

Build a `TempConverter` component (no props).

- A number input where the user types a temperature in Celsius
- A button that toggles the output unit between **Fahrenheit** and **Kelvin**
- Shows the converted value to one decimal, e.g. `77.0 °F` or `298.1 K`
- The button's label says which unit it will switch *to*
- When the Celsius value is `0` or below, and only then, shows `Freezing!`

Formulas:

```
Fahrenheit = celsius * 9 / 5 + 32
Kelvin     = celsius + 273.15
```

`App` renders one `TempConverter`.

**When you're done, ask yourself:** the converted number and the unit symbol both change when you
click the button. Are either of them state? What is the *one* thing the button actually changes?

**My attempt:**

```jsx
import { useState } from 'react';

export function TempConverter(){

const [temp, setTemp] = useState(0);
const [showFahrenheit, setShowFahrenheit] = useState(true);
const fahrenheit = temp * 9 / 5 +32;
const kelvin = temp + 273.15;
const converted = showFahrenheit ? fahrenheit : kelvin;
const unit = showFahrenheit ? '°F' : 'K';


function handleTemp(event){
  setTemp(Number(event.target.value))
}

function handleShow(){
  setShowFahrenheit(!showFahrenheit)
}

  return(
    <div>
     <input type="number" value={temp} onChange={handleTemp}  />
     <button onClick={handleShow}>{showFahrenheit ? "Switch to Kelvin" : "Switch to Fahrenheit"}</button>
     <p>{converted.toFixed(1)} {unit}</p>
     {temp <= 0 && <p>Freezing!</p>}
    </div>
  )
}

export default function App(){
  return(
    <TempConverter />
  )
}

```

---

## Task 3 — Playlist

Build a `Playlist` component (no props). This is the big one.

- A text input and an **Add** button — adds a song title to the playlist
- Every song appears in a list, each with its own **Remove** button
- A separate search input that filters the visible list as you type, case-insensitively
- Above the list: `Showing 3 of 12 songs`
- An **Empty playlist** button that removes everything
- Adding an empty title does nothing
- **Adding a title that's already in the playlist does nothing** — no duplicates
- Pressing Enter in the Add field must add the song and must not reload the page

`App` renders one `Playlist`.

**Two things to be careful about**, both of which you've been caught by before:

- Searching must never delete anyone. Clear the search box and every song comes back.
- Once a search is active, the position of a song in what the user sees is *not* its position in
  the real list.

**When you're done, ask yourself:** how many pieces of state, and how many derived values? For the
duplicate check — which array did you look in, and why couldn't it be the filtered one?

**My attempt:**

```jsx

```

---

## After you finish

1. Did you ever open the exercise files for the **plan**, or only for syntax?
2. Which task cost you the most "what do I do next" time?
3. Did your state plan at the top of each task match what you actually ended up writing? If it
   changed halfway through, what changed and why?
4. How many of your bugs did the browser console catch before I did?

---

<details>
<summary>Solutions — open only after finishing all three</summary>

### Task 1

```jsx
import { useState } from 'react';

// STATE:   steps
// DERIVED: percent, goalReached

function StepTracker() {
  const [steps, setSteps] = useState(0);

  function handleAddHundred() {
    setSteps(steps + 100);
  }

  function handleAddFiveHundred() {
    setSteps(steps + 500);
  }

  function handleReset() {
    setSteps(0);
  }

  const percent = Math.round((steps / 10000) * 100);
  const goalReached = steps >= 10000;

  return (
    <div>
      <p>Steps: {steps}</p>
      <p>Percent of goal: {percent}%</p>
      {goalReached && <p>Goal reached!</p>}
      <button onClick={handleAddHundred}>+100</button>
      <button onClick={handleAddFiveHundred}>+500</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Task 1</h1>
      <StepTracker />
    </div>
  );
}

export default App;
```

**One** `useState`. `percent` and `goalReached` are both calculated from `steps`, so both are
plain `const`s.

The two Add buttons need `steps` in the expression because the new value depends on the old one.
Reset doesn't — `0` is `0` regardless of what came before, so a literal is correct there.

`Math.round` rather than `.toFixed(0)` — you want a number for display, not a formatted string, and
nothing is calculated from it afterwards either way. Both work here; `Math.round` is the honest
one because the job is rounding, not formatting.

### Task 2

```jsx
import { useState } from 'react';

// STATE:   celsius, showFahrenheit
// DERIVED: converted, unit, buttonLabel, isFreezing

function TempConverter() {
  const [celsius, setCelsius] = useState(0);
  const [showFahrenheit, setShowFahrenheit] = useState(true);

  function handleCelsiusChange(event) {
    setCelsius(Number(event.target.value));
  }

  function handleToggle() {
    setShowFahrenheit(!showFahrenheit);
  }

  const converted = showFahrenheit ? celsius * 9 / 5 + 32 : celsius + 273.15;
  const unit = showFahrenheit ? '°F' : 'K';
  const buttonLabel = showFahrenheit ? 'Switch to Kelvin' : 'Switch to Fahrenheit';
  const isFreezing = celsius <= 0;

  return (
    <div>
      <input type="number" value={celsius} onChange={handleCelsiusChange} />
      <p>
        {converted.toFixed(1)} {unit}
      </p>
      {isFreezing && <p>Freezing!</p>}
      <button onClick={handleToggle}>{buttonLabel}</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Task 2</h1>
      <TempConverter />
    </div>
  );
}

export default App;
```

**Two** pieces of state. The user can change exactly two things — the number they type, and which
unit they want. Everything else follows.

The button changes **one boolean**. That single boolean then drives four separate things on screen:
the formula used, the symbol shown, the button's own label, and nothing else. Storing any of those
four separately would let them fall out of step with each other.

Note `converted` stays a real number and `.toFixed(1)` is applied in the JSX. If you'd formatted it
in the calculation, it would be a string — fine here since nothing else uses it, but the habit is
what matters.

### Task 3

```jsx
import { useState } from 'react';

// STATE:   songs, input, query
// DERIVED: visibleSongs, counts

function Playlist() {
  const [songs, setSongs] = useState([]);
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  function handleInputChange(event) {
    setInput(event.target.value);
  }

  function handleQueryChange(event) {
    setQuery(event.target.value);
  }

  function handleAdd(event) {
    event.preventDefault();
    if (input === '') {
      return;
    }
    if (songs.includes(input)) {
      return;
    }
    setSongs([...songs, input]);
    setInput('');
  }

  function handleRemove(title) {
    setSongs(songs.filter((song) => song !== title));
  }

  function handleEmpty() {
    setSongs([]);
  }

  const visibleSongs = songs.filter((song) =>
    song.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input type="text" value={input} onChange={handleInputChange} />
        <button>Add</button>
      </form>

      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleQueryChange}
      />

      <p>
        Showing {visibleSongs.length} of {songs.length} songs
      </p>

      <ul>
        {visibleSongs.map((song) => (
          <li key={song}>
            {song}
            <button type="button" onClick={() => handleRemove(song)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleEmpty}>Empty playlist</button>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Task 3</h1>
      <Playlist />
    </div>
  );
}

export default App;
```

**Three** pieces of state, and `visibleSongs` is derived — never stored. Store it and the songs
that don't match get overwritten out of existence; clear the search and they're gone for good.

**The duplicate check looks in `songs`, not `visibleSongs`.** If a search were active, a song could
be filtered out of view while still being in the playlist — checking the visible list would let you
add it twice. The full list is the only source of truth about what exists.

**`handleRemove` takes a title, not an index.** With a search active, `visibleSongs[0]` might be
`songs[7]` — removing "index 0" would delete the wrong song. Names don't shift when you filter;
positions do. This is also why `key={song}` is safe here: no duplicates are allowed, so titles are
unique.

Two guard clauses rather than one combined condition. Either is fine, but separate ones read as two
distinct rules — empty, and already there.

`type="button"` on Remove: it's outside the form so it isn't strictly required, but it guarantees
the button can never submit anything.

</details>