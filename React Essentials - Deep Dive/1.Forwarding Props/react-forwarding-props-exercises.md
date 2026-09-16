# Forwarding Props — Six Exercises

Unscaffolded, like the Fragments set: you get the situation and the requirement, and you write
the component yourself. No starter blocks with `TODO` gaps to fill in — the gap-filling format
flattered you during Dynamic lists and you said so yourself.

Exercise 1 is plain JavaScript with no React in it at all. Do not skip it. Every other exercise
in this file is that one mechanic wearing a JSX costume.

## Read this first

### `richText` was made up

Nothing in React or HTML knows what `richText` means. The person who wrote the Udemy exercise
invented the name. It could have been `fancy`, `bigMode`, `useTextarea`.

That matters, because there are now **two kinds of prop** arriving at your component:

| Kind | Example | What must happen to it |
| --- | --- | --- |
| Invented by you, for your component to read | `richText`, `rounded`, `title` | **Consumed.** Your component reads it and stops it there. |
| Real HTML attributes meant for the element inside | `type`, `placeholder`, `disabled`, `id` | **Forwarded.** Passed straight through to the element. |

Forward an invented one to a real DOM element by mistake and the browser gets an attribute it
has never heard of. React warns in the console.

### Rest in object destructuring (plain JS)

You already know destructuring:

```js
const { name, age } = person;
```

`...` on the **left**, in a destructuring pattern, means *"everything I didn't name, gathered
into a new object"*:

```js
const person = { name: 'Amar', age: 30, city: 'Sjenica', job: 'dev' };
const { name, ...rest } = person;

name   // 'Amar'
rest   // { age: 30, city: 'Sjenica', job: 'dev' }   ← name is NOT in here
```

**`name` is pulled out.** It is in `name` and it is *not* in `rest`. That is the entire trick,
and it happens in the parameter list before a single line of your function body runs.

### Spread in a JSX attribute list

`...` on the **right**, in a value position, means *"unpack this object here"*:

```js
const props = { type: 'text', placeholder: 'Your name' };
```

```jsx
<input {...props} />        // identical to  <input type="text" placeholder="Your name" />
```

Same three dots, opposite jobs: **gather** on the left, **unpack** on the right.

### The boolean shorthand

```jsx
<button disabled>Send</button>
<Input richText />
```

An attribute written with no `=` is shorthand for `={true}`. `disabled` is `true`. `richText` is
`true`. This is why `<Input richText />` and `<Input richText={true} />` are the same call.

### The problem this unit exists to solve (lecture 65)

```jsx
function Button({ children }) {
  return <button className="btn">{children}</button>;
}

<Button type="submit" disabled>Send</Button>
```

`type` and `disabled` arrive at `Button`. They go **nowhere near** the `<button>` inside it,
because you never passed them on. Props do not fall through a component to the elements it
renders. Nothing is automatic. That is the bug, and forwarding is the fix.

---

## Exercise 1 — No React at all

Plain JavaScript. Write it in a file, or the browser console, and `console.log` each answer.

```js
const config = {
  id: 'btn-1',
  variant: 'primary',
  type: 'submit',
  disabled: true,
};

const {variant, ...rest} = config;
const {id, variant : variable, ... rest2} = config;
const withSize = {size:'large', ...config};
const overridden = {...config, disabled:false}
```

**Build:**

1. Pull `variant` out of `config` into its own variable, and gather everything else into `rest`.
   Log both. Confirm `variant` is not in `rest`.
2. Pull out `id` **and** `variant` in one destructuring, gather the remainder into `rest`. Log
   `rest`.
3. Build a new object `withSize` that has everything in `config` plus `size: 'large'`.
4. Build a new object `overridden` that has everything in `config` but with `disabled: false`.
   Then build it again with the two parts in the opposite order. Log both.

**Then answer (two parts):**

**Part 1:** In step 4, only one of your two orderings actually produced `disabled: false`. Which
one, and what rule decides it?

**Part 2:** In step 1, is `config` itself changed by the destructuring? How would you check
rather than guess?

### My answer

**Part 1:** `{...config, disabled: false}` is the one that works — the override has to come
**after** the spread. A spread only collides when the **same key exists on both sides**, and then
the later one wins. That's why the ordering got away with it in step 3: `size` isn't a key in
`config`, so there was nothing to overwrite. `disabled` is, so order decides it.

**Part 2:** No — `config` is unchanged. Destructuring only **reads**; it never removes keys from
the source. Checked rather than guessed: log `config` after the destructuring — all four keys are
still there, and `rest2` is a separate new object holding only what wasn't named.

**Also learned here:** the two names in `{ variant, ...rest }` are not the same kind of thing.
`variant` must spell an actual key — it's how the value is looked up, so `varianttt` gives
`undefined` and leaves `variant` sitting in the rest object. `rest` is just a bucket, so its name
is free. To keep the key but change the variable name: `{ variant: variant2, ...rest2 }`.

---

## Exercise 2 — Make the props arrive

A component that exists in every codebase: a styled button wrapper.

```jsx
function Button({ children, ...props }) {
  return <button className="btn" {...props}>{children}</button>;
}
 export default function App(){
   return(
      <>
        <Button type="submit" disabled>Send</Button>
        <Button type="button" onClick={() => console.log('hi')}>Log</Button>
      </>
   )
 }
```

Used like this, in `App`:

```jsx
<Button type="submit" disabled>Send</Button>
<Button type="button" onClick={() => console.log('hi')}>Log</Button>
```

**Build:** change `Button` so every prop the caller sets actually reaches the `<button>`, while
`className="btn"` stays.

**Check it:** the first button must render greyed out and unclickable; the second must log when
clicked. If both are clickable, nothing is being forwarded.

**Then answer:** before your fix, what did `props` contain inside `Button`, and where did those
values go?

### My answer

**What `props` contained:** nothing — there was no `props` variable before the fix. React always
hands a component **one object holding every prop**, so `Button` received
`{ children, type, disabled }`. The old parameter list `{ children }` named a single key and
ignored the rest.

**Where the values went:** nowhere. They arrived fine; they were simply never read, so they were
dropped. Props don't fall through to the elements a component renders — forwarding them is
something you do, not something React does.

---

## Exercise 3 — Consume one, forward the rest

```jsx

function Avatar({rounded, ...rest}){

  if (rounded) {
    return <img className="avatar avatar-round" {...rest} />;
  }

  return <img className="avatar" {...rest} />;
}

export default function App(){
return(
  <>
  <Avatar rounded src="https://i.pravatar.cc/80" alt="Tara" width="80" />
  <Avatar src="https://i.pravatar.cc/80" alt="Amar" width="80" />
  </>
)
}

```

**Build:** an `Avatar` component that renders an `<img>`.

- When `rounded` is set, the image gets `className="avatar avatar-round"`.
- When it isn't, it gets `className="avatar"`.
- `src`, `alt`, `width` — and anything else the caller adds later — must reach the `<img>`.
- `rounded` must **not** reach the `<img>`.

**Check it:** open the browser devtools, inspect the first image, and read its attributes. If you
see `rounded` sitting on the `<img>`, or a React warning in the console, your destructuring is
wrong.

**Then answer (two parts):**

**Part 1:** Which single character in your parameter list is what stops `rounded` reaching the DOM?

**Part 2:** You wrote `<Avatar rounded ... />` with no `=`. What value does `rounded` hold inside
the component, and what would `rounded="false"` do instead? Be careful with the second one.

### My answer

**Part 1 — what stops `rounded` reaching the DOM:** **naming it in the destructuring.** Once
`rounded` is named in `{ rounded, ...rest }` it is pulled out of the rest bucket, and only the
bucket gets spread onto the `<img>`.

It is *not* the `if`, and it is *not* the fact that the prop was invented. Proof — write the same
component without destructuring:

```jsx
function Avatar(props)   // props = { rounded, src, alt, width }  ← rounded still in there
```

Spread that and `rounded` lands on the `<img>`, and React warns about an unknown attribute. Being
invented is *why* it has to be stopped; destructuring is *what* stops it.

**Part 2 — what `rounded` holds:** `true`. An attribute written with no `=` is shorthand for
`={true}`.

`rounded="false"` would **not** turn it off. Quotes make it the **string** `"false"`, and a
non-empty string is truthy, so `if (rounded)` passes and the image comes out rounded — the
opposite of what was intended. The only way to pass a real `false` is `rounded={false}`.

General rule: **in JSX, quotes mean string, braces mean JavaScript value.** `width="80"` is the
string `"80"`, not the number.

---

## Exercise 4 — The collision

```jsx
function Card({className, ...props}) {
  return <div className={`card ${className}`} {...props}></div>;
}

export default function App() {
  return (
    <Card className="highlighted">
      <p>Standard card</p>
    </Card>
  );
}

```

`Card` renders a `<div>` that must **always** carry the class `card`, and must **also** carry
whatever `className` the caller passes — here, both `card` and `highlighted`.

**Build it, but first do this:** write the naive version — `<div className="card" {...props}>` —
and look at the rendered `<div>` in devtools. Then swap the two so the spread comes first. Look
again.

**Then fix it properly** so both classes survive, whatever the order.

**Then answer (two parts):**

**Part 1:** What did each of the two naive orderings produce, and why? Name the rule.

**Part 2:** Your working version pulls `className` out of props by name. What happens to a `Card`
that's used with no `className` at all — what does the `<div>` end up with, exactly? Check it,
don't assume.

### My answer

**Part 1 — the two naive orderings.** Both need the plain `props` parameter; with
`{ className, ...props }` there's nothing left in `props` to collide with, so both look identical.

- `<div className="card" {...props}>` → `class="highlighted"`. The spread comes last and overwrites.
- `<div {...props} className="card">` → `class="card"`. The literal comes last and overwrites.

The rule is the one from Exercise 1 step 4: **last one wins.** So ordering can't fix this — either
way one class is destroyed. The fix is to pull `className` out by name so the two can't collide,
then join them yourself:

```jsx
function Card({ className, ...props }) {
  return <div className={`card ${className}`} {...props}></div>;
}
```

**Part 2 — a `<Card>` with no className:** the div comes out as `class="card undefined"`. The prop
is `undefined`, and a template literal turns whatever it's given into **text**, so the word
`undefined` is printed straight into the class string — a real CSS class named `undefined`.

Two fixes: `` `card ${className || ''}` ``, or a default in the parameter list —
`{ className = '', ...props }`. The second is **Default Prop Values**, which the course covers
later; this exercise runs into the problem it exists to solve.

---

## Exercise 5 — Three categories at once

```jsx
<Section title="Billing" id="billing" data-testid="billing-section">
  <p>Your next invoice is on 1 October.</p>
  <p>Card ending 4471.</p>
</Section>
```

**Build:** a `Section` component that renders a `<section>` containing an `<h2>` with the title,
followed by whatever was passed between the tags.

Every prop above falls into exactly one of three categories. Work out which is which **before**
you write the parameter list:

- consumed by `Section` and never forwarded
- the content between the tags
- forwarded untouched to the `<section>` element

**Check it:** the rendered `<section>` must carry `id` and `data-testid`. It must **not** carry
`title`, and the word "Billing" must appear once, not twice.

**Then answer:** `children` arrives in the props object like everything else. What goes wrong if
you *don't* name it in the destructuring and just spread everything onto the `<section>`? Predict
first, then try it.

### My answer

---

## Exercise 6 — Two levels deep

```jsx
<Field label="Email" type="email" placeholder="you@example.com" required />
```

**Build:** a `Field` component that renders

```
<div class="field">
  <label>Email</label>
  <input ... />
</div>
```

The catch: `Field` renders a `<div>`, but `type`, `placeholder` and `required` belong to the
`<input>` — two levels down, not on the thing `Field` returns.

**Check it:** the `<div class="field">` must have no `type` or `placeholder` on it. The `<input>`
must have all three.

**Then answer (two parts):**

**Part 1:** In Exercise 2 the forwarded props went onto the element `Button` returned. Here they
go onto an element *inside* what `Field` returns. What decides where a spread lands — is it
React, or is it you?

**Part 2:** `label` and `placeholder` are both "text shown to the user". One is consumed and one
is forwarded. Why?

### My answer

---

## When you're done

1. Which exercises did you get right first try, without running the code to find out? That's the
   number worth writing down, not how many eventually worked.
2. Where did you stall longest? If any single exercise took more than fifteen minutes, write down
   the sentence describing what you were stuck on — that sentence decides whether this unit needs
   a reps file on top.
3. Go back to your own `forwarding-props.jsx`. You can now answer the question you couldn't at
   the start: which two characters take `richText` out of what you spread, and what would appear
   in the browser's console if they weren't there?

---

## Solutions

Check after each exercise, not at the end — these build on each other, and a wrong answer left
uncorrected poisons the next one.

<details>
<summary><strong>Exercise 1</strong></summary>

```js
const config = { id: 'btn-1', variant: 'primary', type: 'submit', disabled: true };

// 1
const { variant, ...rest } = config;
console.log(variant); // 'primary'
console.log(rest);    // { id: 'btn-1', type: 'submit', disabled: true }

// 2
const { id, variant: v, ...rest2 } = config;
console.log(rest2);   // { type: 'submit', disabled: true }

// 3
const withSize = { ...config, size: 'large' };

// 4
const overridden = { ...config, disabled: false };  // disabled: false  ✓
const wrongWay   = { disabled: false, ...config };  // disabled: true   ✗
```

**Part 1:** `{ ...config, disabled: false }` wins. **Later keys overwrite earlier ones.** In the
second ordering, `...config` unpacks *after* `disabled: false` and its own `disabled: true`
lands on top. This is the same rule that Exercise 4 is built on.

**Part 2:** No — destructuring only reads. `console.log(config)` after the destructuring shows
all four keys still there. Checking beats guessing: log the original object afterwards.

</details>

<details>
<summary><strong>Exercise 2</strong></summary>

```jsx
function Button({ children, ...props }) {
  return (
    <button className="btn" {...props}>
      {children}
    </button>
  );
}
```

**Answer:** before the fix, `props` inside `Button` held `{ children, type, disabled }` — the
values *arrived* perfectly well. They went nowhere: the function simply never used them, so they
were dropped on the floor. Nothing about a prop makes it fall through to the elements a component
renders. `children` is named here because it's used as content, not as an attribute.

</details>

<details>
<summary><strong>Exercise 3</strong></summary>

```jsx
function Avatar({ rounded, ...props }) {
  const classes = rounded ? 'avatar avatar-round' : 'avatar';

  return <img className={classes} {...props} />;
}
```

**Part 1:** the `.` — well, the three of them. `...props` in the parameter list gathers
*everything not already named*, and `rounded` is already named, so it is excluded by definition.

**Part 2:** `rounded` holds `true`. `rounded="false"` would hold the **string** `"false"`, which
is truthy — the image would come out rounded. That's the classic trap: only `rounded={false}`
gives you an actual `false`.

</details>

<details>
<summary><strong>Exercise 4</strong></summary>

```jsx
function Card({ className, children, ...props }) {
  const classes = 'card ' + (className || '');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
```

**Part 1:** `<div className="card" {...props}>` produced `class="highlighted"` — the spread came
later and overwrote. Reversed, `<div {...props} className="card">` produced `class="card"` — now
the literal came later and overwrote. Same rule as Exercise 1 step 4: **last one wins.** The fix
isn't ordering, it's pulling `className` out by name so it can't collide, then combining the two
yourself.

**Part 2:** with no `className` passed, `className` is `undefined`, so `'card ' + (className || '')`
gives `"card "` — with a trailing space. Harmless in HTML, but you should have *seen* that rather
than assumed it was clean.

</details>

<details>
<summary><strong>Exercise 5</strong></summary>

```jsx
function Section({ title, children, ...props }) {
  return (
    <section {...props}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

**Answer:** `children` is a prop like any other, so leaving it in `props` spreads it onto the
`<section>` as an attribute — React treats `children` passed that way as the element's content,
so your two `<p>` tags render, but you've lost control of where they sit relative to the `<h2>`,
and anything you *did* put between the tags in JSX gets overwritten. Name it, use it explicitly.

`title` is consumed (it's yours, and `title` on a real element means a tooltip — forwarding it
would put a hover tooltip on the section). `id` and `data-testid` are forwarded.

</details>

<details>
<summary><strong>Exercise 6</strong></summary>

```jsx
function Field({ label, ...props }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input {...props} />
    </div>
  );
}
```

**Part 1:** you decide. A spread is just an attribute list on whichever element you type it on —
React has no notion of "the component's props go on the outermost element". `{...props}` on the
`<div>` would put `placeholder` on a `<div>`, which is meaningless. The wrapper element and the
element the props belong to are frequently not the same element.

**Part 2:** `label` is invented by you — no HTML element reads a `label` attribute, and the text
has to be placed inside a `<label>` element by your code. `placeholder` is a real `<input>`
attribute the browser already understands, so it just needs delivering.

</details>
