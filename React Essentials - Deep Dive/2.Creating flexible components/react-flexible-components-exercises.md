# Creating Flexible Components — Six Exercises

Covers Udemy lectures 67–69 (Multiple JSX Slots, Setting Component Types Dynamically, Setting
Default Prop Values) and Coding Exercise 15.

Unscaffolded, like the Forwarding Props set: you get the situation and the requirement, you write
the component. No `TODO` gaps to fill in.

Exercise 1 is plain JavaScript with no React in it. **Do not skip it.** Lecture 68 is that one
mechanic wearing a JSX costume, and it's the lecture you have the least grip on.

## Read this first

### The one idea underneath all of it

Conditional Content taught you **JSX is a value**. Dynamic lists added **React renders an array of
values**. This unit is the third line of that same sentence:

> **A prop can hold a value that hasn't been rendered yet — a component itself.**

Two consequences, and they're the whole unit:

- A prop can hold **finished JSX** (`header={<h2>Hi</h2>}`) → you place it between tags: `{header}`.
- A prop can hold **the component that makes it** (`Icon={PlusIcon}`) → you use it as a tag:
  `<Icon />`.

Nothing here is a React feature either. A component is a function, a function is a value, and
values go in props. Same as every unit since Conditional Content.

### Start from the mistake you already made

Your Button attempt passed the tests and was still wrong. It did this:

```jsx
className={ Icon ? "icon-button"
          : mode === "filled" ? "filled-button"
          : mode === "outline" ? "outline-button"
          : "text-button" }
```

A chained ternary is still **one expression producing one value**. The first branch that wins is
the whole answer; nothing else runs. So `<Button Icon={PlusIcon} mode="text">` came out with
`class="icon-button"` — the `button` base class never appeared anywhere, and `mode="text"` was
ignored outright.

The spec said: *"All buttons need a `button` CSS class — and then, depending on their mode,
additional classes."*

**Those classes are additive layers, not alternatives.** `button` always, **plus** a mode class,
**plus** `icon-button` if there's an icon, **plus** whatever the caller passed. A ternary *chooses
one*. That's why the real answer builds a string up instead of picking:

```jsx
let cssClasses = `button ${mode}-button`;
if (Icon) cssClasses += ' icon-button';
```

**The question to ask before writing any conditional:** am I choosing between alternatives, or
accumulating layers? Ternary for the first. Build-up for the second.

### Lecture 67 — JSX is a value, so any prop can hold it

You already know this from Conditional Content: `const box = <p>Hi</p>` is legal, because a JSX
tag compiles to a function call and a function call produces a value.

So there is nothing special about `children`:

```jsx
<Tabs buttons={<><TabButton /><TabButton /></>}>
  <p>Content</p>
</Tabs>
```

| Slot | How it's filled | Name |
| --- | --- | --- |
| `children` | whatever sits **between** the tags | built-in, React fills it for you |
| `buttons` | passed **explicitly** as an attribute in braces | you invented it |

That's the entire lecture. `children` is the slot with a name already; a **named slot** is one you
pass yourself. A component can have as many as it needs — `header`, `footer`, `sidebar`, `actions`.

A prop holds **one** value, so multiple elements in a slot need a Fragment around them. That's your
Fragments unit doing work here.

### Lecture 68 — a prop can hold a component *identifier*

Look at a JSX tag and ask what React does with the name:

```jsx
<div />          // lowercase → React reads it as the STRING 'div' → built-in HTML element
<TabButton />    // Capitalised → React reads it as a VARIABLE → looks up what's in it
```

That's the rule the whole lecture rests on: **lowercase means a literal HTML tag name,
capitalised means "go look in the variable."** It's why your components have always had to start
with a capital letter.

Now put a component in a variable:

```jsx
const Thing = TabButton;   // Thing holds a function
<Thing />                  // React calls that function → renders a TabButton
```

And a variable can be a **prop**. That's `Icon={PlusIcon}` — you hand the component a pointer to
another component. Inside, `<Icon />` uses it.

React accepts **two kinds of value** in that slot:

| Value | Example | What React renders |
| --- | --- | --- |
| a **string** | `'menu'`, `'div'`, `'section'` | that built-in HTML element |
| a **function** | `PlusIcon`, `TabButton` | that component, by calling it |

Which is why `ButtonsContainer = 'menu'` and `ButtonsContainer={TabButton}` both work on the same
prop.

**The parentheses matter.** `PlusIcon` is the function itself. `PlusIcon()` **calls** it and passes
the result. Same pass-vs-call distinction you drilled in Events with `onClick={fn}` vs
`onClick={fn()}` — different unit, identical rule.

**The capital letter is load-bearing, not cosmetic.** If the prop were named `icon` and you wrote
`<icon />`, React would look for an HTML element called `icon`. There isn't one.

### Lecture 69 — default prop values

```jsx
function Button({ mode = 'filled' }) { ... }
```

Plain JavaScript destructuring defaults, no React feature involved. One precision worth having:
the default fires when the value is **`undefined`** — which is what you get when the prop isn't
passed at all. It does **not** fire for `null`, `false`, `0` or `''`. Those are values, and a value
that exists is used.

### The three categories, extended

Forwarding Props gave you `MINE / FIXED / PASS ON`. This unit adds a fourth thing a prop can be:

| Kind | Example | What you do with it |
| --- | --- | --- |
| **MINE** | `mode`, `rounded` | read it, use it, never put it on the DOM |
| **FIXED** | `"button"`, `"field"` | not a prop at all — written straight in |
| **PASS ON** | `type`, `disabled`, `onClick` | spread onto the right element |
| **A SLOT** | `children`, `buttons`, `Icon` | placed in the output as JSX or used as a tag |

### Setup

`src/App.js`, as always. No `useState` in this unit — nothing here changes over time. Exercise 1 is
plain JavaScript and can go in the browser console instead if that's faster.

**Keep devtools open for every exercise from 2 onwards.** This is the first unit where the screen
lies to you: a wrong tag name, a missing class and an empty wrapper span all look fine rendered.
Your Button attempt passed its tests with the wrong classes on every button. The element inspector
is the only honest check here.

---

## Exercise 1 — No React at all

Plain JavaScript. Browser console or a file, `console.log` every answer.

```js
function greet() {
  return 'hello';
}

function shout() {
  return 'HELLO';
}

 const actions={
  greet : greet,
  shout : shout
}

actions.greet();

const Chosen = actions.greet;
Chosen();

console.log(actions.greet);
console.log(actions.greet());

function run(fn){
  return fn()
};

run(greet);
run(greet());

const functions = [greet, shout];
functions[1]();

```

**Build:**

1. Put both functions into an object `actions`, then call `greet` **through the object** — without
   typing `greet()` directly.
2. Copy one of them into a new variable called `Chosen` (capital C, for reasons that arrive in
   Exercise 4). Call it through `Chosen`.
3. Log `actions.greet` and `actions.greet()` on two separate lines. Look carefully at the two
   outputs before reading on.
4. Write a function `run(fn)` that takes a function and returns the result of calling it. Call it
   as `run(greet)`. Then try `run(greet())` and read the error.
5. Put both functions in an array and call the second one straight out of the array, in one
   expression.

**Watch for:** array vs. item vs. field, your biggest slip from Dynamic lists, in a new costume —
`actions.greet` is the function, `actions.greet()` is what it returned, `actions` is the object
holding it. Three different things, one `.` apart.

**Then answer (two parts):**

**Part 1:** In step 3, what is the difference between the two logged values? Name what each one
*is*, not just what it prints.

**Part 2:** In step 4, `run(greet)` works and `run(greet())` doesn't. Explain what value each call
actually hands to `run`, and why only one of them can be called inside.

### My answer

**Part 1:** `actions.greet` **is the function itself** — a value I can store and pass around.
`actions.greet()` **is the string `'hello'`** the function returned. The parentheses are the call;
without them nothing has run yet.

**Part 2:** `run(greet)` hands over the **function**, so `fn()` inside runs it. `run(greet())` runs
it first and hands over the **string `'hello'`**, so `fn()` becomes `'hello'()` — a **TypeError**,
because a string isn't callable. It doesn't quietly do nothing; it crashes.

**What tripped me up:** the parentheses, in both directions. First I wrote `greet : greet()` and
stored the result instead of the function; then I left the `()` off where I needed a call. One
question fixes both: **am I handing this over, or running it?**

---

## Exercise 2 — A named slot

**Build:** a component `SplitPanel`, used like this:

```jsx
<SplitPanel sidebar={<Nav />}>
  <Article />
</SplitPanel>
```

- Renders an `<aside>` containing whatever came in through `sidebar`.
- Then a `<main>` containing the children.
- **No wrapper `<div>`.** The two elements sit side by side in the DOM.

Write `Nav` and `Article` too — one line each, anything visible will do.

**Check it:** open devtools. There must be exactly two elements at the top, `<aside>` and `<main>`,
with no parent added by `SplitPanel`.

**Watch for:** "no wrapper div" means a Fragment — that's your Fragments unit, and this is the first
place it earns its keep here. Also the `return`: three components in one file is three chances to
forget it.

**Then answer (two parts):**

**Part 1:** `sidebar` and `children` both arrive holding JSX. What is the *only* difference between
them?

**Part 2:** What happens if the caller writes `<SplitPanel sidebar={<Nav />} />` with nothing
between the tags? What does `children` hold, and what does React draw for that value?

---

## Exercise 3 — Two slots, and a caller who passes several elements

**Build:** a component `Toolbar` that renders a `<header>` containing, in order:

1. a `<div className="toolbar-left">` holding the `left` slot
2. a `<div className="toolbar-right">` holding the `right` slot

Use it with **three** buttons on the left and **one** on the right.

**Check it:** all four buttons render, in the right two groups.

**Watch for:** the hard part is at the **call site**, not in the component. The component is four
lines and you already know them. Three buttons in one prop is where this exercise actually lives.

**Then answer:** the `left` slot needs three buttons. You can't write three elements as one prop
value. What did you wrap them in, and what's the one-sentence reason a prop forces that?

---

## Exercise 4 — The tag comes from a prop

**Build:** a component `List`, used all three of these ways:

```jsx
<List>              <Item /> <Item /> </List>
<List as="ol">      <Item /> <Item /> </List>
<List as="menu">    <Item /> <Item /> </List>
```

- The children are rendered inside an element whose **tag name comes from the `as` prop**.
- With no `as`, it's a `<ul>`.
- `Item` is your own component rendering an `<li>` with some text.

**Check it:** inspect all three. The rendered tags must be `<ul>`, `<ol>`, `<menu>` — not three
`<ul>`s, and not a literal `<as>` element anywhere.

**Watch for:** name discipline, and this time it isn't a typo — it's the rule. `as` and `As` and
`Tag` are three different things here, and only a capitalised one works as a tag. Your usual
`taxRate` vs `taxrate` slip, except React won't fall back to a default; it'll invent an HTML
element.

**Then answer (two parts):**

**Part 1:** Inside `List`, why can't you write `<as>{children}</as>`? Say exactly what React would
do with that.

**Part 2:** The prop is written lowercase at the call site (`as="ol"`) but must be capitalised
inside the component. Where does the rename happen, and what is one way to write it?

---

## Exercise 5 — The tag is a component, not a string

**Build:** a component `Badge`, used like this:

```jsx
<Badge Icon={StarIcon}>Featured</Badge>
<Badge Icon={BoltIcon}>Fast</Badge>
<Badge>Plain</Badge>
```

- Renders a `<span className="badge">`.
- If `Icon` was passed, the icon component renders first, wrapped in a
  `<span className="badge-icon">`.
- Then the children.
- With no `Icon`, no `badge-icon` span appears in the DOM at all.

Write `StarIcon` and `BoltIcon` yourself — each returns an `<svg>`, or just a text character if you
want to move faster.

**Check it:** in devtools, the third badge must have **no** `<span class="badge-icon">` inside it —
not an empty one.

**Watch for:** where the `&&` starts. Put it around `<Icon />` only and you get an empty wrapper
span in the DOM — invisible on screen, wrong in the document. This is "inside vs. outside the loop"
from Dynamic lists, asked about a conditional instead of a `.map()`: decide what repeats, or in this
case what's optional, before you type the braces.

**Then answer (two parts):**

**Part 1:** `as="ol"` in Exercise 4 and `Icon={StarIcon}` here both end up as a tag. What is
different about the two **values**, and how does React tell which kind it's been given?

**Part 2:** What renders if you write `Icon={StarIcon()}` at the call site instead? Predict first,
then try it, then explain the gap if you got it wrong.

---

## Exercise 6 — Coding Exercise 15, from a blank file

Rebuild the Udemy `Button`. Blank file. **Do not look at the solution you were given, or at your
own first attempt.**

Used all of these ways:

```jsx
<Button>Default</Button>
<Button mode="filled">Filled</Button>
<Button mode="outline">Outline</Button>
<Button mode="text">Text</Button>
<Button Icon={HomeIcon}>Home</Button>
<Button Icon={PlusIcon} mode="text">Add</Button>
<Button disabled>Disabled</Button>
<Button onClick={() => console.log('hi')} className="extra">Click me</Button>
```

Requirements, all at once:

- Every button carries the class `button`, **always**.
- Plus a mode class: `filled-button`, `outline-button` or `text-button`.
- No `mode` passed means `filled`.
- If `Icon` is passed, **also** the class `icon-button`, and the icon renders inside a
  `<span className="button-icon">`.
- The children are wrapped in a plain `<span>`.
- Any standard `<button>` prop the caller sets (`disabled`, `onClick`, `type`, `id`…) reaches the
  real `<button>`.
- A `className` from the caller is **added** to the classes, not replacing them.
- `mode` and `Icon` must not appear as attributes on the `<button>` in devtools.

**Before you write the component,** write the four category lines and fill them in:

```js
// MINE:     props this component reads and consumes
// FIXED:    values that are the same every time
// PASS ON:  forwarded — onto which element?
// SLOTS:    values placed as JSX or used as a tag
```

**Check it:** inspect `<Button Icon={PlusIcon} mode="text" className="extra">`. Its class attribute
must contain **four** class names. Count them in devtools.

**Watch for:** the JS↔JSX boundary, your standing weak spot, and this exercise is built on it. The
class string is **computed above the `return`** with `let` and `if` — it's accumulation, which is
statements, which can't live in braces. Only the finished variable goes inside. If you find yourself
trying to write an `if` or a `+=` inside `className={...}`, that's the boundary telling you you're
on the wrong side of it.

**Watch for:** fixing only half the list. There are eight requirements above. Tick them off one by
one against your finished component before you decide it's done — this is the exact situation where
you historically apply three of four fixes and move on.

**Then answer (two parts):**

**Part 1:** Which requirement in that list is the one your first attempt got wrong, and what is the
general rule it violated?

**Part 2:** `className` arrives from the caller and `button` is fixed. Why can't you solve that
collision by reordering the attributes on the `<button>` tag? (You worked this out in Forwarding
Props Exercise 4 — say the rule from memory.)

---

## When you're done

Answer these without looking anything up:

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

Then, on your own work:

7. How many did you get right **first try, without running the code to find out**? That's the
   number worth writing down, not how many eventually worked.
8. Where did you stall longest? Write the sentence describing what you were stuck on — that
   sentence decides whether this unit needs a reps file next, or goes straight to a cold test.
9. Go back to `Tabs.jsx` in your course project. You can now answer this: what exactly would break
   if the prop were named `buttonsContainer` instead of `ButtonsContainer`, and what would appear
   in the DOM?

---

## Solutions

Check after each exercise, not at the end — these build on each other.

<details>
<summary><strong>Exercise 1</strong></summary>

```js
// 1
const actions = { greet, shout };
console.log(actions.greet());        // 'hello'

// 2
const Chosen = shout;
console.log(Chosen());               // 'HELLO'

// 3
console.log(actions.greet);          // ƒ greet() { return 'hello'; }   ← the function itself
console.log(actions.greet());        // 'hello'                          ← what it returned

// 4
function run(fn) {
  return fn();
}
console.log(run(greet));             // 'hello'
console.log(run(greet()));           // TypeError: fn is not a function

// 5
const list = [greet, shout];
console.log(list[1]());              // 'HELLO'
```

**Part 1:** `actions.greet` **is the function** — a value you can pass around, store, hand to
something else to call later. `actions.greet()` is the **string it returned**. The parentheses are
the call; without them nothing has run yet.

**Part 2:** `run(greet)` hands `run` the function, so `fn()` inside can call it. `run(greet())`
calls it first and hands over `'hello'` — a string. `'hello'()` is a TypeError, because strings
aren't callable.

This is the whole of lecture 68. `Icon={PlusIcon}` passes the function so `<Icon />` can call it;
`Icon={PlusIcon()}` passes rendered JSX, and `<Icon />` then tries to use an object as a component.

</details>

<details>
<summary><strong>Exercise 2</strong></summary>

```jsx
function SplitPanel({ sidebar, children }) {
  return (
    <>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </>
  );
}
```

**Part 1:** Only **how they're filled**. `children` is filled by React from whatever sits between
the tags; `sidebar` is filled by you, explicitly, as an attribute. Once inside the component
they're both just props holding JSX, and both get placed the same way — in braces, between tags.

**Part 2:** `children` is `undefined`. React draws **nothing** for `undefined` — the `<main>`
renders, empty. Same table as Conditional Content: `null`, `undefined`, `false` and `''` draw
nothing; `0` draws a visible zero.

</details>

<details>
<summary><strong>Exercise 3</strong></summary>

```jsx
function Toolbar({ left, right }) {
  return (
    <header>
      <div className="toolbar-left">{left}</div>
      <div className="toolbar-right">{right}</div>
    </header>
  );
}

export default function App() {
  return (
    <Toolbar
      left={
        <>
          <button>Cut</button>
          <button>Copy</button>
          <button>Paste</button>
        </>
      }
      right={<button>Help</button>}
    />
  );
}
```

**Answer:** a Fragment. A prop holds exactly **one** value, and three sibling elements are three
values — the Fragment makes them one. Same reason a component returns one element.

</details>

<details>
<summary><strong>Exercise 4</strong></summary>

```jsx
function List({ as: Tag = 'ul', children }) {
  return <Tag>{children}</Tag>;
}
```

**Part 1:** `<as>` is lowercase, so React reads it as the literal string `'as'` and tries to create
an HTML element called `as`. It never looks at your variable. Lowercase is *always* a tag name,
never a lookup.

**Part 2:** In the destructuring, with the rename syntax you already met in Forwarding Props
Exercise 1: `{ as: Tag = 'ul' }` — read the key `as`, store it in `Tag`, default `'ul'`. The other
way is a plain assignment above the `return`:

```jsx
function List({ as = 'ul', children }) {
  const Tag = as;
  return <Tag>{children}</Tag>;
}
```

Either is fine. What isn't optional is that the name used as a tag starts with a capital.

</details>

<details>
<summary><strong>Exercise 5</strong></summary>

```jsx
function Badge({ Icon, children }) {
  return (
    <span className="badge">
      {Icon && (
        <span className="badge-icon">
          <Icon />
        </span>
      )}
      {children}
    </span>
  );
}
```

**Part 1:** `as="ol"` is a **string**; `Icon={StarIcon}` is a **function**. React checks the type:
a string means "create that built-in HTML element", a function means "call it and render what it
returns". Same slot, two accepted kinds of value.

**Part 2:** `Icon={StarIcon()}` calls the component yourself and passes the **returned JSX object**.
`<Icon />` then asks React to use that object as a component type, and React throws — an object
isn't a valid element type. Exercise 1 step 4 in a costume.

</details>

<details>
<summary><strong>Exercise 6</strong></summary>

```jsx
// MINE:     mode, className
// FIXED:    "button", "button-icon"
// PASS ON:  disabled, onClick, type, id… → the <button>
// SLOTS:    children, Icon

export default function Button({ children, className, mode = 'filled', Icon, ...props }) {
  let cssClasses = `button ${mode}-button`;

  if (Icon) {
    cssClasses += ' icon-button';
  }

  if (className) {
    cssClasses += ' ' + className;
  }

  return (
    <button className={cssClasses} {...props}>
      {Icon && (
        <span className="button-icon">
          <Icon />
        </span>
      )}
      <span>{children}</span>
    </button>
  );
}
```

**Part 1:** *"Every button carries the class `button`, always"* — and the mode class alongside the
icon class. The rule violated: **the classes accumulate, they don't compete.** A ternary chain
picks exactly one value, so it can never produce two classes at once. Build the string up instead.

**Part 2:** Reordering can't work because **last one wins** — whichever of `className` and the
spread is written second destroys the other. Either the caller's class survives and `button` is
lost, or the reverse. The fix is to pull `className` out by name so the two can't collide, then
join them yourself.

</details>

<details>
<summary><strong>Answers to the closing questions</strong></summary>

**1.** Because the capital letter is how React tells two cases apart. A **lowercase** tag name is
read as a **string** — `<div />` means `'div'`, a built-in HTML element — and React never looks for
a variable of that name. A **capitalised** tag name is read as a **variable reference**: React looks
up what's in it and uses that value as the element type. Write `<as />` and you get a literal,
meaningless `<as>` element in the DOM, with no error.

**2.** The only difference is **how they're filled**: React fills `children` from whatever sits
between the tags; you fill `footer` explicitly as an attribute. That difference lives entirely at
the **call site**. Inside the component they're identical — both props holding a value, both placed
in braces between tags.

**3.** `Icon={PlusIcon}` passes the **function itself**, and `<Icon />` calls it. `Icon={PlusIcon()}`
calls it first and passes the **returned element object**, and `<Icon />` then tries to use that
object as an element type, which throws. Parentheses are the call; without them nothing has run yet.
Same rule as `onClick={fn}` vs `onClick={fn()}` from Events.

**4.** A **string** (`'menu'`, `'div'`) → React creates that built-in HTML element. A **function**
(`PlusIcon`, `TabButton`) → React calls it and renders what it returns.

**5.** The default fires only when the value is **`undefined`**, which is what you get when the prop
isn't passed. Two falsy values that would **not** trigger it: `null` and `''` (also `0` and
`false`). Those are values, and a value that exists is used as-is.

**6.** Ask: **am I choosing, or accumulating?** Choosing between mutually exclusive alternatives →
ternary. Independent conditions whose results stack → build the string up. A ternary produces one
value and can never yield two class names at once, which is exactly what your first Button attempt
needed and didn't do.

**9.** Rename it to `buttonsContainer` on both sides and `<buttonsContainer>` is lowercase, so React
reads it as a tag name string and creates a literal `<buttonscontainer>` element in the DOM (HTML
tag names are case-insensitive, so the capital is lost). The `'menu'` default is never consulted.
Nothing throws and nothing looks obviously broken — the buttons still render inside it, because it's
a real if meaningless element.

</details>
