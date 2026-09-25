# Creating Flexible Components — Four Reps

Not an exercise set. **Reps.** Four combined components, each written from a blank file.

## Why these exist

Both exercise sets are done. The concepts came out clean in code — dynamic tags, string vs function,
slots and defaults all worked by the end of set 2, and Exercises 3, 4 and 5 were right first try
unaided.

What didn't work was **assembly**. Set 2's Exercises 6 and 7 failed four times, and not one failure
was conceptual:

| What happened | What kind of mistake |
| --- | --- |
| `className = 'tile'` — the caller's prop given the fixed class as its default | two categories merged into one variable |
| `classes` and `...rest` both built, neither put on the element | computed a value, didn't attach it |
| `renderIcon` deleted, `{renderIcon}` left in the JSX | edited one part, didn't re-read what depended on it |
| `WarnIcon` declared inside `Notice` | scope |

That's holding eight to eleven requirements in your head without dropping one. More explanation
doesn't fix it; doing the same shape four times does.

Each rep below is about the size of `Tile`. Ten minutes each. Four attempts at the shape rather than
one.

## Rules

1. **Blank file every time.** Don't copy the previous rep and edit it.
2. **Write the four category lines first.** Not optional — every failure in set 2's Exercise 6 was a
   category error, and the lines were skipped three times running.
   ```js
   // MINE:     props this component reads and consumes — never on the DOM
   // FIXED:    values that are the same every time — not props at all
   // PASS ON:  forwarded — onto WHICH element?
   // SLOTS:    values placed as JSX, or used as a tag
   ```
3. **Tick off the numbered requirements one at a time** against the finished component before you
   call it done. Out loud, against the numbers.
4. **Then read your opening tag.** Every variable you computed above the `return` — is it actually
   on the element? This is the one that bit three times.
5. **Run it and inspect the DOM.** Class counts are given for each rep. Count them in devtools.

## The shape, once

Every rep here is the same five moves. Recognising that is the point.

```js
// 1. destructure: rename the tag prop, default the ones that need defaults,
//    name every prop you consume, gather the rest
// 2. start the class string with the fixed class + the one built from a prop
// 3. add a class per independent condition
// 4. add the caller's className last
// 5. return: the tag, className, the spread, then the slots in order
```

---

## Rep 1 — `Chip`

```jsx
function Chip({
  as: Tag = 'span',
  className,
  tone = 'neutral',
  removable,
  Icon,
  children,
  ...rest
}) {
  let classes = `chip chip-${tone}`;
  if (removable) {classes += ' chip-removable';}
  if (Icon) {classes += ' chip-with-icon';}
  if (className) {classes += ` ${className}`;}

  return (
    <Tag className={classes} {...rest}>
      {Icon && (<span className="chip-icon"><Icon /></span>)}
      {children}
    </Tag>
  );
}

function StarIcon({ children }) {
  return <span>Starrr</span>;
}

export default function App() {
  return (
    <>
      <Chip>Default</Chip>
      <Chip tone="success">Paid</Chip>
      <Chip tone="danger" removable>Overdue</Chip>
      <Chip Icon={StarIcon} tone="info" className="pinned" id="c1">
        Starred
      </Chip>
      <Chip as="a" href="/tags/react">React</Chip>
    </>
  );
}
```

1. Outer tag from `as`, defaulting to `span`.
2. Always the class `chip`.
3. Plus `chip-${tone}`, with `tone` defaulting to `neutral`.
4. Plus `chip-removable` when `removable` is set.
5. Plus `chip-with-icon` when `Icon` is passed.
6. The caller's `className` is **added**, not replacing.
7. When `Icon` is passed it renders first, inside `<span className="chip-icon">`. When it isn't,
   that span must **not** exist in the DOM.
8. Then the children.
9. `id`, `href` and other standard props reach the outer element.
10. `as`, `tone`, `removable`, `Icon`, `className` must not appear as attributes.

**Check it:** the fourth chip has **four** class names. The first has **two**. The fifth is an `<a>`.

### My answer

```js
// MINE:     as, tone, removable, Icon, className
// FIXED:    "chip", "chip-icon"
// PASS ON:  id, href… → the outer element, via ...rest
// SLOTS:    Icon (used as a tag), children (placed as content)
```

**What tripped me up on the lines:** I put `children` under PASS ON. It isn't forwarded — it's a
**slot** I place myself between the tags. Left in `...rest` it rides along in the spread and the
element ends up with content from two sources, which is the bug from set 1's Exercise 5.

`"chip-icon"` is FIXED even though it only appears when there's an icon. **FIXED isn't about whether
it always renders — it's about whether the value ever comes from the caller.** It's that exact
string every time it appears. Conditional *appearance* and variable *value* are different things.

**On props appearing on two lines:** `as` and `Icon` are both MINE *and* SLOTS, and that's correct.
The lines answer two different questions — **MINE vs PASS ON** is *does this reach the DOM?*, and
**SLOTS** is *how do I place it in the output?*

---

## Rep 2 — `Field`

```jsx

function Field({ className, required, label, as : Input="input", hint, ...rest }){
  let classes = "field";
  if(required){classes += " field-required"};
  if(className){classes += ` ${className}`};

  return(
    <div className={classes}>
      <label>{label}</label>
      <Input required={required} {...rest} />
      {hint}
    </div>
  )
}
export default function App(){
  return(
    <>
      <Field label="Email" name="email" />
      <Field label="Password" name="pw" type="password" required />
      <Field label="Bio" as="textarea" name="bio" rows={4} />
      <Field label="Age" name="age" hint={<small>Must be 18+</small>} className="wide" />
    </>
  )
}
```

1. Renders a `<div>` with the class `field`, **always**.
2. Plus `field-required` when `required` is set.
3. Plus the caller's `className`, added.
4. Inside the div: a `<label>` holding `label`, then the input element, then the `hint` slot.
5. The input element's tag comes from `as`, defaulting to `input`.
6. `name`, `type`, `rows` — and anything else standard — reach the **input element**, not the
   `<div>`.
7. When `hint` isn't passed, nothing extra appears.
8. `label`, `as`, `hint`, `className` must not appear on any element.

**Check it:** the third field's input is a `<textarea>` with `rows="4"`. The `<div class="field">`
must carry no `name`, `type` or `rows`.

**This one is different on purpose:** the forwarded props go on an element *inside* what the
component returns, not on the outer one. Same as Forwarding Props Exercise 6. Note that `required`
is consumed for the class **and** is a real input attribute — decide what you want and say which in
your category lines.

### My answer

```js
// MINE:     label, as, hint, className
// FIXED:    "field"
// PASS ON:  name, type, rows… → the <Input>, not the <div>
// SLOTS:    hint (content), and `as` used as a tag
// BOTH:     required — read for the class AND forwarded to the input
```

**`required` does two jobs.** `Field` reads it to add `field-required` to the div's class — that's
MINE. It's also a real `<input>` attribute the browser acts on — that's PASS ON. Naming it in the
destructuring took it out of `...rest`, so the only way to have both was to put it back by hand:
`required={required}`.

The general rule: **naming a prop removes it from the spread.** Usually that's the point — it's how
`label` and `as` stay off the DOM. When a prop is both mine *and* the element's, I pay for it by
re-attaching it myself.

**What tripped me up:** I wrote `<label label={label}>` — the text as an **attribute** instead of
between the tags. That's set 1's Exercise 2 again (`<aside sidebar={Sidebar}>`), and it also broke
requirement 8, since `label` is MINE and must not appear on any element. I also nested the input and
hint *inside* the `<label>` instead of making them siblings.

Then, forwarding `required`, I wrote `<div className={classes} {required}>` — a bare `{...}` in an
attribute list can only be a **spread**, so that's a syntax error. An attribute is **name, equals,
value**, which `className={classes}` right beside it was already showing. And it was on the wrong
element: `required` is an attribute of the input, not the div.

---

## Rep 3 — `Panel`

```jsx
function Panel({ as : Tag="div", className, tone="plain", collapsed, header, footer, children, ...rest }){
  let classes=`panel panel-${tone}`;
  if(collapsed){classes += " panel-collapsed"};
  if(className){classes += ` ${className}`};

  return(
    <Tag className={classes} {...rest}>
     {header && <div className="panel-header">{header}</div>}
     <div className="panel-body">{children}</div>
     {footer && <div className="panel-footer">{footer}</div>}
    </Tag>
  )
}

export default function App(){
  return(
    <>
      <Panel>Just a body.</Panel>

      <Panel
        as="section"
        header={<h2>Settings</h2>}
        footer={<button>Save</button>}
        tone="warning"
        collapsed
        className="narrow"
        id="settings"
      >
        Body text.
      </Panel>
    </>
  )
}

```

1. Outer tag from `as`, defaulting to `div`.
2. Always the class `panel`.
3. Plus `panel-${tone}`, `tone` defaulting to `plain`.
4. Plus `panel-collapsed` when `collapsed` is set.
5. Plus the caller's `className`.
6. When `header` is passed, it renders first inside `<div className="panel-header">`. When it
   isn't, that div must **not** exist.
7. Then the children, always, inside `<div className="panel-body">`.
8. When `footer` is passed, it renders last inside `<div className="panel-footer">`. When it isn't,
   that div must **not** exist.
9. `id` and other standard props reach the outer element.
10. `as`, `tone`, `collapsed`, `header`, `footer`, `className` must not appear as attributes.

**Check it:** the first panel is a `<div class="panel panel-plain">` containing **exactly one**
child — the body div. The second is a `<section>` with **four** class names and three children.

**Two slots this time**, both content, both optional. Set 2 only ever made one thing optional at a
time.

### My answer

```js
// MINE:     as, tone, collapsed, className
// FIXED:    "panel", "panel-header", "panel-body", "panel-footer"
// PASS ON:  id… → the outer element, via ...rest
// SLOTS:    header, footer, children — all three placed as content
```

Nothing is used as a tag here except `as` itself. All three slots hold finished JSX, so all three go
between tags in braces.

The two optional wrappers are conditional **as a whole** — `{header && <div …>{header}</div>}`, not
`<div>{header && header}</div>`. Wrapping only the contents would leave an empty `panel-header` div
in the DOM on every panel without a header: invisible on screen, wrong in the document.

**What tripped me up:** I made the body conditional too. Requirement 7 says the children render
**always**. It looked fine because both my panels had children — a `<Panel />` with nothing between
the tags would have come out with no body div at all.

The habit behind it: I found a pattern that worked for the first slot and applied it to the other
two without re-reading which requirement each one answers. That's the tick-off step in rule 3, and
skipping it is what this file exists to fix.

---

## Rep 4 — `MenuItem`

```jsx
function MenuItem({ 
 as : Tag="button",
 className, 
 tone="default", 
 disabled, 
 Icon, 
 Badge, 
 shortcut,
 children, 
 ...rest 
 }){

  let classes = `menu-item menu-item-${tone}`;
  const isButtonDisabled = Tag === 'button' && disabled;
  if(disabled){classes += " menu-item-disabled"};
  if(className){classes += ` ${className}`};

  return(
    <Tag className={classes} disabled={isButtonDisabled} {...rest}>
     {Icon && <span className="menu-icon"><Icon /></span>}
     {children}
     {Badge && <span className="menu-badge"><Badge /></span>}
     {shortcut && <span className="menu-shortcut">{shortcut}</span>}
    </Tag>
  )
}

function HomeIcon(){return(<span>Homeee</span>)};
function TrashIcon(){return(<span>Trashh</span>)};
function NewBadge(){return(<span>Badgee</span>)}

export default function App(){
  return(
    <>
      <MenuItem>Plain</MenuItem>
      <MenuItem Icon={HomeIcon} shortcut="⌘H">Home</MenuItem>
      <MenuItem Icon={TrashIcon} tone="danger" disabled>Delete</MenuItem>
      <MenuItem as="a" href="/help" Badge={NewBadge} className="promoted">Help</MenuItem>
    </>
  )
}
```

1. Outer tag from `as`, defaulting to `button`.
2. Always the class `menu-item`.
3. Plus `menu-item-${tone}`, `tone` defaulting to `default`.
4. Plus `menu-item-disabled` when `disabled` is set.
5. Plus the caller's `className`.
6. `Icon` renders first inside `<span className="menu-icon">` when passed, and that span must not
   exist otherwise.
7. Then the children.
8. Then `Badge` — **another component prop** — inside `<span className="menu-badge">`, absent when
   not passed.
9. Then `shortcut`, a plain string, inside `<span className="menu-shortcut">`, absent when not
   passed.
10. `href` and other standard props reach the outer element.
11. `disabled` must **also** reach the outer element when it's a `<button>`, because it's a real
    button attribute — decide how, and say why in your category lines.
12. `as`, `tone`, `Icon`, `Badge`, `shortcut`, `className` must not appear as attributes.

**Check it:** the third item has **three** class names and is disabled. The fourth is an `<a>` with
three class names, and holds a `menu-badge` span but no `menu-shortcut`.

**Two component props at once** (`Icon`, `Badge`) and one string slot (`shortcut`), so the
"placed as content vs used as a tag" decision has to be made three times in one component.
Requirement 11 is the interesting one: a prop that is **both** MINE and PASS ON.

### My answer

```js
// MINE:     as, tone, Icon, Badge, shortcut, className
// FIXED:    "menu-item", "menu-icon", "menu-badge", "menu-shortcut"
// PASS ON:  href… → the outer element, via ...rest
// SLOTS:    Icon and Badge (used as tags), shortcut and children (placed as content)
// BOTH:     disabled — read for the class, and forwarded only when the tag is a <button>
```

**Requirement 11, my decision:** `const isButtonDisabled = Tag === 'button' && disabled`, then
`disabled={isButtonDisabled}`. `disabled` is a real `<button>` attribute but means nothing on an
`<a>`, so it's forwarded only when the element is actually a button.

**Three slots, two treatments, decided by what the value is:** `Icon` and `Badge` hold
**functions**, so they're used as tags — `<Icon />`, `<Badge />`. `shortcut` holds a **string**, so
it's placed as content — `{shortcut}`. Each wrapper span is conditional as a whole.

**What tripped me up:**

1. I wrote `{Icon}` — a function placed as content. React can't render a function; nothing
   appeared. The question to ask: *finished element, or the function that makes one?*
2. `Badge` was named in the destructuring and never rendered. Same named-and-unused slip as
   `className` in set 1 and `required` in Rep 2.
3. I moved the `menu-icon` and `menu-badge` wrapper spans **into** the icon components — the same
   move as Rep 1's `StarIcon`. Those classes are FIXED values owned by `MenuItem`; the icons should
   render only themselves.

---

## After all four

1. How many did you write correctly **first try, without running it to find out**?
2. In which reps did you forget to put something on the element that you'd computed above the
   `return`? If the answer is zero, the habit has formed.
3. Rep 2 and Rep 4 each had a prop that didn't fit neatly in one category. Name them and say what
   you did.
4. Write the five-move shape from memory, without looking at the top of this file.

Then the three statements that failed twice in set 2 — say them cold:

5. `children` and a named slot like `footer`: what is the only difference, and where does it live?
6. `function Button({ mode = 'filled' })` — when does `'filled'` actually get used? And name two
   values a caller could pass that would **not** make it kick in.
7. Ternary or build-up — what's the test?

### My answers

**1. First try, without running: 0 of 4 strictly.** Rep 3 came closest — one requirement misread,
nothing else.

**2. The attaching habit has formed.** Across all four reps, `classes` and `...rest` never got left
off the tag — in set 2 that happened three times. What still slips is **named props going unused**:
`required` in Rep 2, `Badge` in Rep 4.

**3.** `required` (Rep 2) and `disabled` (Rep 4). Both are read to build a class **and** are real
HTML attributes, so after naming them in the destructuring I had to put them back on the element by
hand.

**4.** The five moves — which I hadn't actually read at the top of the file:
1. destructure: rename the tag prop, defaults, name every consumed prop, gather the rest
2. start the class string with the fixed class plus the one built from a prop
3. add a class per independent condition
4. add the caller's `className` last
5. return: tag, `className`, spread, then the slots in order

**5.** *(third attempt, finally)* `footer` is written like any normal prop — as an **attribute inside
the opening tag**, holding JSX instead of a string. `children` is whatever sits **between the opening
and closing tags**. Inside the component they're both just props.

I kept answering "children holds anything, footer holds specific stuff." Wrong — both can hold
anything. The difference is **where you write it**, not **what it holds**.

**6.** `'filled'` gets used only when `mode` isn't passed at all — `undefined`. Passing `null`, `''`,
`0` or `false` doesn't trigger it; those are values that exist. *(The original wording, "when does a
destructuring default fire", was jargon and I didn't recognise the question — reworded above.)*

**7. ✅** Ternary when I need **one outcome among alternatives**. Build up when independent
conditions **add onto** each other. It's about kind, not count.

---

## Solutions

Check after each rep, not at the end.

<details>
<summary><strong>Rep 1 — Chip</strong></summary>

```jsx
// MINE:     as, tone, removable, Icon, className
// FIXED:    "chip", "chip-icon"
// PASS ON:  id, href… → the outer element
// SLOTS:    Icon (used as a tag), children

function StarIcon() {
  return <span>★</span>;
}

function Chip({
  as: Tag = 'span',
  tone = 'neutral',
  removable,
  Icon,
  className,
  children,
  ...props
}) {
  let classes = `chip chip-${tone}`;

  if (removable) {
    classes += ' chip-removable';
  }

  if (Icon) {
    classes += ' chip-with-icon';
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <Tag className={classes} {...props}>
      {Icon && (
        <span className="chip-icon">
          <Icon />
        </span>
      )}
      {children}
    </Tag>
  );
}
```

Fourth chip: `chip chip-info chip-with-icon pinned` — four. First: `chip chip-neutral` — two.

The `&&` wraps the **whole** span. Wrapping only `<Icon />` leaves an empty `chip-icon` span in the
DOM on every chip without an icon.

</details>

<details>
<summary><strong>Rep 2 — Field</strong></summary>

```jsx
// MINE:     label, as, hint, className
// FIXED:    "field"
// PASS ON:  name, type, rows… → the INPUT element, not the <div>
// SLOTS:    hint (content), and `as` used as a tag
// BOTH:     required — consumed for the class AND forwarded as a real input attribute

function Field({
  label,
  as: Input = 'input',
  hint,
  required,
  className,
  ...props
}) {
  let classes = 'field';

  if (required) {
    classes += ' field-required';
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <div className={classes}>
      <label>{label}</label>
      <Input required={required} {...props} />
      {hint}
    </div>
  );
}
```

`required` is the interesting one. Naming it in the destructuring takes it out of `props`, so if you
want it on the input you have to put it back explicitly — `required={required}`. Leaving it *out* of
the destructuring would forward it automatically but then you couldn't use it for the class. Either
is defensible; the category lines are where you say which you chose.

The spread goes on the `<Input>`, not the `<div>`. Same decision as Forwarding Props Exercise 6.

</details>

<details>
<summary><strong>Rep 3 — Panel</strong></summary>

```jsx
// MINE:     as, tone, collapsed, className
// FIXED:    "panel", "panel-header", "panel-body", "panel-footer"
// PASS ON:  id… → the outer element
// SLOTS:    header, footer, children — all content

function Panel({
  as: Tag = 'div',
  tone = 'plain',
  collapsed,
  header,
  footer,
  className,
  children,
  ...props
}) {
  let classes = `panel panel-${tone}`;

  if (collapsed) {
    classes += ' panel-collapsed';
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <Tag className={classes} {...props}>
      {header && <div className="panel-header">{header}</div>}
      <div className="panel-body">{children}</div>
      {footer && <div className="panel-footer">{footer}</div>}
    </Tag>
  );
}
```

First panel: `<div class="panel panel-plain">` with one child. Second: `<section>` with
`panel panel-warning panel-collapsed narrow` — four — and three children.

The body div is **not** conditional; the other two are. Deciding which wrappers are optional before
typing is the whole rep.

</details>

<details>
<summary><strong>Rep 4 — MenuItem</strong></summary>

```jsx
// MINE:     as, tone, Icon, Badge, shortcut, className
// FIXED:    "menu-item", "menu-icon", "menu-badge", "menu-shortcut"
// PASS ON:  href… → the outer element
// SLOTS:    Icon and Badge (used as tags), shortcut (content), children
// BOTH:     disabled — consumed for the class AND a real <button> attribute

function MenuItem({
  as: Tag = 'button',
  tone = 'default',
  Icon,
  Badge,
  shortcut,
  disabled,
  className,
  children,
  ...props
}) {
  let classes = `menu-item menu-item-${tone}`;

  if (disabled) {
    classes += ' menu-item-disabled';
  }

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <Tag className={classes} disabled={disabled} {...props}>
      {Icon && (
        <span className="menu-icon">
          <Icon />
        </span>
      )}
      {children}
      {Badge && (
        <span className="menu-badge">
          <Badge />
        </span>
      )}
      {shortcut && <span className="menu-shortcut">{shortcut}</span>}
    </Tag>
  );
}
```

Third item: `menu-item menu-item-danger menu-item-disabled` — three. Fourth: `menu-item
menu-item-default promoted` — three — an `<a>`, with a badge span and no shortcut span.

`Icon` and `Badge` are both **functions**, so both are used as tags. `shortcut` is a **string**, so
it's placed as content. Three slots, two different treatments, decided by what the value *is*.

`disabled={disabled}` on an `<a>` is harmless — React drops attributes that don't apply. If you'd
rather be strict, that's a condition, not a requirement of this rep.

</details>
