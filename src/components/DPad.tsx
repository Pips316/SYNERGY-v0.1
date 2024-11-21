import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';

type Direction = { x: number; y: number };

interface DPadProps {
  onDirectionChange: (direction: Direction) => void;
}

export default function DPad({ onDirectionChange }: DPadProps) {
  const handleDirection = (x: number, y: number) => {
    onDirectionChange({ x, y });
  };

  return (
    <div className="grid grid-cols-3 gap-1 w-32 touch-none select-none">
      <div className="col-start-2">
        <button
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-300"
          onClick={() => handleDirection(0, -1)}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
      <div className="col-start-1 row-start-2">
        <button
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-300"
          onClick={() => handleDirection(-1, 0)}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="col-start-3 row-start-2">
        <button
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-300"
          onClick={() => handleDirection(1, 0)}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="col-start-2 row-start-2">
        <div className="w-10 h-10 bg-gray-900 rounded-lg" />
      </div>
      <div className="col-start-2 row-start-3">
        <button
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-300"
          onClick={() => handleDirection(0, 1)}
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}