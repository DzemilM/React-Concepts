# React Props — Practice Exercises (Set 3)

Same six concepts as before, all-new scenarios. This set is a **retest**: 1–3 are quick
warmups, 4–5 reinforce spread/map/children, and **6 is a fresh nested-object + map + reduce
challenge** — the same shape as Set 2's `OrderSummary`, so it tells you whether the hard one
actually stuck.

**Rules for yourself:**
- Type every line by hand in StackBlitz. Run it. Don't move on until the preview matches the goal.
- Try each one *fully* before opening the solutions at the bottom. Getting stuck and pushing
  through is the whole point — a wrong render you then fix teaches more than a right copy.
- For #6 especially: don't peek. If you stall, re-read the 5-step mental model (data → prop →
  dots → map → reduce), not the answer.

---

## Exercise 1: MovieCard (basics)

**Goal:** Make `MovieCard` reusable. It accepts a `title` and a `director` prop and renders
them in an `<h2>` and a `<p>`. `App` must render **at least three** movies, one of which
**must** be `"Inception"` directed by `"Christopher Nolan"`.

```jsx
export function MovieCard(props) {
  return (
    <div className="movie">
      <h2>{props.title}</h2>
      <p>{props.director}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Watchlist</h1>
      <MovieCard title="Inception" director="Cristopher Nolan" />
      <MovieCard title="Batman Begins" director="Cristopher Nolan" />
      <MovieCard title="The Dark Knight" director="Cristopher Nolan" />
    </div>
  );
}

export default App;
```

---

## Exercise 2: WeatherTile (non-string props + conditional)

**Goal:** Create a `WeatherTile` that accepts a `city` (string), a `temp` (number, in °C),
and an `isRaining` (boolean).

- Render the city in an `<h3>`.
- Render the temp rounded to a whole number, followed by `"°C"`.
- If `isRaining` is `true`, also render `"☔ bring an umbrella"`; if `false`, render `"☀ clear"`.

`App` renders one rainy city and one clear city. Remember: `temp={18.7}` and
`isRaining={true}` need **curly braces** (they're a number and a boolean, not strings).

```jsx
export function WeatherTile(props) {
  return (
    <div className="weather">
      <h3>{props.city}</h3>
      <p>{Math.round(props.temp)+"°C"}</p>
      <p>{props.isRaining?"☔ bring an umbrella":"☀ clear"}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Forecast</h1>
      <WeatherTile city="Sjenica" temp={18.7} isRaining={true} />
      <WeatherTile city="Pazar" temp={28.7} isRaining={false} />
    </div>
  );
}

export default App;
```

---

## Exercise 3: Tag (destructuring + default values)

**Goal:** Build a `Tag` that accepts `label` and `size`. **Destructure in the parameter
list** (no `props.xxx`) and give `size` a **default value** of `"medium"`.

- Apply `size` as the `className`.
- `App` renders three tags: one `"small"`, one `"large"`, and one with **no size prop** (must
  fall back to `"medium"`).
- After it runs, **Inspect** the DOM and confirm the three `<span>`s have
  `class="small"`, `class="large"`, `class="medium"`.

```jsx
export function Tag({label, size="medium"}) {
  return <span className={size}>{label}</span>;
}

function App() {
  return (
    <div id="app">
      <Tag size="small" label="bruda" />
      <Tag label="brate" />
      <Tag size="large" label="tebra" />
    </div>
  );
}

export default App;
```

---

## Exercise 4: PlayerRow (spread + map)

**Goal:** Render one `PlayerRow` per entry in `PLAYERS` **without writing each prop by hand**
— use the **spread** operator and `.map()` (with a `key`).

- `PlayerRow` accepts `name`, `team`, and `points` and renders them.
- Reminder: inside the map you work with the single item (`player`), and `key` must be a
  value that's **unique** per player.

```jsx
const PLAYERS = [
  { id: "p1", name: "Luka", team: "Mavs", points: 33 },
  { id: "p2", name: "Jokic", team: "Nuggets", points: 28 },
  { id: "p3", name: "Giannis", team: "Bucks", points: 31 },
];

export function PlayerRow({name, team, points}) {
  return (
    <div className="player">
      <p>Name={name}</p>
      <p>Team={team}</p>
      <p>Point={points}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Scoreboard</h1>
      {PLAYERS.map((player)=>(
        <PlayerRow key={player.id} {...player} />
      ))}
    </div>
  );
}

export default App;
```

---

## Exercise 5: Panel (children) + a mapped list inside

**Goal:** Two things combined — a `children` wrapper *and* a small map, so you get an extra
rep on both before the challenge.

- Build a generic `Panel` that accepts a `heading` and `children`. It renders the heading in
  an `<h2>`, then the `children` below.
- In `App`, use `Panel` **twice**. Inside the **first** panel, nest a plain `<p>`. Inside the
  **second** panel, nest a `<ul>` whose `<li>`s you generate by **`.map()`-ing over an array
  of strings** (e.g. `["Milk", "Eggs", "Bread"]`) — remember a `key`.

This proves `children` can be *anything*, including a list you built with `.map()`.

```jsx
export function Panel({heading, children}) {
  return (
    <div className="panel">
      <h2>{heading}</h2>
      {children}
    </div>
  );
}

function App() {
  const groceries = ["Milk", "Eggs", "Bread"];

  return (
    <div id="app">
    <Panel heading="some heading">
      <p>Plain p</p>
    </Panel>

    <Panel heading="another heading">
    <ul>
      {groceries.map((grocery)=>(
        <li key={grocery}>
         Grocery={grocery}
        </li>
      ))}
    </ul>
    </Panel>
    </div>
  );
}

export default App;
```

---

## Exercise 6: PlaylistSummary (nested objects + arrays + reduce — the retest)

**Goal:** Same shape as Set 2's `OrderSummary`, new data. Build a `PlaylistSummary` that
accepts a single `playlist` prop, an **object** shaped like this:

```js
{
  id: "PL-1",
  owner: { name: "Mia", country: "Canada" },
  tracks: [
    { title: "Song A", artist: "Band X", seconds: 200 },
    { title: "Song B", artist: "Band Y", seconds: 245 },
  ],
}
```

- Render the playlist id, and the owner's `name` **and** `country` (nested:
  `playlist.owner.name`).
- Render each track as an `<li>` showing its `title`, `artist`, and length. Use `.map()` with
  a `key`.
- Compute and render the **total duration** in seconds across all tracks (use `reduce`).
- **Bonus 1:** show the total as `M:SS` (e.g. 445 seconds → `"7:25"`). Hint:
  `Math.floor(total / 60)` for minutes, `total % 60` for the leftover seconds. (Getting a
  leading zero on single-digit seconds is a nice extra.)
- **Bonus 2:** accept a `speed` prop (a number like `1.5`) with a **default of `1`**, and
  divide the total duration by it (listening faster = less time). Default `1` leaves it
  unchanged.
- `App` must render **at least two** playlists.

Reminder of the 5-step model: **data → comes in as a prop → dig with dots → `.map` the array
(work with the single item!) → `.reduce` for the total.**

```jsx
export function PlaylistSummary({playlist, speed=1}) {
  const totalSeconds = playlist.tracks.reduce((sum, track) => sum + track.seconds, 0);
  return (
    <div className="playlist">
     <p>Name={playlist.owner.name}</p>
     <p>Country={playlist.owner.country}</p>
      <ul>
      {playlist.tracks.map((track)=>(
        <li key={track.title}>
          {track.title}-title, {track.artist}-artist, {track.seconds}-seconds
        </li>
      ))}
      </ul>
      <h2>
      TOTAL={Math.floor(totalSeconds/60)}:{totalSeconds % 60}
      </h2>
    </div>
  );
}

function App() {
  const playlistA = {
    id: "PL-1",
    owner: { name: "Mia", country: "Canada" },
    tracks: [
      { title: "Song A", artist: "Band X", seconds: 200 },
      { title: "Song B", artist: "Band Y", seconds: 245 },
    ],
  };

  const playlistB = {
    id: "PL-2",
    owner: { name: "Milan", country: "Srbija" },
    tracks: [
      { title: "Pesma A", artist: "Elektricna jegulja", seconds: 300 },
      { title: "Pesma B", artist: "Combe", seconds: 545 },
    ],
  };

  return (
    <div id="app">
      <h1>Playlists</h1>
      <PlaylistSummary playlist={playlistA} />
      <PlaylistSummary playlist={playlistB} />
    </div>
  );
}

export default App;
```

---

## Self-check questions (answer in your own words before peeking)

1. In `<WeatherTile temp={18.7} isRaining={true} />`, why do both values need `{ }` but
   `city="Paris"` doesn't?
2. Inside `TRACKS.map((track) => ...)`, if you accidentally wrote `playlist.owner.title`
   instead of `track.title`, what would render and why?
3. What are the **two** arguments `.reduce()` takes, and what is the lonely `0` (or `1`) at
   the very end?
4. Your `Panel` receives a `<ul>` built with `.map()` as its `children`. Did you pass it as an
   attribute, or by nesting? Which is the idiomatic way?
5. `speed = 1` as a default: when exactly does the `1` get used, and why is `1` a "safe"
   default for a divisor (what would `0` do)?

---

<details>
<summary>⚠️ Solutions — only open after a real attempt at each</summary>

### 1. MovieCard

```jsx
export function MovieCard(props) {
  return (
    <div className="movie">
      <h2>{props.title}</h2>
      <p>{props.director}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Watchlist</h1>
      <MovieCard title="Inception" director="Christopher Nolan" />
      <MovieCard title="Parasite" director="Bong Joon-ho" />
      <MovieCard title="Whiplash" director="Damien Chazelle" />
    </div>
  );
}

export default App;
```

### 2. WeatherTile

```jsx
export function WeatherTile(props) {
  return (
    <div className="weather">
      <h3>{props.city}</h3>
      <p>{Math.round(props.temp)}°C</p>
      <p>{props.isRaining ? "☔ bring an umbrella" : "☀ clear"}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Forecast</h1>
      <WeatherTile city="London" temp={14.3} isRaining={true} />
      <WeatherTile city="Madrid" temp={29.8} isRaining={false} />
    </div>
  );
}

export default App;
```

### 3. Tag

```jsx
export function Tag({ label, size = "medium" }) {
  return <span className={size}>{label}</span>;
}

function App() {
  return (
    <div id="app">
      <Tag label="New" size="small" />
      <Tag label="Sale" size="large" />
      <Tag label="Default" />
    </div>
  );
}

export default App;
```

### 4. PlayerRow

```jsx
const PLAYERS = [
  { id: "p1", name: "Luka", team: "Mavs", points: 33 },
  { id: "p2", name: "Jokic", team: "Nuggets", points: 28 },
  { id: "p3", name: "Giannis", team: "Bucks", points: 31 },
];

export function PlayerRow({ name, team, points }) {
  return (
    <div className="player">
      <strong>{name}</strong> — {team} — {points} pts
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Scoreboard</h1>
      {PLAYERS.map((player) => (
        <PlayerRow key={player.id} {...player} />
      ))}
    </div>
  );
}

export default App;
```

### 5. Panel

```jsx
export function Panel({ heading, children }) {
  return (
    <div className="panel">
      <h2>{heading}</h2>
      {children}
    </div>
  );
}

function App() {
  const groceries = ["Milk", "Eggs", "Bread"];

  return (
    <div id="app">
      <Panel heading="Welcome">
        <p>This panel wraps a paragraph.</p>
      </Panel>
      <Panel heading="Shopping List">
        <ul>
          {groceries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

export default App;
```

### 6. PlaylistSummary (with both bonuses)

```jsx
export function PlaylistSummary({ playlist, speed = 1 }) {
  const totalSeconds = playlist.tracks.reduce(
    (sum, track) => sum + track.seconds,
    0
  );
  const adjusted = totalSeconds / speed;
  const minutes = Math.floor(adjusted / 60);
  const seconds = Math.round(adjusted % 60);
  const padded = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className="playlist">
      <p>id: {playlist.id}</p>
      <p>Owner: {playlist.owner.name}</p>
      <p>Country: {playlist.owner.country}</p>
      <ul>
        {playlist.tracks.map((track) => (
          <li key={track.title}>
            {track.title} — {track.artist} — {track.seconds}s
          </li>
        ))}
      </ul>
      <h2>
        Total: {minutes}:{padded}
      </h2>
    </div>
  );
}

function App() {
  const playlistA = {
    id: "PL-1",
    owner: { name: "Mia", country: "Canada" },
    tracks: [
      { title: "Song A", artist: "Band X", seconds: 200 },
      { title: "Song B", artist: "Band Y", seconds: 245 },
    ],
  };
  const playlistB = {
    id: "PL-2",
    owner: { name: "Leo", country: "Brazil" },
    tracks: [
      { title: "Track 1", artist: "DJ Z", seconds: 180 },
      { title: "Track 2", artist: "DJ Q", seconds: 210 },
      { title: "Track 3", artist: "DJ W", seconds: 195 },
    ],
  };

  return (
    <div id="app">
      <h1>Playlists</h1>
      <PlaylistSummary playlist={playlistA} />
      <PlaylistSummary playlist={playlistB} speed={1.5} />
    </div>
  );
}

export default App;
```

Note on `%`: `total % 60` is the **remainder** after dividing by 60 — i.e. the leftover
seconds that don't make a full minute. `445 % 60` is `25`, and `Math.floor(445 / 60)` is `7`,
so `7:25`. That's the whole `M:SS` trick.

</details>
```
