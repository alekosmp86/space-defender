export const MessageType = {
  INPUT: "input",
  STATE: "state",
  INIT: "init",
  ASSIGN_ID: "assign_id",
} as const;
export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export const EnemyPattern = {
  STRAIGHT: "straight",
  ZIGZAG: "zigzag",
} as const;
export type EnemyPattern = (typeof EnemyPattern)[keyof typeof EnemyPattern];

export const Direction = {
  LEFT: -1,
  RIGHT: 1,
  NONE: 0,
} as const;
export type Direction = (typeof Direction)[keyof typeof Direction];

export const Colors = {
  PLAYER: "#00FF00",
  OTHER_PLAYER: "#00FFFF",
  PLAYER_BULLET: "#68fc68ff",
  OTHER_PLAYER_BULLET: "#91f8f8ff",
  ENEMY: "#FF0000",
  SCORE: "#FFFF00",
} as const;
export type Colors = (typeof Colors)[keyof typeof Colors];
