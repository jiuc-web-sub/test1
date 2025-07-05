import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './assets/css/variables.css';
import './assets/css/App.css';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);