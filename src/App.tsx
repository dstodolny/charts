import React from 'react';
import { LineChart } from './LineChart';

const data = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 6 },
  { x: 6, y: 8 },
  { x: 7, y: 7 },
  { x: 8, y: 9 },
  { x: 9, y: 10 },
  { x: 10, y: 12 },
];

function App() {
  return (
    <main>
      <LineChart data={data} config={{}} />
    </main>
  );
}

export default App;
