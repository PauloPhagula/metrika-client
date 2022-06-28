import './App.css';
import { Link } from "react-router-dom";

import Chart from "./components/chart";
import React, { useState, useEffect } from 'react';

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Metrika</a>
          </div>
      </nav>

      <div className="container-fluid">
        <div className='row align-items-center'>
          <Chart />
        </div>
      </div>
    </>
  );
}

export default App;
