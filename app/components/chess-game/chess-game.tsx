"use client";

import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";
import { ChessResults } from "./modals/chess-results";
import { ChessStart } from "./modals/chess-start";
import { PlayAs } from "./modals/play-as";

// Move type (Moving pieces from, to and optional promotion for pawns)
type Move = {
  from: string;
  to: string;
  promotion?: string;
};

// Properties expected by the ChessGame component
type props = {
    // Player side
    side: "black" | "white";
    // Chess game instance
    game: Chess;
    // Setter for game state
    setGame: (game: Chess) => void;
    // Whether the game is over
    isGameOver: boolean;
    // Setter for game over state
    setIsGameOver: (over: boolean) => void;
    // Difficulty/depth for Stockfish
    difficulty: number;
    // Function to set difficulty level
    setDifficulty: (difficulty: number) => void;
    // Tracks all moves made
    setMoveHistory: React.Dispatch<React.SetStateAction<string[][]>>;
    // Boolean for showing the playAs modal
    showSwitchSides: boolean;
    // Function to handle confirmation of switching color/sides
    switchSidesConfirm: () => void;
    // Function to handle declining of switching color/sides
    switchSidesCancel: () => void;
}

export function ChessGame({side, game, setGame, isGameOver, setIsGameOver, difficulty, setDifficulty, setMoveHistory, showSwitchSides, switchSidesConfirm, switchSidesCancel}: props) {
    // Highlights legal moves 
    const [legalMoveHighlights, setLegalMoveHighlights] = useState<{[square: string]: React.CSSProperties;}>({});
    // Highlights check/mates
    const [checkhighlights, setCheckHighlights] = useState<{[square: string]: React.CSSProperties;}>({});
    // Controls whether an AI move is in progress
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    // Holds the winner for displaying game results
    const [winner, setWinner] = useState<"White" | "Black" | "Draw" | null>(null);
    // Used for the starting prompt for difficulty
    const [gameStart, setGameStart] = useState(true);

    function isPlayerPiece(square: Square): boolean {
        const piece = game.get(square);
        return piece?.color === side[0];
    }

    // Shows legal moves for piece that is clicked
    function onSquareClick(square: string) {
        if (isGameOver || !isPlayerPiece(square as Square)) return;

        // An array of legal moves
        const moves = game.moves({square: square as Square, verbose: true,}) as Array<{ to: string }>;

        // If no legal moves for a piece clear the highlighted squares
        if (moves.length === 0) {
            setLegalMoveHighlights({});
            return;
        }

        // Create a new object to store highlighted square styles
        const newHighlights: { [square: string]: React.CSSProperties } = {};

        // Loop through each legal move for the selected piece
        moves.forEach((move) => {
            // Highlight the destination square
            newHighlights[move.to] = {
                boxShadow: "inset 0 0 0 5px #baca44",
                backgroundColor: "transparent", 
            };
        });

        // Set the highlighted squares
        setLegalMoveHighlights(newHighlights);
    }

    // Same as onSquareClick but starts when a piece is being dragged
    function onPieceDragBegin(piece: string, sourceSquare: string) {
        if (isGameOver || !isPlayerPiece(sourceSquare as Square)) return;

        const moves = game.moves({square: sourceSquare as Square, verbose: true,}) as Array<{ to: string }>;

        if (moves.length === 0) {
            setLegalMoveHighlights({});
            return;
        }

        const newHighlights: { [square: string]: React.CSSProperties } = {};

        moves.forEach((move) => {
            newHighlights[move.to] = {
                boxShadow: "inset 0 0 0 5px #baca44",
                backgroundColor: "transparent", 
            };
        });

        setLegalMoveHighlights(newHighlights);
    }

    // Handles the player making a move and returns the updated game state is valid
    function makeAMove(move: Move | string): Chess | null {
        try {
            // Create a copy of the current game state to avoid mutating the origional
            const gameCopy = new Chess(game.fen());
            // Attempt to make the move on the copied board
            const result = gameCopy.move(move);
            // Log the move in UCI format (to and from e.g. e2d4 )
            console.log("Player move:", result.from + result.to);

            // If the move is valid return the updated game state
            if (result) return gameCopy;

            // If the move is invalid return null
            return null;
        } catch (error) {
            // Handle any errors (invalid moves)
            console.warn("Invalid move attempted:", move, error);
            return null;
        }
    }

    // Highlights the king's square red when checkmated
    const kingThreats = useCallback((gameInstance: Chess) => {
        // Get the current board layout as a 2D array
        const board = gameInstance.board();
        // Check if king is in check
        const isCheck = gameInstance.inCheck();
        // Check if king is mated
        const isMate = gameInstance.isCheckmate();

        // Determine the threatened king
        const kingColor = gameInstance.turn();
        let kingSquare: string | null = null;
            
        // Loop through each square on the board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece?.type === "k" && piece.color === kingColor) {
                    const file = String.fromCharCode("a".charCodeAt(0) + col);
                    const rank = `${8 - row}`;
                    kingSquare = `${file}${rank}`;
                    break;
                }
            }
        }

        // If no check/mate clear highlighted squares
        if (!isCheck && !isMate) {
            setCheckHighlights({});
            return;
        }

        if (kingSquare) {
            const highlightStyle = isMate
                ? { backgroundColor: "rgba(255, 0, 0, 0.6)" } 
                : {
                    boxShadow: "inset 0 0 0 5px rgba(255, 0, 0, 0.6)",
                    backgroundColor: "transparent", 
                };

            setCheckHighlights({
                [kingSquare]: highlightStyle,
            });
        }
    }, []);

    // Sends FEN(Forsyth-Edwards Notation) and difficulty/depth to the API to get the best move from Stockfish
    const handleAIMove = useCallback(async (fen: string) => {
        // Prevents AI from moving if it's not its turn or if it is processing a move
        if (isProcessingAI || new Chess(fen).turn() === side[0]) return;

        // Lock AI processing to prevent duplicate calls
        setIsProcessingAI(true);
        console.log("Sending difficulty to API:", difficulty);

        try {
            // Send current position and difficulty/depth to Stockfish API
            const response = await fetch("/api/stockfish-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fen, difficulty }),
            });

            const data = await response.json();
            const bestMove: string = data.move;
            console.log("AI best move:", bestMove);

            // Ensure best move in valid format (e2e4 etc)
            if (bestMove?.length >= 4) {
                const aiFrom = bestMove.slice(0, 2);
                const aiTo = bestMove.slice(2, 4);
                const aiPromotion = bestMove.length === 5 ? bestMove[4] : undefined;

                // Apply Stockfish move
                const aiGameInstance = new Chess(fen);
                const aiGame = aiGameInstance.move({
                    from: aiFrom,
                    to: aiTo,
                    promotion: aiPromotion,
                });

                if (aiGame) {
                    // Update game state with move from Stockfish
                    setGame(aiGameInstance);

                    const lastMove = aiGameInstance.history({ verbose: true }).at(-1);
                    if (lastMove) {
                        setMoveHistory((prev) => {
                            const newHistory = [...prev];
                            if (lastMove.color === "w") {
                                newHistory.push([lastMove.san]);
                            } else {
                            const last = newHistory.pop() || [""];
                                last[1] = lastMove.san;
                                newHistory.push(last);
                            }
                            return newHistory;
                        });
                    }

                    // Check for chekmate afterStockfish moves
                    if (aiGameInstance.isCheckmate()) {
                        setIsGameOver(true);

                        const loser = aiGameInstance.turn(); 
                        const winnerColor = loser === 'w' ? 'Black' : 'White';

                        setWinner(winnerColor);
                        //Check for draw
                    } else if (aiGameInstance.isDraw()){
                        setIsGameOver(true);
                        setWinner("Draw");
                    }

                    // Highlight losing king
                    kingThreats(aiGameInstance);
                } else {
                    // Log illegal moves
                    console.warn("AI move was invalid for current position:", bestMove);
                }
            }
        } catch (err) {
            // Handle API or parsing errors
            console.error("AI move failed:", err);
        } finally {
            // Clear AI processing flag
            setIsProcessingAI(false);
        }
    }, [side, kingThreats, setGame, setIsGameOver, difficulty, isProcessingAI, setMoveHistory]);

    // Handles the logic when a piece is dropped on target square 
    function onDrop(sourceSquare: string, targetSquare: string): boolean {
        // Prevents any moves if the game is already over
        if (isGameOver) return false;

        // Only allows moves for the player whose turn it is
        if (game.turn() !== side[0]) return false;

        // Get the piece on the source square
        const piece = game.get(sourceSquare as Square);
        // Check if the piece is a pawn
        const isPawn = piece?.type === "p";
        // If it is a pawn, check to see if it's being promoted (moved to the 1st/8th rank)
        const isPromotionRank = (piece?.color === "w" && targetSquare[1] === "8") || (piece?.color === "b" && targetSquare[1] === "1");

        // Stops the pawn from moving until a promotion piece is selected
        if (isPawn && isPromotionRank) return false;

        // Returns updated game state if move is valid
        const updatedGame = makeAMove({ from: sourceSquare, to: targetSquare });

        // If move is invalid exit
        if (!updatedGame) return false;

        // Update the game state
        setGame(updatedGame);
        // Clear any highlighted squares
        setLegalMoveHighlights({});

        const lastMove = updatedGame.history({ verbose: true }).at(-1);
        if (lastMove) {
            setMoveHistory((prev) => {
                const newHistory = [...prev];
                if (lastMove.color === "w") {
                    // White's turn, start a new row
                    newHistory.push([lastMove.san]);
                } else {
                    // Black's turn, update last row
                    const last = newHistory.pop() || [""];
                    last[1] = lastMove.san;
                    newHistory.push(last);
                }
                return newHistory;
            });
        }

        // Check for checkmate
        if (updatedGame.isCheckmate()) {
            setIsGameOver(true);

            const loser = updatedGame.turn(); 
            const winnerColor = loser === 'w' ? 'Black' : 'White';

            setWinner(winnerColor);
        // Check for draw
        } else if (updatedGame.isDraw()){
            setIsGameOver(true);
            setWinner("Draw");
        }

        // Call Checkmate function to handle that logic
        kingThreats(updatedGame);

        // Trigger the AI move 
        if (updatedGame.turn() !== side[0]) {
            handleAIMove(updatedGame.fen());
        }

        // Move was successful
        return true;
    }

    // Checks if a pawn move qualifies for a promotion
    function onPromotionCheck(sourceSquare: Square, targetSquare: Square, piece: string): boolean {

        // Check if white pawn is moving from the 7th to 8th rank and if a black pawn is moving from the 2nd rank to the 1st
        if ((piece === "wP" && sourceSquare[1] === "7" && targetSquare[1] === "8") || (piece === "bP" && sourceSquare[1] === "2" && targetSquare[1] === "1")) {
            // Return true, a pawn needs to be promoted
            return true;
        }

        // Resturn false, a pawn is not being promoted
        return false;
    }

    // Handles the logic after a user selects a piece for pawn promotion
    function onPromotionPieceSelect(piece?: string, promoteFromSquare?: Square, promoteToSquare?: Square): boolean {
        // Ensure all required parameters are provided
        if (!piece || !promoteFromSquare || !promoteToSquare) return false;

        // Extract the last character of the piece string and convert to lowercase to get promotion type (e.g., "q", "r", "b", "n")
        const promotion = piece[piece.length - 1].toLowerCase() as "q" | "r" | "b" | "n";
        // Attempt to make the promotion move
        const updatedGame = makeAMove({
            from: promoteFromSquare,
            to: promoteToSquare,
            promotion,
        });

        // If the move is invalid, return false
        if (!updatedGame) return false;

        // Update the game state
        setGame(updatedGame);

        // Check for king threats check/mate
        kingThreats(updatedGame);

        if (updatedGame.isCheckmate()) {
            setIsGameOver(true);
            const loserColor = updatedGame.turn();
            const winnerColor = loserColor === "w" ? "Black" : "White";
            setWinner(winnerColor);
        } else if (updatedGame.isDraw()) {
            setIsGameOver(true);
        }

        // Promotion successful
        return true;
    }

    function canDragPiece({ piece }: { piece: string }): boolean {
        if (isGameOver) return false;

        const currentTurn = game.turn(); 
        const pieceColor = piece[0];     

        return pieceColor === side[0] && currentTurn === side[0];
    }


    // Resets game state to allow a new game and initializes a new game instance
    function playAgain() {
        setIsGameOver(false);
        setWinner(null);
        setGame(new Chess());
        setMoveHistory([]);
        setCheckHighlights({});
        setLegalMoveHighlights({});
    }

    // useEffect to trigger the AI move
    useEffect(() => {
        // If it's the AI's trun, call handleAIMove
        if (game.turn() !== side[0]) {
            handleAIMove(game.fen());
        }
    }, [side, game, handleAIMove]);

    // useEffect to clear highlights if the game is not in check/mate
    useEffect(() => {
        if (game.isCheckmate() || game.isCheck()) {
            kingThreats(game);
        }
        else{
            setLegalMoveHighlights({});
        }
    }, [game, kingThreats]);

    return (
        <div className="relative w-full max-w-[700px] border-2 dark:border-2 aspect-square">
            <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                onSquareClick={onSquareClick}
                onPieceDragBegin={onPieceDragBegin}
                onPromotionCheck={onPromotionCheck}
                onPromotionPieceSelect={onPromotionPieceSelect}
                customSquareStyles={{...legalMoveHighlights, ...checkhighlights}}
                areArrowsAllowed={true}
                showBoardNotation={true}
                boardOrientation={side}
                arePiecesDraggable={!isGameOver}
                isDraggablePiece={canDragPiece}
            />

            {isGameOver && winner && (
                <ChessResults 
                    winner={winner} 
                    reset={playAgain}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty} 
                />
            )}

            {gameStart && (
                <ChessStart 
                setGameStart={setGameStart} 
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                />
            )}

            {showSwitchSides && (
				<PlayAs
					onConfirm={switchSidesConfirm}
					onCancel={switchSidesCancel}
				/>
			)}
        </div>

    );
}
