import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center transition-opacity duration-1000">
      <div className="text-center">
        <h1 className="font-['Space_Grotesk'] text-7xl tracking-wider relative float">
          <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-orange-600/20 via-red-500/20 to-pink-600/20"></span>
          <span className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text 
            [text-shadow:0_0_30px_rgba(249,115,22,0.2)] animate-pulse">
            SYNERGY
          </span>
        </h1>
        <span className="text-orange-500/50 text-lg tracking-[0.2em] uppercase relative mt-4 block">
          <span className="absolute -inset-1 blur-md bg-orange-500/10"></span>
          <span className="relative">by Magnetic</span>
        </span>
      </div>
    </div>
  );
}