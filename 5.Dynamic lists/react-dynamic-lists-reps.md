# Dynamic Lists — Ten Reps

Not an exercise set. **Reps.** Ten small tasks, each one thing, each written from a blank file.

## How this is different from the first exercise file

The exercise file gave you the data, the parameter names, the surrounding JSX and a `TODO` in the
gap. You scored well on it. Then Section D of the binding drill took the scaffold away and asked you
to write seven expressions from English, and you got one.

That's the gap this file exists to close. Nothing here is harder than what you've already done — it's
the same material, minus the frame. Each task is three to six lines of output. If one takes you more
than ten minutes, stop and write down where you stalled; that's the useful information, not the
finished code.

## Rules

1. **Blank file every time.** Don't copy the previous task and edit it. The point is starting from
   nothing, repeatedly.
2. **Write the plan before the JSX.** Three lines, every task, no exceptions:
   ```
   // ARRAY:   what am I looping over?
   // ITEM:    what does ONE element look like? write the fields out.
   // RESULT:  what type comes back?
   ```
   `RESULT` is the one that catches wrong-method errors before you type them.
3. **Run it before you decide it's done.** Read the screen. `undefined` means one level too early,
   `NaN` means arithmetic on a non-number, `[object Object]` means a whole object where a field
   belonged.
4. **Don't look at earlier tasks in this file.** Looking up syntax is fine. Looking up the plan
   isn't.

Solutions are at the bottom. Check after each one — these are short enough that a wrong answer
sitting uncorrected would poison the next rep.

---

## Rep 1

```js
const COLORS = ['red', 'green', 'blue'];
```

A `<ul>` with one `<li>` per colour.

## Rep 2

```js
const CITIES = [
  { id: 'c1', name: 'Oslo', country: 'Norway' },
  { id: 'c2', name: 'Lima', country: 'Peru' },
];
```

A `<ul>` where each row reads `Oslo, Norway`.

## Rep 3

```js
const PLANTS = [
  { id: 'p1', name: 'Fern', height: 30 },
  { id: 'p2', name: 'Cactus', height: 45 },
  { id: 'p3', name: 'Ivy', height: 12 },
];
```

The list, plus an `<h2>` above it reading `3 plants` — the number coming from the data.

## Rep 4

Same `PLANTS` data. Each row is its own `PlantRow` component that receives `name` and `height` and
renders `Fern — 30cm`.

## Rep 5

```js
const STUDENTS = [
  { id: 's1', name: 'Ana', passed: true },
  { id: 's2', name: 'Bo', passed: false },
  { id: 's3', name: 'Cy', passed: true },
];
```

Only the students who passed.

## Rep 6

Same `STUDENTS` data. Only those who **failed**, and if nobody failed, a `<p>Everyone passed.</p>`
with no list element on the page at all.

Then flip `Bo` to `passed: true` and confirm.

## Rep 7

```js
const TRACKS = [
  { id: 't1', title: 'Intro', seconds: 95 },
  { id: 't2', title: 'Verse', seconds: 140 },
  { id: 't3', title: 'Outro', seconds: 60 },
];
```

Rows reading `1. Intro (95s)`, numbered from the array order.

## Rep 8

Same `TRACKS` data. The list, plus a `<p>` below it reading `Total: 295s`.

## Rep 9

Same `TRACKS` data. The list, **longest first**, without modifying `TRACKS`.

## Rep 10

```js
const TEAMS = [
  {
    id: 'g1',
    group: 'Group A',
    players: [
      { id: 'x1', name: 'Ana', goals: 3 },
      { id: 'x2', name: 'Bo', goals: 1 },
    ],
  },
  {
    id: 'g2',
    group: 'Group B',
    players: [{ id: 'x3', name: 'Cy', goals: 5 }],
  },
];
```

Each group as a `<section>` with an `<h3>` and a `<ul>` of its players, each row reading
`Ana — 3 goals`.

---

## After all ten

Count how many you wrote correctly **first try, without running it to find out**. That number is the
one worth tracking — not how many you eventually got right.

Then answer:

1. Which reps needed `.map()`, which needed `.filter()`, and which needed `.reduce()`? Say what
   decided it each time.
2. Which rep needed a copy before doing anything, and why?
3. In Rep 10, how many `key` attributes are there, and on which elements?

---

<details>
<summary><strong>Solutions</strong></summary>

### Rep 1

```jsx
const COLORS = ['red', 'green', 'blue'];

function App() {
  return (
    <ul>
      {COLORS.map((color) => (
        <li key={color}>{color}</li>
      ))}
    </ul>
  );
}

export default App;
```

`key={color}` is fine here because the strings are unique — a property of this data, not a rule.

### Rep 2

```jsx
function App() {
  return (
    <ul>
      {CITIES.map((city) => (
        <li key={city.id}>
          {city.name}, {city.country}
        </li>
      ))}
    </ul>
  );
}
```

Two braced expressions with a literal `, ` between them.

### Rep 3

```jsx
function App() {
  return (
    <div>
      <h2>{PLANTS.length} plants</h2>
      <ul>
        {PLANTS.map((plant) => (
          <li key={plant.id}>{plant.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

`PLANTS.length` — derived. The `<h2>` and `<ul>` need a wrapper because a component returns one
value; a `<div>` or a Fragment both work.

### Rep 4

```jsx
function PlantRow({ name, height }) {
  return (
    <li>
      {name} — {height}cm
    </li>
  );
}

function App() {
  return (
    <ul>
      {PLANTS.map((plant) => (
        <PlantRow key={plant.id} name={plant.name} height={plant.height} />
      ))}
    </ul>
  );
}
```

Key on `<PlantRow />`, because that's what the callback returns. Not on the `<li>` inside it.

### Rep 5

```jsx
function App() {
  const passed = STUDENTS.filter((student) => student.passed);

  return (
    <ul>
      {passed.map((student) => (
        <li key={student.id}>{student.name}</li>
      ))}
    </ul>
  );
}
```

`student.passed` is already a boolean — no `=== true` needed.

### Rep 6

```jsx
function App() {
  const failed = STUDENTS.filter((student) => !student.passed);

  return (
    <div>
      {failed.length === 0 ? (
        <p>Everyone passed.</p>
      ) : (
        <ul>
          {failed.map((student) => (
            <li key={student.id}>{student.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Ternary, not `&&` — two visible outcomes, and `&&` would leave an empty `<ul>` in the DOM.

### Rep 7

```jsx
function App() {
  return (
    <ol>
      {TRACKS.map((track, index) => (
        <li key={track.id}>
          {index + 1}. {track.title} ({track.seconds}s)
        </li>
      ))}
    </ol>
  );
}
```

`index` for the number, `track.id` for the key. Position versus identity — two jobs, two answers.

### Rep 8

```jsx
function App() {
  const totalSeconds = TRACKS.reduce((sum, track) => sum + track.seconds, 0);

  return (
    <div>
      <ol>
        {TRACKS.map((track) => (
          <li key={track.id}>{track.title}</li>
        ))}
      </ol>
      <p>Total: {totalSeconds}s</p>
    </div>
  );
}
```

One number for the whole array → computed above the `return`, rendered outside the loop.

### Rep 9

```jsx
function App() {
  const longest = [...TRACKS].sort((a, b) => b.seconds - a.seconds);

  return (
    <ol>
      {longest.map((track) => (
        <li key={track.id}>
          {track.title} ({track.seconds}s)
        </li>
      ))}
    </ol>
  );
}
```

`[...TRACKS]` first — `.sort()` reorders in place and would permanently rearrange `TRACKS`.
`b.seconds - a.seconds` for descending.

### Rep 10

```jsx
function App() {
  return (
    <div>
      {TEAMS.map((team) => (
        <section key={team.id}>
          <h3>{team.group}</h3>
          <ul>
            {team.players.map((player) => (
              <li key={player.id}>
                {player.name} — {player.goals} goals
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

Two maps, two keys: `team.id` on the `<section>`, `player.id` on the `<li>`. No sort needed here, so
no copy needed either.

### Closing answers

1. **`.map()`** — 1, 2, 3, 4, 7, 10, and the display half of 5, 6, 8, 9. Chosen whenever the count
   stays the same and each item becomes something else. **`.filter()`** — 5 and 6, chosen when the
   count shrinks and the surviving items are unchanged. **`.reduce()`** — 8, chosen when a whole
   array collapses into one value.
2. **Rep 9.** `.sort()` mutates the array it's called on, and the task forbade modifying `TRACKS`.
   `.map()` and `.filter()` never need a copy — they build new arrays and leave the original alone.
3. **Two.** `team.id` on the `<section>` and `player.id` on the `<li>` — one per map, on whatever
   that map's callback returns.

</details>
