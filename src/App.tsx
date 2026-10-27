import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <div className="py-20 text-center">
              <h1 className="font-serif text-3xl font-bold">MyStyle Alger</h1>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
