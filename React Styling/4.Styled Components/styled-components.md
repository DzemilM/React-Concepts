# Styled Components (lectures 114–118)

A third-party package: `npm install styled-components` (in StackBlitz: add it to the
dependencies in `package.json`, or it'll offer to install when you import it).

## The one idea (114)

You don't write class names at all. You create a **component** that has its CSS built in:

```jsx
import { styled } from 'styled-components';

const ControlContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export default function AuthInputs() {
  return <ControlContainer>...</ControlContainer>;
}
```

- `styled.div` → "make a component that renders a `<div>`". There's `styled.button`,
  `styled.input`, `styled.p` — one per HTML element.
- The backticks right after it are a **tagged template**: a function called with a template
  literal. Inside is real CSS (kebab-case, not the camelCase of inline styles).
- What you get back is a **component** (a function), so the variable needs a **capital letter**
  — Rule 3: `<ControlContainer>` means "look inside this variable", and inside is a component.

Under the hood it generates a unique class name, injects the CSS for it into the page, and puts
that class on the `<div>`. So it's scoped, like CSS Modules.

## It forwards props (115)

A styled component passes every prop you give it on to the element it renders — `children`,
`type`, `onChange`, `value`, `className`. Like `{...rest}` from Forwarding Props, done for you:

```jsx
const Input = styled.input`padding: 0.75rem 1rem;`;

<Input type="email" value={email} onChange={handleChange} />
// renders <input class="sc-abc xyz" type="email" value=... >
```

## Dynamic & conditional styling (116)

Put a **function** inside `${ }` in the template. Styled Components calls it with the props:

```jsx
const Label = styled.label`
  color: ${({ $invalid }) => ($invalid ? '#f87171' : '#6b7280')};
`;

<Label $invalid={emailNotValid}>Email</Label>
```

Why the `$` on `$invalid`? Because the component forwards all props to the DOM (above), and
`invalid` would end up as an unknown attribute on `<label>` with a React warning. A
`$`-prefixed prop is a **transient prop**: the styles can read it, the DOM never gets it. Same
decision as Forwarding Props — "used by me, not passed on" — just made with a `$` instead of
naming it in the destructuring.

## Pseudo selectors, nesting, media queries (117)

`&` means "this component's own generated class":

```jsx
const Button = styled.button`
  background-color: #f0b322;

  &:hover {
    background-color: #f0920e;
  }

  & img {            /* any <img> inside this button */
    width: 2rem;
  }

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;
```

Everything inline styles couldn't do works here, because this is a real stylesheet.

## Reusable components & combinations (118)

Move styled components into their own files and export them, like any component:

```jsx
// components/Button.jsx
import { styled } from 'styled-components';
const Button = styled.button`...`;
export default Button;
```

And combine them inside normal components when a piece of UI is more than one element:

```jsx
// components/Input.jsx
const Label = styled.label`color: ${({ $invalid }) => ($invalid ? '#f87171' : '#6b7280')};`;
const StyledInput = styled.input`...`;

export default function Input({ label, invalid, ...props }) {
  return (
    <p>
      <Label $invalid={invalid}>{label}</Label>
      <StyledInput $invalid={invalid} {...props} />
    </p>
  );
}
```

Look at the decisions: `label` and `invalid` are **named** (used by me), `...props` is **passed
on** to the input. Exactly the Forwarding Props pattern. The outside world uses plain
`invalid`; only the styled pieces inside need the `$`.

## Pros & cons

| Pros | Cons |
|------|------|
| Scoped, no class names to invent | You must know CSS |
| Styles sit next to the component | No separation of React and CSS code |
| Dynamic styling from props is easy | Many small components; extra package |

## Check yourself

1. Why must `const container = styled.div\`...\`` be renamed `Container`?
2. You pass `invalid={true}` (no `$`) to a `styled.input`. What happens?
3. What does `&` stand for in `&:hover`?

<details><summary>Answers</summary>

1. `styled.div` returns a component. Lowercase `<container>` is treated as a literal HTML tag
   name; a capital makes React look inside the variable.
2. The styles can still read it, but it's also forwarded to the real `<input>` as an attribute,
   and React warns about a non-boolean/unknown attribute. `$invalid` stops it reaching the DOM.
3. The class name Styled Components generated for this component.

</details>
