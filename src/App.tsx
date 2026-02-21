import "./App.css";
import { useEffect, useRef } from "react";
import { createInitialState, update } from "./game/engine";
import { TICK_INTERVAL } from "./game/constants";
import { render } from "./render/renderer";
import { createKeyboardInput } from "./input/keyboardInput";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.scale(dpr, dpr);

    const state = createInitialState(width, height);
    const inputController = createKeyboardInput();

    const interval = setInterval(() => {
      update(state, inputController.getInput(), width);
    }, TICK_INTERVAL);

    function loop() {
      render(ctx, state, width, height);
      requestAnimationFrame(loop);
    }

    loop();

    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}

export default App;
