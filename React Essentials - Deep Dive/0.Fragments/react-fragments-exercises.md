# React Fragments — Three Exercises

Small concept, so three exercises. Less scaffolding than past units: you get the data and the
requirement, and you write the component yourself. Solutions are collapsed at the bottom.

## Read this first

### Why a component can only return one thing

You already know **JSX is a value**. Under the hood, every tag is a function call:

```jsx
<h1>Hi</h1>   // becomes roughly  createElement('h1', null, 'Hi')
```

So this:

```jsx
return (
  <h1>Summary</h1>
  <p>{text}</p>
);
```

is like writing `return createElement(...) createElement(...)`: two values with nothing joining
them. A function returns **one** value. That's a syntax error, not a React rule.

The old fix was wrapping everything in a `<div>`. That works, but it puts a real, extra element into
the DOM. A **Fragment** gives you the one wrapper JavaScript needs **without adding anything to the
DOM**.

### Two ways to write it

```jsx
<>...</>                        // short form. Nothing to import.

import { Fragment } from 'react';
<Fragment>...</Fragment>        // long form. Same result.
```

They render exactly the same. The one difference: **the short form can't take any attributes at
all.** The long form can take one: `key`. Keep that in mind for Exercise 3.

### When the extra `<div>` actually breaks things

Most of the time a wrapper `<div>` is just clutter. Some parents only allow certain children,
though:

- `<tr>` may only contain `<td>` / `<th>`
- `<ul>` / `<ol>` may only contain `<li>`
- `<dl>` may only contain `<dt>` / `<dd>`

Put a `<div>` in between and you get invalid HTML. React warns about it in the console, and the
browser may even move your elements somewhere else. That's where Fragments stop being tidiness and
become necessary.

---

## Exercise 1 — Two siblings, no wrapper

```js
const ARTICLE = {
  title: 'Why Fragments Exist',
  author: 'Ada',
};

function Heading({title, author}){
  return(
    <>
     <h1>{title}</h1>
     <p>By {author}</p>
    </>
  )
  }

  export default function App(){
    return(
      <article>
       <Heading title={ARTICLE.title} author={ARTICLE.author} />
      </article>
    )
  }
```

**Build:**

- A `Heading` component that receives `title` and `author` as props and returns an `<h1>` (the
  title) and a `<p>` that reads `by Ada`. They are **siblings**, with no wrapper element.
- An `App` that renders `<article>` with `<Heading />` inside it.

**Check it:** open DevTools → Elements. `<h1>` and `<p>` should be **direct children** of
`<article>`, with nothing in between.

**Then answer (two parts):** delete the `<>` and `</>` and save. What happens, **and** why can't
JavaScript accept it?

### My answer

**What happens:** a **syntax error**, something like *"Adjacent JSX elements must be wrapped in an
enclosing tag."* It happens at the build step, **before React runs anything**, so the whole app
fails to show up, not even the `<article>`. The page doesn't render with something wrong in it; it
doesn't render at all.

**Why JavaScript can't accept it:**

1. Each JSX tag compiles to a function call (`<h1>` becomes roughly `createElement('h1', ...)`),
   and a function call produces **one value**.
2. Two tags side by side are therefore **two values with nothing joining them**.
3. `return` can only hand back **one** value, so two unjoined values are not valid JavaScript.

**What the Fragment does:** it wraps the two tags so JavaScript sees a **single value**, and it
does this **without adding any element to the DOM**. DevTools proves it: `<h1>` and `<p>` sit
directly inside `<article>` with nothing in between.

> Watch the wording: a Fragment is a **wrapper**, not a *parent element*. A `<div>` is a parent
> element because it shows up in the DOM. A Fragment never does.

---

## Exercise 2 — Break it first, then fix it

```js
const PERSON = { name: 'Grace', role: 'Engineer', city: 'New York' };
```

**Build:**

- A `Cells` component that receives `person` and returns **three `<td>`s**: name, role, city.
- An `App` that renders:

  ```
  <table>
    <tbody>
      <tr>
        ← Cells goes here
      </tr>
    </tbody>
  </table>
  ```

**Step 1:** write `Cells` with a `<div>` as the wrapper. Run it and open the **browser console**
(not the StackBlitz preview). Copy the warning React gives you.

**Step 2:** fix it so the three `<td>`s sit directly inside `<tr>`.

**Then answer:** in one sentence, what was actually wrong with the `<div>` version? "It's
unnecessary" is not the answer.

---

## Exercise 3 — Fragments inside a `.map()`

```js
const GLOSSARY = [
  { id: 'g1', term: 'Prop', definition: 'Data passed from parent to child.' },
  { id: 'g2', term: 'State', definition: 'Data a component remembers between renders.' },
  { id: 'g3', term: 'Key', definition: "An item's identity inside a list." },
];
```

**Build:** an `App` that renders one `<dl>`. For **each** glossary entry, the `<dl>` gets a `<dt>`
(the term) followed by a `<dd>` (the definition). The finished DOM should look like:

```html
<dl>
  <dt>Prop</dt>
  <dd>Data passed from parent to child.</dd>
  <dt>State</dt>
  <dd>...</dd>
  ...
</dl>
```

No `<div>` around each pair, since `<dl>` doesn't allow one. The console must be **free of the key
warning**.

Before you type anything, write these three lines as comments:

```
// ARRAY:   what am I looping over?
// RESULT:  how many elements does ONE callback call need to return?
// KEY:     which element does the key go on?
```

<details>
<summary>Hint — only open after a real attempt stalls</summary>

The key goes on whatever the callback **returns**, which is the same rule as in Dynamic Lists. So
what does the callback return here, and can that thing take attributes in the form you used?

</details>

**Then answer (two parts):** why does `<>` fail here, **and** what does the `key` end up attached
to in the real DOM?

---

## Solutions

<details>
<summary>Exercise 1</summary>

```jsx
const ARTICLE = {
  title: 'Why Fragments Exist',
  author: 'Ada',
};

function Heading({ title, author }) {
  return (
    <>
      <h1>{title}</h1>
      <p>by {author}</p>
    </>
  );
}

function App() {
  return (
    <article>
      <Heading title={ARTICLE.title} author={ARTICLE.author} />
    </article>
  );
}

export default App;
```

**Answer:** you get a syntax error at build time, something like *"Adjacent JSX elements must be
wrapped in an enclosing tag."* **Why:** each JSX tag is a function call that produces one value,
and `return` can only hand back one value. Two values side by side aren't a single expression.

</details>

<details>
<summary>Exercise 2</summary>

```jsx
const PERSON = { name: 'Grace', role: 'Engineer', city: 'New York' };

function Cells({ person }) {
  return (
    <>
      <td>{person.name}</td>
      <td>{person.role}</td>
      <td>{person.city}</td>
    </>
  );
}

function App() {
  return (
    <table>
      <tbody>
        <tr>
          <Cells person={PERSON} />
        </tr>
      </tbody>
    </table>
  );
}

export default App;
```

**Step 1 warning:** something like *"In HTML, `<div>` cannot be a child of `<tr>`"* (older
versions: *"validateDOMNesting: `<div>` cannot appear as a child of `<tr>`"*).

**Answer:** the `<div>` produced **invalid HTML**, because `<tr>` may only contain `<td>`/`<th>`.
The Fragment fixes it because it adds no element to the DOM at all.

</details>

<details>
<summary>Exercise 3</summary>

```jsx
import { Fragment } from 'react';

const GLOSSARY = [
  { id: 'g1', term: 'Prop', definition: 'Data passed from parent to child.' },
  { id: 'g2', term: 'State', definition: 'Data a component remembers between renders.' },
  { id: 'g3', term: 'Key', definition: "An item's identity inside a list." },
];

function App() {
  return (
    <dl>
      {GLOSSARY.map((entry) => (
        <Fragment key={entry.id}>
          <dt>{entry.term}</dt>
          <dd>{entry.definition}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

export default App;
```

**Plan lines:**
```
// ARRAY:   GLOSSARY
// RESULT:  two elements, so they need one wrapper, and it can't be a <div>
// KEY:     on the Fragment, because that's what the callback returns
```

**Answer:** `<>` can't take any attributes, so there's nowhere to put `key`. The long form
`<Fragment>` is the only fragment that accepts one. **In the DOM:** nothing. The Fragment
doesn't exist in the DOM, and `key` isn't a prop either. React uses it to match the pair between
renders, then throws it away. `<dt>` and `<dd>` land directly inside `<dl>`.

</details>
