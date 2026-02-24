import { useState } from "react";
import "./App.css";
import { JoinScreen } from "./JoinScreen";
import { Game } from "./Game";

function App() {
  const [isJoined, setIsJoined] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const handleJoin = (name: string) => {
    setPlayerName(name);
    setIsJoined(true);
  };

  return (
    <div className="app-container">
      {!isJoined ? (
        <JoinScreen onJoin={handleJoin} />
      ) : (
        <Game playerName={playerName} />
      )}
    </div>
  );
}

export default App;
