import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/index.jsx';  // <-- sigue apuntando a index.jsx
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
