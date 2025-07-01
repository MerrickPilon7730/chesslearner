"use client";

import { ChessGame } from "./chess-game";

export function ChessWrapper() {
  return (
    <div className="w-full flex justify-center items-center">
        <ChessGame />
    </div>
  );
}
