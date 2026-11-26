# Vanilla CSS (lectures 106–109)

## The one idea

You write normal CSS in a `.css` file and import it into a component file:

```jsx
import './Header.css';

export default function Header() {
  return <h1 className="title">My app</h1>;
}
```

`import './Header.css'` has **no name on the left** — nothing comes back to use. The build tool
(Vite) just injects that CSS into the page's `<head>`. From then on it is ordinary CSS for the
**whole page**.

`className`, not `class`: JSX is JavaScript, and `class` is a reserved word there.

## Splitting CSS across files (107)

You can put `Header.css` next to `Header.jsx` and `index.css` for global things (body, fonts).
This is **organization only**. It tells *you* the styles belong to the header. It does not tell
the browser anything.

## NOT scoped to components (109) — the important lecture

```css
/* Header.css */
p { color: red; }
```

Imported in `Header.jsx`, this rule turns **every `<p>` in the app** red, including paragraphs in
components that never imported `Header.css`. Same for class names: if `Header.css` and
`Footer.css` both define `.title`, they collide and the one loaded later wins where they conflict.

Why: once imported, all CSS lands in one global stylesheet. The file it came from is forgotten.

## Pros & cons (108)

| Pros | Cons |
|------|------|
| Plain CSS, nothing new to learn | Global — clashes between components |
| CSS and JSX kept separate | You must know CSS |
| Whoever writes CSS doesn't need to touch JSX | Keeping class names unique is your job |

The cons are what the next approaches fix.

## Check yourself

1. `Card.jsx` imports `Card.css`, which has `button { background: blue; }`. `App.jsx` never
   imports `Card.css`. What color are the buttons in `App`, and why?
2. Why `className` and not `class`?

<details><summary>Answers</summary>

1. Blue (once `Card` is anywhere in the app, so the import runs). Imported CSS is global — it
   applies to every matching element on the page, not just `Card`'s.
2. JSX compiles to JavaScript, where `class` is a reserved keyword.

</details>
