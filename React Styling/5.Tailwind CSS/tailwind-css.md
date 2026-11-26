# Tailwind CSS (lectures 119–125, Coding Exercise 19)

## The one idea (119)

You don't write CSS. Tailwind ships thousands of tiny classes that each do **one thing**, and
you combine them in `className`:

```jsx
<header className="flex flex-col items-center mt-8 mb-16">
  <h1 className="text-xl font-semibold tracking-widest text-center uppercase text-amber-800">
    ReactArt
  </h1>
</header>
```

`flex` = `display: flex`. `mt-8` = `margin-top: 2rem`. `text-amber-800` = a specific brown.
Spacing numbers are a scale (`4` = `1rem`), not pixels.

Tailwind **scans your files** for these class names and only puts the ones you used into the
final CSS.

## Setup (120–121) — v3 vs v4

The course was recorded with v3; current installs give v4. With Vite (v4):

```bash
npm install tailwindcss @tailwindcss/vite
```

```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ plugins: [react(), tailwindcss()] });
```

```css
/* index.css */
@import "tailwindcss";
```

v3 instead had a `tailwind.config.js` and three `@tailwind base; @tailwind components;
@tailwind utilities;` lines. Customizing (your own font, colors) is in that config file in v3
and in an `@theme { }` block in your CSS in v4. Don't mix the two setups.

Values not in the scale: square brackets — `w-[350px]`, `bg-[#1d1d1d]`.

## Media queries & pseudo selectors (122)

A **prefix** with a colon:

```jsx
<h1 className="text-xl md:text-4xl hover:text-amber-500">...</h1>
```

- `hover:text-amber-500` — only on hover. Also `focus:`, `disabled:`, `first:`...
- `md:text-4xl` — from the `md` breakpoint (768px) **and up**. Tailwind is **mobile-first**:
  the unprefixed class is the small-screen style, prefixes override it on bigger screens. So
  `md:` doesn't mean "only on medium".

## Dynamic & conditional styling (123)

Nothing new — it's still a `className` string. Build it like in folder 2:

```jsx
let labelClasses = 'block mb-2 text-xs font-bold tracking-wide uppercase';
if (invalid) {
  labelClasses += ' text-red-400';
} else {
  labelClasses += ' text-stone-300';
}
return <label className={labelClasses}>{label}</label>;
```

Note this is an *alternative* (red **or** stone), so both branches add a color — don't put the
default color in the base string and then add red on top: two color classes on one element,
and which wins depends on the order in Tailwind's CSS, not in your string.

**The Tailwind-specific trap:** never assemble a class name out of pieces.

```jsx
className={`text-${color}-400`}   // ❌ Tailwind never sees "text-red-400" in your code
className={color === 'red' ? 'text-red-400' : 'text-stone-300'}   // ✅ full names
```

Tailwind finds classes by reading your source as text. A class that only exists at runtime
isn't in the CSS.

## Migrating the demo app (124)

Delete the custom CSS, replace each class with Tailwind utilities, and where a styled component
had props (`$invalid`), turn it back into a normal component that builds a class string.

## Pros & cons (125)

| Pros | Cons |
|------|------|
| No CSS to write, no class names to invent | Long `className` strings |
| Styles right in the JSX | Style changes mean editing JSX |
| No clashes; consistent spacing/colors | You learn Tailwind's names, not plain CSS |
| Highly customizable | Still need CSS knowledge to know *what* you want |

## Check yourself

1. `className="p-2 md:p-8"`. Padding on a phone? On a laptop?
2. Why does `` `bg-${status}-500` `` style nothing, even when `status` is `'green'`?
3. How do you make an input red only when `invalid` is true?

<details><summary>Answers</summary>

1. Phone: `p-2` (0.5rem). Laptop (≥768px): `p-8` (2rem). Mobile-first — unprefixed is the base.
2. Tailwind generates CSS only for class names it finds written out in the source. `bg-green-500`
   never appears as text, so its CSS doesn't exist.
3. Build the string: e.g. `` className={`border ${invalid ? 'border-red-500' : 'border-stone-300'}`} ``.

</details>
