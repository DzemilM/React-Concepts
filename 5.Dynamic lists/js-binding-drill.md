# What Is This Name Bound To? — a plain-JS drill

No React. No JSX. No components. Every question here is JavaScript, and you can paste any of it
straight into a browser console to check yourself.

## Why this file exists

Across the Dynamic Lists exercises and cold test, seven bugs were the same bug:

`task === false` · `TASKS.done` · `player.index` · `[...MENU]` · `cat.price` · `{book}` vs the props
actually sent · `b - a`

Every one of them was *"what is this name bound to?"* — the array where an item was meant, the item
where a field was meant, a parameter mistaken for a property. None of them were concept failures.
You can explain keys, `filter` vs `map`, and derived-vs-state correctly. You just don't pause to say
what a variable holds before putting a dot after it.

**The habit this drill builds: before you type a `.`, say out loud what's on the left of it.**

---

## The data

Everything below uses this one shape. Read it properly before you start — most of the drill is just
*reading it carefully*.

```js
const LIBRARY = {
  name: 'City Library',
  shelves: [
    {
      id: 's1',
      label: 'Fiction',
      books: [
        { id: 'b1', title: 'Dune', pages: 412, out: false },
        { id: 'b2', title: 'Ubik', pages: 224, out: true },
      ],
    },
    {
      id: 's2',
      label: 'Science',
      books: [
        { id: 'b3', title: 'Cosmos', pages: 365, out: false },
      ],
    },
  ],
};
```

Four levels: an **object**, holding an **array** of shelf objects, each holding an **array** of book
objects. Say which is which out loud once before continuing.

---

## Section A — What does it evaluate to?

For each line, write the value. If it's `undefined`, `NaN`, or a crash, say which — those three are
the answers that matter, because they're what your bugs actually produced.

```js
A1.  LIBRARY.length
A2.  LIBRARY.shelves.length
A3.  LIBRARY.shelves.label
A4.  LIBRARY.shelves[0].label
A5.  LIBRARY.shelves[0].books.title
A6.  LIBRARY.shelves[0].books[1].title
A7.  LIBRARY.shelves.books
A8.  LIBRARY.shelves[1].books[0].pages
A9.  [...LIBRARY]
A10. [...LIBRARY.shelves].length
A11. LIBRARY.shelves[0].books[0] - LIBRARY.shelves[0].books[1]
A12. LIBRARY.shelves[0].books[0].pages - LIBRARY.shelves[0].books[1].pages
```

**Then answer in one sentence:** what do A1, A3, A5 and A7 have in common?

---

## Section B — What is the parameter bound to?

For each call, say what **each** parameter holds. Not what the callback should do — just what's in
the box.

```js
B1.  LIBRARY.shelves.map((x) => …)
B2.  LIBRARY.shelves[0].books.filter((x) => …)
B3.  LIBRARY.shelves.map((x, y) => …)
B4.  [...LIBRARY.shelves[0].books].sort((x, y) => …)
B5.  LIBRARY.shelves[0].books.reduce((x, y) => …, 0)
```

B5 is the one to slow down on. Its two parameters are **not** the same kind of thing as each other,
and the first one is not an item from the array. If you can say what each is without looking it up,
you understand `reduce`; if you can't, that's worth knowing now rather than in the exam.

---

## Section C — Spot the wrong dot

Each line is broken. For each: **(a)** what does it produce — a crash, `undefined`, `NaN`, or a
wrong-but-silent value? and **(b)** what's the fix?

Don't skip (a). Knowing *which* wrong output a mistake produces is how you debug from the screen
instead of from me.

```js
const shelf = LIBRARY.shelves[0];
const books = shelf.books;

C1.  books.filter((book) => book === false)
C2.  books.filter(book.out === false)
C3.  books.sort((a, b) => a - b)
C4.  books.map((book, index) => book.index + 1)
C5.  [...shelf].sort((a, b) => a.pages - b.pages)
C6.  books.reduce((sum, book) => sum + book, 0)
C7.  LIBRARY.shelves.map((shelf) => shelf.title)
```

C6 is nastier than it looks — it doesn't crash and it doesn't give `NaN`. Predict the actual output
before you run it.

---

## Section D — Write the expression

English on the left, you write the JavaScript. One expression each, no loops, no `forEach`.

```
D1. How many shelves are there?
D2. An array of every book title on the Fiction shelf.
D3. The books on the Fiction shelf that are currently checked out.
D4. Total pages on the Fiction shelf.
D5. The Fiction shelf's books, longest first — without modifying LIBRARY.
D6. Total pages across the entire library, every shelf included.
D7. An array of the shelf labels, in the form 'Fiction (2 books)'.
```

D6 is the cold-test total again. D7 is a `map` whose callback reads a field *and* a nested length —
two different depths in one expression.

---

## Section E — The habit

Take your D5 and D6 answers and, above each, write the comment you skipped on the cold test:

```
// ARRAY:   what am I mapping/reducing over?
// ITEM:    what does ONE element look like? write the fields out.
// RESULT:  what type comes back — array, number, object?
```

Then one sentence: in D6, the outer `reduce`'s second parameter and the inner `reduce`'s second
parameter hold different things. What is each one?

---

<details>
<summary><strong>Answers</strong> — after you've done all five sections</summary>

### Section A

```
A1.  undefined      — LIBRARY is an object; objects have no .length
A2.  2
A3.  undefined      — .shelves is an array; the label is on the shelves inside it
A4.  'Fiction'
A5.  undefined      — .books is an array; the title is on the books inside it
A6.  'Ubik'
A7.  undefined      — .shelves is an array; .books is on a shelf, not on the array of shelves
A8.  365
A9.  TypeError: LIBRARY is not iterable — you can't spread an object into an array literal
A10. 2
A11. NaN            — subtracting two objects
A12. 188            — 412 - 224
```

**A1, A3, A5 and A7 all reach for a field one level too high.** Every one asks a *container* for
something that lives on the *things inside it*. That's your bug, four times, in its purest form —
and notice none of them crash. They quietly hand back `undefined`, which then becomes `NaN` or a
blank screen somewhere further down.

### Section B

```
B1.  x = one shelf object            { id, label, books }
B2.  x = one book object             { id, title, pages, out }
B3.  x = one shelf object, y = its index (0, then 1) — a number, not a property of x
B4.  x and y = two book objects being compared against each other
B5.  x = the running total so far (starts at 0, the second argument)
     y = one book object
```

B5 is the trap: `reduce`'s first parameter is the **accumulator**, not an item. It's the only
callback here whose first parameter isn't an element of the array. That's why `sum + book` in C6
goes wrong — `book` is the item, `sum` is the total, and only one of them is a number.

### Section C

```
C1.  Silent wrong value — returns []. A book object is never === false, so nothing passes.
     Fix: (book) => book.out === false, or !book.out
C2.  Crash — ReferenceError: book is not defined. There's no `book` in scope out there, and
     .filter() needs a FUNCTION passed to it, not a value. Same rule as onClick={fn} vs fn().
     Fix: books.filter((book) => book.out === false)
C3.  Silent wrong value — the comparator subtracts two objects, gets NaN, and the order doesn't
     change. Also mutates `books`, and through it LIBRARY.
     Fix: [...books].sort((a, b) => a.pages - b.pages)
C4.  NaN in every slot — `index` is a standalone parameter, not a field on `book`.
     Fix: index + 1
C5.  Crash — shelf is an object, not iterable, so [...shelf] throws.
     Fix: [...shelf.books]
C6.  '0[object Object][object Object]' — a string. `sum + book` with a number and an object makes
     JavaScript stringify the object and concatenate. No crash, no NaN, just nonsense.
     Fix: sum + book.pages
C7.  [undefined, undefined] — shelves have a `label`, not a `title`. Silent.
     Fix: shelf.label
```

Count them: **five of the seven are silent.** They don't throw. That's the argument for reading the
screen carefully — a crash tells you where it broke, but `undefined`, `NaN`, and `[object Object]`
make you go looking.

### Section D

```js
D1. LIBRARY.shelves.length

D2. LIBRARY.shelves[0].books.map((book) => book.title)

D3. LIBRARY.shelves[0].books.filter((book) => book.out)

D4. LIBRARY.shelves[0].books.reduce((sum, book) => sum + book.pages, 0)

D5. [...LIBRARY.shelves[0].books].sort((a, b) => b.pages - a.pages)

D6. LIBRARY.shelves.reduce(
      (sum, shelf) => sum + shelf.books.reduce((s, book) => s + book.pages, 0),
      0
    )
    // → 1001

D7. LIBRARY.shelves.map((shelf) => `${shelf.label} (${shelf.books.length} books)`)
    // → ['Fiction (2 books)', 'Science (1 books)']
```

D5: `b.pages - a.pages` for descending, and the spread first so `LIBRARY` survives.

D6: the outer `reduce` walks shelves and adds one number per shelf; that number is what the inner
`reduce` produces from that shelf's books. Both start at `0`.

### Section E

In D6:

- the **outer** callback's second parameter is a **shelf object**
- the **inner** callback's second parameter is a **book object**

Same word position, different depth. Naming them `shelf` and `book` instead of both being `item` is
what stops you reaching for `.pages` on the wrong one.

</details>
