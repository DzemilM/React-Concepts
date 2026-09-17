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
function Tag({label, ...passed}){
  return(
    <span className="tag" {...passed}>{label}</span>
  )
}

export default function App(){
  return(
    <Tag label="React" id="tag-react" onClick={() => console.log('tag')} />
  )
}

```

Renders a `<span>` with class `tag` and the text `React` inside it. Clicking it logs.

### My answer

```js
// MINE:     label
// FIXED:    "tag"
// PASS ON:  id, onClick → the <span>
```

`label` is text the user sees, so it goes **between** the tags as `{label}`, not as an attribute.
`"tag"` never appears where `<Tag>` is used, so it's fixed. Anything written on that line comes from
the caller, including `onClick`.

---

## Rep 2

```jsx
function SearchBox({ buttonText, ...other }) {
  return (
    <div className="search">
      <input {...other} />
      <button>{buttonText}</button>
    </div>
  );
}

export default function App() {
  return <SearchBox buttonText="Go" placeholder="Search..." name="q" />;
}

```

Renders a `<div>` with class `search`, containing an `<input>` and a `<button>` that says `Go`. The
`<div>` carries no extra attributes.

### My answer

```js
// MINE:     buttonText
// FIXED:    "search"
// PASS ON:  placeholder, name → the <input>, not the <div>
```

The spread goes on the element the props belong to. `placeholder` and `name` are form-field
attributes, so they go on the `<input>`, even though the component returns the `<div>`.

---

## Rep 3

```jsx
function Alert({kind, children, ...other}){
  return(
    <div className={`alert alert-${kind}`} {...other} >
    {children}
    </div>
  )
}

export default function App(){
  return(
    <Alert kind="error" id="payment-alert" role="alert">
      Payment failed.
    </Alert>
  )
}

```

Renders a `<div>` with class `alert alert-error`. For `kind="success"` it would be
`alert alert-success`. The text between the tags shows inside it.

### My answer

```js
// MINE:     kind, children
// FIXED:    "alert"
// PASS ON:  id, role → the <div>
```

A MINE prop gets **used**, not put back on the element. `kind` only builds the class name; writing
`kind={kind}` on the div would put an attribute the browser doesn't understand into the DOM.
`children` needs naming even when it seems to work without it — unnamed, it only survives by
accident inside the spread. The rest bucket `...other` must come **last** in the parameter list.

---

## Rep 4

```jsx
function LinkButton({ primary, children, ...other }) {
  const myClass = primary ? 'btn btn-primary' : 'btn';

  return (
    <a className={myClass} {...other}>
      {children}
    </a>
  );
}

export default function App() {
  return (
    <>
      <LinkButton primary href="/signup" target="_blank">
        Sign up
      </LinkButton>
      <LinkButton href="/login">Log in</LinkButton>
    </>
  );
}

```

Renders an `<a>`. Class is `btn btn-primary` when `primary` is set, just `btn` when it isn't.
`primary` must not appear on the `<a>` in devtools.

### My answer

```js
// MINE:     primary, children
// FIXED:    "btn"
// PASS ON:  href, target → the <a>
```

The class is worked out **above** the `return` with a ternary, and only the variable goes in the
braces. Tried first: `${if (primary) 'btn-primary'}` — doesn't compile, because `${}` and JSX
braces take a **value**, and `if` is a statement. A ternary is a value; an `if` belongs above the
`return`. `children` named and placed, not left to ride along in the spread.

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
