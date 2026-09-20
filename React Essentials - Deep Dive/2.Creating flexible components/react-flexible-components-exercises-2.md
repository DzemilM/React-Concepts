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
<Label />
<Label text="Hello" />
<Label text="" />
<Label text={null} />
<Label text={0} />
```

- Renders a `<p>` containing `text`.
- With no `text`, it says `Untitled`.

**Predict before you run it.** Write down what each of the five `<p>`s will contain. Then run it and
compare. Getting one wrong here is the point of the exercise.

**Watch for:** two of these render nothing at all, and one renders something you might not expect.
The value table from Conditional Content is in play alongside the default rule.

**Then answer:** which of the five triggered the default, and what is the exact condition? Then:
`<Label text={0} />` — why does that one behave differently from `text={null}`?

---

## Exercise 2 — The tag comes from a string

**Build:** a component `Text`, used all four of these ways:

```jsx
<Text>plain</Text>
<Text as="strong">bold</Text>
<Text as="em">italic</Text>
<Text as="h1">heading</Text>
```

- The children render inside an element whose tag name comes from `as`.
- With no `as`, it's a `<span>`.

**Do the rename in the destructuring**, in one parameter list, no extra line above the `return`.

**Check it:** devtools. Four different tags. If you see four `<span>`s, or an `<as>` anywhere, it's
wrong — and the screen won't tell you.

**Then answer:** in `{ as: Tag = 'span' }`, which of `as` and `Tag` must already exist as a key in
the props object, and why does it have to be that one?

---

## Exercise 3 — Same thing, written the other way

Same `Text` component, same four call sites, but now do the rename with **a plain line above the
`return`** instead of in the parameter list.

Two lines of body. That's the whole exercise.

**Then answer:** both versions work. What is the one thing that is true in both — the thing that
would break either version if you got it wrong?

---

## Exercise 4 — The tag is a function

**Build:** a component `Row`, used like this:

```jsx
<Row Cell={TextCell}>hello</Row>
<Row Cell={CodeCell}>const x = 1</Row>
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

**Part 2:** Try `Cell={TextCell()}` and read the error. Say which word in the error is the value
React *received*, and which words are the two it *wanted*.

---

## Exercise 5 — One prop, both kinds of value

**Build:** a component `Wrapper` that takes an `as` prop and renders its children inside it.

Now use it **both** ways on the same component:

```jsx
<Wrapper as="section">a built-in element</Wrapper>
<Wrapper as={Card}>a component</Wrapper>
```

Write `Card` yourself — it renders a `<div className="card">` with its children inside.

- With no `as`, it's a `<div>`.

**Check it:** devtools. The first is a `<section>`. The second is a `<div class="card">` — note that
`Card` renders its own element, so what you see is whatever `Card` returns.

**Then answer:** the same prop took a string one time and a function the next, and you wrote no
condition for it. Why does that work — what is doing the deciding?

---

## Exercise 6 — Accumulating classes

**Build:** a component `Tile`, used all of these ways:

```jsx
<Tile>Plain</Tile>
<Tile size="large">Large</Tile>
<Tile selected>Selected</Tile>
<Tile size="small" selected className="promo">Everything</Tile>
<Tile onClick={() => console.log('hi')} id="t1">Clickable</Tile>
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

---

## Exercise 7 — Everything at once

**Build:** a component `Notice`, used like this:

```jsx
<Notice>Plain notice</Notice>

<Notice
  as="section"
  Icon={WarnIcon}
  level="danger"
  title={<h3>Payment failed</h3>}
  id="pay-notice"
>
  Your card was declined.
</Notice>
```

Requirements:

- Outer tag comes from `as`, defaulting to `div`.
- Always the class `notice`, plus `notice-${level}`, with `level` defaulting to `info`.
- If `Icon` is passed, it renders first inside a `<span className="notice-icon">`. If not, that span
  must **not** exist in the DOM.
- If `title` is passed, it renders next. It holds finished JSX, not a component.
- Then the children.
- `id` and other standard props reach the outer element.
- `as`, `Icon`, `level` and `title` must not appear as attributes.

**Check it:** inspect both. The first is `<div class="notice notice-info">` with no icon span and no
title. The second is `<section class="notice notice-danger" id="pay-notice">` with three things
inside it.

**Then answer:** `Icon` and `title` both arrive holding something renderable, and you treated them
differently — `<Icon />` for one, `{title}` for the other. Why?

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

Then:

7. How many exercises did you get right **first try, without running the code to find out**? Set 1
   scored 1 of 6.
8. Which of the seven took the longest, and what was the sentence you were stuck on?

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
// MINE:     as, level
// FIXED:    "notice", "notice-icon"
// PASS ON:  id… → the outer element
// SLOTS:    Icon (a tag), title (content), children

function Notice({ as: Tag = 'div', Icon, level = 'info', title, children, ...props }) {
  const classes = `notice notice-${level}`;

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

**Why `Icon` and `title` are treated differently:** `title` holds a **finished element** — the
caller already wrote `<h3>Payment failed</h3>`, so there's nothing left to do but place it between
tags. `Icon` holds a **function that hasn't been called yet**, so `<Icon />` is what calls it.

`{Icon}` alone would try to render a function, and `<title />` would ask React for an HTML element
called `title`. Same slot idea, two kinds of value, two ways of using them.

Note `const` is fine here — nothing is appended, so no `let` needed. Exercise 6 needed `let` because
the string grew.

</details>
