# React Styling — overview

Udemy lectures 106–125 + Coding Exercises 17–19. Explanations only: practice happens in real projects.

## The one idea underneath all of it

React doesn't have a styling system. It only gives you two attributes to hang styles on:

- `className` — **a string**. Every approach except inline styles ends up producing this string.
- `style` — **an object**.

Every approach in this unit is a different way to produce that string or that object.
Conditional styling is therefore the same thing you did in Conditional Content: **pick a value
with plain JavaScript** (a ternary, an `if` above the `return`), then put it in the attribute.

## The folders

| # | Folder | What it produces | Scoped to the component? |
|---|--------|------------------|--------------------------|
| 0 | Vanilla CSS | a class name **you** write in a `.css` file | ❌ global |
| 1 | Inline Styles | a `style` **object** | ✅ only that one element |
| 2 | Dynamic CSS Classes | a class string built with JS | depends on the CSS behind it |
| 3 | CSS Modules | a class name **generated** from your `.module.css` file | ✅ |
| 4 | Styled Components | a **component** with the CSS built in | ✅ |
| 5 | Tailwind CSS | many small ready-made class names | ✅ (nothing custom to clash) |

## Which one when

- **Small project, you know CSS:** vanilla CSS, maybe CSS Modules for safety.
- **One value that changes at runtime** (a width from state, a color the user picked): inline style.
- **Whole design system as components** (`<Button>`, `<Input>`) in a JS-heavy codebase: Styled Components.
- **You want to style without leaving the JSX:** Tailwind.

None is "the right one". Teams pick one and stick to it. You'll see all of them in real codebases.
