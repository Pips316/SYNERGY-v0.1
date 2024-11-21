import React from 'react';
import { Target, Zap, Heart } from 'lucide-react';

interface GameStatsProps {
  score: number;
  length: number;
  lives: number;
}

export default function GameStats({ score, length, lives }: GameStatsProps) {
  return (
    <div className="mb-2 flex items-center gap-6 p-3 rounded-full border border-orange-500/30 bg-orange-500/5">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-orange-400" />
        <span className="text-lg font-bold">Score: {score}</span>
      </div>
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-green-400" />
        <span className="text-lg font-bold">Energy: {length}</span>
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart
            key={i}
            className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
}