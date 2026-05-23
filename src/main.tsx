import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

window.addEventListener('error', (e) => {
  console.error("GLOBAL ERROR:", e.error);
  fetch('http://localhost:5173/error-log?msg=' + encodeURIComponent(e.error?.stack || e.message));
});

window.addEventListener('unhandledrejection', (e) => {
  console.error("UNHANDLED REJECTION:", e.reason);
  fetch('http://localhost:5173/error-log?msg=' + encodeURIComponent(e.reason?.stack || e.reason));
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
