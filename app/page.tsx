"use client";

import { useState } from "react";
import { Chess } from "chess.js"; 
import { Chessboard } from "react-chessboard";

type Move = {
  from: string;
  to: string;
  promotion?: string;
};

export default function Home() {
  const [game, setGame] = useState<Chess>(new Chess());

  function makeAMove(move: Move | string) {
    const gameCopy = new Chess(game.fen()); 
    const result = gameCopy.move(move);
    if (result) setGame(gameCopy);
    return result;
  }

  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
    });

    if (move === null) return false;
    return true;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-2 w-[90%]">
        <div className="flex items-center justify-center">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            areArrowsAllowed={true}
            showBoardNotation={true}
            boardOrientation="white"
            customNotationStyle={{
              color: "black",
            }}
          />
        </div>
        <div className="flex items-center justify-center">
          Other stuff
        </div>
      </div>
    </div>
  );
}
