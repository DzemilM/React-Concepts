// Udemy — "Using Fragments"
// Task: Summary must output <h1> and <p> without wrapping them in any other HTML element.
// inace function Summary je pocelo samo s return null
function Summary({ text }) {
  return (
    <>
      <h1>Summary</h1>
      <p>{text}</p>
    </>
  );
}

function App() {
  return (
    <div id="app" data-testid="app">
      <Summary text="Fragments help you avoid unnecessary HTML elements." />
    </div>
  );
}

export default App;
