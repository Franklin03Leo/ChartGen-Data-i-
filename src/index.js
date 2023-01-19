import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider
} from "@mui/material/styles";

import { themeConfig } from './Components/themeConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));
// const theme = createTheme(themeConfig);
root.render(
  <React.StrictMode>
    {/* <MuiThemeProvider theme={theme}> */}
      <App />
    {/* </MuiThemeProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
