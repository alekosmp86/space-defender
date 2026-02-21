import "./App.css";
import { useEffect, useRef } from "react";
import { render } from "./render/renderer";
import { createKeyboardInput } from "./input/keyboardInput";
import { MessageType } from "./game/enums";
import { StateInterpolator } from "./game/interpolator";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const interpolatorRef = useRef<StateInterpolator>(new StateInterpolator());

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

    const inputController = createKeyboardInput();

    // Connect to server
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () =>
      socket.send(
        JSON.stringify({
          type: MessageType.INIT,
          dimensions: { width, height },
        }),
      );

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === MessageType.STATE) {
        interpolatorRef.current.addSnapshot(data.state);
      }
    };

    socket.onclose = () => console.log("Disconnected from server");

    // Render loop
    function loop() {
      const interpolatedState = interpolatorRef.current.getInterpolatedState(
        performance.now(),
      );

      if (interpolatedState) {
        render(ctx, interpolatedState, width, height);
      }

      // Send input every frame
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: MessageType.INPUT,
            input: inputController.getInput(),
          }),
        );
      }

      requestAnimationFrame(loop);
    }

    loop();
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
