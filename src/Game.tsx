import { useEffect, useRef, useState } from "react";
import { render } from "./render/renderer";
import { createKeyboardInput } from "./input/keyboardInput";
import { MessageType } from "./game/enums";
import { StateInterpolator } from "./game/interpolator";

interface GameProps {
  playerName: string;
}

export function Game({ playerName }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const interpolatorRef = useRef<StateInterpolator>(new StateInterpolator());
  const localPlayerIdRef = useRef<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);

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
          name: playerName,
          dimensions: { width, height },
        }),
      );

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === MessageType.ASSIGN_ID) {
        localPlayerIdRef.current = data.id;
      } else if (data.type === MessageType.STATE) {
        interpolatorRef.current.addSnapshot(data.state);
        setIsWaiting(data.state.waiting);
      }
    };

    socket.onclose = () => console.log("Disconnected from server");

    let frameId: number;

    // Render loop
    function loop() {
      const interpolatedState = interpolatorRef.current.getInterpolatedState(
        performance.now(),
      );

      if (interpolatedState) {
        render(
          ctx,
          interpolatedState,
          width,
          height,
          localPlayerIdRef.current || undefined,
        );
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

      frameId = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(frameId);
      socket.close();
      inputController.destroy();
    };
  }, [playerName]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
        }}
      />
      {isWaiting && (
        <div className='waiting-overlay'>Esperando por otro jugador...</div>
      )}
    </>
  );
}
