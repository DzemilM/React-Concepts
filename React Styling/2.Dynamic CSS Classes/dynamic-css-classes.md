# Dynamic & conditional CSS classes (lecture 112, Coding Exercise 18)

## The one idea

`className` is **a string**. Conditional styling = building that string with JavaScript.
The CSS lives in a `.css` file as usual; JS only decides **which class names** are in the string.

```css
/* Auth.css */
label.invalid { color: #f87171; }
input.invalid { background-color: #fed2d2; }
```

## Pattern 1 — the class is either there or not

```jsx
<input className={emailNotValid ? 'invalid' : undefined} />
```

`undefined` → React leaves the attribute off. (An empty string `''` also works — you get
`class=""`.)

## Pattern 2 — a fixed class plus a conditional one

```jsx
<label className={`label ${emailNotValid ? 'invalid' : ''}`}>Email</label>
```

`label` is always there; `invalid` is added when needed. The template literal joins them with a
space. This is the **accumulate** case from Creating Flexible Components: build the string up.

For three or more pieces, build it above the `return`:

```jsx
let classes = 'btn';
if (primary) classes += ' btn-primary';
if (disabled) classes += ' btn-disabled';
return <button className={classes}>Go</button>;
```

Mind the **leading space** in `' btn-primary'` — without it you get `btnbtn-primary`.

## The trap: `&&` inside the template literal

```jsx
className={`label ${emailNotValid && 'invalid'}`}
```

When `emailNotValid` is `false`, `&&` returns `false` (it returns an operand, never a boolean
— the rule from Conditional Content), and a template literal prints it as text:
`class="label false"`. Use a ternary with `''` inside template literals.

## Still global

This is still vanilla CSS. `.invalid` here clashes with any other `.invalid` in the app. Making
the class *dynamic* doesn't make it *scoped*. That's what CSS Modules fix (next folder).

## Check yourself

1. `invalid` is `false`. What's the rendered class of `` className={`field ${invalid && 'error'}`} ``?
2. `active` is `true`. What's wrong with `let c = 'tab'; if (active) c += 'tab-active';`?

<details><summary>Answers</summary>

1. `"field false"`. `&&` returned `false`, and the template literal turned it into the text "false".
2. No leading space: the result is `'tabtab-active'`, one class name that matches nothing.

</details>
