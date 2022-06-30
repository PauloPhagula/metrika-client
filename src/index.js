import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css';

import App from './App';
import NewMetric from './NewMetric';
import Stats from './Stats';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/dashboard" element={<Stats />} />
          <Route path="/new" element={<NewMetric />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(<con>`</con>sole.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
