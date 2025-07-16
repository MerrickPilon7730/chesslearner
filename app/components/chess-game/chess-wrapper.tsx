"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChessGame } from "./chess-game";
import { Chess } from "chess.js";

type Props = {
  setMoveHistory: React.Dispatch<React.SetStateAction<string[][]>>;
};

// This component acts as a wrapper for game state and UI controls
export function ChessWrapper({setMoveHistory}: Props) {
  // Tracks the player's side (white/black)
  const [side, setSide] = useState<"black" | "white">("white");
  // Formatted string for the button to switch sides
  const [string, setString] = useState<"Black" | "White">("Black");
  // Initializes a new chess game instance 
  const [game, setGame] = useState(new Chess());
  // Tracks if game is over, used for ending/resetting the game
  const [isGameOver, setIsGameOver] = useState(false);
  // Tracks the current difficulty/depth of Stockfish
  const [difficulty, setDifficulty] = useState(5);

  // Called when player wants to switch sides. It switches sides and resets the game.
  function onClick() {
    setSide(side === "white" ? "black" : "white");
    setString(string === "Black" ? "White" : "Black");
    setGame(new Chess());
    setIsGameOver(false);
  }

  // Resets the current game
  function resetGame() {
    setGame(new Chess());
    setIsGameOver(false);
  }

  return (
    <div className="w-full flex flex-col justify-center items-center px-4">
      <div className="w-full flex justify-start px-4 gap-4">
        <Button variant="default" onClick={onClick}>
          Play As {string}
        </Button>
        <Button variant="default" onClick={resetGame}>
          Reset
        </Button>

        <div className="flex items-center w-64 gap-2">
          <label
            htmlFor="difficulty"
            className="text-md text-white whitespace-nowrap "
          >
            Difficulty: {difficulty}
          </label>

          <input
            type="range"
            id="difficulty"
            min={1}
            max={20}
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="w-full flex justify-center mt-4">
        <ChessGame
          game={game}
          setGame={setGame}
          side={side}
          isGameOver={isGameOver}
          setIsGameOver={setIsGameOver}
          difficulty={difficulty}
          setMoveHistory={setMoveHistory}
        />
      </div>

    </div>
  );
}
