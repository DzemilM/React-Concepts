# React Events — Udemy exercise: Reacting to Events

## The task

Work on a **User Login** component that has already been prepared by a colleague.

The goal: update the data stored in the existing `user` object with some dummy data once the
**Login** button in the `App` component is pressed.

**Requirements**

- `email` → any non-empty string of your choice
- `password` → any non-empty string of your choice
- `loggedIn` → `true`

**Out of scope**

- You do **not** have to read the values typed into the `<input>` fields — ignore them for now.
  Listening to keystrokes and reading user input comes later in the course; those fields are
  just there to look good.
- The login does not actually work. This exercise is only about event handling — real
  authentication comes later too.

## Starter code

```jsx
export const user = {
  email: '',
  password: '',
  loggedIn: false,
};

function App() {
  return (
    <div id="app">
      <h1>User Login</h1>

      <p>
        <label>Email</label>
        <input type="email" />
      </p>

      <p>
        <label>Password</label>
        <input type="password" />
      </p>

      <p id="actions">
        <button>Login</button>
      </p>
    </div>
  );
}

export default App;
```

## What I don't understand

<!-- write what's confusing before we start -->

## My attempt

```jsx

```

## Notes