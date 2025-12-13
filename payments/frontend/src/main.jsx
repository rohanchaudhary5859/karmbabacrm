import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Subscribe from './Subscribe';
import Success from './Success';
import Cancel from './Cancel';

function App(){ return (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Subscribe/>} />
      <Route path='/subscription-success' element={<Success/>} />
      <Route path='/subscription-cancel' element={<Cancel/>} />
    </Routes>
  </BrowserRouter>
);}

createRoot(document.getElementById('root')).render(<App/>);
