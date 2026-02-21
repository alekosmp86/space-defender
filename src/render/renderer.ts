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
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(player.x - 15, player.y + 30);
  ctx.lineTo(player.x + 15, player.y + 30);
  ctx.closePath();
  ctx.fill();
}

function drawBullets(ctx: CanvasRenderingContext2D, bullets: Bullet[]) {
  ctx.fillStyle = "white";
  for (const bullet of bullets) {
    ctx.fillRect(bullet.x - 3, bullet.y, 6, 12);
  }
}

function drawEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[]) {
  ctx.fillStyle = "red";
  for (const enemy of enemies) {
    ctx.fillRect(enemy.x - 15, enemy.y, 30, 30);
  }
}

function drawScore(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.fillStyle = "yellow";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${state.score}`, 20, 30);
  ctx.fillText(`Level: ${state.level}`, 20, 60);
}
