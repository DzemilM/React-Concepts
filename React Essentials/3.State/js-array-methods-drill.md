# JS Array Methods — Targeted Drill

No React. No components. Just `.map()`, `.filter()` and spread, which is what actually slowed you
down in Set 3.

Run these in the browser console (F12 → Console) or a blank StackBlitz. `console.log` everything —
you learn more from seeing the output than from getting it right.

Should take about half an hour.

---

## Read this first: the anatomy

Both methods have the **same shape**, and mixing up the two slots is what cost you three rounds in
Set 3 Exercise 5:

```js
theArray.map((oneItem) => whatToTurnItInto)
//  ↑            ↑
//  which list   your name for a single item
```

**The array goes before the dot.** The parameter is a name *you invent* for one item at a time.

This is the mistake you made:

```js
guests.map((visibleGuests) => ...)   // ✗ looping the wrong array, and the name is a lie
visibleGuests.map((guest) => ...)    // ✓
```

### The one-line difference between them

| method | what the callback returns | what you get back |
|---|---|---|
| `.map()` | the **replacement** for that item | a new array, **same length** |
| `.filter()` | `true` = keep, `false` = drop | a new array, **shorter or equal** |

**`.filter()` keeps what's true.** You inverted this in Set 3:

```js
guests.filter((guest) => guest === name)    // ✗ keeps ONLY that one
guests.filter((guest) => guest !== name)    // ✓ keeps everyone else
```

### Both callbacks get a second parameter: the index

```js
["a", "b", "c"].map((item, index) => ...)
```

| call | `item` | `index` |
|---|---|---|
| 1st | `"a"` | `0` |
| 2nd | `"b"` | `1` |
| 3rd | `"c"` | `2` |

Two separate parameters. You never combine them — `item[index]` reaches *inside* the item, which
is what you accidentally wrote.

### And both return a NEW array

Neither one touches the original. That's exactly why they're the right tools for React state.

---

## Part 1 — `.map()`

Use this array for exercises 1–4:

```js
const numbers = [1, 2, 3, 4, 5];
console.log(numbers.map((number)=> number * 2));
console.log(numbers.map((number)=> number + "!"));
console.log(numbers.map((number,index)=>number * index));
console.log(numbers)
```

**1.** Produce `[2, 4, 6, 8, 10]` — every number doubled.

**2.** Produce `["1!", "2!", "3!", "4!", "5!"]` — each number as a string with `!` on the end.

**3.** Produce `[0, 2, 6, 12, 20]` — each number multiplied by its own index.

**4.** After all three, `console.log(numbers)`. What is it now? Why?

Now use this one:

```js
const names = ["alice", "bob", "carl"];
console.log(names.map((name)=>name.toUpperCase()));
console.log(names.map((name,index)=>`${index+1}. ${name}`))
```

**5.** Produce `["ALICE", "BOB", "CARL"]`. (`.toUpperCase()`)

**6.** Produce `["1. alice", "2. bob", "3. carl"]` — numbered from 1, not 0.

---

## Part 2 — `.filter()`

```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(numbers.filter((number)=> number > 5));
console.log(numbers.filter((number)=> number % 2 === 0));
console.log(numbers.filter((number)=>number !== 7));
console.log(numbers.filter((number, index)=>index !== 3))
```

**7.** Keep only the numbers above 5.

**8.** Keep only the even numbers. (`n % 2 === 0` is true for even numbers.)

**9.** Remove the number 7. Everything else stays.

**10.** Remove whatever is at index 3. (Not the value 3 — the item in position 3.)

```js
const guests = ["Alice", "Bob", "Carl", "Anna"];
console.log(guests.filter((guest)=>guest.toLowerCase().includes('a')));
console.log(guests.filter((guest)=>guest !== "Bob"))
```

**11.** Keep only the names containing the letter `a` — **case-insensitively**, so all four match.
(`.includes()` and `.toLowerCase()`.)

**12.** Remove `"Bob"` by name.

---

## Part 3 — Spread, and the React patterns

```js
const items = ["apple", "bread"];
const added = [...items, "milk"];
const start = ["milk", ...items];
console.log(items);
console.log(added);
console.log(start)
```

**13.** Produce a new array with `"milk"` added on the end — **without** using `.push()`.

**14.** Produce a new array with `"milk"` at the **start**.

**15.** Now do it the wrong way on purpose:

```js
const copy = ["apple", "bread"];
const result = copy.push("milk");
console.log(result);
console.log(copy);
```

What does `result` hold? What does `copy` hold? **Both answers matter** — one of them is why
`setItems(items.push(x))` breaks React so badly.

**16.** `const a = ["x", "y"]; const b = a;` — then `b.push("z")`. Log both `a` and `b`. Explain
what you see. This is exactly what React sees when you mutate state.

---

## Part 4 — Combining them

```js
const guests = ["Alice", "Bob", "Carl", "Anna", "Dave"];
const query = "a";
const hasQuery = guests.filter((guest)=>guest.toLowerCase().includes(query.toLowerCase()));
console.log(hasQuery);
console.log(hasQuery.map((guest)=>guest.toUpperCase()));
console.log(hasQuery.length);
const index = 2;
const noCarl = guests.filter((guest, i)=> i !== index)
```

**17.** In one expression: keep the names containing `query` (case-insensitive), then uppercase
each survivor.

**18.** Count how many names contain `query`. (You don't need a loop — filter, then read a
property.)

**19.** Given `const index = 2`, produce a new array with `"Carl"` removed, using the index rather
than the name.

**20.** The trap from Set 3, in plain JS. You have:

```js
const guests   = ["Alice", "Bob", "Carl"];
const visible  = guests.filter((g) => g.toLowerCase().includes("c"));   // ["Carl"]
console.log(guests);
console.log(visible)
```

The user clicks Remove on the **first item of `visible`** — index `0`.

Now write `guests.filter((guest, index) => index !== 0)` and log it.

**Who got removed?** Explain in one sentence why removing by index is a bug once a filter is
involved, and what you should use instead.

---

<details>
<summary><strong>Solutions</strong></summary>

```js
// 1
numbers.map((n) => n * 2)

// 2
numbers.map((n) => n + "!")

// 3
numbers.map((n, index) => n * index)

// 4
// numbers is STILL [1,2,3,4,5]. map never modifies the original —
// it builds and returns a new array. That's why it's safe for state.

// 5
names.map((name) => name.toUpperCase())

// 6
names.map((name, index) => (index + 1) + ". " + name)

// 7
numbers.filter((n) => n > 5)

// 8
numbers.filter((n) => n % 2 === 0)

// 9
numbers.filter((n) => n !== 7)

// 10
numbers.filter((n, index) => index !== 3)

// 11
guests.filter((guest) => guest.toLowerCase().includes("a"))

// 12
guests.filter((guest) => guest !== "Bob")

// 13
[...items, "milk"]

// 14
["milk", ...items]

// 15
// result is 3 — push returns the new LENGTH, not the array.
// copy is ["apple","bread","milk"] — push modified it in place.
//
// So setItems(items.push(x)) sets your state to the number 3.
// Then items.map(...) crashes, because numbers have no .map.

// 16
// BOTH log ["x","y","z"].
// `b = a` doesn't copy the array — it points a second name at the same one.
// This is what React sees: you handed it the identical array it already had,
// so its "did this change?" check says no, and it skips the re-render.
// The contents changed. The array didn't.

// 17
guests
  .filter((guest) => guest.toLowerCase().includes(query.toLowerCase()))
  .map((guest) => guest.toUpperCase())

// 18
guests.filter((g) => g.toLowerCase().includes(query.toLowerCase())).length

// 19
guests.filter((guest, i) => i !== index)

// 20
// ALICE gets removed, not Carl.
// Carl is index 0 in `visible` but index 2 in `guests`. The Remove button
// knows its position in the filtered list, which says nothing about its
// position in the full list.
// Fix: remove by name — names don't shift when you filter, positions do.
```

</details>

---

## After you've done all twenty

Answer these three from memory, no scrolling back:

1. In `guests.map((guest) => ...)`, which part is the array and which part did you invent?
2. `.filter()` keeps the items your test returns **what** for?
3. Why does `.push()` break React when `[...arr, x]` doesn't?

<details>
<summary>Answers</summary>

1. `guests` — before the dot — is the array. `guest` is the parameter name I invented for one item
   at a time. Array before the dot, item name inside the brackets. Plural outside, singular inside.
2. **`true`.** Filter always describes what you **keep** — so "remove X" has to be written as
   "keep everything that isn't X", with `!==`.
3. `push` changes the array in place and hands back the **same array**. React decides whether to
   re-render by comparing the value you gave the setter against the one it already holds — same
   array, no difference, no re-render. It never looks *inside* at the contents. `[...arr, x]` builds
   a brand-new array, so the comparison finds a difference and React re-renders.

</details>

If those three are instant, the bottleneck's gone and you're ready for the cold test.