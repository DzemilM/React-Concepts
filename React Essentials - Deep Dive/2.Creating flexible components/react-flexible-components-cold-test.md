# Creating Flexible Components — Cold Test

No starter code. No skeletons, no blanks. You get the call sites and the requirements; every line of
every component is yours, in a blank StackBlitz.

**Rules:**

- Look up *syntax* freely (how a destructuring rename is spelled). Don't look up the *plan* — don't
  open the exercise or reps files to see the structure.
- **Write the plan first**, in a comment at the top of each task:
  ```js
  // MINE:     props this component reads and consumes — never on the DOM
  // FIXED:    values that are the same every time — not props at all
  // PASS ON:  forwarded — onto WHICH element?
  // SLOTS:    values placed as content, or used as a tag
  ```
  That's part of the test. Every assembly failure in set 2 traced back to skipping it.
- **Tick off the numbered requirements one at a time** before you say a task is done.
- **Read your opening tag last.** Every variable computed above the `return`, and every prop you
  named — is it actually used?
- **Run it and inspect the DOM before you ask me.** This unit is the one where the screen lies.
  Class counts are given; count them in devtools.
- Solutions are collapsed at the bottom. Open them **only after** all three are done.

---

## Task 1 — `Page`

```jsx
<Page title="Home">Welcome.</Page>

<Page
  title="Settings"
  sidebar={<nav>Menu</nav>}
  actions={
    <>
      <button>Save</button>
      <button>Cancel</button>
    </>
  }
  wide
  id="settings-page"
>
  Settings body.
</Page>
```

1. Renders a `<main>`. Always the class `page`, plus `page-wide` when `wide` is set.
2. Inside it, first an `<h1>` holding `title`.
3. Then, **only when `sidebar` is passed**, an `<aside className="page-sidebar">` holding it.
4. Then a `<section className="page-body">` holding the children — **always**.
5. Then, **only when `actions` is passed**, a `<div className="page-actions">` holding it.
6. `id` and other standard props reach the `<main>`.
7. `title`, `sidebar`, `actions`, `wide` must not appear as attributes.

**Check it:** the first page's `<main>` has **one** class and **two** children (`<h1>`, the body
section). The second has **two** classes and **four** children.

**When you're done, ask yourself:** `title` holds a string and `sidebar` holds JSX. Both are placed
the same way. Why?

### My solution

```jsx
function Page({ wide, title, sidebar, actions, children, ...rest }) {
  let classes = 'page';
  if (wide) {
    classes += ' page-wide';
  }

  return (
    <main className={classes} {...rest}>
        <h1>{title}</h1>
        {sidebar && <aside className="page-sidebar">{sidebar}</aside>}
        <section className="page-body">{children}</section>
        {actions && <div className="page-actions">{actions}</div>}
    </main>
  );
}

export default function App() {
  return (
    <>
      <Page title="Home">Welcome.</Page>
      <Page
        title="Settings"
        sidebar={<nav>Menu</nav>}
        actions={
          <>
            <button>Save</button>
            <button>Cancel</button>
          </>
        }
        wide
        id="settings-page"
      >
        Settings body.
      </Page>
    </>
  );
}
```

### My answer

```js
// MINE:     title, sidebar, actions, wide
// FIXED:    "page", "page-wide", "page-sidebar", "page-body", "page-actions"
// PASS ON:  id… → the <main>, via ...rest
// SLOTS:    title, sidebar, actions, children — all placed as content
```

*(Plan written after the code, not before. The rule says before.)*

**Why `{title}` and `{sidebar}` are placed the same way:** both are **finished values**. A string and
a JSX element can both be drawn by React directly between tags. Only a **function** — a component not
yet called — has to be used as a tag, `<X />`. The difference that matters is *finished vs not yet
called*, not string vs JSX.

Correct on all seven requirements, with the body `<section>` left unconditional while the two optional
wrappers got `&&`.

**On `className`:** I first named it and never used it. I removed it, which passes this spec, but a
caller's `className` would then ride in `...rest`, land after `className={classes}`, and replace
`page`. For a real component, join it on.

---

## Task 2 — `Title`

```jsx
function Fancy({ children, ...props }) {
  return <h2 {...props}>✦ {children} ✦</h2>;
}
```

That one's given — copy it in as-is. Now build `Title`:

```jsx
<Title>Default</Title>
<Title level="h1" size="large">Big one</Title>
<Title level="h3" muted className="subtle">Quiet</Title>
<Title level={Fancy} id="fancy">Decorated</Title>
```

1. The rendered tag comes from `level`, defaulting to `h2`.
2. Always the class `title`.
3. Plus `title-${size}`, `size` defaulting to `medium`.
4. Plus `title-muted` when `muted` is set.
5. Plus the caller's `className`, **added**.
6. `id` and other standard props reach the element.
7. `level`, `size`, `muted`, `className` must not appear as attributes.

**Check it:** the third title is an `<h3>` with **four** class names. The fourth is an `<h2>` with
the ✦ characters around the text, and `id="fancy"` on it.

**When you're done, ask yourself (two parts):** `level` received a string three times and a
function once, and you wrote no condition to tell them apart. Who decided what to do with each, and
by checking what? Then: why does `Fancy` still end up with the classes, even though `Title` never
renders an `<h2>` itself?

### My solution

```jsx
function Fancy({ children, ...props }) {
  return <h2 {...props}>✦ {children} ✦</h2>;
}

function Title({ level : Tag="h2", className, size="medium", muted, children, ...rest }){
  let classes=`title title-${size}`;
  if(muted){classes+=" title-muted"};
  if(className){classes+=` ${className}`}

  return(
    <Tag className={classes} {...rest}>
     {children}
    </Tag> 
  )
}

export default function App(){
  return(
    <>
      <Title>Default</Title>
      <Title level="h1" size="large">Big one</Title>
      <Title level="h3" muted className="subtle">Quiet</Title>
      <Title level={Fancy} id="fancy">Decorated</Title>
    </>
  )
}
```

### My answer

```js
// MINE:     level, size, muted, className
// FIXED:    "title", "title-muted"
// PASS ON:  id… → the element <Tag> renders
// SLOTS:    level (used as a tag), children (placed as content)
```

**Part 1 — who decides:** React, by checking the **type** of the value in `Tag`. A **string** means
*create* that built-in element; a **function** means *call* it and render what it returns. One
`<Tag>`, no condition from me.

**Part 2 — how `Fancy` gets the classes.** Props only flow **down**, from the component that writes a
tag to the component named by it:

```
App     writes   id="fancy"
  ↓
Title   builds className, renders <Tag className=… id=…>  — and Tag is Fancy
  ↓
Fancy   receives className + id as its props, spreads them onto its <h2>
  ↓
<h2 class="title title-medium" id="fancy">
```

`Fancy` produces none of it. It takes what it's handed from outside and forwards it to its `<h2>` —
the Forwarding Props pattern, one level deeper.

**What tripped me up:**

- `children` wasn't named, and `<Tag … />` self-closed — yet the text still showed. It was riding
  inside `...rest`, and spreading `{ children }` onto a tag works like writing it between the tags.
  Worked by accident. `children` is a **slot**: name it, place it.
- Fixing that took three rounds: placed but not named (*"children is not defined"*), then named but
  put in the attribute list — `<Tag {children} />`, a syntax error, same as Rep 2's `<div {required}>`.
  Edited one part, broke another; re-read the whole `return` after each fix.
- In the plan I listed `Fancy` as if it were a prop. It isn't — it's one **value** the `level` prop
  receives. The plan sorts **props**, not values.

---

## Task 3 — `Toast`

```jsx
<Toast>Saved.</Toast>

<Toast level="error" Icon={AlertIcon} heading={<strong>Upload failed</strong>} closable>
  The file was too large.
</Toast>

<Toast as="section" level="success" Icon={CheckIcon} className="pinned" role="status">
  All done.
</Toast>
```

Write `AlertIcon` and `CheckIcon` yourself — each returns a span with a character in it, nothing
else.

1. The outer tag comes from `as`, defaulting to `div`.
2. Always the class `toast`.
3. Plus `toast-${level}`, `level` defaulting to `info`.
4. Plus `toast-with-icon` when `Icon` is passed.
5. Plus `toast-closable` when `closable` is set.
6. Plus the caller's `className`.
7. When `Icon` is passed, it renders first, inside `<span className="toast-icon">`. When it isn't,
   that span must not exist.
8. Then `heading`, when passed.
9. Then the children, inside `<p className="toast-message">` — **always**.
10. When `closable` is set, a `<button className="toast-close">×</button>` renders last. When it
    isn't, that button must not exist.
11. `role` and other standard props reach the outer element.
12. `as`, `level`, `Icon`, `heading`, `closable`, `className` must not appear as attributes.

**Check it:** the first toast has **two** classes and exactly **one** child. The second has **four**
classes and four children. The third is a `<section>` with **four** classes and `role="status"`.

`closable` is new: one boolean that drives **both** a class **and** an extra element. No hint beyond
that.

**When you're done, ask yourself:** `Icon` and `heading` both render something optional near the
top. One is written `<Icon />` and the other `{heading}`. Say why in one sentence, using the words
*function* and *element*.

### My solution

```jsx
function AlertIcon(){return(<span>Alerttt</span>)}
function CheckIcon(){return(<span>Checkkk</span>)}

function Toast({ as : Tag="div", className, level="info", Icon, closable, heading, children, ...rest }){
  let classes=`toast toast-${level}`;
  if(Icon){classes+=" toast-with-icon"};
  if(closable){classes+=" toast-closable"};
  if(className){classes+=` ${className}`};

  return(
    <Tag className={classes} {...rest}>
      {Icon && <span className="toast-icon"><Icon /></span>}
      {heading}
      <p className="toast-message">{children}</p>
      {closable && <button className="toast-close">×</button>}
    </Tag>
  )
}

export default function App(){
  return(
    <> 
      <Toast>Saved.</Toast>

      <Toast level="error" Icon={AlertIcon} heading={<strong>Upload failed</strong>} closable>
        The file was too large.
      </Toast>

      <Toast as="section" level="success" Icon={CheckIcon} className="pinned" role="status">
        All done.
      </Toast>
    </>
  )
}
```

### My answer

```js
// MINE:     as, level, Icon, heading, closable, className
// FIXED:    "toast", "toast-with-icon", "toast-closable", "toast-icon", "toast-message", "toast-close"
// PASS ON:  role… → the element <Tag> renders
// SLOTS:    as and Icon (used as tags), heading and children (placed as content)
```

*(Plan written after the code again, worked out with four prompting questions.)*

**`<Icon />` vs `{heading}`:** `Icon` holds a **function** that hasn't been called yet, so `<Icon />`
calls it. `heading` holds a finished **element**, so `{heading}` just places it.

It's about **when** the element is built. `heading={<strong>…</strong>}` is built **early**, in
`App`, before `Toast` runs; `Toast` receives it finished. `Icon={AlertIcon}` is only the function's
name — its element is built **late**, inside `Toast`, when React reaches `<Icon />` and calls it.
Same split as `greet` vs `greet()` in set 1's Exercise 1. A cooked meal vs a recipe: serve one,
cook the other.

**`closable`**, the new thing, came out right first time: one boolean that adds a class **and**
decides whether the `×` button exists. It's MINE only — its value never appears on screen, and it
isn't a real HTML attribute here, so nothing gets put back.

**What tripped me up:** I put `className="toast-icon"` inside `AlertIcon` and `CheckIcon` instead of
wrapping `<Icon />` in `Toast` — the **third** time the wrapper drifted into the child (Rep 1, Rep 4,
here). My own plan listed `"toast-icon"` as FIXED, and the code contradicted it. The DOM came out
identical, so devtools couldn't catch it; the test is *if someone passes an icon I didn't write, does
`toast-icon` still appear?*

---

## After you finish

Answer these before opening the solutions:

1. In Task 1, which wrapper was **not** conditional, and how did you make sure you didn't give it the
   same `&&` as the others?
2. In Task 2, where does the `Fancy` component's `...props` spread get its `className` from?
3. In Task 3, what category did you put `closable` in, and did it end up on the DOM?
4. How many of the three did you get right **before** running them?

### My answers

**1.** The body `<section>` in `Page`. The requirement said **always**, and `&&` is only for wrappers
that must **not exist** when their slot is empty. Children aren't guaranteed — `<Page title="x" />`
is legal — but the section is required either way; with no children it just renders empty.

**2.** From `Title`. When `Tag` holds `Fancy`, the line `<Tag className={classes} {...rest}>` *is*
`<Fancy className={classes} id="fancy">`. So `Fancy` receives `className` and `id` as its props, its
`...props` gathers them, and it spreads them onto its `<h2>`. The caller never passed a `className`
in that call — `"title title-medium"` was built by `Title`.

**3.** MINE. It didn't reach the DOM **because I named it in the destructuring**, so it never got
into `...rest`.

**4. One of three, strictly.** Task 1 right first time. Task 2's `children` only worked by riding in
the spread, and took three rounds to name and place properly. Task 3's icon wrapper was in the wrong
component. Neither of those is a typo.

**Overall:** no concept needed explaining — a real change from set 1. What still costs rounds is the
plan getting skipped on all three tasks, and the wrapper drifting into the child.

---

<details>
<summary><strong>Solutions</strong> — only after all three are done and running</summary>

### Task 1

```jsx
// MINE:     title, sidebar, actions, wide
// FIXED:    "page", "page-wide", "page-sidebar", "page-body", "page-actions"
// PASS ON:  id… → the <main>
// SLOTS:    title, sidebar, actions, children — all placed as content

function Page({ title, sidebar, actions, wide, children, ...props }) {
  let classes = 'page';

  if (wide) {
    classes += ' page-wide';
  }

  return (
    <main className={classes} {...props}>
      <h1>{title}</h1>
      {sidebar && <aside className="page-sidebar">{sidebar}</aside>}
      <section className="page-body">{children}</section>
      {actions && <div className="page-actions">{actions}</div>}
    </main>
  );
}
```

**Why `title` and `sidebar` are placed the same way:** both are **finished values** — a string and
a JSX element — and React renders both between tags. Only a *function* would need to be used as a
tag. What a value holds doesn't matter; whether it's already finished does.

The body `<section>` has no `&&`. Two optional slots, one required — decide per requirement, not
per pattern.

### Task 2

```jsx
// MINE:     level, size, muted, className
// FIXED:    "title"
// PASS ON:  id… → the element
// SLOTS:    children, and `level` used as a tag

function Title({
  level: Tag = 'h2',
  size = 'medium',
  muted,
  className,
  children,
  ...props
}) {
  let classes = `title title-${size}`;

  if (muted) {
    classes += ' title-muted';
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
```

Third title: `<h3 class="title title-medium title-muted subtle">` — four.

**Who decides:** React. It checks the **type** of the value in `Tag` — a string means "create that
built-in element", a function means "call it". One `<Tag>`, no condition from you.

**Why `Fancy` gets the classes:** `Title` renders `<Fancy className={classes} id="fancy">`, so
`className` and `id` arrive in `Fancy`'s props. `Fancy` gathers them in its own `...props` and
spreads them onto its `<h2>`. `Title` never renders the `<h2>` — `Fancy` does, with what it was
given.

### Task 3

```jsx
// MINE:     as, level, Icon, heading, closable, className
// FIXED:    "toast", "toast-icon", "toast-message", "toast-close"
// PASS ON:  role… → the outer element
// SLOTS:    Icon (used as a tag), heading and children (placed as content)

function AlertIcon() {
  return <span>!</span>;
}

function CheckIcon() {
  return <span>✓</span>;
}

function Toast({
  as: Tag = 'div',
  level = 'info',
  Icon,
  heading,
  closable,
  className,
  children,
  ...props
}) {
  let classes = `toast toast-${level}`;

  if (Icon) {
    classes += ' toast-with-icon';
  }

  if (closable) {
    classes += ' toast-closable';
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <Tag className={classes} {...props}>
      {Icon && (
        <span className="toast-icon">
          <Icon />
        </span>
      )}
      {heading}
      <p className="toast-message">{children}</p>
      {closable && <button className="toast-close">×</button>}
    </Tag>
  );
}
```

First: `toast toast-info`, one child. Second: `toast toast-error toast-with-icon toast-closable`,
four children. Third: `<section class="toast toast-success toast-with-icon pinned" role="status">`.

**`closable`** is MINE — read twice, once for the class and once to decide whether the button
exists, and never forwarded. It's not a real HTML attribute of any element here, so unlike
`required` and `disabled` in the reps, nothing needs putting back.

**`<Icon />` vs `{heading}`:** `Icon` holds a **function** that hasn't been called yet, so it's used
as a tag; `heading` holds a finished **element**, so it's placed between tags.

</details>
