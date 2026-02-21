import { PLAYER_SPEED, BULLET_SPEED } from "./constants";
import type { GameState, InputState } from "./types";

export function createInitialState(width: number, height: number): GameState {
  return {
    tick: 0,
    player: {
      x: width / 2,
      y: height - 60,
      cooldown: 0,
    },
    bullets: [],
    enemies: [],
    level: 1,
    score: 0,
    gameOver: false,
  };
}

function isColliding(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function update(
  state: GameState,
  input: InputState,
  width: number,
): void {
  state.tick++;

  // Move player
  movePlayer(state, input, width);

  // Shooting cooldown
  playerShoot(state, input);

  // Update bullets
  updateBullets(state);

  // Spawn enemies
  spawnEnemies(state, width);

  // Update enemies
  updateEnemies(state, width);

  // Check game over
  checkGameOver(state);
}

function checkGameOver(state: GameState) {
  if (state.score >= state.level * 200) {
    state.level++;
  }

  for (const enemy of state.enemies) {
    if (isColliding(enemy.x - 20, enemy.y, 40, 40, state.player.x, state.player.y, 40, 40)) {
      state.gameOver = true;
      console.log("Game Over");
      break;
    }
  }
}

function movePlayer(state: GameState, input: InputState, width: number) {
  state.player.x += input.move * PLAYER_SPEED;

  if (state.player.x < 20) state.player.x = 20;
  if (state.player.x > width - 20) state.player.x = width - 20;
}

function playerShoot(state: GameState, input: InputState) {
  if (state.player.cooldown > 0) {
    state.player.cooldown--;
  }

  if (input.shoot && state.player.cooldown <= 0) {
    state.bullets.push({
      x: state.player.x,
      y: state.player.y,
    });

    state.player.cooldown = 20;
  }
}

function updateBullets(state: GameState) {
  for (let i = state.bullets.length - 1; i >= 0; i--) {
    const bullet = state.bullets[i];
    bullet.y -= BULLET_SPEED;

    let hit = false;

    for (let j = state.enemies.length - 1; j >= 0; j--) {
      const enemy = state.enemies[j];

      if (
        isColliding(
          bullet.x - 3,
          bullet.y,
          6,
          12,
          enemy.x - 20,
          enemy.y,
          40,
          40,
        )
      ) {
        state.enemies.splice(j, 1);
        state.score += 10;
        hit = true;
        break;
      }
    }

    if (hit || bullet.y < 0) {
      state.bullets.splice(i, 1);
    }
  }
}

function spawnEnemies(state: GameState, width: number): void {
  if (state.tick % (60 - state.level * 5) === 0) {
    console.log("spawn");
    state.enemies.push({
      x: Math.random() * (width - 40) + 20,
      y: -20,
      speed: 2 + state.level * 0.5,
      pattern: state.level >= 3 ? "zigzag" : "straight",
      direction: Math.random() > 0.5 ? 1 : -1,
    });
  }
}

function updateEnemies(state: GameState, width: number) {
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];

    enemy.y += enemy.speed;

    if (enemy.pattern === "zigzag") {
      enemy.x += enemy.direction * 2;

      if (enemy.x < 20 || enemy.x > width - 20) {
        enemy.direction *= -1;
      }
    }

    // Remove if off screen
    if (enemy.y > 1000) {
      state.enemies.splice(i, 1);
    }
  }
}
