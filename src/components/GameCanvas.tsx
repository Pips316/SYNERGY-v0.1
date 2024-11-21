import React, { useRef, useEffect } from 'react';
import { Position, Wave } from '../types/game';

interface GameCanvasProps {
  snake: Position[];
  collectible: Position;
  waves: Wave[];
  gridSize: number;
  cellSize: number;
  targetPosition: Position | null;
  invulnerable: boolean;
  justCollected?: boolean;
}

export default function GameCanvas({ 
  snake, 
  collectible, 
  waves, 
  gridSize, 
  cellSize,
  invulnerable,
  justCollected = false
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef<number>(0);

  const drawPulsingBorder = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const pulseIntensity = Math.sin(time * 0.004) * 0.5 + 0.5;
    const borderWidth = 12;
    
    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + pulseIntensity * 0.4})`;
    ctx.lineWidth = borderWidth;
    ctx.shadowBlur = 30;
    ctx.shadowColor = `rgba(255, 255, 255, ${0.8 + pulseIntensity * 0.2})`;
    
    ctx.beginPath();
    ctx.rect(
      borderWidth/2, 
      borderWidth/2, 
      width - borderWidth, 
      height - borderWidth
    );
    ctx.stroke();
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + pulseIntensity * 0.2})`;
    ctx.lineWidth = borderWidth * 1.5;
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.rect(
      borderWidth, 
      borderWidth, 
      width - borderWidth * 2, 
      height - borderWidth * 2
    );
    ctx.stroke();
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + pulseIntensity * 0.1})`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.rect(
      borderWidth * 2, 
      borderWidth * 2, 
      width - borderWidth * 4, 
      height - borderWidth * 4
    );
    ctx.stroke();
    
    ctx.restore();
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = 0.02;
    ctx.font = `${width * 0.2}px 'Space Grotesk', sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < 3; i++) {
      const offset = i * 50;
      const gradient = ctx.createLinearGradient(0, offset, width, height - offset);
      gradient.addColorStop(0, `rgba(249, 115, 22, ${0.1 - i * 0.02})`);
      gradient.addColorStop(0.5, `rgba(239, 68, 68, ${0.1 - i * 0.02})`);
      gradient.addColorStop(1, `rgba(236, 72, 153, ${0.1 - i * 0.02})`);
      ctx.fillStyle = gradient;

      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI / 16 + i * 0.1);
      ctx.fillText('MAGNETIC', 0, 0);
      ctx.rotate(Math.PI / 16 - i * 0.1);
      ctx.translate(-width / 2, -height / 2);
    }
    ctx.restore();
  };

  const drawOrb = (ctx: CanvasRenderingContext2D, x: number, y: number, time: number) => {
    const pulseIntensity = Math.sin(time * 0.005) * 0.5 + 0.5;
    const glowSize = 20 + pulseIntensity * 10;
    const orbSize = cellSize / 2 * (1 + pulseIntensity * 0.1);

    ctx.save();
    
    // Outer glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.8)');
    gradient.addColorStop(0.5, 'rgba(249, 115, 22, 0.3)');
    gradient.addColorStop(1, 'rgba(249, 115, 22, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#fb923c';
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(x, y, orbSize, 0, Math.PI * 2);
    ctx.fill();

    // Inner highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x - orbSize * 0.3, y - orbSize * 0.3, orbSize * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const draw = (timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current = timestamp;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBackground(ctx, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    waves.forEach(wave => {
      const waveGradient = ctx.createLinearGradient(
        wave.origin.x * cellSize,
        wave.origin.y * cellSize,
        (wave.origin.x + wave.direction.x * gridSize) * cellSize,
        (wave.origin.y + wave.direction.y * gridSize) * cellSize
      );
      
      const alpha = Math.sin(wave.progress * Math.PI) * 0.3;
      waveGradient.addColorStop(0, `rgba(147, 197, 253, 0)`);
      waveGradient.addColorStop(wave.progress, `rgba(147, 197, 253, ${alpha})`);
      waveGradient.addColorStop(Math.min(1, wave.progress + 0.1), 'rgba(147, 197, 253, 0)');
      
      ctx.fillStyle = waveGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = `rgba(147, 197, 253, ${alpha * 2})`;
      ctx.lineWidth = 2;
      const arrowLength = cellSize * 0.8;
      
      for (let i = 0; i < gridSize; i += 4) {
        for (let j = 0; j < gridSize; j += 4) {
          const x = i * cellSize + cellSize / 2;
          const y = j * cellSize + cellSize / 2;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + wave.direction.x * arrowLength,
            y + wave.direction.y * arrowLength
          );
          ctx.stroke();
        }
      }
    });

    snake.forEach((segment, i) => {
      const alpha = 1 - (i / snake.length) * 0.6;
      ctx.globalAlpha = alpha;
      
      if (i === 0) { // Head segment
        if (invulnerable) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
          ctx.fillStyle = '#ef4444';
        } else if (justCollected) {
          ctx.shadowBlur = 35;
          ctx.shadowColor = 'rgba(74, 222, 128, 0.9)';
          ctx.fillStyle = '#4ade80';
        } else {
          ctx.shadowBlur = 25;
          ctx.shadowColor = 'rgba(249, 115, 22, 0.8)';
          ctx.fillStyle = '#f97316';
        }

        const headX = segment.x * cellSize + cellSize / 2;
        const headY = segment.y * cellSize + cellSize / 2;
        const headSize = cellSize / 2 * (justCollected ? 1.1 : 1);

        if (justCollected) {
          const glowGradient = ctx.createRadialGradient(
            headX, headY, 0,
            headX, headY, headSize * 2
          );
          glowGradient.addColorStop(0, 'rgba(74, 222, 128, 0.4)');
          glowGradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(headX, headY, headSize * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(headX, headY, headSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const greenIntensity = 1 - (i / snake.length) * 0.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(74, 222, 128, ${0.4 * greenIntensity})`;
        ctx.fillStyle = `rgba(74, 222, 128, ${greenIntensity})`;
        ctx.beginPath();
        ctx.arc(
          segment.x * cellSize + cellSize / 2,
          segment.y * cellSize + cellSize / 2,
          cellSize / 2 * (1 - i / snake.length * 0.3),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    drawOrb(
      ctx,
      collectible.x * cellSize + cellSize / 2,
      collectible.y * cellSize + cellSize / 2,
      timestamp
    );

    drawPulsingBorder(ctx, canvas.width, canvas.height, timestamp);

    animationFrameRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [snake, collectible, waves, invulnerable, justCollected]);

  return (
    <canvas
      ref={canvasRef}
      width={gridSize * cellSize}
      height={gridSize * cellSize}
      className="border border-gray-700 rounded-lg shadow-lg"
    />
  );
}