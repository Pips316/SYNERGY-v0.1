import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MagneticGame from './MagneticGame';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-black">
      <MagneticGame className="w-full max-w-2xl mx-auto" />
    </div>
  </StrictMode>
);