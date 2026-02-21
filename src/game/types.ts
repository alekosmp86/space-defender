import type { Direction, EnemyPattern, MessageType } from "./enums";

export type InputState = {
  move: Direction;
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
  pattern: EnemyPattern;
  direction: Direction;
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

export type ClientMessage =
  | {
      type: typeof MessageType.INPUT;
      input: InputState;
    }
  | {
      type: typeof MessageType.INIT;
      dimensions: {
        width: number;
        height: number;
      };
};

export type ServerMessage = {
  type: MessageType;
  state: GameState;
};
