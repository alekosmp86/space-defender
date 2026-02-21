export type InputState = {
  move: -1 | 0 | 1;
  shoot: boolean;
};

export type Player = {
  x: number;
  y: number;
  cooldown: number;
};

export type Bullet = {
  x: number;
  y: number;
};

export type Enemy = {
  x: number;
  y: number;
  speed: number;
  pattern: "straight" | "zigzag";
  direction: -1 | 1;
};

export type GameState = {
  tick: number;
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  level: number;
  score: number;
  gameOver: boolean;
};
