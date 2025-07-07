"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChessGame } from "./chess-game";
import { Chess } from "chess.js";

export function ChessWrapper() {
  const [side, setSide] = useState<"black" | "white">("white");
  const [string, setString] = useState<"Black" | "White">("Black");
  const [game, setGame] = useState(new Chess());
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(5);

  function onClick() {
    setSide(side === "white" ? "black" : "white");
    setString(string === "Black" ? "White" : "Black");
    setGame(new Chess());
    setIsGameOver(false);
  }

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
        />
      </div>
    </div>
  );
}
