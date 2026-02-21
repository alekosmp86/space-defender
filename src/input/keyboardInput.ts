import type { InputState } from "../game/types";

export function createKeyboardInput() {
  const input: InputState = {
    move: 0,
    shoot: false,
  };

  // ----- KEYBOARD -----
  const keys: Record<string, boolean> = {};

  const onKeyDown = (e: KeyboardEvent) => {
    keys[e.code] = true;
  };

  const onKeyUp = (e: KeyboardEvent) => {
    keys[e.code] = false;
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

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
    destroy: () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    },
  };
}
