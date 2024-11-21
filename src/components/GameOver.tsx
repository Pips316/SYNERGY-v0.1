import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
  onShare: () => void;
}

export default function GameOver({ score, onRestart, onShare }: GameOverProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm rounded-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-4">Final Score: {score}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="px-8 py-3 text-lg font-semibold rounded-full border border-orange-500/30 hover:border-orange-500 transition-all duration-300 hover:bg-orange-500/10"
          >
            Play Again
          </button>
          <button
            onClick={onShare}
            className="px-8 py-3 text-lg font-semibold rounded-full border border-orange-500/30 hover:border-orange-500 transition-all duration-300 hover:bg-orange-500/10"
          >
            Share Score on X
          </button>
        </div>
      </div>
    </div>
  );
}