import { Colors } from "../game/enums";
import type { Bullet, Enemy, GameState, Player } from "../game/types";

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
  localPlayerId?: string,
) {
  ctx.clearRect(0, 0, width, height);

  for (const id in state.players) {
    drawPlayer(ctx, state.players[id], id === localPlayerId);
    drawPlayerName(ctx, state.players[id], id === localPlayerId);
  }
  drawBullets(ctx, state.bullets, localPlayerId);

  drawEnemies(ctx, state.enemies);

  drawScore(ctx, state);
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  isLocal: boolean,
) {
  const x = Math.round(player.x);
  const y = Math.round(player.y);
  ctx.fillStyle = isLocal ? Colors.PLAYER : Colors.OTHER_PLAYER;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 15, y + 30);
  ctx.lineTo(x + 15, y + 30);
  ctx.closePath();
  ctx.fill();
}

function drawPlayerName(
  ctx: CanvasRenderingContext2D,
  player: Player,
  isLocal: boolean,
) {
  const x = Math.round(player.x);
  const y = Math.round(player.y);
  ctx.fillStyle = isLocal ? Colors.PLAYER : Colors.OTHER_PLAYER;
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText(player.name, x, y + 50);
  ctx.textAlign = "start";
}

function drawBullets(
  ctx: CanvasRenderingContext2D,
  bullets: Bullet[],
  localPlayerId?: string,
) {
  for (const bullet of bullets) {
    ctx.fillStyle =
      bullet.playerId === localPlayerId
        ? Colors.PLAYER_BULLET
        : Colors.OTHER_PLAYER_BULLET;
    ctx.fillRect(Math.round(bullet.x) - 3, Math.round(bullet.y), 6, 12);
  }
}

function drawEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[]) {
  ctx.fillStyle = Colors.ENEMY;
  for (const enemy of enemies) {
    ctx.fillRect(Math.round(enemy.x) - 15, Math.round(enemy.y), 30, 30);
  }
}

function drawScore(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.fillStyle = Colors.SCORE;
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${state.score}`, 20, 30);
  ctx.fillText(`Level: ${state.level}`, 20, 60);
}
