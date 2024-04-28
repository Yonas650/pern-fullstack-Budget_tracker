import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

//wrap the App component with a Bootstrap container class for consistent spacing and alignment
root.render(
  <React.StrictMode>
    <div className="container py-5"> 
      <App />
    </div>
  </React.StrictMode>
);
