import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import "./index.css";
import App from "./App";
import store from './store/index';
import { BrowserRouter } from "react-router-dom";

const app = (
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);


ReactDOM.render(app, document.getElementById("root"));
