// Udemy — Coding Exercise 14: "Forwarding Props"
// Task: Input must render a <textarea> when a richText prop is set, otherwise an <input>.
// All other props set on Input must be forwarded straight to the returned element.
// Used like: <Input type="text" placeholder="Your name" /> and <Input richText placeholder="Your message" />

// --- Input.js ---  (in StackBlitz this line is: export default function Input(...))
function Input({ richText, ...props }) {
  if (richText) {
    return <textarea {...props} />;
  }

  return <input {...props} />;
}

// --- App.js ---  (in StackBlitz this file starts with: import Input from './Input';)
function App() {
  return (
    <div id="content">
      <Input type="text" placeholder="Your name" />
      <Input richText placeholder="Your message" />
    </div>
  );
}

export default App;
