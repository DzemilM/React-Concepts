# Forwarding Props — Four Reps

Not an exercise set. **Reps.** Four small components, each written from a blank file.

## Why these exist

The six exercises got done, but 4 and 6 didn't come out clean. The stalls were specific:

- **Exercise 6** — not seeing which value was fixed (`"field"`) and which came from the caller, and
  so not knowing which prop to name.
- **Exercise 6** — spreading in places a spread can't go: `className={...input}`,
  `<label>{...input}</label>`.
- **Exercise 4** — pulling `className` out and never using it, then joining two strings with quotes
  and `+` inside backticks.

Every rep below hits at least one of those. If one takes more than ten minutes, stop and write down
the sentence describing where you stalled.

## Rules

1. Blank file every time. Don't copy from the exercises file.
2. Before writing the component, write these three comment lines and fill them in:
   ```js
   // MINE:     props this component uses itself (never passed on)
   // FIXED:    values that are the same every time — not props at all
   // PASS ON:  everything else — and onto WHICH element?
   ```
3. Run it and inspect the element in devtools before deciding it's done.
4. `{...x}` goes **on its own inside a tag**, like `<input {...x} />`. Nowhere else.

---

## Rep 1

```jsx
<Tag label="React" id="tag-react" onClick={() => console.log('tag')} />
```

Renders a `<span>` with class `tag` and the text `React` inside it. Clicking it logs.

---

## Rep 2

```jsx
<SearchBox buttonText="Go" placeholder="Search..." name="q" />
```

Renders a `<div>` with class `search`, containing an `<input>` and a `<button>` that says `Go`. The
`<div>` carries no extra attributes.

---

## Rep 3

```jsx
<Alert kind="error" id="payment-alert" role="alert">
  Payment failed.
</Alert>
```

Renders a `<div>` with class `alert alert-error`. For `kind="success"` it would be
`alert alert-success`. The text between the tags shows inside it.

---

## Rep 4

```jsx
<LinkButton primary href="/signup" target="_blank">Sign up</LinkButton>
<LinkButton href="/login">Log in</LinkButton>
```

Renders an `<a>`. Class is `btn btn-primary` when `primary` is set, just `btn` when it isn't.
`primary` must not appear on the `<a>` in devtools.

---

## After all four

Count how many you wrote correctly **first try, without running it to find out**. Then:

1. In which reps was something under **FIXED**? Did you ever write a fixed value as a prop?
2. In which rep did the spread go on an element *other* than the one the component returns?

---

## Solutions

Check after each rep, not at the end.

<details>
<summary><strong>Rep 1</strong></summary>

```jsx
// MINE:     label
// FIXED:    "tag"
// PASS ON:  id, onClick → the <span>

function Tag({ label, ...props }) {
  return (
    <span className="tag" {...props}>
      {label}
    </span>
  );
}
```

`label` is text, so it's placed between the tags. `"tag"` is written straight in — nobody passes it.

</details>

<details>
<summary><strong>Rep 2</strong></summary>

```jsx
// MINE:     buttonText
// FIXED:    "search"
// PASS ON:  placeholder, name → the <input>, not the <div>

function SearchBox({ buttonText, ...inputProps }) {
  return (
    <div className="search">
      <input {...inputProps} />
      <button>{buttonText}</button>
    </div>
  );
}
```

Same shape as Exercise 6: the spread lands on the element the props belong to, which isn't the one
the component returns.

</details>

<details>
<summary><strong>Rep 3</strong></summary>

```jsx
// MINE:     kind, children
// FIXED:    "alert"
// PASS ON:  id, role → the <div>

function Alert({ kind, children, ...props }) {
  return (
    <div className={`alert alert-${kind}`} {...props}>
      {children}
    </div>
  );
}
```

One template literal, backticks only — no quotes inside, no `+`. Only `${kind}` is code.

</details>

<details>
<summary><strong>Rep 4</strong></summary>

```jsx
// MINE:     primary, children
// FIXED:    "btn"
// PASS ON:  href, target → the <a>

function LinkButton({ primary, children, ...props }) {
  const classes = primary ? 'btn btn-primary' : 'btn';

  return (
    <a className={classes} {...props}>
      {children}
    </a>
  );
}
```

Class worked out above the `return`, one `<a>` below it. `primary` is named, so it never reaches the
DOM.

</details>
