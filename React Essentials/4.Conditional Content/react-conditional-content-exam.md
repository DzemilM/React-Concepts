# React Conditional Content — Written Exam

22 questions in four sections. **No running code, no looking at the exercise file.** Write your
answers out, then check them against the collapsed key at the bottom.

Section D is plain JavaScript with no React in it at all. It's there because that's where this
unit actually cost you time — compound booleans, precedence, and spread. Don't skip it.

**Mark yourself honestly.** For predict-the-output, "roughly right" is wrong — the point is
whether you know the exact value.

---

## Section A — Predict the output

For each, say **what appears on screen**. If nothing appears, say so.

### A1

```jsx
function App() {
  const items = [];
  return <div>{items.length && <p>You have items</p>}</div>;
}
```
0 is falsy value so 'you have items' wont appear, 0 appears

> ✅ **Correct.** `items.length` is `0`. `&&` hands back its **left** operand when that operand is
> falsy, so the whole expression evaluates to `0` — and React paints `0` as text. The paragraph
> doesn't render, but a stray zero does.

### A2

```jsx
function App() {
  const name = '';
  return <div>{name && <p>Hello</p>}</div>;
}
```
nothing will appear

> ✅ **Correct.** `''` is falsy, so `&&` returns `''`, and React draws nothing for an empty string.
> Same mechanism as A1 — the only difference is what React does with the returned value. That's
> why "falsy means invisible" is not a safe rule.

### A3

State the **value** each expression evaluates to. Not what renders — the value.

```js
false && <p>Hi</p>
0     && <p>Hi</p>
''    && <p>Hi</p>
'abc' && <p>Hi</p>
```
false,0,'',<p>Hi</p>

> ✅ **Correct.** The rule behind all four: **falsy left → return the left operand unchanged;
> truthy left → return the right operand.** `&&` never manufactures `true`/`false` — it always
> hands back one of the two things you gave it.

### A4

```js
const count = 5;
console.log(!count === 0);
```

What prints? Explain the order the engine evaluates it in.

>
> `!` only grabs the thing directly next to it — like the minus in `-5 + 3` belongs to the `5`, not
> to the whole sum. So JavaScript reads the line as `(!count) === 0`, then works through it in two
> steps:
>
> 1. `!5` → **`false`** (5 is truthy, `!` flips it)
> 2. `false === 0` → **`false`**
>
> Step 2 is `false` because `===` checks the **type** as well as the value. `false` is a boolean,
> `0` is a number — different types, so it says no without ever comparing the values.
>
> The common misreading is to see this as *"count is not 0."* That would be written `count !== 0`,
> and it would be `true`.

### A5

```jsx
function App() {
  const [n, setN] = useState(0);
  return (
    <div>
      {n > 0 ? <p>Positive</p> : null}
      {n === 0 && <p>Zero</p>}
      <button onClick={() => setN(n + 1)}>+</button>
    </div>
  );
}
```
on first render it shows zero, after one click it doesnt show zero but positive instead

What's on screen **on first render**, and what's on screen **after one click**? Both halves.

> ✅ **Correct, both halves.** First render: `n` is `0`, so `n > 0` is false → `null` → nothing,
> and `n === 0` is true → `Zero` shows. After one click: `Positive` shows, `Zero` is gone. The
> `+` button is on screen the whole time — it lives outside both conditionals.

### A6

```jsx
function App() {
  const status = 'loading';

  let content;
  if (status === 'idle') {
    content = <p>Idle</p>;
  } else if (status === 'done') {
    content = <p>Done</p>;
  }

  return <div>{content}</div>;
}
```

What appears? Why?

nothing, we didnt put loading in conditions, not just else at end

> ✅ **Correct, right reason.** `status` is `'loading'`, which matches neither branch, and there's
> no final bare `else` — so `content` is never assigned and stays `undefined`. React draws nothing
> for `undefined`. This is the argument for always ending the chain with a plain `else`.

### A7

```jsx
function App() {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen(true);
    console.log(isOpen);
  }

  return <button onClick={handleClick}>Open</button>;
}
```

What does the **first** click log? (This one is State, not conditionals — it's here on purpose.)

>
> ```js
> setIsOpen(true);      // changes it for the NEXT run of the component
> console.log(isOpen);  // still reading THIS run
> ```
>
> `isOpen` was `false` when this function started, and it stays `false` until the function
> finishes. The setter doesn't reach back and edit the variable you're currently holding — it
> schedules a re-render, and the new value only arrives when React calls your component again.
>
> Think of `isOpen` as a photograph React handed you when it ran the component. `setIsOpen(true)`
> doesn't edit the photo; it asks for a new one to be printed for next time. Line 2 is still
> looking at the old photo.
>
> Watch the wording too: "logs nothing" would mean the line never ran. It ran — `console.log`
> always prints something. The question is *what*.

---

## Section B — Spot the bug

Each has exactly one main bug. Name the line, say what goes wrong on screen, and say why.

### B1

```jsx
const [isOpen, setIsOpen] = useState(false);
return <div>{setIsOpen ? <p>Open</p> : null}</div>;
```
its the second line, screen always shows open,
its checking the function instead of value so it will always be truthy.

### B2

The page has just loaded and nothing has been added yet.

```jsx
function ItemList() {
  const [items, setItems] = useState([]);

  return (
    <div>
      {items.length && <p>{items.length} items</p>}
    </div>
  );
}
```

What does the user see, and why?

when the list is empty, items.length is 0 and && returns 0 which renders on the page

### B3

```jsx
function Result() {
  const score = 80;

  let message;

  if (score > 50) {
    <p>Pass</p>
  } else {
    message = <p>Fail</p>
  }

  return <div>{message}</div>;
}
```

Pass isnt assigned, so message stays undefined if score is > 50 and we get nothing, only fail can be displayed

### B4

```jsx
return (
  <div>
    {if (isAdmin) { <p>Admin panel</p> }}
  </div>
);
```
if is inside jsx braces, braces need an expression which produce a value, not just a statement like if, it doesnt compile, it should either be done as ternary or with &&


### B5

```jsx
function SendButton() {
  const [email, setEmail] = useState('');

  const isValid = email.includes('@');

  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={isValid}>Send</button>
    </form>
  );
}
```

Try it with an empty box, then with `me@example.com`. What's wrong?

Should be disabled={!isValid} — greyed out when the email is invalid, clickable when it's valid. As written it's the reverse.

### B6

```jsx
const [items, setItems] = useState([]);
const [text, setText] = useState('');

function handleAdd() {
  setItems([items, ...text]);
}
```

With an empty list and `text` set to `"eggs"`, what is `items` after one click?

items is [],e,g,g,s because we spread text out with ..., while items werent spread out so they go inside as whole element

### B7

```jsx
function EmailForm() {
  const [input, setInput] = useState('');

  const isValid   = input.length > 0 && input.includes('@');
  const showError = input.lenght > 0 && !isValid;

  return (
    <form>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      {showError && <p>Please enter a valid email.</p>}
    </form>
  );
}
```

The user types `abc` — no `@`, so the error should appear. It doesn't, and the console is clean.
Why on both counts?

logic bug, it says lenght isntead of length, javascript gives back undefined and it evaluates to false
---

## Section C — Explain it

Full sentences. These are the ones you'll be asked in an interview.

### C1
Why can you use `if` above the `return` but not inside `{ }` in JSX? Use the words *expression*
and *statement*.

JSX braces require expressions which evaluate to a value React can render. if is a statement which directs control flow and produces no value, so there's nothing to hand over. Above the return you're in ordinary JavaScript, where statements are exactly where they belong — you run the if and assign the result to a variable, then render that variable.

### C2
```js
let content;
if (...) { content = <p>A</p>; }
```
Why `let` and not `const`? Give the precise reason, not "because it changes."

const requires a value on the same line it's declared, and forbids assigning to it afterwards. let content; has no value on its line, and content = <p>A</p> assigns to it later — const breaks both rules. Note that's the first assignment, not a re-assignment; const forbids it either way.

### C3

An email form computes two booleans:

```js
const isValid   = email.length > 0 && email.includes('@');
const showError = email.length > 0 && !isValid;

// ...later, in the JSX:
{showError && <p>Please enter a valid email.</p>}
<button disabled={!isValid}>Submit</button>
```

They look almost identical. What exactly breaks if you delete `showError` and use `!isValid` for
both jobs? Name the moment it goes wrong.

Collapse them and the error appears the instant the page loads. An empty input is invalid, so !isValid is true before the user has typed a single character — you're telling them they got it wrong before they started.

### C4
When would you pick `{cond && <A />}` over `{cond ? <A /> : null}`? And when is `&&` the **wrong**
choice? Both halves.

&& and ? : null do the same job when the condition is a real boolean, so picking between them
is mostly about brevity: && is shorter and reads directly as "if this, show that", with no
: null hanging off the end.

&& is the wrong choice when the left side is a NUMBER. 0 is falsy, so && hands back 0 — and
React paints 0 as visible text. (NaN behaves the same way.) false, null, undefined and ''
are all falsy too, but React draws nothing for those, so they're safe.

Rule: never put a raw number on the left of && in JSX. Compare it into a boolean first —
items.length > 0, not items.length.

Because of that trap, some teams ban && in JSX entirely and always write ? ... : null. You
lose four characters and you can never hit the 0 bug.


### C5
`{cond ? <A /> : null}` versus rendering `<A />` always and hiding it with CSS. What's the
difference in what ends up on the page?

when the condition is false, the element isn't in the DOM at all. It doesn't exist.
CSS hiding — the element is in the DOM, fully built, just not painted.`
---

## Section D — Plain JavaScript (no React)

### D1
What does each expression evaluate to?

```js
0     && 'hello'
1     && 'hello'
''    && 'hello'
'hi'  && 0
```
0, hello, '', 0

### D2
Why is `!5 === 0` false? Walk the two steps.

it first checks !, not ===, and it becomes false === 0, false and zero arent same type so it also gives us false

### D3
Write, as a single expression: *"age is at least 18 **and** country is `'DE'`"*.

age >= 18 && country === "DE"

### D4
```js
const arr = ['a'];
const word = 'hi';
```
What is each of these?

```js
[...arr, word]
[arr, ...word]
[...arr, ...word]
```

[a, hi];
[[a], h, i];
[a, h, i];

### D5
```js
const isBig = size > 10 ? true : false;
```
Rewrite this in fewer characters without changing behaviour, and say why the original is
redundant.

const isBig = size > 10;

no need for true false, the > evaluates that already

### D6
You have `const isValid = ...`. Write the expression meaning *"the button should be disabled when
the input is not valid."*

<button disabled={!isValid}>Disable</button>

---

<details>
<summary><strong>Answer key</strong> — only after you've written all 22</summary>

## Section A

**A1.** A literal **`0`** appears on screen. `items.length` is `0`; `&&` returns its **left**
operand when that operand is falsy, so the expression evaluates to `0`, and React paints `0` as
text.

**A2.** **Nothing appears.** `''` is falsy so `&&` returns `''`, and React draws nothing for an
empty string. Note this is the *same mechanism* as A1 — only the value table differs. That's why
you can't rely on "falsy means invisible."

**A3.**
```
false && <p>Hi</p>   →  false
0     && <p>Hi</p>   →  0
''    && <p>Hi</p>   →  ''
'abc' && <p>Hi</p>   →  the <p>Hi</p> element
```
The rule: **falsy left → return the left operand unchanged. Truthy left → return the right
operand.** `&&` never manufactures `true`/`false`.

**A4.** Prints **`false`**.

`!` only grabs the thing directly next to it — like the minus in `-5 + 3` belongs to the `5`, not
to the whole sum. So JavaScript reads the line as `(!count) === 0` and works through it in two
steps:

1. `!5` → **`false`** (5 is truthy, `!` flips it)
2. `false === 0` → **`false`**

Step 2 is `false` because `===` checks the **type** as well as the value. `false` is a boolean,
`0` is a number — different types, so it says no without ever comparing the values.

The common misreading is to see this as *"count is not 0."* That would be written `count !== 0`,
and it would be `true`.

**A5.** Both halves:
- **First render:** `Zero` and the `+` button. (`n` is `0`, so `n > 0` is false → `null` → nothing;
  `n === 0` is true → `Zero` shows.)
- **After one click:** `Positive` and the `+` button. `Zero` is gone.

**A6.** **Nothing appears** where `{content}` is. `status` is `'loading'`, which matches neither
branch, and there's no final `else` — so `content` is never assigned and stays `undefined`. React
draws nothing for `undefined`. This is the argument for ending with a bare `else`.

**A7.** Logs **`false`**.

```js
setIsOpen(true);      // changes it for the NEXT run of the component
console.log(isOpen);  // still reading THIS run
```

`isOpen` was `false` when this function started, and it stays `false` until the function finishes.
The setter doesn't reach back and edit the variable you're currently holding — it schedules a
re-render, and the new value only arrives when React calls your component again.

Think of `isOpen` as a photograph React handed you when it ran the component. `setIsOpen(true)`
doesn't edit the photo; it asks for a new one to be printed for next time. Line 2 is still looking
at the old photo.

Note the wording trap: "logs nothing" would mean the line never ran. It ran — `console.log` always
prints something. The question is *what*.

## Section B

**B1.** The condition is `setIsOpen` — the **setter**, not the value. A function is always truthy,
so `<p>Open</p>` shows permanently and clicking never changes anything visible. Should be `isOpen`.

**B2.** When `items` is empty, a stray **`0`** renders. `&&` returns the falsy left operand, which
is the number `0`, which React paints. Fix: make the left side a real boolean —
`items.length > 0 && ...`.

**B3.** The `if` branch **builds JSX and never assigns it**. `<p>Pass</p>` is created and thrown
away. When `score > 50`, `message` is `undefined` and nothing renders. The `else` branch is
correct — compare the two and the missing `message =` is obvious.

**B4.** `if` is a **statement**; JSX braces require an **expression**. This is a syntax error, not
a runtime bug — it won't compile. Use a ternary inline, or move the `if` above the `return` and
render a variable.

**B5.** `disabled` is **inverted**. Empty input → `includes('@')` is `false` → `disabled={false}` →
the button is clickable with an empty box. Valid email → `disabled={true}` → greyed out. Needs
`!isValid`. (Secondary: `isValid` also never checks that the input is non-empty.)

**B6.** `items` becomes:
```js
[ [], 'e', 'g', 'g', 's' ]
```
The spread is on the **wrong operand**. `...text` explodes the string into single characters, and
`items` with no spread is nested whole as a single element. Should be `[...items, text]`.

**B7.** `lenght` is misspelled. JavaScript doesn't error on an unknown property — it returns
`undefined`. `undefined > 0` is `false`, so `showError` is permanently `false` and the message
never renders. Silent, no console output, nothing to trace. Same failure mode as a mistyped prop
name falling back to its default.

## Section C

**C1.** JSX braces hold an **expression** — something that evaluates to a value React can render.
`if` is a **statement**: it directs control flow and produces no value, so there's nothing to hand
back. Above the `return` you're in ordinary JavaScript, where statements are exactly what belongs.

**C2.** `const` requires a value on the same line as the declaration and forbids assigning to it
afterwards. Here you declare the variable empty and fill it inside a branch — both of those are
things `const` disallows. "Because it changes" is imprecise: the variable is assigned once per
render, never re-changed.

**C3.** They answer different questions. `isValid` = "is this a usable email." `showError` = "has
the user typed something wrong yet." An empty input is **invalid but blameless** — collapse them
and the error message is on screen the instant the page loads, before the user has typed a
character. The extra condition in `showError` is "they've typed something."

**C4.** Both halves:
- **Use `&&`** when there are only two outcomes — the element or nothing — and the condition is
  already a real boolean. It's shorter and reads as "if this, show that."
- **`&&` is wrong** when the left side is a number or a string. `0` and `''` are falsy but `0`
  renders visibly. Use `cond ? <A /> : null`, or compare the value into a boolean first
  (`items.length > 0`).

**C5.** The ternary **removes the element from the DOM entirely** — it isn't in the page at all.
CSS hiding leaves the element present, just not painted: still in the DOM, still findable, its
content still there. That's why the Udemy task specified "remove it from the DOM" — it's asking
for conditional rendering, not a `display: none`.

## Section D

**D1.**
```js
0     && 'hello'   →  0
1     && 'hello'   →  'hello'
''    && 'hello'   →  ''
'hi'  && 0         →  0
```
Same single rule every time: falsy left → the left operand; truthy left → the right operand.

false,0,'',<p>Hi</p> is what we get

**D2.** Two steps:
1. `!` has higher precedence than `===`, so it parses as `(!5) === 0`
2. `!5` is `false` (5 is truthy). Then `false === 0` is `false` — `===` requires the same type, and
   boolean ≠ number.

If you actually meant "5 is not zero," that's `5 !== 0`.

**D3.**
```js
age >= 18 && country === 'DE'
```
"at least 18" is `>=`, not `>`. Two comparisons joined by `&&`.

**D4.**
```js
[...arr, word]      →  ['a', 'hi']
[arr, ...word]      →  [['a'], 'h', 'i']
[...arr, ...word]   →  ['a', 'h', 'i']
```
`...` unpacks an iterable. Arrays unpack into their elements; **strings unpack into characters**.
Anything without `...` goes in whole, as one element — including a whole array.

**D5.**
```js
const isBig = size > 10;
```
`size > 10` **already evaluates to a boolean**. `? true : false` says "if it's true give me true,
if it's false give me false" — it hands back exactly what it was given.

**D6.**
```js
disabled={!isValid}
```
`disabled` asks "should this be switched off"; `isValid` answers "is this good." Opposite
questions, so negate.

</details>

---

## How to read your score

- **Section A wrong** → you don't have the value table. Re-read it; everything else depends on it.
- **Section B wrong** → these are the bugs you'll actually write. Each one maps to a mistake made
  during the exercises.
- **Section C wrong** → you can write it but can't explain it. Fine for now, not fine long-term.
- **Section D wrong** → the gap isn't React. Drill plain JS booleans before the next unit.
