# Dynamic Lists — Cold Test

No starter code. No shapes, no blanks. You get the data and the requirements; every line of JSX is
yours to write in a blank StackBlitz.

**Rules:**

- Look up *syntax* freely (how `.sort()`'s comparator is spelled, what `.reduce()`'s second argument
  does). Don't look up the *plan* — don't open the exercise file to see the structure.
- **Write the list plan first**, in a comment at the top of each task:
  ```
  // ARRAY:    what am I mapping over?
  // ITEM:     what does ONE element of it look like? write the fields out.
  // DERIVED:  what's computed once, outside the loop?
  ```
  That's part of the test, not a warm-up. Five of your bugs in the exercise set were "I used the
  array where I meant an item, or the item where I meant a field." Writing `ITEM:` out before you
  start is the fix.
- **Run it before you ask me.** Every bug in the exercise set was visible on screen — `NaN.`,
  `0 tasks left`, a crash. Read the output, then read the error, and only bring me what you can't
  explain.
- Keep the browser console open. React warns about missing keys; that warning is free marking.
- If you get stuck on "what do I do next" (not "how do I spell this"), that's the signal you need
  another rep — write down where it happened.
- Solutions are collapsed at the bottom. Open them **only after** you've finished all three.

---

## Task 1 — Bookshelf

```js
const BOOKS = [
  { id: 'b1', title: 'Dune', author: 'Herbert', year: 1965 },
  { id: 'b2', title: 'Neuromancer', author: 'Gibson', year: 1984 },
  { id: 'b3', title: 'Snow Crash', author: 'Stephenson', year: 1992 },
];
```

Build it so that:

- An `<h2>` reads `3 books` — with the real number, not a typed `3`
- Below it, a `<ul>` with one row per book
- Each row reads `Dune — Herbert (1965)`
- Each row is its own `BookRow` component, receiving what it needs as props
- `App` renders the whole thing

**When you're done, ask yourself:** how many separate values does `BookRow` receive, and how many
attributes did you write on it in `App`? If those two numbers differ, why?

---

## Task 2 — Inbox

```js
const MESSAGES = [
  { id: 'm1', from: 'Ana', subject: 'Lunch?', read: false },
  { id: 'm2', from: 'Bank', subject: 'Statement ready', read: true },
  { id: 'm3', from: 'Luis', subject: 'Re: tickets', read: false },
  { id: 'm4', from: 'Newsletter', subject: 'Weekly digest', read: true },
];
```

Build it so that:

- Only **unread** messages appear
- An `<h2>` reads `2 unread`, with the real count
- Each row reads `Ana — Lunch?`
- When nothing is unread: a `<p>Inbox zero.</p>` and **no list element at all** on the page

**Then set every message to `read: true` and check the empty case.** An empty `<ul>` looks
identical to no `<ul>` on screen — the only way to know which you built is to look, so open the
browser's element inspector or reason it out from your own code.

**When you're done, ask yourself:** where did the count come from? If you called `.filter()` twice,
say why that's wasteful and what you'd do instead.

---

## Task 3 — Conference schedule

```js
const SCHEDULE = [
  {
    id: 'day1',
    day: 'Monday',
    talks: [
      { id: 't1', title: 'Intro to Hooks', minutes: 30 },
      { id: 't2', title: 'Rendering Deep Dive', minutes: 55 },
      { id: 't3', title: 'Q&A', minutes: 20 },
    ],
  },
  {
    id: 'day2',
    day: 'Tuesday',
    talks: [
      { id: 't4', title: 'Testing Components', minutes: 45 },
      { id: 't5', title: 'Performance', minutes: 40 },
    ],
  },
];
```

Build it so that:

- Each day is a `<section>` with an `<h3>` naming the day
- Within a day, talks are listed **longest first**
- Each talk row reads `1. Rendering Deep Dive (55 min)` — numbered **within its own day**, so
  Tuesday's first talk is also `1.`
- Below everything, a `<p>` reading `Total: 190 min` across the whole conference
- `SCHEDULE` must not be modified

The total is the hardest part of this test. It's one number, from data that's two levels deep. No
hint beyond that.

**When you're done, ask yourself:** how many `key` attributes are in your finished component, and
what is each one keyed off?

---

## After you finish

Answer these before opening the solutions:

1. In Task 1, `BookRow` sits inside a `.map()`. What decided which element the `key` went on?
2. In Task 2, what would have appeared on screen if you'd used `&&` instead of a ternary, with
   everything marked read?
3. In Task 3, the numbering restarts at `1.` on Tuesday. What is it about where `index` comes from
   that makes that happen automatically?
4. Which of your three tasks needed `.sort()`, and what did you have to do before calling it?

---

<details>
<summary><strong>Solutions</strong> — only after all three are done and running</summary>

### Task 1

```jsx
const BOOKS = [
  { id: 'b1', title: 'Dune', author: 'Herbert', year: 1965 },
  { id: 'b2', title: 'Neuromancer', author: 'Gibson', year: 1984 },
  { id: 'b3', title: 'Snow Crash', author: 'Stephenson', year: 1992 },
];

function BookRow({ title, author, year }) {
  return (
    <li>
      {title} — {author} ({year})
    </li>
  );
}

function App() {
  return (
    <div id="app">
      <h2>{BOOKS.length} books</h2>
      <ul>
        {BOOKS.map((book) => (
          <BookRow
            key={book.id}
            title={book.title}
            author={book.author}
            year={book.year}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
```

`BookRow` receives **three** values but you wrote **four** attributes. `key` is the fourth, and it
never arrives — React consumes it to track list identity. If `BookRow` needed the id, you'd pass it
again as a normal prop.

The count is `BOOKS.length`. Typing `3` would be a lie the moment the array changes.

`{title} — {author} ({year})` — the em dash and the parentheses are plain text sitting between
braced expressions. Text in JSX is kept exactly as typed, spaces included.

### Task 2

```jsx
const MESSAGES = [
  { id: 'm1', from: 'Ana', subject: 'Lunch?', read: false },
  { id: 'm2', from: 'Bank', subject: 'Statement ready', read: true },
  { id: 'm3', from: 'Luis', subject: 'Re: tickets', read: false },
  { id: 'm4', from: 'Newsletter', subject: 'Weekly digest', read: true },
];

function App() {
  const unread = MESSAGES.filter((message) => !message.read);

  return (
    <div id="app">
      <h2>{unread.length} unread</h2>
      {unread.length === 0 ? (
        <p>Inbox zero.</p>
      ) : (
        <ul>
          {unread.map((message) => (
            <li key={message.id}>
              {message.from} — {message.subject}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
```

`!message.read` and `message.read === false` are both fine. What isn't fine is `message === false`
or `MESSAGES.read` — the filter callback's parameter is **one message object**, and the thing you
test is a field on it.

The count is `unread.length` — derived from the array you already built. A second
`MESSAGES.filter(...).length` walks all four messages again to learn something you already knew.

A ternary, not `&&`, because there are two visible outcomes. With `&&` you'd need one expression for
the message and a second for the list, and it's easy to end up rendering an empty `<ul>` — which
looks like success and isn't.

### Task 3

```jsx
function App() {
  const totalMinutes = SCHEDULE.reduce(
    (sum, day) => sum + day.talks.reduce((daySum, talk) => daySum + talk.minutes, 0),
    0
  );

  return (
    <div id="app">
      <h2>Schedule</h2>
      {SCHEDULE.map((day) => {
        const sortedTalks = [...day.talks].sort((a, b) => b.minutes - a.minutes);

        return (
          <section key={day.id}>
            <h3>{day.day}</h3>
            <ul>
              {sortedTalks.map((talk, index) => (
                <li key={talk.id}>
                  {index + 1}. {talk.title} ({talk.minutes} min)
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <p>Total: {totalMinutes} min</p>
    </div>
  );
}

export default App;
```

**The total.** Two levels of data, so a `reduce` inside a `reduce`: the outer one walks days and
adds up each day's own total, the inner one walks that day's talks. A `flatMap` version works too:
`SCHEDULE.flatMap((d) => d.talks).reduce((s, t) => s + t.minutes, 0)`. Either way it's computed once
at the top of `App`, because it's one number for the whole page — not something that belongs inside
either loop.

**`b.minutes - a.minutes`**, not `a - b`. Longest first is descending, so the subtraction flips.
For Monday: 55, 30, 20.

**`[...day.talks]`** before sorting. `.sort()` reorders in place, so without the copy you'd
permanently rearrange `SCHEDULE`, and the constraint forbids it.

**`sortedTalks` sits above the callback's `return`**, not above `App`'s — it depends on `day`, which
only exists inside that callback. Typing `{` after the arrow means you owe a `return`, and it's
there.

**Three keys?** No — **two**. `day.id` on the `<section>` and `talk.id` on the `<li>`. Two maps, two
lists React is tracking, one key each. The `<h3>`, `<ul>` and `<p>` aren't in any list, so they get
nothing.

**The numbering restarts** because `index` comes from the **inner** map, which starts over at `0`
every time the outer callback runs. You didn't have to reset anything — the scope did it.

### Answers to the closing questions

1. The `key` goes on whatever the `.map()` callback **returns** — here that's `<BookRow />`, so the
   key goes there and not on the `<li>` inside `BookRow`. React tracks the element the array holds,
   and the array holds `BookRow` elements.
2. Nothing visible would change — you'd still see no rows — but the DOM would hold an **empty
   `<ul>`**, and the "Inbox zero." message would only appear if you wrote a second condition for it.
   `&&` gives you one outcome or nothing; you needed two outcomes.
3. `index` is the second parameter of the **inner** map, and that map is called fresh inside each
   day's callback. A new call means a new count from `0`. Nothing carries across days because
   nothing is shared across the calls.
4. Task 3. Copy the array first — `[...day.talks]` — because `.sort()` mutates the array it's called
   on, unlike `.map()` and `.filter()`, which both build new ones and leave the original alone.

</details>
