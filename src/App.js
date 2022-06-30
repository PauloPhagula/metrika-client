import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from "react-router-dom";
import './App.css';

function App() {
  let activeClassName = "nav-link active";
  let inactiveClassName = "nav-link";

  return (
    <>
      <header className="navbar navbar-expand-lg bg-light mb-4 p-3">
          <nav className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <span className="navbar-brand">
                <i className="bi bi-bar-chart" role="img" aria-label="Metrika Home"></i> Metrika
              </span>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/new" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>
                      New Metric
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
      </header>

      <Outlet />

      <footer className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p className="col text-muted text-end">© 2022 Paulo Phagula for FactoriaHR</p>
        </div>
      </footer>
    </>
  );
}

export default App;
