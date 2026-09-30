# Creating Flexible Components — Written Exam

24 questions in five sections. **No running code, no looking at the other files.** Write your answer
under each question, then check against the collapsed key at the bottom.

**This exam tests this unit and nothing else.** No JavaScript error-message trivia. Every question
is aimed at something that actually went wrong during the exercises, reps or cold test — the
`Fancy` flow, `Icon` vs `heading`, `children` vs a named slot, defaults, class building, and
**planning: naming what is what.** Section C is entirely that.

**Do it rested.** The Dynamic lists explain-section was done tired and scored 3½ of 8.

**Mark yourself honestly.** For predict-the-output, "roughly right" is wrong. For explain-it, a
correct idea in fuzzy words is half marks — the words are the thing being tested.

---

## Section A — Predict the output

Say what ends up **in the DOM**. Tag names and class names matter.

### A1

```jsx
function Box({ as = 'div', children }) {
  return <as>{children}</as>;
}

<Box as="section">Hi</Box>
```

**My answer:** `<section>Hi</section>` — **✗**

It's `<as>Hi</as>`. A lowercase name in the tag position is a **string**, a literal tag name, so React
never looks at the prop. To use the prop's value it has to go into a **capitalised** variable first
(`as: Tag`).

### A2

What does each `<p>` contain? All five.

```jsx
function Label({ text = 'Untitled' }) {
  return <p>{text}</p>;
}

<Label />
<Label text={undefined} />
<Label text={null} />
<Label text="" />
<Label text={0} />
```

**My answer:** the first three show "Untitled", the last two show an empty string and `0` —
**4 of 5**

Got the tricky one — explicit `undefined` does trigger the default. But `null` does **not**: it's a
value that exists, so no default, and React draws nothing. Correct: Untitled, Untitled, nothing,
nothing, `0`. **Only `undefined` triggers a default.**

### A3

Write the exact rendered HTML. Then say **which component wrote the `class`**, and **which wrote the
`<h3>`**.

```jsx
function Fancy({ children, ...props }) {
  return <h3 {...props}>» {children}</h3>;
}

function Heading({ as: Tag = 'h2', className, children, ...rest }) {
  let classes = 'heading';
  if (className) {
    classes += ` ${className}`;
  }
  return <Tag className={classes} {...rest}>{children}</Tag>;
}

<Heading as={Fancy} id="intro" className="big">Hello</Heading>
```

**My answer:** `Fancy` wrote the `<h3>`, `Heading` wrote the class.
`<h3 className="heading big">Hello</h3>` — **half**

The attribution is right, and that's the key idea. The HTML is missing `id="intro"`, which travels the
same path as the class (`Heading` → `...rest` → `Fancy`'s props → `...props` → `<h3>`), and the `»`
that `Fancy` writes before `{children}`. In the DOM the attribute is `class`, not `className`:
`<h3 class="heading big" id="intro">» Hello</h3>`.

### A4

What renders? And what happened to `title`? Both halves.

```jsx
function Card({ title, ...rest }) {
  return <div className="card" {...rest} />;
}

<Card title="Welcome">Body text</Card>
```

**My answer:** a div with class `card` and "Body text" shows. Nothing happens with `title` — it was
named, so it isn't in `...rest`. — **✅**

Both halves right. "Body text" shows because `children` *wasn't* named, so it rode in `...rest` onto
the div — it works, but by accident.

### A5

Write the DOM for this one exactly.

```jsx
function Chip({ Icon, children }) {
  return (
    <span className="chip">
      <span className="chip-icon">{Icon && <Icon />}</span>
      {children}
    </span>
  );
}

<Chip>Plain</Chip>
```

**My answer:** the outer chip span with an empty `chip-icon` span inside, and "Plain" after it. —
**✅** *("Plain" added after pressing enter too early.)*

`<span class="chip"><span class="chip-icon"></span>Plain</span>`. The `&&` wraps only the icon, not
its wrapper, so the empty wrapper is always there.

### A6

What is the `class` on the button, and does "Go" appear?

```jsx
function Btn({ ...rest }) {
  return <button className="btn" {...rest} />;
}

<Btn className="primary">Go</Btn>
```

**My answer:** class is `btn`, and "Go" doesn't appear because there are no children. — **✗ both**

*(My first instinct was right; I talked myself out of it.)* Nothing is named, so **everything is in
`rest`** — `className` **and** `children`.

- **"Go" appears**: `children` rides the spread onto the button, exactly like A4.
- **The class is `primary`**: the spread comes after `className="btn"`, and **last one wins**.

Ask "what's in `rest`?" before changing an answer.

### A7

Both of these are wrong. For each: **what error**, and **at which moment** — before React gets the
value, or when React tries to use it?

```jsx
function StarIcon() {
  return <span>★</span>;
}

function TextCell({ children }) {
  return <span>{children}</span>;
}

// (a) somewhere a component does <Icon /> with this:
<Badge Icon={StarIcon()}>Featured</Badge>

// (b) somewhere a component does <Cell>…</Cell> with this:
<Row Cell={TextCell()}>hello</Row>
```

**My answer:** the error is that the function gets called — it should be just `StarIcon` and
`TextCell`. — **half**

The root cause and the fix are right. But (a) and (b) fail **differently**:

- **(a)** `StarIcon()` takes no props, runs fine, and returns an element **object**. It breaks
  **later**, when React reaches `<Icon />`: *"expected a string or a class/function… got: object."*
- **(b)** `TextCell()` tries to destructure `children` with no arguments. It breaks **immediately**,
  at the call site: *"Cannot destructure property 'children' of 'undefined'."*

### Section A so far

A1 ✗ · A2 4/5 · A3 half · A4 ✅ · A5 ✅ · A6 ✗ · A7 half.

The ideas are there — attribution in A3, `rest` in A4, the root cause in A7. What slipped is
**completeness**: the lowercase trap in A1, second-guessing in A6, and half of A3 and A7 left out.

---

## Section B — Spot the bug

Each has one main bug. Name the line, say what goes wrong, and say why.

### B1

The spec: *"`Badge` wraps any icon it's given in `<span className="badge-icon">`."* With `StarIcon`
the DOM looks right. Now imagine someone else writes a second icon and passes it in:

```jsx
function HeartIcon() {
  return <span>♥</span>;
}

<Badge Icon={HeartIcon}>Liked</Badge>
```

Is there a `badge-icon` span in that one? What's wrong with the code?

```jsx
function Badge({ Icon, children }) {
  return (
    <span className="badge">
      {Icon && <Icon />}
      {children}
    </span>
  );
}

function StarIcon() {
  return <span className="badge-icon">★</span>;
}
```

**My answer:** the span with the class is written inside `StarIcon`, so it doesn't wrap other icons —
with `HeartIcon` there's no `badge-icon`. — **half**

I found where the span was, but my first read was *"so it always wraps an icon?"* — the opposite
conclusion. The second-icon test is what turned it around. `"badge-icon"` is a FIXED class owned by
`Badge`: `{Icon && <span className="badge-icon"><Icon /></span>}`, and every icon returns only itself.
Fourth time this unit — the reflex to build: **when an icon contains its own wrapper, imagine a second
icon that doesn't.**

### B2

The header never appears.

```jsx
function Panel({ header, children }) {
  return (
    <section>
      <div className="panel-header" header={header}></div>
      {children}
    </section>
  );
}

<Panel header={<h2>Settings</h2>}>Body</Panel>
```

**My answer:** it should be `{header}` between the tags, not `header=` in the attribute list. — **✅**

The div has nothing between its tags, so it renders empty and "Settings" appears nowhere — a `<div>`
doesn't display its attributes. Fix: `<div className="panel-header">{header}</div>`. I've made this
mistake twice (set 1's `<aside sidebar>`, Rep 2's `<label label>`) and caught it straight away here.

### B3

The caller's class vanishes.

```jsx
function Tile({ size = 'medium', className, children, ...rest }) {
  const classes = `tile tile-${size}`;
  return <div className={classes} {...rest}>{children}</div>;
}

<Tile className="promo">X</Tile>
```

**My answer:** `promo` vanishes. It would have overwritten the classes if `className` weren't named in
`Tile`, but it was named, so `...rest` doesn't take it — it's just discarded. — **✅**

Both paths right: **named** → not in `rest`, never joined, discarded; **not named** → in `rest`,
spread after `className={classes}`, **overwrites** it (A6's last-one-wins). Fix: name it **and** join
it — `let classes = …; if (className) classes += \` ${className}\`;` — `let`, because `const` can't be
appended to.

### B4

Different bug, same symptom area. What's the `class` on the div, and what went wrong?

```jsx
function Tile({ className = 'tile', size = 'medium', children }) {
  return <div className={`${className} tile-${size}`}>{children}</div>;
}

<Tile className="promo">X</Tile>
```

**My answer:** `promo tile-medium` — the fixed class wasn't written in; it's whatever `className`
holds. — **✅**

Precisely: `'tile'` is a FIXED class written as the **default** of `className`, a MINE prop. A default
only applies when the prop is missing, so the caller's `"promo"` **replaces** `tile` instead of adding
to it. Two categories merged into one variable. Fix: type `tile` into the string, no default on
`className`, join it last.

### B5

One mistake, two consequences. Name both.

```jsx
function List({ Tag: as = 'ul', children }) {
  return <Tag>{children}</Tag>;
}

<List as="ol"><li>One</li></List>
```

**My answer:** `as` and `Tag` are swapped, so there's no key called `Tag`… it stays `ul`, or nothing
shows. — **half**

Read it with the rule **"take X, call it Y"**: `{ Tag: as = 'ul' }` is *take `Tag`, call it `as`*.

1. There's no `Tag` key (the caller wrote `as="ol"`), so the default fires and the variable `as` is
   always `'ul'` — **the caller's `"ol"` is ignored.** *(Got this one.)*
2. No variable `Tag` is ever created, so `<Tag>` **crashes** with *"Tag is not defined"* — nothing
   renders at all. *(Missed this one.)*

Fix: `{ as: Tag = 'ul' }` — take `as`, the key that exists; call it `Tag`, capitalised.

### B6

The password input isn't required.

```jsx
function Field({ label, required, ...rest }) {
  let classes = 'field';
  if (required) {
    classes += ' field-required';
  }
  return (
    <div className={classes}>
      <label>{label}</label>
      <input {...rest} />
    </div>
  );
}

<Field label="Password" type="password" required />
```

**My answer:** it's not in `rest` because it's named specifically, and because of that it doesn't
reach the input. — **✅**

Wanted: `<input type="password" required>`. Got: `<input type="password">`. A prop that's both mine
(used for the class) and a real HTML attribute has to be put back by hand:
`<input required={required} {...rest} />`. Same as Rep 2.

### Section B total

B1 half · B2 ✅ · B3 ✅ · B4 ✅ · B5 half · B6 ✅ — **5 of 6**.

Clearly stronger than Section A. Spotting a bug in code I'm shown is solid; predicting the exact
output from scratch is where points leaked.

---

## Section C — Plan it

No code. **Just the four lines.** This is the section the whole unit kept circling: the code was
usually fine once the plan was right.

```js
// MINE:     props this component reads and consumes — never on the DOM
// FIXED:    values that are the same every time — not props at all
// PASS ON:  forwarded — onto WHICH element?
// SLOTS:    values placed as content, or used as a tag
```

Reminders you've earned the hard way: the plan sorts **props**, not values. A prop can land on more
than one line. FIXED means *the caller never supplies it*, not *it always appears*.

### C1

```jsx
<Banner tone="warning" dismissible Icon={WarnIcon} className="top" id="b1">
  Maintenance tonight.
</Banner>
```

The spec: a `<div>` with the classes `banner`, `banner-${tone}` (`tone` defaults to `info`),
`banner-dismissible` when `dismissible` is set, plus the caller's `className`. The icon inside
`<span className="banner-icon">`. The children inside `<p className="banner-text">`. When
`dismissible` is set, a `<button className="banner-close">×</button>` at the end. `id` reaches the
div.

Write the four lines. Then: which line — or lines — does `dismissible` go on, and why **not** SLOTS?

### C2

```jsx
<Input
  label="Email"
  as="textarea"
  disabled
  name="email"
  hint={<small>We never share it</small>}
/>
```

The spec: a `<div className="field">`, plus `field-disabled` when `disabled` is set. Inside: a
`<label>` holding `label`, then the input element (tag from `as`, defaulting to `input`), then
`hint`. `name` and `disabled` must both reach the **input element**.

Write the four lines. One prop goes on two lines — name it, and say what you'd have to write in the
JSX because of that.

### C3

Someone wrote this plan for the call below. It has **four** mistakes. Find them all.

```jsx
<Card as="article" Icon={StarIcon} title={<h3>Hi</h3>} className="x" id="c1">
  Body
</Card>
```

```js
// MINE:     as, Icon, title
// FIXED:    "card", className
// PASS ON:  id, children → the outer element
// SLOTS:    StarIcon, title
```

---

## Section D — Explain it

Full sentences. The words are what's being tested.

### D1

`children` and a prop called `footer` both hold JSX. What is the **only** difference between them,
and where does that difference live? (Hint at what it is *not*: it's not what they can hold.)

### D2

`Icon={StarIcon}` and `heading={<strong>Hi</strong>}`. Inside the component one is written
`<Icon />` and the other `{heading}`. Explain why, using the words *function* and *element* — and
say **when** each one's element actually gets built.

### D3

A variable used as a tag must be capitalised. What does the capital letter tell React — and what
does it **not** tell React?

### D4

Two conditions both affect a class list. Ternary, or build the string up? Give the test you use to
decide, and say what's wrong with deciding by *how many* conditions there are.

### D5

`"chip-icon"` only appears on chips that have an icon. Is it FIXED? Why or why not?

### D6

Why does naming a prop in the destructuring keep it off the DOM? And what does that cost you when
the prop is **also** a real HTML attribute?

---

## Section E — Plain JavaScript

### E1

What is `Tag` in each case?

```js
const { as: Tag = 'div' } = { as: 'nav' };
const { as: Tag = 'div' } = {};
const { as: Tag = 'div' } = { as: undefined };
const { as: Tag = 'div' } = { as: null };
```

(Pretend each line is in its own file — ignore the redeclaration.)

### E2

```js
function greet() {
  return 'hello';
}

function run(fn) {
  return fn();
}

const a = greet;
const b = greet();
```

What is `a`, and what is `b` — say what each **is**, not what it prints. Then: what does `run(a)`
return, and what happens with `run(b)`?

---

<details>
<summary><strong>Answer key</strong> — only after you've written all 24</summary>

## Section A

**A1.** `<as>Hi</as>`. The lowercase `as` in the tag position is read as the **string** `'as'` — a
literal tag name — so React creates an `<as>` element and never looks at the prop. No error, nothing
in the console. To use the prop as a tag it has to go into a **capitalised** variable.

**A2.**

| Call | `<p>` shows |
| --- | --- |
| `<Label />` | **Untitled** |
| `text={undefined}` | **Untitled** |
| `text={null}` | *nothing* |
| `text=""` | *nothing* |
| `text={0}` | **0** |

The second one is the one to check. The default fires when the value **is `undefined`** — leaving the
prop out is just the usual way to get `undefined`, but passing it explicitly does the same. `null`,
`''` and `0` are values, so they're used as-is. React skips `null`; it renders `''` as empty text
and `0` as a visible zero.

**A3.**

```html
<h3 class="heading big" id="intro">» Hello</h3>
```

**`Heading` wrote the `class`** — it built `"heading big"` and put it on `<Tag>`. **`Fancy` wrote
the `<h3>`.** When `Tag` holds `Fancy`, `<Tag className={classes} id="intro">` *is*
`<Fancy className="heading big" id="intro">`, so both arrive as `Fancy`'s props; its `...props`
gathers them and spreads them onto its `<h3>`. Props flow **down**: from the component that writes a
tag, to the component the tag names.

**A4.** `<div class="card">Body text</div>`. `children` wasn't named, so it's inside `...rest`, and
spreading `{ children: "Body text" }` onto a self-closing tag works like writing it between the tags.
It renders — **by accident**. `title` was named and then never used, so it's dropped: "Welcome"
appears nowhere, and nothing warns you.

**A5.**

```html
<span class="chip"><span class="chip-icon"></span>Plain</span>
```

An empty `chip-icon` span. The `&&` wraps only the icon, not its wrapper, so the wrapper always
exists. Invisible on screen, wrong in the document. The `&&` has to wrap the **whole** span.

**A6.** `class="primary"`, and yes, "Go" appears. The spread comes after `className="btn"`, so the
caller's `className` inside `rest` overwrites it — **last one wins**, and `btn` is gone. "Go" shows
because `children` is in `rest` too, riding the spread.

**A7.**

- **(a)** `StarIcon()` runs fine — it takes no props — and returns an element **object**. The error
  comes **later**, when React reaches `<Icon />` and refuses an object as an element type:
  *"expected a string … or a class/function … but got: object."*
- **(b)** `TextCell()` is called with **no arguments**, so its parameter list tries to destructure
  `children` from `undefined`. The error comes **earlier**, at the call site, before React is
  involved: *"Cannot destructure property 'children' of 'undefined'."*

Same root cause both times — **called it instead of passing it.**

## Section B

**B1.** The `badge-icon` wrapper is inside `StarIcon` instead of `Badge`. The DOM looks right only
because `StarIcon` happens to add it; pass any other icon and the class never appears. `"badge-icon"`
is a **FIXED** value owned by `Badge`. Fix: `{Icon && <span className="badge-icon"><Icon /></span>}`
in `Badge`, and `StarIcon` returns just `<span>★</span>`.

**B2.** `header={header}` puts the JSX in the **attribute list** of the div. The div has nothing
between its tags, so it renders empty, and "Settings" appears nowhere. Content goes **between** the
tags: `<div className="panel-header">{header}</div>`.

**B3.** `className` is named in the destructuring — so it's out of `rest` — and then never joined
into `classes`. "promo" silently vanishes. Pulling it out and joining it back are **two steps**.
Fix: `let classes = …; if (className) classes += \` ${className}\`;` — and it has to be `let`, not
`const`, once you append.

**B4.** `class="promo tile-medium"` — `tile` is gone. Giving `className` a default of `'tile'` merged
a **FIXED** value with a **MINE** prop: when the caller passes a `className`, it *replaces* the fixed
class instead of adding to it. `tile` is typed into the string; `className` has no default and is
joined on last.

**B5.** The rename is inverted. `{ Tag: as = 'ul' }` means *"take the key `Tag`, call it `as`"*.

1. There's no `Tag` key in the props object — the caller wrote `as="ol"` — so the default fires and
   the variable `as` is always `'ul'`. The caller's `"ol"` is ignored.
2. The variable named `Tag` is never created, so `<Tag>` throws *"Tag is not defined"*.

Correct: `{ as: Tag = 'ul' }` — **"take `as`, call it `Tag`"**. Source first.

**B6.** `required` is named in the destructuring, so it's **out of `rest`**. It's used for the class,
then never reaches the `<input>`. Fix: `<input required={required} {...rest} />`. A prop that's both
yours and a real HTML attribute has to be put back by hand.

## Section C

**C1.**

```js
// MINE:     tone, dismissible, Icon, className
// FIXED:    "banner", "banner-dismissible", "banner-icon", "banner-text", "banner-close"
// PASS ON:  id… → the outer <div>
// SLOTS:    Icon (used as a tag), children (placed as content)
```

`banner-${tone}` is **not** FIXED — the tone comes from the caller. `className` is **always** MINE.

`dismissible` goes on **MINE only**. Its value `true` is never displayed — you never write
`{dismissible}` anywhere. It only *decides* two things: whether a class is added and whether the
button exists. The button is fixed markup that `dismissible` switches on. And it isn't a real HTML
attribute of a `<div>`, so nothing is passed on.

**C2.**

```js
// MINE:     label, as, hint, disabled
// FIXED:    "field", "field-disabled"
// PASS ON:  name, disabled… → the INPUT element, not the <div>
// SLOTS:    label and hint (placed as content), as (used as a tag)
```

**`disabled`** is on two lines: read for the class, **and** a real input attribute. Because it's named
in the destructuring it's out of `rest`, so the JSX has to put it back by hand:
`<Input disabled={disabled} {...rest} />`.

**C3.** The four mistakes:

1. **`className` is under FIXED.** It comes from the caller — it's **MINE**, and it's missing from
   that line.
2. **`children` is under PASS ON.** It's a **SLOT**, placed between the tags. Left in the spread it
   only works by accident.
3. **`StarIcon` is under SLOTS.** That's a **value**, not a prop. The prop is `Icon`. The plan sorts
   props.
4. **`as` is missing from SLOTS.** It's used as a tag.

Corrected:

```js
// MINE:     as, Icon, title, className
// FIXED:    "card"
// PASS ON:  id… → the outer element
// SLOTS:    as and Icon (used as tags), title and children (placed as content)
```

## Section D

**D1.** The only difference is **where it's written at the call site**. `footer` is written like any
normal prop — an **attribute inside the opening tag**, holding JSX. `children` is whatever sits
**between the opening and closing tags**. Inside the component they're identical: both just props,
both placed with braces. It is *not* what they can hold — both can hold anything.

**D2.** `Icon` holds a **function** that hasn't been called yet, so `<Icon />` is what calls it — its
element is built **late**, inside the component, when React reaches that line. `heading` holds a
finished **element** — the caller already built `<strong>Hi</strong>` in their own code, **early**,
before the component ran — so `{heading}` just places it. A recipe versus a cooked meal.

**D3.** It tells React **"this is a variable — use whatever is inside it."** It does **not** tell React
"this is a component". What's inside could be a string like `'h2'`, which gives a built-in element.
React decides afterwards by checking the **type** of the value: string → create that element,
function → call it.

**D4.** Ask: **am I choosing, or accumulating?** Choosing one outcome among alternatives → ternary,
however many there are. Independent conditions that can be true together → build the string up.
Counting is the wrong test: three mutually exclusive options still suit a ternary, and two
independent conditions still can't use one — a ternary produces **one** value.

**D5.** Yes, FIXED. FIXED is about whether the **value** ever comes from the caller, not whether it
always **appears**. `"chip-icon"` is that exact string every time it's used; nobody can pass a
different one. Conditional appearance and variable value are different things.

**D6.** `...rest` gathers only what **wasn't named**, so a named prop is never in the spread and can't
reach the DOM. The cost: if the prop is also a real attribute — `required`, `disabled` — it doesn't
reach the element either, so you have to put it back by hand: `required={required}`.

## Section E

**E1.** `'nav'`, `'div'`, `'div'`, `null`. The default fires only when the value is `undefined` —
missing **or** explicitly `undefined`. `null` is a value and is kept.

**E2.** `a` **is the function itself** — not run. `b` **is the string `'hello'`** — the function has
already run. `run(a)` returns `'hello'`, because `run` calls what it's given. `run(b)` throws a
**TypeError**: `fn()` becomes `'hello'()`, and a string isn't callable.

</details>

---

## How to read your score

- **Section A wrong** → you can't yet predict what a prop turns into in the DOM. A3 and A4 are the
  ones that matter: props flowing through a component, and `children` riding in a spread.
- **Section B wrong** → these are bugs you actually wrote. B1, B3 and B6 are all yours, from this
  unit.
- **Section C wrong** → the planning isn't automatic yet, and that's where most of this unit's
  rounds went. Keep writing the four lines first on every component from now on.
- **Section D wrong** → you can write it but can't say it. D1 and D2 are the two that took the most
  reframings.
- **Section E wrong** → the gap is plain JavaScript: functions as values, and destructuring defaults.
