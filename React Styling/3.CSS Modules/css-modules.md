# CSS Modules (lecture 113)

## The one idea

Same CSS you already write, but the **build tool renames every class to something unique**, so
classes from different files can't clash.

Two changes from vanilla CSS:

1. File name ends in `.module.css`: `Header.module.css`.
2. Import it **with a name**:

```jsx
import classes from './Header.module.css';

export default function Header() {
  return <p className={classes.paragraph}>Hello</p>;
}
```

```css
/* Header.module.css */
.paragraph { color: purple; }
```

## What `classes` actually is

A plain object. Keys are the class names you wrote; values are the generated names:

```js
console.log(classes);
// { paragraph: '_paragraph_1a2b3_1' }
```

So `classes.paragraph` is just a string — and `className` wants a string. The CSS in the page
was rewritten to `._paragraph_1a2b3_1 { color: purple; }`. Another file's `.paragraph` gets a
different suffix, so the two never meet.

(This is the "object vs. field" check: `classes` is the object, `classes.paragraph` is the
field you want.)

Class names with a dash aren't valid after a dot, so use brackets: `classes['nav-link']`.

## Dynamic classes

Same patterns as the previous folder, using the field instead of a hard-coded string:

```jsx
<label className={emailNotValid ? classes.invalid : undefined}>Email</label>
<p className={`${classes.paragraph} ${active ? classes.active : ''}`}>...</p>
```

## The catch: only *classes* get scoped

```css
/* Header.module.css */
p { color: red; }   /* still global! hits every <p> in the app */
```

Element selectors (`p`, `button`) aren't renamed — there's no name to rename. Put element
styles behind a class.

## Setup

Vite (and so StackBlitz's Vite/React template) supports CSS Modules out of the box. The
`.module.css` ending is the switch.

## Pros & cons

| Pros | Cons |
|------|------|
| Scoped — no clashes | Many small CSS files |
| Still plain CSS (hover, media queries all work) | Dynamic classes still need string building |
| Nothing to install | You must know CSS |

## Check yourself

1. What does `classes.title` contain, and where did that value come from?
2. You write `className={classes}`. What happens?
3. Is `h2 { margin: 0 }` in a `.module.css` file scoped?

<details><summary>Answers</summary>

1. A generated string like `'_title_x9f2_3'`. The build tool renamed `.title` in the CSS and
   gave you an object mapping the original name to the new one.
2. `classes` is the whole object, not a string — React writes `class="[object Object]"`, no
   styles match.
3. No. Only class names are renamed; an element selector stays global.

</details>
