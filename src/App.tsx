import React from 'react';
import { LineChart } from './LineChart';

const data = [
  { brand: 'Brand A', date: new Date('2022-01-01'), sales: 100 },
  { brand: 'Brand A', date: new Date('2022-02-01'), sales: 200 },
  { brand: 'Brand A', date: new Date('2022-03-01'), sales: 150 },
  { brand: 'Brand A', date: new Date('2022-04-01'), sales: 300 },
  { brand: 'Brand A', date: new Date('2022-05-01'), sales: 250 },
  { brand: 'Brand A', date: new Date('2022-06-01'), sales: 350 },
  { brand: 'Brand A', date: new Date('2022-07-01'), sales: 400 },
  { brand: 'Brand A', date: new Date('2022-08-01'), sales: 450 },
  { brand: 'Brand A', date: new Date('2022-09-01'), sales: 350 },
  { brand: 'Brand A', date: new Date('2022-10-01'), sales: 300 },
  { brand: 'Brand A', date: new Date('2022-11-01'), sales: 200 },
  { brand: 'Brand A', date: new Date('2022-12-01'), sales: 150 },
  { brand: 'Brand B', date: new Date('2022-01-01'), sales: 50 },
  { brand: 'Brand B', date: new Date('2022-02-01'), sales: 250 },
  { brand: 'Brand B', date: new Date('2022-03-01'), sales: 175 },
  { brand: 'Brand B', date: new Date('2022-04-01'), sales: 275 },
  { brand: 'Brand B', date: new Date('2022-05-01'), sales: 300 },
  { brand: 'Brand B', date: new Date('2022-06-01'), sales: 400 },
  { brand: 'Brand B', date: new Date('2022-07-01'), sales: 450 },
  { brand: 'Brand B', date: new Date('2022-08-01'), sales: 375 },
  { brand: 'Brand B', date: new Date('2022-09-01'), sales: 325 },
  { brand: 'Brand B', date: new Date('2022-10-01'), sales: 200 },
  { brand: 'Brand B', date: new Date('2022-11-01'), sales: 100 },
  { brand: 'Brand B', date: new Date('2022-12-01'), sales: 75 },
  { brand: 'Brand C', date: new Date('2022-01-01'), sales: 150 },
  { brand: 'Brand C', date: new Date('2022-02-01'), sales: 275 },
  { brand: 'Brand C', date: new Date('2022-03-01'), sales: 200 },
  { brand: 'Brand C', date: new Date('2022-04-01'), sales: 275 },
  { brand: 'Brand C', date: new Date('2022-05-01'), sales: 300 },
  { brand: 'Brand C', date: new Date('2022-06-01'), sales: 150 },
  { brand: 'Brand C', date: new Date('2022-07-01'), sales: 200 },
  { brand: 'Brand C', date: new Date('2022-08-01'), sales: 250 },
  { brand: 'Brand C', date: new Date('2022-09-01'), sales: 300 },
  { brand: 'Brand C', date: new Date('2022-10-01'), sales: 400 },
  { brand: 'Brand C', date: new Date('2022-11-01'), sales: 450 },
  { brand: 'Brand C', date: new Date('2022-12-01'), sales: 500 },
];

function App() {
  return (
    <main>
      <LineChart
        data={data}
        config={{
          x: (d) => d.date,
          y: (d) => d.sales,
          z: (d) => d.brand,
          dimension: {
            width: 640,
            height: 480,
            margin: {
              top: 20,
              right: 30,
              bottom: 30,
              left: 40,
            },
          },
        }}
      />
    </main>
  );
}

export default App;
