export type Position = {
  x: number;
  y: number;
};

export type Wave = {
  origin: Position;
  direction: Position;
  strength: number;
  progress: number;
};