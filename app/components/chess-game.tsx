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

export function ChessGame() {
    const [game, setGame] = useState<Chess>(new Chess());
    const [highlightedSquares, setHighlightedSquares] = useState<{[square: string]: React.CSSProperties;}>({});

    function onSquareClick(square: string) {
        const moves = game.moves({square: square as Square, verbose: true,}) as Array<{ to: string }>;

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
        const moves = game.moves({square: sourceSquare as Square, verbose: true,}) as Array<{ to: string }>;

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
        try {
            const gameCopy = new Chess(game.fen());
            const result = gameCopy.move(move);

            if (result) {
                setGame(gameCopy);
            }

            return result;
        } catch (error) {
            console.warn("Invalid move attempted:", move, error);
            return null;
        }
    }

    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        const piece = game.get(sourceSquare as Square);
        const isPawn = piece?.type === "p";
        const isPromotionRank = (piece?.color === "w" && targetSquare[1] === "8") || (piece?.color === "b" && targetSquare[1] === "1");

        if(isPawn && isPromotionRank) return false;

        const move = makeAMove({from: sourceSquare, to: targetSquare,});

        if (move === null) return false;

        setHighlightedSquares({});

        return true;
    }

    function onPromotionCheck(sourceSquare: Square, targetSquare: Square, piece: string): boolean {

        if ((piece === "wP" && sourceSquare[1] === "7" && targetSquare[1] === "8") || (piece === "bP" && sourceSquare[1] === "2" && targetSquare[1] === "1")) {
            return true;
        }

        return false;
    }

    function onPromotionPieceSelect(piece?: string, promoteFromSquare?: Square,  promoteToSquare?: Square): boolean {
        if (!piece || !promoteFromSquare || !promoteToSquare) return false;

        const promotion = piece[piece.length - 1].toLowerCase() as "q" | "r" | "b" | "n";
        const move = makeAMove({ from: promoteFromSquare, to: promoteToSquare, promotion });

        if (move) {
            setHighlightedSquares({});
            return true;
        }

        return false;
    }

    return (
        <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        onSquareClick={onSquareClick}
        onPieceDragBegin={onPieceDragBegin}
        onPromotionCheck={onPromotionCheck}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customSquareStyles={highlightedSquares}
        areArrowsAllowed={true}
        showBoardNotation={true}
        boardOrientation="white"
        />
    );
}
