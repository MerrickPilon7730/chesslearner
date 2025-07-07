"use client";

import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";
import { ChessResults } from "./chess-results";

type Move = {
  from: string;
  to: string;
  promotion?: string;
};

type props = {
    side: "black" | "white";
    game: Chess;
    setGame: (game: Chess) => void;
    isGameOver: boolean;
    setIsGameOver: (over: boolean) => void;
    difficulty: number;
}

export function ChessGame({side, game, setGame, isGameOver, setIsGameOver, difficulty}: props) {
    const [highlightedSquares, setHighlightedSquares] = useState<{[square: string]: React.CSSProperties;}>({});
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [winner, setWinner] = useState<"White" | "Black" | "Draw" | null>(null);

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

    const checkmate = useCallback((gameInstance: Chess) => {
        if (gameInstance.isCheckmate()) {
            const loserColor = gameInstance.turn(); 
            const board = gameInstance.board();

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
                        return; 
                    }
                }
            }
        } else {
            setHighlightedSquares({});
        }
    }, []);

    const handleAIMove = useCallback(async (fen: string) => {
        if (isProcessingAI || new Chess(fen).turn() === side[0]) return;

        setIsProcessingAI(true);
        console.log("Sending difficulty to API:", difficulty);

        try {
            const response = await fetch("/api/stockfish-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fen, difficulty }),
            });

            const data = await response.json();
            const bestMove: string = data.move;
            console.log("AI best move:", bestMove);

            if (bestMove?.length >= 4) {
                const aiFrom = bestMove.slice(0, 2);
                const aiTo = bestMove.slice(2, 4);
                const aiPromotion = bestMove.length === 5 ? bestMove[4] : undefined;

                const aiGameInstance = new Chess(fen);
                const aiGame = aiGameInstance.move({
                    from: aiFrom,
                    to: aiTo,
                    promotion: aiPromotion,
                });

                if (aiGame) {
                    setGame(aiGameInstance);

                    if (aiGameInstance.isCheckmate()) {
                        setIsGameOver(true);

                        const loser = aiGameInstance.turn(); 
                        const winnerColor = loser === 'w' ? 'Black' : 'White';

                        setWinner(winnerColor);
                    } else if (aiGameInstance.isDraw()){
                        setIsGameOver(true);
                        setWinner("Draw");
                    }

                    checkmate(aiGameInstance);
                } else {
                    console.warn("AI move was invalid for current position:", bestMove);
                }
            }
        } catch (err) {
            console.error("AI move failed:", err);
        } finally {
            setIsProcessingAI(false);
        }
    }, [side, checkmate, setGame, setIsGameOver, difficulty, isProcessingAI]);


    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        if (isGameOver) return false;

        if (game.turn() !== side[0]) return false;

        const piece = game.get(sourceSquare as Square);
        const isPawn = piece?.type === "p";
        const isPromotionRank = (piece?.color === "w" && targetSquare[1] === "8") || (piece?.color === "b" && targetSquare[1] === "1");

        if (isPawn && isPromotionRank) return false;

        const updatedGame = makeAMove({ from: sourceSquare, to: targetSquare });

        if (!updatedGame) return false;

        setGame(updatedGame);
        setHighlightedSquares({});

        if (updatedGame.isCheckmate()) {
            setIsGameOver(true);

            const loser = updatedGame.turn(); 
            const winnerColor = loser === 'w' ? 'Black' : 'White';

            setWinner(winnerColor);
        } else if (updatedGame.isDraw()){
            setIsGameOver(true);
            setWinner("Draw");
        }

        checkmate(updatedGame);

        if (updatedGame.turn() !== side[0]) {
            handleAIMove(updatedGame.fen());
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

            const loserColor = updatedGame.turn();
            const winnerColor = loserColor === 'w' ? 'Black' : 'White';

            setWinner(winnerColor);
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
        } else if (updatedGame.isDraw()){
            setIsGameOver(true);
        } else {
            setHighlightedSquares({});
        }

        return true;
    }

    function playAgain() {
        setIsGameOver(false);
        setWinner(null);
        setGame(new Chess());
    }

    useEffect(() => {
        if (game.turn() !== side[0]) {
            handleAIMove(game.fen());
        }
    }, [side, game, handleAIMove]);

    useEffect(() => {
        if (!game.isCheckmate()) {
            setHighlightedSquares({});
        }
    }, [game]);

    return (
        <div className="relative w-full max-w-[700px] aspect-square">
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

            {isGameOver && winner && (
                <ChessResults winner={winner} reset={playAgain} />
            )}
        </div>

    );
}
