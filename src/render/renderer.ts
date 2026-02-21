import type { Bullet, Enemy, GameState, Player } from "../game/types";

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
) {
  ctx.clearRect(0, 0, width, height);

  // Draw player (triangle)
  drawPlayer(ctx, state.player);

  // Draw bullets
  drawBullets(ctx, state.bullets);

  // Draw enemies
  drawEnemies(ctx, state.enemies);

  // Draw score
  drawScore(ctx, state);
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  const x = Math.round(player.x);
  const y = Math.round(player.y);
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 15, y + 30);
  ctx.lineTo(x + 15, y + 30);
  ctx.closePath();
  ctx.fill();
}

function drawBullets(ctx: CanvasRenderingContext2D, bullets: Bullet[]) {
  ctx.fillStyle = "white";
  for (const bullet of bullets) {
    ctx.fillRect(Math.round(bullet.x) - 3, Math.round(bullet.y), 6, 12);
  }
}

function drawEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[]) {
  ctx.fillStyle = "red";
  for (const enemy of enemies) {
    ctx.fillRect(Math.round(enemy.x) - 15, Math.round(enemy.y), 30, 30);
  }
}

function drawScore(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.fillStyle = "yellow";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${state.score}`, 20, 30);
  ctx.fillText(`Level: ${state.level}`, 20, 60);
}
