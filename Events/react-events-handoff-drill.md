# Events — Hand-off Drill (single pattern)

One task. One pattern: **a child sends its own value up to a handler the parent owns.** This is
the thing that's not reflexive yet. Do it cold, in one shot, no asking first.

**The rule for this pattern (say it before you write):**
- The **child** owns the button → on click it **wraps** to inject its own value:
  `onClick={() => onSomething(myValue)}`
- The **parent** owns the behaviour → it defines one handler and **passes it down bare**:
  `onSomething={handleIt}`
- The handler **receives the value as its own parameter** — it must NOT reach for the child's
  prop name, which doesn't exist in the parent's scope.

---

## Task — ColorPicker

Build **two** components.

1. `Swatch` — takes a `color` prop (a string like `"red"`) and an `onPick` prop (a function).
   It renders a button showing the color name, and when clicked, calls `onPick` **with its own
   color**. `Swatch` contains **no `console.log`** — it knows nothing about what picking does.

2. `ColorPicker` — renders four `Swatch`es: `"red"`, `"green"`, `"blue"`, `"yellow"`. It defines
   what happens on pick: logging `Picked: <color>`. It passes that behaviour down to each
   `Swatch`.

`App` renders one `ColorPicker`.

**My attempt:**

```jsx
function Swatch({color, onPick}){
  return(
    <button onClick={()=>onPick(color)}>{color}</button>
  )}

function ColorPicker(){
  function picked(name){console.log(`Picked: ${name}`)}

  return(
    <div>
    <Swatch color="red" onPick={picked} />
    <Swatch color="green" onPick={picked} />
    <Swatch color="blue" onPick={picked} />
    <Swatch color="yellow" onPick={picked} />
    </div>
  )}

  export default function App(){
    return(
    <ColorPicker />)
  }
```

---

**No help until you have a complete attempt.** Before you run it, self-check against these four —
they're the exact things you slipped on last time:

1. Does `Swatch`'s `onClick` **wrap** (`() => onPick(color)`), or did you accidentally *call*
   (`onPick(color)`) or pass bare (`onPick`)?
2. Did you pass the string `color` — not an object `{color}`?
3. Does `ColorPicker` pass `onPick` **bare** to each Swatch (not `() => ...`, not `handleX()`)?
4. Does the parent's handler log its **own parameter's name**, not `color`? (`color` doesn't
   exist in `ColorPicker`.)

And the two you keep forgetting anywhere:
5. Does **every** component have a `return`?
6. Do the four `<Swatch>`es sit inside **one wrapper** (`<div>`)?

## After

- Did it run correctly on the **first** time you pressed play? Yes/no — be honest.
- If no: which of the six checks did you miss? That's the specific rep you still need.
- If yes, first try, clean: the hand-off is reflexive. Events is ready for the written exam.

---

<details>
<summary>Solution — open only after your attempt runs (or you're truly stuck after a real try)</summary>

```jsx
function Swatch({ color, onPick }) {
  return <button onClick={() => onPick(color)}>{color}</button>;
}

function ColorPicker() {
  function handlePick(name) {
    console.log('Picked: ' + name);
  }

  return (
    <div>
      <Swatch color="red" onPick={handlePick} />
      <Swatch color="green" onPick={handlePick} />
      <Swatch color="blue" onPick={handlePick} />
      <Swatch color="yellow" onPick={handlePick} />
    </div>
  );
}

export default function App() {
  return (
    <div id="app">
      <h1>Color Picker</h1>
      <ColorPicker />
    </div>
  );
}
```

The relay:
- `Swatch` **wraps** — `() => onPick(color)` — injecting its own color, waiting for the click.
- `ColorPicker` passes `handlePick` **bare** — the Swatch is the one that calls it, with the color.
- `handlePick(name)` logs `name` — the color that rode up. Not `color`; that lives only inside
  `Swatch`.

`onPick` is an invented prop — rename it to `onFoo` on both sides and nothing breaks. If you did
the four Swatches with a `.map()` over `['red','green','blue','yellow']` (each with a `key`),
that's cleaner still and fully correct.

</details>