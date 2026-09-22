# Creating Flexible Components — Exercise Set 2

Second pass at Udemy lectures 67–69. Fresh problems, same ideas.

## Why this file exists

The six exercises in set 1 got done. Then the recall questions at the end scored **one clean
partial out of six** — and the two that collapsed hardest, *"what two kinds of value does React
accept as an element type"* and *"what does `Icon={PlusIcon()}` do"*, are the centre of the unit.
One of them had been answered correctly two days earlier, on the day the error was run.

So this isn't punishment for the exercises. It's that **the exercises can be passed with help while
the facts stay loose**, and loose facts evaporate. This set is smaller per problem and there are
more of them, because that's what makes things stick.

**Weighting:** heavy on dynamic component types and the string-vs-function distinction, medium on
class accumulation and defaults, light on slots — slots landed in set 1 and don't need more.

## The four facts the recall missed

Learn these four before starting. They're the whole unit in a box.

**1. Lowercase is a string, capitalised is a variable.**

```jsx
<div />     // React reads the STRING 'div'      → built-in HTML element
<Tag />     // React reads the VARIABLE Tag      → uses whatever is inside it
```

React never "looks for an element and fails." A lowercase name *is* the element name. `<as />`
creates an `<as>` element, the browser accepts it, and nothing appears in the console.

**2. React accepts exactly two kinds of value as an element type: a string or a function.**

| Value | Example | React does |
| --- | --- | --- |
| string | `'menu'`, `'ol'` | creates that built-in HTML element |
| function | `PlusIcon`, `TabButton` | calls it, renders what it returns |

Not "object and string." **An object is what it refuses.** The error says so:

> *expected a string (for built-in components) or a class/function (for composite components) but
> got: object*

`PlusIcon()` runs fine — it returns an element **object**, and an object is not a type.

**3. A default fires on `undefined` only.**

```jsx
function Button({ mode = 'filled' }) { ... }
```

`undefined` → default fires. `null`, `''`, `0`, `false` → **no default**, the value is used as-is.
Only a missing prop gives you `undefined`.

**4. Ternary vs build-up is about *kind*, not *count*.**

- **Choosing** between mutually exclusive alternatives → ternary, however many branches.
- **Accumulating** independent conditions that stack → build the string up.

Your Button needed `button` **and** a mode class **and** maybe `icon-button` **and** maybe the
caller's class. Those aren't alternatives, so no ternary can produce them — not because there were
four, but because they stack.

## How to work this file

1. Blank file for each exercise. Don't copy the previous one and edit it.
2. **Run it.** Every exercise here is checked in devtools, not on screen.
3. Exercises 1–4 are small on purpose — two to six lines of component. Don't overthink them.
4. Check the solution after each one, not at the end.

### Setup

`src/App.js`. No `useState` anywhere in this file.

---

## Exercise 1 — Defaults, and what does not trigger them

**Build:** a component `Label`, used all five of these ways:

```jsx
function Label({ text = 'Untitled' }) {
  return <p>{text}</p>;
}

export default function App() {
  return (
    <>
      <Label />
      <Label text="Hello" />
      <Label text="" />
      <Label text={null} />
      <Label text={0} />
    </>
  );
}
```

- Renders a `<p>` containing `text`.
- With no `text`, it says `Untitled`.

**Predict before you run it.** Write down what each of the five `<p>`s will contain. Then run it and
compare. Getting one wrong here is the point of the exercise.

**Watch for:** two of these render nothing at all, and one renders something you might not expect.
The value table from Conditional Content is in play alongside the default rule.

**Then answer:** which of the five triggered the default, and what is the exact condition? Then:
`<Label text={0} />` — why does that one behave differently from `text={null}`?

### My answer

**Prediction, written before running — all five correct:** Untitled, Hello, nothing, nothing, `0`.

Only `<Label />` triggered the default. The condition is **`text === undefined`**, which is what a
missing prop gives you. `''`, `null` and `0` are values the caller deliberately passed, so they're
used as-is.

**Why `0` differs from `null`:** two different reasons that happen to look alike.

| Value | What React does |
| --- | --- |
| `null`, `undefined`, `true`, `false` | **skipped by rule** — they're what conditionals produce, so painting them would be useless |
| any string or number | **rendered as text** |

`''` and `0` both go down the second row. `''` is invisible because it has no characters, not
because React skipped it. `0` has one character, so you see it — which is where the stray-zero bug
comes from.

So the model is not *"falsy renders nothing."*

**What tripped me up:** I first wrote `text ? <p>{text}</p> : <p>Untitled</p>` — a ternary tests
**truthiness**, a default tests **`undefined`**. That collapsed all four falsy values into
"Untitled" and printed it four times instead of once. Then I hand-rolled
`if (text === undefined)`, which is correct but is exactly what `= 'Untitled'` already means. A
destructuring default *is* that `if`, in one token.

---

## Exercise 2 — The tag comes from a string

**Build:** a component `Text`, used all four of these ways:

```jsx
function Text({ as: Tag = 'span', children }) {
  return <Tag>{children}</Tag>;
}

export default function App() {
  return (
    <>
      <Text>plain</Text>
      <Text as="strong">bold</Text>
      <Text as="em">italic</Text>
      <Text as="h1">heading</Text>
    </>
  );
}
```

- The children render inside an element whose tag name comes from `as`.
- With no `as`, it's a `<span>`.

**Do the rename in the destructuring**, in one parameter list, no extra line above the `return`.

**Check it:** devtools. Four different tags. If you see four `<span>`s, or an `<as>` anywhere, it's
wrong — and the screen won't tell you.

**Then answer:** when you write `<Text as="strong">bold</Text>`, React hands your function this
object:

```js
{ as: 'strong', children: 'bold' }
```

Now look at `{ as: Tag = 'span' }`. Which of the two words — `as` or `Tag` — appears in that object,
and which one did you invent? So which side of the colon is a **lookup**, and which side is just a
**name you're storing it under**?

### My answer

**`as` is the lookup, `Tag` is the name.** `as` is the key React actually put in the props object —
it's there because the call site wrote `as="strong"`. `Tag` appears nowhere in that object; it's my
local variable. Destructuring can only read keys that exist, so the source has to come first.

Left of the colon = **where the value comes from**. Right = **what I call it here**, capitalised so
`<Tag>` is read as a variable instead of a literal HTML tag name.

Read it aloud every time: **"take `as`, call it `Tag`."** Source first.

**Why it feels backwards:** because it *is* flipped from ordinary assignment.

```js
const Tag = props.as;      // new variable first, source second
const { as: Tag } = props; // source first, new variable second
```

Both lines do exactly the same thing.

**What tripped me up:** I hand-rolled the default again — `if (As) { return <As>... } return <span>...`
— which is the same move as Exercise 1's `if (text === undefined)`, one exercise later. `= 'span'`
replaces both returns. And `if (As)` tests **truthiness**, not `undefined`, so it's the Exercise 1
trap a second time.

---

## Exercise 3 — Same thing, written the other way

Same `Text` component, same four call sites, but now do the rename with **a plain line above the
`return`** instead of in the parameter list.

Two lines of body. That's the whole exercise.

```jsx
function Text({ as = 'span', children }) {
  const Tag = as;
  return <Tag>{children}</Tag>;
}
```

**Then answer:** the two versions differ in *where* the rename happens. What do they have in
**common**?

Concrete test: in each version, change `Tag` to `tag` — lowercase — everywhere it appears. Run both.
What renders now, and what does that tell you is the thing neither version can do without?

### My answer

**The name in the tag position must be capitalised.** Lowercase it in either version and React stops
looking anything up — it creates a literal `<tag>` element with the children inside, no error and
nothing in the console. Where the rename happens is style; that it's capitalised is the rule.

The capital doesn't mean *"this is a component."* It means **"this is a variable — look up what's
inside it."** What's found there decides whether you get a component or a built-in element, and
React works that out afterwards by checking the type.

---

## Exercise 4 — The tag is a function

**Build:** a component `Row`, used like this:

```jsx
function Row({ Cell, children }) {
  return (
    <div className="row">
      <Cell>{children}</Cell>
    </div>
  );
}

function TextCell({ children }) {
  return <span>{children}</span>;
}

function CodeCell({ children }) {
  return <code>{children}</code>;
}

export default function App() {
  return (
    <>
      <Row Cell={TextCell}>hello</Row>
      <Row Cell={CodeCell}>const x = 1</Row>
    </>
  );
}
```

- `Row` renders a `<div className="row">`.
- Inside it, the component held in `Cell`, with the children inside that.
- Write `TextCell` and `CodeCell` yourself. `TextCell` renders a `<span>`; `CodeCell` renders a
  `<code>`. Both should display whatever is between their tags.

**Check it:** devtools. The first row holds a `<span>`, the second a `<code>`. Same `Row` component
both times.

**Then answer (two parts):**

**Part 1:** `Cell` holds a function. Name the other kind of value React would also accept in that
position, and what it would do with it.

**Part 2:** Try `Cell={TextCell()}` and read the error — it is **not** the one from set 1's `Badge`.
Work out why: what does `TextCell()` receive as its argument when you call it yourself, and what
does its parameter list try to do with that? Then say what set 1's `StarIcon` did differently that
let it get far enough to produce the *element type* error instead.

### My answer

**Part 1:** a **string**. React would **create** that built-in HTML element — `'span'` gives a
`<span>`. It doesn't search for anything; a lowercase name *is* the element name.

**Part 2:** it throws before React is involved at all:

> *Cannot destructure property 'children' of 'undefined'*

`TextCell()` calls the function **with no arguments**, so `props` is `undefined`, and the parameter
list `{ children }` tries to read a key off `undefined`.

Set 1's `StarIcon` took no props, so `StarIcon()` ran fine and returned an element **object** —
React then refused that object as an element type. Two different failure points:

| Component reads props? | What breaks | Error |
| --- | --- | --- |
| no (`StarIcon`) | React gets an object as a type | *expected a string or a class/function… got: object* |
| yes (`TextCell`) | the call itself | *Cannot destructure 'children' of undefined* |

Same root cause both times — **called it instead of passing it** — surfacing at different moments.

---

## Exercise 5 — One prop, both kinds of value

**Build:** a component `Wrapper` that takes an `as` prop and renders its children inside it.

Now use it **both** ways on the same component:

```jsx
function Wrapper({ as: Tag = "div", children }) {
  return <Tag>{children}</Tag>;
}

function Card({ children }) {
  return <div className="card">{children}</div>;
}

export default function App() {
  return (
    <>
      <Wrapper as="section">a built-in element</Wrapper>
      <Wrapper as={Card}>a component</Wrapper>
    </>
  );
}
```

Write `Card` yourself — it renders a `<div className="card">` with its children inside.

- With no `as`, it's a `<div>`.

**Check it:** devtools. The first is a `<section>`. The second is a `<div class="card">` — note that
`Card` renders its own element, so what you see is whatever `Card` returns.

**Then answer:** the same prop took a string one time and a function the next, and you wrote no
condition for it. Why does that work — what is doing the deciding?

### My answer

**React is doing the deciding.** It checks the **type** of the value handed to it as an element
type: a **string** means "create that built-in HTML element", a **function** means "call it and
render what it returns." That check already exists inside React, which is why one `<Tag>` covers
both cases and I never write a condition.

So `as` here and `Icon` in set 1's `Badge` were never two mechanisms — one slot, two kinds of value.

**What tripped me up:** I first said the **quotes** were deciding. They're not — quotes and braces
are only how the value is *written* at the call site, and `as="section"` and `as={'section'}` produce
the identical string. The syntax is gone by the time the component runs; only the value's type is
left.

---

## Exercise 6 — Accumulating classes

**Build:** a component `Tile`, used all of these ways:

```jsx
function Tile({ size = 'medium', selected, className, children, ...rest }) {
  let classes = `tile tile-${size}`;

  if (selected) {
    classes += ' tile-selected';
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}


export default function App() {
  return (
    <>
      <Tile>Plain</Tile>
      <Tile size="large">Large</Tile>
      <Tile selected>Selected</Tile>
      <Tile size="small" selected className="promo">Everything</Tile>
      <Tile onClick={() => console.log('hi')} id="t1">Clickable</Tile>
    </>
  );
}
```

Requirements:

- Every tile carries the class `tile`, **always**.
- Plus a size class: `tile-large`, `tile-small`, `tile-medium`.
- No `size` passed means `medium`.
- When `selected` is set, **also** the class `tile-selected`.
- A `className` from the caller is **added**, not replacing anything.
- Standard props (`onClick`, `id`, …) reach the `<div>`.
- `size` and `selected` must **not** appear as attributes in devtools.
- The children go straight inside the `<div>` — no extra wrapper.

**Before writing the component,** fill in these four lines. They are not optional here; in set 1
you skipped them and three of the four failures were category errors.

```js
// MINE:     props this component reads and consumes
// FIXED:    values that are the same every time
// PASS ON:  forwarded — onto which element?
// SLOTS:    values placed as JSX or used as a tag
```

**Check it:** inspect the fourth tile. Its class attribute must have **four** names. Count them.

**Watch for:** one `let`, not `const`. `===` not `=`. And a prop pulled out by name still has to be
*used* — in set 1 you destructured `className` and then never joined it back, so the caller's class
vanished.

**Then answer:** the size class is `tile-${size}` and the selected class is conditional. Why can
those two not be written as one ternary?

### My answer

```js
// MINE:     size, selected, className — read and used, never put on the DOM
// FIXED:    "tile" — nobody passes it, it's typed straight into the string
// PASS ON:  onClick, id… → the <div>, via ...rest
// SLOTS:    children
```

**Why not one ternary:** `size` and `selected` are **independent**. A tile can be small **and**
selected, so `tile-small` and `tile-selected` have to appear together. A ternary produces one value,
so it can only ever hand back one of them. Choosing between alternatives → ternary. Conditions that
stack → build the string up.

**What tripped me up — all three failures were category errors, and I skipped the four lines above
for the third time in a row.**

1. I wrote `className = 'tile'`, giving the caller's prop a default of the fixed class. That merges
   **MINE** with **FIXED**: a caller passing `className="promo"` replaced `tile` instead of adding
   to it, so the base class vanished on exactly the tile that needed it most.
2. I put `size` and `selected` on the `<div>` as bare attributes, which is `={true}` — both landed
   in the DOM. They're **MINE**; naming them in the parameter list is what keeps them off.
3. `${selected ? 'tile-selected' : ''}` — the empty branch is the tell. Choosing between "a class"
   and "no class" isn't choosing, it's adding conditionally, and it left a trailing space on every
   unselected tile.

`tile` is fixed and `className` comes from the caller. They are two different kinds of thing and one
variable can't be both.

---

## Exercise 7 — Everything at once

The capstone, same scale as the Udemy Button — bigger, in fact. Blank file, and write the four
category lines before any JSX.

**Build:** a component `Notice`, used all five of these ways:

```jsx
function WarnIcon() {
  return <span>Warrnnnn</span>;
}

function InfoIcon() {
  return <span>Infooo</span>;
}

function Notice({
  as: Tag = 'div',
  className,
  level = 'info',
  dismissible,
  Icon,
  title,
  children,
  ...rest
}) {
  let classes = `notice notice-${level}`;
  let renderTitle;
  let renderIcon;

  if (Icon) {
    classes += ' notice-with-icon';
    renderIcon = (
      <span className="notice-icon">
        <Icon />
      </span>
    );
  }

  if (dismissible) {classes += ' notice-dismissible'};
  if (className) {classes += ` ${className}`};
  
  if (title) {renderTitle = title};

  return (
    <Tag className={classes} {...rest}>
      {renderIcon}
      {renderTitle}
      {children}
    </Tag>
  );
}

export default function App() {
  return (
    <>
      <Notice>Plain notice</Notice>
      <Notice level="warning">Careful.</Notice>
      <Notice
        as="section"
        Icon={WarnIcon}
        level="danger"
        title={<h3>Payment failed</h3>}
        id="pay-notice"
      >
        Your card was declined.
      </Notice>
      <Notice Icon={InfoIcon} dismissible className="pinned">Heads up.</Notice>
      <Notice as="aside" onClick={() => console.log('hi')}>Clickable</Notice>
    </>
  );
}
```

Requirements, all at once:

1. The outer tag comes from `as`, defaulting to `div`.
2. Every notice carries the class `notice`, **always**.
3. Plus a level class: `notice-${level}`, with `level` defaulting to `info`.
4. If `Icon` is passed, **also** the class `notice-with-icon`.
5. If `dismissible` is set, **also** the class `notice-dismissible`.
6. A `className` from the caller is **added** to all of that, not replacing it.
7. If `Icon` is passed, it renders first inside a `<span className="notice-icon">`. If not, that
   span must **not** exist in the DOM — not an empty one.
8. If `title` is passed, it renders next. It holds **finished JSX**, not a component.
9. Then the children.
10. `id`, `onClick` and any other standard prop reach the outer element.
11. `as`, `Icon`, `level`, `title`, `dismissible` and `className` must **not** appear as attributes
    in devtools.

Write `WarnIcon` and `InfoIcon` yourself — one line each.

**Before writing the component,** fill these in:

```js
// MINE:     
// FIXED:    values that are the same every time
// PASS ON:  forwarded — onto which element?
// SLOTS:    values placed as JSX, or used as a tag
```

**Check it:** inspect the fourth notice. Its class attribute must have **five** names. Count them in
devtools. Then inspect the first — it must have exactly two, and no `<span class="notice-icon">`
anywhere inside it.

**Watch for:** eleven requirements. Tick them off one at a time against the finished component. In
set 1 you passed four of eight on the first attempt and called it done.

**Watch for:** `let` not `const` for the class string, `===` not `=` if you compare anything, and a
prop pulled out by name still has to be *used* — destructuring `className` only stops it colliding,
it doesn't join it on.

**Then answer (two parts):**

**Part 1:** `Icon` and `title` both arrive holding something renderable, and you treated them
differently — `<Icon />` for one, `{title}` for the other. Why?

**Part 2:** three of the class rules (3, 4, 5) are separate conditions. Could any pair of them be
written as a single ternary? Say why or why not, using the word *alternatives*.

### My answer

```js
// MINE:     as, level, dismissible, className — read and used, never on the DOM
// FIXED:    "notice", "notice-icon"
// PASS ON:  id, onClick… → the outer element, via ...rest
// SLOTS:    Icon (used as a tag), title (placed as content), children
```

**Part 1:** `title` holds a **finished element** — the caller already wrote
`<h3>Payment failed</h3>`, so there's nothing to do but place it between tags. `Icon` holds a
**function that hasn't been called yet**, so `<Icon />` is what calls it. Element vs function: the
two words the whole unit turns on.

**Part 2:** No. A ternary picks between **alternatives** — one wins and the other can't also happen.
These three are **independent**: a notice can be `danger` **and** have an icon **and** be
dismissible, so all three classes have to appear together. A ternary produces one value, so it
structurally can't.

**What tripped me up:** I built `classes` over five lines and then left both it *and* `...rest` off
the `<Tag>`. Six of the eleven requirements were failing at the final line while the string above it
was perfect. That's the third time in two files: **compute a value correctly, forget to attach it.**
New habit — after writing the `return`, read the opening tag and check every variable computed above
is actually on it.

Then, fixing that, I deleted the `renderIcon` declaration and its assignment while adding the icon
components, leaving `{renderIcon}` in the JSX with nothing behind it, and I declared `WarnIcon` and
`InfoIcon` **inside** `Notice`, where `App` can't see them. Both are the same class of slip: editing
one part and not re-reading what depended on it.

---

## When you're done

The same six questions from set 1. Answer them **cold**, without scrolling up — that's the whole
point of this file. Last time this scored one clean partial out of six.

1. Why must a variable used as a JSX tag start with a capital letter? Say what React does with a
   lowercase tag name.
2. `children` and a prop called `footer` both hold JSX. What is the only difference between them,
   and does that difference live inside the component or at the call site?
3. `Icon={PlusIcon}` versus `Icon={PlusIcon()}` — what value does each pass, and what does
   `<Icon />` do with it in each case?
4. React accepts two kinds of value as an element type. Name both, with an example of each.
5. `mode = 'filled'` — name the exact condition under which that default is used, and name two
   falsy values a caller could pass that would **not** trigger it.
6. You have two conditions that both affect an element's class list. Ternary, or build the string
   up? Give the question you ask yourself to decide.
7. `null`, `''` and `0` in braces — which of the three does React **skip**, which does it **render
   as text**, and why do two of them end up invisible for different reasons? (Flagged during
   Exercise 1 as still shaky — answer it cold.)

Then:

8. How many exercises did you get right **first try, without running the code to find out**? Set 1
   scored 1 of 6.
9. Which of the seven took the longest, and what was the sentence you were stuck on?

---

## Solutions

Check after each exercise, not at the end.

<details>
<summary><strong>Exercise 1</strong></summary>

```jsx
function Label({ text = 'Untitled' }) {
  return <p>{text}</p>;
}
```

| Call | `text` holds | `<p>` shows |
| --- | --- | --- |
| `<Label />` | `'Untitled'` | **Untitled** — default fired |
| `<Label text="Hello" />` | `'Hello'` | Hello |
| `<Label text="" />` | `''` | *nothing* — no default, and React draws nothing for `''` |
| `<Label text={null} />` | `null` | *nothing* — no default, React draws nothing for `null` |
| `<Label text={0} />` | `0` | **0** — no default, and React *does* draw a zero |

**The default fires only when the value is `undefined`**, which is what a missing prop gives you.
`null`, `''`, `0` and `false` are all values that exist, so they're used as-is.

`0` differs from `null` because of the second rule, from Conditional Content: React draws nothing
for `null`, `undefined`, `false` and `''`, but it **does** draw a visible `0`. Two separate rules
stacked — which is why this one is worth getting wrong once.

</details>

<details>
<summary><strong>Exercise 2</strong></summary>

```jsx
function Text({ as: Tag = 'span', children }) {
  return <Tag>{children}</Tag>;
}
```

`as` must be the one that already exists as a key, because **the left of the colon is a lookup**.
The props object React builds is `{ as: 'strong', children: ... }` — there is no `Tag` in it. Write
`Tag: as` and you'd be asking for a key that isn't there, get `undefined`, and the `'span'` default
would fire every time.

Read it as: **"take `as`, call it `Tag`."**

</details>

<details>
<summary><strong>Exercise 3</strong></summary>

```jsx
function Text({ as = 'span', children }) {
  const Tag = as;
  return <Tag>{children}</Tag>;
}
```

The thing true in both: **the name used in the tag position is capitalised.** That's what makes
React treat it as a variable instead of a literal element name. Where the capitalisation happens —
parameter list or a separate line — is style. That it happens at all is the rule.

</details>

<details>
<summary><strong>Exercise 4</strong></summary>

```jsx
function TextCell({ children }) {
  return <span>{children}</span>;
}

function CodeCell({ children }) {
  return <code>{children}</code>;
}

function Row({ Cell, children }) {
  return (
    <div className="row">
      <Cell>{children}</Cell>
    </div>
  );
}
```

**Part 1:** a **string** — `'span'`, `'code'`, any built-in element name. React would create that
HTML element instead of calling a component.

**Part 2:** the error reads *"expected a string (for built-in components) or a class/function (for
composite components) but got: **object**."* Received: **object**. Wanted: **string** or
**function**. `TextCell()` ran and returned a finished element object, and an element is not a type.

</details>

<details>
<summary><strong>Exercise 5</strong></summary>

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function Wrapper({ as: Tag = 'div', children }) {
  return <Tag>{children}</Tag>;
}
```

**React is doing the deciding.** It looks at the type of the value it's handed: a string means
"create that built-in element", a function means "call it." You write one `<Tag>` and React sorts
out which case it is. That's why `as` and `Icon` in set 1 were the same mechanism wearing different
names.

</details>

<details>
<summary><strong>Exercise 6</strong></summary>

```jsx
// MINE:     size, selected, className
// FIXED:    "tile"
// PASS ON:  onClick, id… → the <div>
// SLOTS:    children

function Tile({ size = 'medium', selected, className, children, ...props }) {
  let classes = `tile tile-${size}`;

  if (selected) {
    classes += ' tile-selected';
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
```

The fourth tile: `tile tile-small tile-selected promo` — four names.

**Why not one ternary:** because `size` and `selected` are **independent**. A tile can be small *and*
selected, so both classes must be able to appear together. A ternary produces one value, so it can
only ever give you one of them. Choosing → ternary. Accumulating → build up.

</details>

<details>
<summary><strong>Exercise 7</strong></summary>

```jsx
// MINE:     as, level, dismissible, className
// FIXED:    "notice", "notice-icon"
// PASS ON:  id, onClick… → the outer element
// SLOTS:    Icon (used as a tag), title (placed as content), children

function WarnIcon() {
  return <span>⚠</span>;
}

function InfoIcon() {
  return <span>ℹ</span>;
}

function Notice({
  as: Tag = 'div',
  Icon,
  level = 'info',
  title,
  dismissible,
  className,
  children,
  ...props
}) {
  let classes = `notice notice-${level}`;

  if (Icon) {
    classes += ' notice-with-icon';
  }

  if (dismissible) {
    classes += ' notice-dismissible';
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <Tag className={classes} {...props}>
      {Icon && (
        <span className="notice-icon">
          <Icon />
        </span>
      )}
      {title}
      {children}
    </Tag>
  );
}
```

The fourth notice: `notice notice-info notice-with-icon notice-dismissible pinned` — five names.
The first: `notice notice-info` — two, and no icon span.

**Part 1 — why `Icon` and `title` differ:** `title` holds a **finished element**. The caller already
wrote `<h3>Payment failed</h3>`, so there's nothing left to do but place it between tags. `Icon`
holds a **function that hasn't been called yet**, so `<Icon />` is what calls it.

`{Icon}` alone would try to render a function, and `<title />` would ask React for an HTML element
called `title`. Same slot idea, two kinds of value, two ways of using them.

**Part 2 — no pair can be a ternary.** A ternary picks between **alternatives**: one wins, the other
can't also happen. Here all three conditions are independent — a notice can be `danger` **and** have
an icon **and** be dismissible, and all three classes have to appear together. A ternary produces
one value, so it structurally cannot. This is the same rule the Button in set 1 broke.

**Note `let`, not `const`**, because the string grows. Exercise 5's `Wrapper` needed no `let` —
nothing was appended there.

</details>
