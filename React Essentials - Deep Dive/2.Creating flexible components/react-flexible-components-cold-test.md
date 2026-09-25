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

---

## After you finish

Answer these before opening the solutions:

1. In Task 1, which wrapper was **not** conditional, and how did you make sure you didn't give it the
   same `&&` as the others?
2. In Task 2, where does the `Fancy` component's `...props` spread get its `className` from?
3. In Task 3, what category did you put `closable` in, and did it end up on the DOM?
4. How many of the three did you get right **before** running them?

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
