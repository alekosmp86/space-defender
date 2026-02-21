import type { InputState } from "../game/types";

export function createKeyboardInput() {
  const input: InputState = {
    move: 0,
    shoot: false,
  };

  // ----- KEYBOARD -----
  const keys: Record<string, boolean> = {};

  window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
  });

  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });

  function updateKeyboardState() {
    if (keys["ArrowLeft"]) input.move = -1;
    else if (keys["ArrowRight"]) input.move = 1;
    else input.move = 0;

    input.shoot = !!keys["Space"];
  }

  return {
    getInput: () => {
      updateKeyboardState();
      return input;
    },
  };
}
