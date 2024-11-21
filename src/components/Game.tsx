import React, { useState, useEffect } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { Position, Wave } from '../types/game';
import GameStats from './GameStats';
import GameOver from './GameOver';
import GameCanvas from './GameCanvas';
import Controls from './Controls';
import { ArrowLeft } from 'lucide-react';

const CELL_SIZE = 15;
const GRID_SIZE = 24;
const INITIAL_SPEED = 400;
const MIN_SPEED = 150;
const SPEED_DECREASE_PER_COLLECT = 5;
const WAVE_FORCE = 0.15;
const WAVE_SPAWN_CHANCE = 0.03;
const MAX_WAVES = 2;
const COLLISION_THRESHOLD = 0.8;
const INITIAL_LIVES = 3;
const INVULNERABILITY_FRAMES = 15;
const WALL_BUFFER = 0.4;
const DANGER_ZONE = 2.0;
const BORDER_OFFSET = 0.2;

export default function Game() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState<Position[]>([{ x: 12, y: 12 }]);
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [collectible, setCollectible] = useState<Position>({ x: 18, y: 12 });
  const [waves, setWaves] = useState<Wave[]>([]);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [invulnerabilityFrames, setInvulnerabilityFrames] = useState(0);
  const [justCollected, setJustCollected] = useState(false);

  const checkWallCollision = (pos: Position): boolean => {
    const offset = WALL_BUFFER + BORDER_OFFSET;
    return (
      pos.x < offset || 
      pos.x > GRID_SIZE - offset ||
      pos.y < offset || 
      pos.y > GRID_SIZE - offset
    );
  };

  const checkNearWall = (pos: Position): boolean => {
    return (
      pos.x < DANGER_ZONE || 
      pos.x > GRID_SIZE - DANGER_ZONE ||
      pos.y < DANGER_ZONE || 
      pos.y > GRID_SIZE - DANGER_ZONE
    );
  };

  const spawnCollectible = () => {
    let newPos: Position;
    do {
      newPos = {
        x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
        y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
      };
    } while (
      snake.some(segment => 
        Math.abs(segment.x - newPos.x) < 1 && 
        Math.abs(segment.y - newPos.y) < 1
      ) ||
      checkWallCollision(newPos)
    );
    setCollectible(newPos);
  };

  const spawnWave = () => {
    if (Math.random() > WAVE_SPAWN_CHANCE || waves.length >= MAX_WAVES) return;
    
    const edge = Math.floor(Math.random() * 4);
    const position = Math.floor(Math.random() * GRID_SIZE);
    
    const wave: Wave = {
      origin: edge === 0 ? { x: position, y: -1 } :
             edge === 1 ? { x: GRID_SIZE, y: position } :
             edge === 2 ? { x: position, y: GRID_SIZE } :
                         { x: -1, y: position },
      direction: edge === 0 ? { x: 0, y: 1 } :
                edge === 1 ? { x: -1, y: 0 } :
                edge === 2 ? { x: 0, y: -1 } :
                            { x: 1, y: 0 },
      strength: WAVE_FORCE,
      progress: 0
    };
    
    setWaves(prev => [...prev, wave]);
  };

  const turnLeft = () => {
    setDirection(prev => ({
      x: prev.y,
      y: -prev.x
    }));
  };

  const turnRight = () => {
    setDirection(prev => ({
      x: -prev.y,
      y: prev.x
    }));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') turnLeft();
    if (e.key === 'ArrowRight') turnRight();
  };

  const shareScore = () => {
    const tweet = `✨ I just hit ${score} in Synergy – aligning with the Magnetic Field and building my $MAG energy! ⚡\n\nAre you ready to challenge me and embrace the Shift? Align, grow, and dominate! 🌌\n\n#Synergy #MAGnetic #AlignYourEnergy\n🎮 GetMag.xyz`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`);
  };

  const moveSnake = () => {
    if (gameOver) return;

    if (invulnerabilityFrames > 0) {
      setInvulnerabilityFrames(prev => prev - 1);
    }

    if (justCollected) {
      setJustCollected(false);
    }

    const head = snake[0];
    let newDirection = { ...direction };

    let totalForceX = 0;
    let totalForceY = 0;
    
    waves.forEach(wave => {
      const waveForce = Math.sin(wave.progress * Math.PI) * wave.strength;
      totalForceX += wave.direction.x * waveForce;
      totalForceY += wave.direction.y * waveForce;
    });

    setWaves(prev => prev
      .map(wave => ({
        ...wave,
        progress: wave.progress + 0.02
      }))
      .filter(wave => wave.progress < 1)
    );

    const newHead = {
      x: head.x + newDirection.x + totalForceX,
      y: head.y + newDirection.y + totalForceY
    };

    if (checkWallCollision(newHead)) {
      setGameOver(true);
      return;
    }

    if (invulnerabilityFrames === 0) {
      const collision = snake.slice(1).some(segment => {
        const dx = Math.abs(segment.x - newHead.x);
        const dy = Math.abs(segment.y - newHead.y);
        return dx < COLLISION_THRESHOLD && dy < COLLISION_THRESHOLD;
      });

      if (collision) {
        if (lives > 1) {
          setLives(prev => prev - 1);
          setInvulnerabilityFrames(INVULNERABILITY_FRAMES);
        } else {
          setGameOver(true);
          return;
        }
      }
    }

    const collectibleCollision = 
      Math.abs(newHead.x - collectible.x) < 0.8 && 
      Math.abs(newHead.y - collectible.y) < 0.8;

    if (collectibleCollision) {
      setScore(s => s + 100);
      setSnake(prev => [newHead, ...prev]);
      spawnCollectible();
      setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_DECREASE_PER_COLLECT));
      setJustCollected(true);
    } else {
      setSnake(prev => [newHead, ...prev.slice(0, -1)]);
    }
  };

  useGameLoop(moveSnake, () => {}, speed);

  useEffect(() => {
    const interval = setInterval(spawnWave, 1000);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleRestart = () => {
    setSnake([{ x: 12, y: 12 }]);
    setDirection({ x: 1, y: 0 });
    setLives(INITIAL_LIVES);
    spawnCollectible();
    setWaves([]);
    setScore(0);
    setGameOver(false);
    setSpeed(INITIAL_SPEED);
    setInvulnerabilityFrames(0);
    setJustCollected(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="flex flex-col items-center gap-2 mb-4">
        <h1 className="font-['Space_Grotesk'] text-5xl tracking-wider relative">
          <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-orange-600/20 via-red-500/20 to-pink-600/20"></span>
          <span className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-transparent bg-clip-text 
            [text-shadow:0_0_30px_rgba(249,115,22,0.2)] animate-pulse">
            SYNERGY
          </span>
        </h1>
        <span className="text-orange-500/50 text-sm tracking-[0.2em] uppercase relative">
          <span className="absolute -inset-1 blur-md bg-orange-500/10"></span>
          <span className="relative">by Magnetic</span>
        </span>
      </div>
      
      <GameStats score={score} length={snake.length} lives={lives} />
      
      <div className="relative touch-none">
        <GameCanvas
          snake={snake}
          collectible={collectible}
          waves={waves}
          gridSize={GRID_SIZE}
          cellSize={CELL_SIZE}
          targetPosition={null}
          invulnerable={invulnerabilityFrames > 0}
          justCollected={justCollected}
        />
        
        {gameOver && <GameOver score={score} onRestart={handleRestart} onShare={shareScore} />}
      </div>

      <div className="mt-4">
        <Controls onTurnLeft={turnLeft} onTurnRight={turnRight} />
      </div>

      <div className="mt-4 text-gray-400 text-sm text-center bg-gradient-to-b from-gray-800/50 to-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
        <p className="mb-1 text-orange-300">How to play:</p>
        <p>Use left/right buttons or arrow keys to turn.</p>
        <p>Collect the MAG orbs to grow and score points.</p>
        <p>Polarity Surges will try to push you - fight against them!</p>
        <p>You have 3 lives - hitting yourself costs 1 life.</p>
        <p>Hitting the walls is instant game over!</p>
        <p className="mt-2 text-orange-400">BECOME ALIGNED - MAG</p>
      </div>

      <a 
        href="https://GetMag.xyz" 
        className="mt-6 px-6 py-3 rounded-full border border-orange-500/30 hover:border-orange-500 transition-all duration-300 hover:bg-orange-500/10 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Go Back
      </a>
    </div>
  );
}