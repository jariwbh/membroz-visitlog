import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Assets/css/custom.css'
import './Assets/css/DropDownstyles.css'
import './Assets/css/dataletters.css'
import './Assets/css/datagrid.css'
import 'jquery'
import 'bootstrap'

import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom'
//import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
