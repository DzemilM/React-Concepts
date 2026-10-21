# React Two-Way Binding — Udemy Coding Exercise

## The task

Collect the values entered into the `<textarea>` and `<input>` with two-way binding.
Pass the collected values as props to the existing `Review` component.

The final app should allow the user to enter feedback and a name, then show those
values in the `Review` component below the inputs.

### Requirements

- For this practice file, use the normal named `useState` import if you prefer.
- Store the current feedback and name in state.
- Listen for changes to both controls and store their new values.
- Use the stored state values as the controls' `value`.
- Pass the stored values to `Review` using the prop names it expects:
  `feedback` and `student`.
- Do not change the `Review` component.

### Watch for:

- Two-way binding is a pair: `value` displays state, and `onChange` updates state.
- `event.target.value` is the new text from the control.
- Pass the handler; do not call it while rendering.
- Compute above the `return`; display inside JSX.

## Starter code — `src/App.js`

```jsx
import React from 'react';

import Review from './Review';

// don't change the Component name "App"
function App() {
  return (
    <>
      <section id="feedback">
        <h2>Please share some feedback</h2>
        <p>
          <label>Your Feedback</label>
          <textarea />
        </p>
        <p>
          <label>Your Name</label>
          <input type="text" />
        </p>
      </section>
      <section id="draft">
        <h2>Your feedback</h2>

        <Review />

        <p>
          <button>Save</button>
        </p>
      </section>
    </>
  );
}

export default App;
```

## Reference — existing `Review.js`

```jsx
export default function Review({ feedback, student }) {
  return (
    <figure>
      <blockquote>
        <p>{feedback}</p>
      </blockquote>
      <figcaption>{student}</figcaption>
    </figure>
  );
}
```

## My solution

```jsx
import React from 'react';

import Review from './Review';

import { useState } from 'react';

// don't change the Component name "App"
function App() {

const [ feedback, setFeedback ] = useState("");
const [ student, setStudent ] = useState("");

function handleFeedback(event) {
  setFeedback(event.target.value);
}

function handleStudent(event) {
  setStudent(event.target.value);
}

  return (
    <>
      <section id="feedback">
        <h2>Please share some feedback</h2>
        <p>
          <label>Your Feedback</label>
          <textarea onChange={handleFeedback} value={feedback} />
        </p>
        <p>
          <label>Your Name</label>
          <input type="text" onChange={handleStudent} value={student} />
        </p>
      </section>
      <section id="draft">
        <h2>Your feedback</h2>

        <Review feedback={feedback} student={student} />

        <p>
          <button>Save</button>
        </p>
      </section>
    </>
  );
}

export default App;

```

## My answer
