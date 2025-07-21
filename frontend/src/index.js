import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import { CookiesProvider } from 'react-cookie';


ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
    <Toaster />
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);

