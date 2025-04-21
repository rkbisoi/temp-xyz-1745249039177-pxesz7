// import { StrictMode } from 'react';
import "./utils/fetchInterceptor.ts";
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fontsource/poppins';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>
);
