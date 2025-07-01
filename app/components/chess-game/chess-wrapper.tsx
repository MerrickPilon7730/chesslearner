"use client";

import { ChessGame } from "./chess-game";

export function ChessWrapper() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-[600px]">
        <ChessGame />
      </div>
    </div>
  );
}
