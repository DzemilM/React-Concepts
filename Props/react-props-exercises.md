# React Props — Practice Exercises

Six exercises that gradually increase in difficulty, in the same style as the Udemy "Working with Props" task. Each one has a goal, starter code, and a solution at the bottom (try not to peek!).

---

## Exercise 1: UserCard (basics)

**Goal:** Make the `UserCard` component reusable. It should accept a `name` and a `job` prop and render them inside the `<h2>` and `<p>` tags. The `App` component must render **at least three** `UserCard`s, and one of them **must** have the name `"Ada Lovelace"` and the job `"Programmer"`.

```jsx
export function UserCard(props) {
  return (
    <div className="card">
      <h2>{props.name}</h2>
      <p>{props.job}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Our Team</h1>
      <UserCard name="Ada Lovelace" job="Programmer" />
      <UserCard name="Grace Hopper" job="Computer Scientist" />
      <UserCard name="Alan Turing" job="Mathematician" />
    </div>
  );
}

export default App;
```

---

## Exercise 2: PriceTag (non-string props)

**Goal:** Create a `PriceTag` component that accepts a `product` (string), a `price` (number), and an `inStock` (boolean) prop.

- Render the product name in an `<h3>`.
- Render the price formatted as `$X.XX` (hint: `price.toFixed(2)`).
- If `inStock` is `false`, render the text `"Sold out"` instead of the price.

The `App` component should render one in-stock product and one sold-out product. Remember: numbers and booleans must be passed with curly braces, e.g. `price={9.99}`.

```jsx

export function PriceTag(props) {
  return (
    <div>
      <h3>{props.product}</h3>
      <p>{props.inStock ? `$${props.price.toFixed(2)}` : "Sold out"}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Shop</h1>
      <PriceTag product="Coffee Mug" price={12.5} inStock={true} />
      <PriceTag product="Notebook" price={4.99} inStock={false} />
    </div>
  );
}

export default App;
```

---

## Exercise 3: Alert (destructuring + default values)

**Goal:** Build an `Alert` component that accepts a `message` and a `type` prop. Use **object destructuring in the function parameter** instead of `props.xxx`, and give `type` a **default value** of `"info"`.

- The `type` should be applied as the element's `className`.
- `App` should render three alerts: one `"error"`, one `"warning"`, and one with **no type prop at all** (which should fall back to `"info"`).

```jsx
export function Alert({ message, type = "info" }) {
  return <div className={type}>{message}</div>;
}

function App() {
  return (
    <div id="app">
      <Alert message="Something went wrong!" type="error" />
      <Alert message="Disk space is low." type="warning" />
      <Alert message="All systems normal." />
    </div>
  );
}

export default App;
```

---

## Exercise 4: Profile (spread operator + prop forwarding)

**Goal:** You have a data array. Render one `Profile` component per entry **without writing each prop manually** — use the spread operator (`{...user}`).

- `Profile` should accept `username`, `age`, and `hobby` and render them.
- Bonus: render the list with `.map()` instead of writing three separate JSX tags (don't forget the `key` prop!).

```jsx
const USERS = [
  { username: "max", age: 31, hobby: "Chess" },
  { username: "sara", age: 27, hobby: "Climbing" },
  { username: "kim", age: 35, hobby: "Painting" },
];

export function Profile({ username, age, hobby }) {
  return (
    <div className="profile">
      <h2>{username}</h2>
      <p>Age: {age}</p>
      <p>Hobby: {hobby}</p>
    </div>
  );
}

function App() {
  return (
    <div id="app">
      <h1>Profiles</h1>
      {USERS.map((user) => (
        <Profile key={user.username} {...user} />
      ))}
    </div>
  );
}

export default App;
```

---

## Exercise 5: Button (children prop)

**Goal:** Create a `FancyButton` component that uses the special **`children`** prop, so it can be used like this:

```jsx
<FancyButton mode="filled">Click me!</FancyButton>
<FancyButton mode="outline">Cancel</FancyButton>
```

- Whatever is placed between the opening and closing tags should appear inside the rendered `<button>`.
- The `mode` prop should be used as the button's `className`.
- `App` must render at least one `"filled"` and one `"outline"` button with different labels.

```jsx
export function FancyButton({ mode, children }) {
  return <button className={mode}>{children}</button>;
}

function App() {
  return (
    <div id="app">
      <FancyButton mode="filled">Click me!</FancyButton>
      <FancyButton mode="outline">Cancel</FancyButton>
    </div>
  );
}

export default App;
```

---

## Exercise 6: RecipeCard (nested / object props — challenge)

**Goal:** Build a `RecipeCard` that accepts a single `recipe` prop, which is an **object** with this shape:

```js
{ title: "Pancakes", time: 20, ingredients: ["Flour", "Eggs", "Milk"] }
```

- Render the title in an `<h2>`.
- Render the time as `"Ready in 20 minutes"`.
- Render each ingredient as an `<li>` inside a `<ul>` (use `.map()` with a `key`).
- `App` must render **at least two** recipes, and one of them **must** be titled `"Pancakes"` with exactly the three ingredients above.

```jsx
export function RecipeCard({ recipe }) {
  return (
    <div className="recipe">
      <h2>{recipe.title}</h2>
      <p>Ready in {recipe.time} minutes</p>
      <ul>
        {recipe.ingredients.map((ing) => (
          <li key={ing}>{ing}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const pancakes = {
    title: "Pancakes",
    time: 20,
    ingredients: ["Flour", "Eggs", "Milk"],
  };
  const salad = {
    title: "Greek Salad",
    time: 10,
    ingredients: ["Tomatoes", "Cucumber", "Feta", "Olives"],
  };

  return (
    <div id="app">
      <h1>Recipe Book</h1>
      <RecipeCard recipe={pancakes} />
      <RecipeCard recipe={salad} />
    </div>
  );
}

export default App;
```
