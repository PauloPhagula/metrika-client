import './App.css';
import { Link } from "react-router-dom";

import Stats from "./components/stats";
import React, { useState, useEffect } from 'react';

function App() {
  return (
    <>
      <header className="p-3 navbar navbar-expand-lg bg-light">
          <nav className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <span className="navbar-brand">
                <i className="bi bi-bar-chart" role="img" aria-label="Metrika Home"></i> Metrika
              </span>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/dashboard">Dashboard</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/new">New Metric</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
      </header>

      <div className="container">
        <div className='row'>
          <Stats />
        </div>
      </div>

      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p className="col text-muted text-end">© 2022 Paulo Phagula</p>
        </footer>
      </div>
    </>
  );
}

export default App;
