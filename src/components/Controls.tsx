import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ControlsProps {
  onTurnLeft: () => void;
  onTurnRight: () => void;
}

export default function Controls({ onTurnLeft, onTurnRight }: ControlsProps) {
  return (
    <div className="flex gap-8">
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full border border-orange-500/30 hover:border-orange-500 transition-all duration-300 hover:bg-orange-500/10 text-gray-300"
        onClick={onTurnLeft}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full border border-orange-500/30 hover:border-orange-500 transition-all duration-300 hover:bg-orange-500/10 text-gray-300"
        onClick={onTurnRight}
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}