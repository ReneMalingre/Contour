import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import '@fontsource/roboto/300.css'; // Weight 300.
import '@fontsource/roboto/400.css'; // Weight 400.
import '@fontsource/roboto/500.css'; // Weight 500.
import '@fontsource/roboto/700.css'; // Weight 700.
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { KattLensProvider } from './hooks/KattLensContext.js';

import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <KattLensProvider>
        <App />
      </KattLensProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
