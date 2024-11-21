import { useEffect, useRef } from 'react';

export function useGameLoop(
  update: () => void,
  draw: () => void,
  speed: number
) {
  const frameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const gameLoop = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current >= speed) {
        update();
        draw();
        lastUpdateRef.current = timestamp;
      }
      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [update, draw, speed]);
}