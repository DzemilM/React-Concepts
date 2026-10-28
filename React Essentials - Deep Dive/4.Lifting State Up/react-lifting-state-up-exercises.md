# React Lifting State Up — Practice Exercises

Six exercises. The early ones are blank-file: requirements only, no starter code. Exercise 4 is
the only one with code on screen, because it's a refactor of something broken.

## The one idea underneath all of it

In the State unit, state lived in **one** component. In Two-Way Binding (Task 3 of the cold test)
you went one step further: `DraftForm` owned the state and passed the current values **down** to
`DraftPreview` as props. The child only displayed them.

This unit adds the missing direction:

> **The child can't change the parent's state itself. So the parent passes it a function that
> does.**

Data still flows down only. Props never go up. What goes down is a **value** *and* a
**function**. When the child calls that function, the code that runs belongs to the parent, so
it can call the parent's setter. That's the Events unit's hand-off pattern, and the
handler now ends in a `setX(...)`.

Where should the state live? In the **closest ancestor of every component that needs it**. That
means every component that reads it and every component that changes it. Not higher, and not
lower.

## Setup

`src/App.js`. Import `useState` normally:

```jsx
import { useState } from 'react';
```

Put all components for an exercise in the same file, above `App`. Replace the previous exercise
when you start the next one.

## Three checks, after writing each component

1. **Every prop I named — did I use it?**
2. **Is `children` named, and placed between the tags?** (Only if the component wraps content.)
3. **Every fixed class — is it written in *this* component, not inside a child?**

And one for this unit, before you write anything:

- **Who reads this value, and who changes it?** The state goes in the closest component that
  contains all of them.

---

## Exercise 1: Like button and counter

**Goal:**

- Two components, `LikeButton` and `LikeCount`, rendered side by side by `App`.
- `LikeButton` renders a button labelled `Like`.
- `LikeCount` renders `<p>N likes</p>`, starting at `0`.
- Clicking `Like` adds one to the count.
- **Neither child has `useState` in it.**

**Watch for:** forgetting the `return`. Three components means three places to forget it. Type
`return ( )` first.

**In writing:** why can't `LikeButton` own the `likes` state, even though it's the component that
changes it?

### My solution

```jsx
import { useState } from 'react';

function LikeButton({ addLike }) {
  return <button onClick={addLike}>Like</button>;
}

function LikeCount({ count }) {
  return <p>{count} likes</p>;
}

export default function App() {
  const [count, setCount] = useState(0);

  function handleCount() {
    setCount(count + 1);
  }

  return (
    <>
      <LikeButton addLike={handleCount} />
      <LikeCount count={count} />
    </>
  );
}
```

### My answer

Props only flow down. If `LikeButton` owned `count`, it could only pass it to its own children,
and `LikeCount` is its sibling, not its child, so it could never get the number. The state has to
live in `App`, the closest component that contains both. `App` passes the value down to
`LikeCount` and a function down to `LikeButton`.

---

## Exercise 2: Pick a size

**Goal:**

- A `SizePicker` component renders three buttons: `S`, `M`, `L`.
- A `SizeLabel` component renders `Selected size: ...`, or `No size selected` before anything is
  clicked.
- `App` owns the chosen size and renders both.
- `SizePicker` gets **one** function prop from `App`, not three. The child decides which size to
  pass to it.

**Watch for:** pass vs call. In `App`, the function goes down **bare**. In `SizePicker`, each
button needs to inject its own size, so it **wraps**. That's the Events hand-off, same split as
before.

**In writing:** when the user clicks `M`, trace it: which function does React call, what does
that function call, what value arrives in `App`, and what does `SizeLabel` show? (Four parts.)

### My solution

```jsx
import { useState } from 'react';

function SizePicker({ pickSize }) {
  return (
    <>
      <button onClick={() => pickSize('S')}>S</button>
      <button onClick={() => pickSize('M')}>M</button>
      <button onClick={() => pickSize('L')}>L</button>
    </>
  );
}

function SizeLabel({ selectedSize }) {
  return (
    <p>
      {selectedSize ? `Selected size: ${selectedSize}` : 'No size selected'}
    </p>
  );
}

export default function App() {
  const [size, setSize] = useState('');

  function handleSize(newSize) {
    setSize(newSize);
  }

  return (
    <>
      <SizePicker pickSize={handleSize} />
      <SizeLabel selectedSize={size} />
    </>
  );
}
```

### My answer

React calls the button's arrow function, which calls `pickSize("M")`. `pickSize` is `handleSize`
under another name: the same function, passed down from `App`. So `"M"` arrives in `App` as the
parameter, and `setSize` stores it. `App` re-renders and passes `'M'` down, so `SizeLabel` shows
`Selected size: M`.

---

## Exercise 3: Search bar and results

```js
const CITIES = ['Sarajevo', 'Mostar', 'Split', 'Zagreb', 'Ljubljana', 'Skopje'];
```

**Goal:**

- A `SearchBar` component renders a controlled text input.
- A `CityList` component renders the cities whose names include the search text, ignoring case,
  or `No cities found`.
- `App` owns the search text.
- `SearchBar` has no state of its own. The input is still controlled: its `value` and its change
  both come from `App`.

**Watch for:** name discipline. You're inventing prop names in `App` and reading them in two
children. A mismatch won't throw an error; you'll just get `undefined`.

**In writing:** the filtered list is derived. Which component computes it in your solution, and
would it also work in the other one? Why?

### My solution

```jsx
import { useState } from 'react';

const CITIES = ['Sarajevo', 'Mostar', 'Split', 'Zagreb', 'Ljubljana', 'Skopje'];

function SearchBar({ val, handleVal }) {
  return <input type="text" value={val} onChange={handleVal} />;
}

function CityList({ cities }) {
  return (
    <div>
      {cities.length > 0 ? (
        <ol>
          {cities.map((city) => {
            return <li key={city}>{city}</li>;
          })}
        </ol>
      ) : (
        'No cities found'
      )}
    </div>
  );
}

export default function App() {
  const [searchText, setSearchText] = useState('');
  function handleSearch(event) {
    setSearchText(event.target.value);
  }

  const filteredCities = CITIES.filter((city) => {
    return city.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <>
      <SearchBar val={searchText} handleVal={handleSearch} />
      <CityList cities={filteredCities} />
    </>
  );
}
```

### My answer

I filtered in `App`, because `App` already has both ingredients: `CITIES` and `searchText`. It
would also work inside `CityList`, as long as `App` passed `searchText` down as a prop. The
**state** has to stay in `App`, because `SearchBar` changes it and `CityList` reads it. The
**derived** list can be computed in either component, as long as that component receives what it
needs.

---

## Exercise 4: Fix the out-of-sync tabs

This runs, but it's broken. Clicking a tab highlights it, but the content underneath never
changes.

```jsx
import { useState } from 'react';

function TabButtons() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <menu>
      <button
        className={activeTab === 'info' ? 'active' : ''}
        onClick={() => setActiveTab('info')}
      >
        Info
      </button>
      <button
        className={activeTab === 'reviews' ? 'active' : ''}
        onClick={() => setActiveTab('reviews')}
      >
        Reviews
      </button>
    </menu>
  );
}

function TabContent() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <section>
      {activeTab === 'info' ? <p>Product details.</p> : <p>No reviews yet.</p>}
    </section>
  );
}

export default function App() {
  return (
    <>
      <TabButtons />
      <TabContent />
    </>
  );
}
```

**Goal:** lift the state so that clicking a tab both highlights it **and** changes the content.
Keep both child components.

**Watch for:** renames leave orphans. When the state moves out of a child, search that child for
every place it still uses the old name, and make sure each one now comes from a prop.

**In writing:** there are two `activeTab` variables in the broken code. Are they the same value?
Say what happens to each one when you click `Reviews`.

### My solution

```jsx
import { useState } from 'react';

function TabButtons({ activeTab, setTab }) {
  return (
    <menu>
      <button
        className={activeTab === 'info' ? 'active' : ''}
        onClick={() => setTab('info')}
      >
        Info
      </button>
      <button
        className={activeTab === 'reviews' ? 'active' : ''}
        onClick={() => setTab('reviews')}
      >
        Reviews
      </button>
    </menu>
  );
}

function TabContent({ activeTab }) {
  return (
    <section>
      {activeTab === 'info' ? <p>Product details.</p> : <p>No reviews yet.</p>}
    </section>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <>
      <TabButtons activeTab={activeTab} setTab={setActiveTab} />
      <TabContent activeTab={activeTab} />
    </>
  );
}
```

### My answer

In the broken code each child had its own `useState`, so there were two separate `activeTab`
values, not one. Clicking `Reviews` changed `TabButtons`' copy to `'reviews'`, so the highlight
moved. `TabContent`'s copy stayed `'info'`, because nothing told it. Lifting the state into `App`
leaves one value that both children receive as a prop, so they always agree.

---

## Exercise 5: How high?

The tree:

```
App
├── Header          (shows the shop name, nothing else)
└── Shop
    ├── Filters     (two buttons: "All" and "On sale")
    └── ProductList (shows the products, filtered)
```

```js
const PRODUCTS = [
  { id: 'p1', name: 'Lamp', onSale: true },
  { id: 'p2', name: 'Chair', onSale: false },
  { id: 'p3', name: 'Rug', onSale: true },
];
```

**Goal:**

- Build all five components.
- `Filters` sets whether to show all products or only the ones on sale.
- `ProductList` shows the matching products, keyed by `id`.
- Put the state where the rule says, not in `App`.

**Watch for:** array vs item vs field. `PRODUCTS` is the array, a `product` is one item, and
`onSale` is a field of the item.

**In writing:** why does the state go in `Shop` and not in `App`? What would `Header` have to do
if it went in `App`?

### My solution

```jsx
import { useState } from 'react';

const PRODUCTS = [
  { id: 'p1', name: 'Lamp', onSale: true },
  { id: 'p2', name: 'Chair', onSale: false },
  { id: 'p3', name: 'Rug', onSale: true },
];

function Header() {
  return <h1>Some shop name</h1>;
}

function Shop() {
  const [filter, setFilter] = useState('all');

  const onSale = PRODUCTS.filter((product) => product.onSale);

  function handleProds(param) {
    setFilter(param);
  }

  return (
    <>
      <Filters handleFilter={handleProds} />
      <ProductList prodList={filter === 'sale' ? onSale : PRODUCTS} />
    </>
  );
}

function Filters({ handleFilter }) {
  return (
    <>
      <button onClick={() => handleFilter('all')}>All</button>
      <button onClick={() => handleFilter('sale')}>On sale</button>
    </>
  );
}

function ProductList({ prodList }) {
  return (
    <ul>
      {prodList.map((prod) => {
        return <li key={prod.id}>{prod.name}</li>;
      })}
    </ul>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Shop />
    </>
  );
}
```

### My answer

State goes in the closest parent of every component that reads or changes it. `Filters` changes
the filter and `ProductList` reads it, so that's `Shop`. `App` would be higher than needed: it would
have to pass the state and the handler through `Shop`, which only forwards them, and every click
would re-render `Header` for nothing. `Header` itself wouldn't have to do anything, because it
never uses the filter.

---

## Exercise 6: Pick a player

```js
const PLAYERS = [
  { id: 'u1', name: 'Ana', team: 'Red' },
  { id: 'u2', name: 'Luis', team: 'Blue' },
  { id: 'u3', name: 'Mira', team: 'Red' },
];
```

**Goal:**

- A `PlayerRow` component renders one `<li>` with the player's name and a `Select` button.
- `App` maps `PLAYERS` to `PlayerRow`s inside a `<ul>`.
- The selected row shows `(selected)` after the name.
- A `PlayerInfo` component below the list shows `Name — Team` for the selected player, or
  `Pick a player` before anything is selected.
- **State stores only the selected player's `id`.** Everything else is derived from it.

**Watch for:** where the key goes. It goes on what the `.map()` callback returns, so on
`<PlayerRow>` in `App`, not on the `<li>` inside it. And `key` isn't a prop, so if `PlayerRow`
needs the id, pass it separately.

**In writing:** why store the `id` instead of the whole player object? Name one thing that's
derived from it.

### My solution

```jsx
import { useState } from 'react';

const PLAYERS = [
  { id: 'u1', name: 'Ana', team: 'Red' },
  { id: 'u2', name: 'Luis', team: 'Blue' },
  { id: 'u3', name: 'Mira', team: 'Red' },
];

function PlayerRow({ playerName, playerId, select }){
  return(
      <li>
        {playerName}
        <button onClick={() => select(playerId)}>Select</button>
      </li>
  )
}

export default function App(){

  const [ selectedPlayerId, setSelectedPlayerId ] = useState("");

  function handleSelect(param){
    setSelectedPlayerId(param)
  }
  return(
    <>
     <ul>
      {PLAYERS.map((player) => {
        return(
          <PlayerRow 
          key={player.id}  
          playerName={player.name} 
          playerId={player.id}
          select={handleSelect} />
        )
      })}
     </ul>
    </>
  )
}
```

### My answer

---

## Cold recall

1. Two sibling components need the same state value. Where does it go?
2. A child needs to change state that lives in its parent. What does the parent pass it?
3. When the child calls that function, whose state changes, and which components re-render?
4. Why not just put every piece of state in `App`?
5. Props flow down only. So how does a value the user picked in a child get up to the parent?

<details>
<summary>Answer key</summary>

1. In their closest common ancestor, the nearest component that contains both.
2. A function (usually a handler that calls the setter), passed as a prop. It can pass the value
   too, if the child also needs to read it.
3. The parent's state changes. The parent re-renders, and so do its children, which receive the
   new value as props.
4. State should sit no higher than it needs to. Higher up, every component in between has to pass
   props it never uses, and more of the tree re-renders on every change.
5. It travels as an **argument**, not a prop. The child calls the parent's function and passes the
   value in, e.g. `onSelect('M')`. The parent's function receives it and stores it in state.

</details>
