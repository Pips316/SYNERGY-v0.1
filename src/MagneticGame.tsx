import React from 'react';
import Game from './components/Game';
import './index.css';

export interface MagneticGameProps {
  className?: string;
}

export default function MagneticGame({ className = '' }: MagneticGameProps) {
  return (
    <div className={className}>
      <Game />
    </div>
  );
}