import React from 'react';
import { NavLink } from "react-router-dom";

function Header() {
  let activeClassName = "nav-link active";
  let inactiveClassName = "nav-link";

  return (
    <header className="navbar navbar-expand-lg bg-light mb-4 p-3">
        <nav className="container flex-wrap align-items-center">
            <span className="navbar-brand">
              <i className="bi bi-bar-chart" role="img" aria-label="Metrika Home"></i> Metrika
            </span>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon bi bi-list"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink to="/" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>
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
        </nav>
    </header>
  );
}

export default Header;
