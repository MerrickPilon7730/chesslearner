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

type props ={
    side: "black" | "white";
}

export function ChessGame({side}: props) {
    const [game, setGame] = useState<Chess>(new Chess());
    const [highlightedSquares, setHighlightedSquares] = useState<{[square: string]: React.CSSProperties;}>({});
    const [isGameOver, setIsGameOver] = useState(false);

    function onSquareClick(square: string) {
        if (isGameOver) return;

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
        if (isGameOver) return;

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

    function makeAMove(move: Move | string): Chess | null {
    try {
        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move(move);

        if (result) return gameCopy;

        return null;
    } catch (error) {
        console.warn("Invalid move attempted:", move, error);
        return null;
    }
    }



    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        if (isGameOver) return false;

        const piece = game.get(sourceSquare as Square);
        const isPawn = piece?.type === "p";
        const isPromotionRank =
            (piece?.color === "w" && targetSquare[1] === "8") ||
            (piece?.color === "b" && targetSquare[1] === "1");

        if (isPawn && isPromotionRank) return false;

        const updatedGame = makeAMove({ from: sourceSquare, to: targetSquare });

        if (!updatedGame) return false;

        setGame(updatedGame);

        if (updatedGame.isCheckmate()) {
            setIsGameOver(true);

            const loserColor = updatedGame.turn();
            const board = updatedGame.board();

            for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece?.type === "k" && piece.color === loserColor) {
                const file = String.fromCharCode("a".charCodeAt(0) + col);
                const rank = `${8 - row}`;
                const kingSquare = `${file}${rank}`;

                setHighlightedSquares({
                    [kingSquare]: {
                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                    },
                });
                }
            }
            }
        } else {
            setHighlightedSquares({});
        }

        return true;
    }



    function onPromotionCheck(sourceSquare: Square, targetSquare: Square, piece: string): boolean {

        if ((piece === "wP" && sourceSquare[1] === "7" && targetSquare[1] === "8") || (piece === "bP" && sourceSquare[1] === "2" && targetSquare[1] === "1")) {
            return true;
        }

        return false;
    }

    function onPromotionPieceSelect(piece?: string, promoteFromSquare?: Square, promoteToSquare?: Square): boolean {
        if (!piece || !promoteFromSquare || !promoteToSquare) return false;

        const promotion = piece[piece.length - 1].toLowerCase() as "q" | "r" | "b" | "n";
        const updatedGame = makeAMove({
            from: promoteFromSquare,
            to: promoteToSquare,
            promotion,
        });

        if (!updatedGame) return false;

        setGame(updatedGame);

        if (updatedGame.isCheckmate()) {
            setIsGameOver(true);

            const loserColor = updatedGame.turn() === "w" ? "b" : "w";
            const board = updatedGame.board();

            for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece?.type === "k" && piece.color === loserColor) {
                const file = String.fromCharCode("a".charCodeAt(0) + col);
                const rank = `${8 - row}`;
                const kingSquare = `${file}${rank}`;

                setHighlightedSquares({
                    [kingSquare]: {
                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                    },
                });
                }
            }
            }
        } else {
            setHighlightedSquares({});
        }

        return true;
    }


    return (
        <div className="w-full max-w-[700px] aspect-square">
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
                boardOrientation={side}
                arePiecesDraggable={!isGameOver}
            />
        </div>

    );
}
