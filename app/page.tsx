"use client";

import { useState } from "react";
import { Chess } from "chess.js"; 
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";

type Move = {
  from: string;
  to: string;
  promotion?: string;
};

export default function Home() {
  const [game, setGame] = useState<Chess>(new Chess());
  const [highlightedSquares, setHighlightedSquares] = useState<{ [square: string]: React.CSSProperties }>({});

  function onSquareClick(square: string) {
    const moves = game.moves({ square: square as Square, verbose: true }) as Array<{ to: string }>;

    if (moves.length === 0) {
      setHighlightedSquares({});
      return;
    }

    const newHighlights: { [square: string]: React.CSSProperties } = {};
    moves.forEach((move) => {
      newHighlights[move.to] = {
        boxShadow: "inset 0 0 0 10px #baca44",
      };

      });

    setHighlightedSquares(newHighlights);
  }

  function onPieceDragBegin(piece: string, sourceSquare: string) {
    const moves = game.moves({ square: sourceSquare as Square, verbose: true }) as Array<{ to: string }>;

    if (moves.length === 0) {
      setHighlightedSquares({});
      return;
    }

    const newHighlights: { [square: string]: React.CSSProperties } = {};
    moves.forEach((move) => {
      newHighlights[move.to] = {
        boxShadow: "inset 0 0 0 10px #baca44",
      };
    });

    setHighlightedSquares(newHighlights);
  }

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
    setHighlightedSquares({});
    return true;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-2 w-[90%]">
        <div className="flex items-center justify-center">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            onPieceDragBegin={onPieceDragBegin}
            customSquareStyles={highlightedSquares}
            areArrowsAllowed={true}
            showBoardNotation={true}
            boardOrientation="white"
          />
        </div>
        <div className="flex items-center justify-center">
          Other stuff
        </div>
      </div>
    </div>
  );
}
