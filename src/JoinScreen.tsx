import React, { useState } from "react";

interface JoinScreenProps {
  onJoin: (name: string) => void;
}

export function JoinScreen({ onJoin }: JoinScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div className="join-screen">
      <div className="join-container">
        <h1>SPACE DEFENDERS</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={!name.trim()}>
            PLAY
          </button>
        </form>
      </div>
    </div>
  );
}
