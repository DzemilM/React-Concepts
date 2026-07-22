# Props — Cold Test

No starter code. Just the data and what it must do. Write every line yourself in a blank
StackBlitz.

**Rules:**
- Look up *syntax* freely (reduce, toFixed, whatever). Don't look up the *plan*.
- If you get stuck on "what do I do next" (not "how do I spell this"), that's the signal you
  need another rep — note where it happened.
- Solutions are collapsed at the bottom. Only open them **after** you've finished, to compare.

---

## Task 1 — GymSession

Data:

```js
{
  id: "S-77",
  member: { name: "Tara", tier: "Gold" },
  exercises: [
    { move: "Squat", sets: 4, reps: 8 },
    { move: "Bench", sets: 3, reps: 10 },
  ],
}

export function GymSession({session}){
  const totalReps = session.exercises.reduce((runningTotal, exercise)=>(
    runningTotal + exercise.sets * exercise.reps),0);
  return(
    <div>
    <p>Name={session.member.name}</p>
    <p>Tier={session.member.tier}</p>
    <ul>
     {session.exercises.map((exercise)=>(
      <li key={exercise.move}>
      Move={exercise.move} Session total reps={exercise.sets * exercise.reps}
      </li>
     ))}
     <p>Total={totalReps}</p>
    </ul>
    </div>
  )
}

function App(){
  const Session1={
  id: "S-67",
  member: { name: "Peter", tier: "Parker" },
  exercises: [
    { move: "Squat", sets: 5, reps: 12 },
    { move: "Bench", sets: 6, reps: 11 },
  ],
}

const Session2={
  id: "P-71",
  member: { name: "Tyler", tier: "Silver" },
  exercises: [
    { move: "Deadlift", sets: 6, reps: 7 },
    { move: "Cable row", sets: 6, reps: 14 },
  ],
}

return (
  <div>
   <h2>Sessions</h2>
   <GymSession session={Session1} />
   <GymSession session={Session2} />
  </div>
)
}
```

Build a `GymSession` component that takes this whole thing as **one prop** and renders:
- the session id
- the member's name and tier
- one list row per exercise: the move, and its total reps (`sets × reps`)
- the **total reps across all exercises**

`App` renders at least two sessions.



---

## Task 2 — InvoiceCard

Data:

```js
{
  number: "INV-2024-08",
  client: { company: "Acme Ltd", contact: "Dana" },
  lines: [
    { description: "Design work", hours: 12, rate: 80 },
    { description: "Revisions", hours: 3, rate: 80 },
  ],
}
```

Build an `InvoiceCard` that takes it as **one prop** and renders:
- the invoice number
- the client company and contact
- one row per line: description, hours, and line amount (`hours × rate`)
- the **subtotal** across all lines
- a **`taxRate` prop with a default of `0`** — render the final total as `subtotal × (1 + taxRate)`, formatted to 2 decimals

`App` renders two invoices: one with a tax rate passed in, one relying on the default.

---

## Task 3 — CourseBox (adds `children`)

Data:

```js
{
  code: "CS-101",
  teacher: { name: "Rob", dept: "Computer Science" },
  students: [
    { name: "Ana", grade: 88 },
    { name: "Ben", grade: 74 },
    { name: "Cleo", grade: 95 },
  ],
}
```

Build a `CourseBox` that takes it as **one prop** *and* accepts **`children`**. It renders:
- the course code, and the teacher's name + dept
- one row per student: name and grade
- the **average grade** (rounded)
- whatever is nested inside the component, below all of the above

`App` renders two courses, each with **different** nested content (e.g. one wraps a `<p>`,
the other wraps a `<button>` or a small `<ul>`).

---

## After you finish

Ask yourself:
1. Did you ever need to look at the old files for the **plan**, or only for syntax?
2. Which step slowed you down most — digging with dots, the map, or the reduce?
3. Could you now explain to someone else why `item.x` inside a map is different from
   `data.something.x`?

---

<details>
<summary>Solutions — open only after finishing all three</summary>

### Task 1

```jsx
export function GymSession({ session }) {
  const totalReps = session.exercises.reduce((sum, ex) => sum + ex.sets * ex.reps, 0);

  return (
    <div className="session">
      <p>Session: {session.id}</p>
      <p>
        {session.member.name} — {session.member.tier}
      </p>
      <ul>
        {session.exercises.map((ex) => (
          <li key={ex.move}>
            {ex.move} — {ex.sets * ex.reps} reps
          </li>
        ))}
      </ul>
      <h2>Total reps: {totalReps}</h2>
    </div>
  );
}

function App() {
  const sessionA = {
    id: "S-77",
    member: { name: "Tara", tier: "Gold" },
    exercises: [
      { move: "Squat", sets: 4, reps: 8 },
      { move: "Bench", sets: 3, reps: 10 },
    ],
  };
  const sessionB = {
    id: "S-78",
    member: { name: "Ivan", tier: "Silver" },
    exercises: [
      { move: "Deadlift", sets: 5, reps: 5 },
      { move: "Row", sets: 4, reps: 12 },
    ],
  };

  return (
    <div id="app">
      <h1>Sessions</h1>
      <GymSession session={sessionA} />
      <GymSession session={sessionB} />
    </div>
  );
}

export default App;
```

### Task 2

```jsx
export function InvoiceCard({ invoice, taxRate = 0 }) {
  const subtotal = invoice.lines.reduce((sum, line) => sum + line.hours * line.rate, 0);
  const total = subtotal * (1 + taxRate);

  return (
    <div className="invoice">
      <h2>{invoice.number}</h2>
      <p>
        {invoice.client.company} — {invoice.client.contact}
      </p>
      <ul>
        {invoice.lines.map((line) => (
          <li key={line.description}>
            {line.description} — {line.hours}h — ${line.hours * line.rate}
          </li>
        ))}
      </ul>
      <p>Subtotal: ${subtotal}</p>
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}

function App() {
  const invoiceA = {
    number: "INV-2024-08",
    client: { company: "Acme Ltd", contact: "Dana" },
    lines: [
      { description: "Design work", hours: 12, rate: 80 },
      { description: "Revisions", hours: 3, rate: 80 },
    ],
  };
  const invoiceB = {
    number: "INV-2024-09",
    client: { company: "Globex", contact: "Sam" },
    lines: [
      { description: "Consulting", hours: 6, rate: 120 },
      { description: "Report", hours: 2, rate: 100 },
    ],
  };

  return (
    <div id="app">
      <h1>Invoices</h1>
      <InvoiceCard invoice={invoiceA} taxRate={0.2} />
      <InvoiceCard invoice={invoiceB} />
    </div>
  );
}

export default App;
```

### Task 3

```jsx
export function CourseBox({ course, children }) {
  const total = course.students.reduce((sum, s) => sum + s.grade, 0);
  const average = Math.round(total / course.students.length);

  return (
    <div className="course">
      <h2>{course.code}</h2>
      <p>
        {course.teacher.name} — {course.teacher.dept}
      </p>
      <ul>
        {course.students.map((student) => (
          <li key={student.name}>
            {student.name} — {student.grade}
          </li>
        ))}
      </ul>
      <p>Average: {average}</p>
      {children}
    </div>
  );
}

function App() {
  const courseA = {
    code: "CS-101",
    teacher: { name: "Rob", dept: "Computer Science" },
    students: [
      { name: "Ana", grade: 88 },
      { name: "Ben", grade: 74 },
      { name: "Cleo", grade: 95 },
    ],
  };
  const courseB = {
    code: "MA-200",
    teacher: { name: "Sara", dept: "Mathematics" },
    students: [
      { name: "Dino", grade: 61 },
      { name: "Eva", grade: 79 },
    ],
  };

  return (
    <div id="app">
      <h1>Courses</h1>
      <CourseBox course={courseA}>
        <p>Enrollment closes Friday.</p>
      </CourseBox>
      <CourseBox course={courseB}>
        <button>Join waitlist</button>
      </CourseBox>
    </div>
  );
}

export default App;
```

Note on Task 3's average: `reduce` gives the **sum** of grades; divide by
`course.students.length` (how many students) to get the average, then round it.

</details>
```
