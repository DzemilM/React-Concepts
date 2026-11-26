# Inline styles (lectures 110–111, Coding Exercise 17)

## The one idea

`style` takes a **JavaScript object**, not a CSS string.

```jsx
<p style={{ color: 'red', textAlign: 'left' }}>Hello</p>
```

The double braces are not special syntax:

- outer `{ }` — "a JavaScript value goes here" (the JSX boundary, like `{name}`)
- inner `{ }` — the object literal itself

Same thing, written in two steps:

```jsx
const pStyle = { color: 'red', textAlign: 'left' };   // compute above the return
return <p style={pStyle}>Hello</p>;                     // display inside it
```

## Rules of the object

- Property names are **camelCase**: `background-color` → `backgroundColor`, `text-align` →
  `textAlign`. (Or quote them: `'background-color'` — works, nobody does it.)
- Values are **strings**: `'red'`, `'1rem'`, `'1px solid black'`.
- A plain **number** is read as pixels for size properties: `{ width: 200 }` → `200px`.
  Unitless properties stay unitless: `{ opacity: 0.5 }`, `{ zIndex: 2 }`.

## Dynamic & conditional (111)

Since it's an object, any value can be computed:

```jsx
<input
  style={{
    backgroundColor: emailNotValid ? '#fed2d2' : '#d1d5db',
  }}
/>
```

```jsx
<div style={{ width: `${progress}%` }} />   // progress from state
```

This is where inline styles are actually the best tool: a value that's only known at runtime
(a width from a slider, a color from data).

## Pros & cons

| Pros | Cons |
|------|------|
| Scoped — affects only this one element | You style every element separately |
| Easy dynamic values | No `:hover`, no `@media`, no `::before` |
| No CSS file to manage | No separation of CSS and JSX; JSX gets noisy |

## Check yourself

1. Why does `style="color: red"` fail in React?
2. Write the object for the CSS `font-size: 2rem; margin-top: 10px;`.
3. Why can't you make a hover effect with inline styles?

<details><summary>Answers</summary>

1. `style` expects an object, not a string.
2. `{ fontSize: '2rem', marginTop: 10 }` (or `marginTop: '10px'`).
3. Inline styles are set on the element itself. `:hover` is a selector, and selectors only exist
   in stylesheets.

</details>
