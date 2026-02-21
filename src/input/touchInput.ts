import type { InputState } from "../game/types";

export function createTouchInput(canvas: HTMLCanvasElement) {
  const input: InputState = {
    move: 0,
    shoot: false,
  };

  canvas.style.touchAction = "none";

  function handleTouch(e: TouchEvent) {
    if (e.touches.length === 0) {
      input.move = 0;
      input.shoot = false;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;

    if (x < rect.width / 2) {
      input.move = -1;
    } else {
      input.move = 1;
    }

    input.shoot = true; // auto-fire
  }

  canvas.addEventListener("touchstart", handleTouch);
  canvas.addEventListener("touchmove", handleTouch);
  canvas.addEventListener("touchend", () => {
    input.move = 0;
    input.shoot = false;
  });

  return {
    getInput: () => input,
  };
}
