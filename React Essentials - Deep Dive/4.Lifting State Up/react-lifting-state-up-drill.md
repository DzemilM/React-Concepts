# Lifting State Up — Short Drill

Two points from the exam, nothing else:

1. **State that stays in the one component that uses it.** It only goes up when someone else needs
   it.
2. **`.find()` gives `undefined` when nothing matches.** Reading a field off it crashes.

Answer under each question, then check the collapsed key at the bottom. No running code.

---

## Part 1 — Stay or go up?

For each one, name the component that owns the state. Use one question: **does anyone besides this
component need to know?**

### 1

```
App
└── Gallery
    └── Photo × 6   (each has a ♥ button that fills or empties its own heart)
```

Nothing else on the page shows likes.

**My answer:**

### 2

The same tree, but now `Gallery` has a heading that says `3 liked`.

**My answer:**

### 3

```
App
└── Settings
    ├── PasswordField   (an input with a Show/Hide button that reveals its own text)
    └── SaveButton
```

**My answer:**

### 4

```
App
└── Player
    ├── VolumeSlider   (changes the volume)
    └── Speaker        (shows the volume as a number)
```

**My answer:**

### 5

```
App
├── Header
│   └── MenuButton   (opens and closes its own dropdown list)
└── Main
```

**My answer:**

### 6

```
App
├── Toolbar
│   └── OpenButton   (opens the modal)
└── Modal            (shows itself only when open, has a Close button)
```

**My answer:**

---

## Part 2 — What if nothing matches?

```js
const USERS = [
  { id: 'u1', name: 'Ana', age: 31 },
  { id: 'u2', name: 'Luis', age: 27 },
];
```

### 7

```js
const found = USERS.find((u) => u.id === 'u9');
```

What is `found`? And what happens if the next line is `<p>{found.name}</p>`?

**My answer:**

### 8

```js
const a = USERS.filter((u) => u.id === 'u9');
const b = USERS.find((u) => u.id === 'u9');
```

What is `a`, and what is `b`? Which one is safe to `.map()` over?

**My answer:**

### 9

```jsx
function Profile({ name, age }) {
  return <p>{name ? `${name}, ${age}` : 'No user picked'}</p>;
}

export default function App() {
  const [userId, setUserId] = useState('');
  const user = USERS.find((u) => u.id === userId);

  return <Profile name={user.name} age={user.age} />;
}
```

What goes wrong on the first render, and how do you fix it?

**My answer:**

### 10

Write `Profile` so it receives the whole user (or `undefined`) as **one** prop, and shows
`Ana, 31` or `No user picked` without crashing. Then write the line in `App` that renders it.

### My solution

```jsx
import { useState } from 'react';

```

---

<details>
<summary>Answer key</summary>

1. **Each `Photo`.** Only that photo reads and changes its own heart. Nobody else needs it.
2. **`Gallery`.** The heading reads the likes now, so the photos share them. The closest parent of
   the photos and the heading is `Gallery`. It stores which photos are liked (their ids).
3. **`PasswordField`.** Show/Hide only affects its own input. `SaveButton` doesn't care.
4. **`Player`.** `VolumeSlider` changes it and `Speaker` reads it. They're siblings, so it goes up
   to their parent.
5. **`MenuButton`.** It opens and closes its own list. `Header` and `Main` don't need to know.
6. **`App`.** `OpenButton` changes it, and `Modal` reads it (and changes it with Close). They're in
   different branches, and the closest parent containing both is `App`.
7. `found` is `undefined`, because no user has the id `'u9'`. `found.name` reads a field of
   `undefined`, so it crashes.
8. `a` is `[]`, an empty array. `b` is `undefined`. `a` is safe to `.map()` over: it just makes
   nothing. `filter` always gives an array, and `find` gives one item or `undefined`.
9. `userId` starts as `''`, so `user` is `undefined`, and `user.name` crashes in `App` before
   `Profile` runs. Fix: pass the whole `user` as one prop and check it inside `Profile`.
10.

```jsx
function Profile({ user }) {
  return <p>{user ? `${user.name}, ${user.age}` : 'No user picked'}</p>;
}

// in App:
<Profile user={user} />
```

</details>
