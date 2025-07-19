"use client";

import { useState, useMemo } from "react";
import { Chess } from "chess.js";

import { Button } from "@/components/ui/button";

import { ChessGame } from "./chess-game";
import { WhiteCapturedPieces } from "./white-captured-pieces";
import { BlackCapturedPieces } from "./black-captured-pieces";
import { useCapturedPieces } from "@/hooks/useCapturedPieces";

type Props = {
  setMoveHistory: React.Dispatch<React.SetStateAction<string[][]>>;
  moveHistory: string[][];
};

// This component acts as a wrapper for game state and UI controls
export function ChessWrapper({setMoveHistory, moveHistory}: Props) {
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
	// Converts move history from string[][] to string[]
	const flatMoveHistory = useMemo(() => moveHistory.flat(), [moveHistory]);
	// Uses flatMoveHistory to keep track of pieces captured
	const {whiteCaptured, blackCaptured} = useCapturedPieces(flatMoveHistory);

	// Called when player wants to switch sides. It switches sides and resets the game.
	function onClick() {
		setSide(side === "white" ? "black" : "white");
		setString(string === "Black" ? "White" : "Black");
		setGame(new Chess());
		setIsGameOver(false);
		setMoveHistory([]);
	} 

	// Resets the current game
	function resetGame() {
		setGame(new Chess());
		setIsGameOver(false);
		setMoveHistory([]);
	}

	return (
		<div className="w-full flex flex-col justify-center items-center px-4">
			<div className="w-full flex justify-center px-4 gap-4">
				<Button variant="default" onClick={onClick}>
					Play As {string}
				</Button>
				<Button variant="default" onClick={resetGame}>
					Reset
				</Button>

				<div className="flex items-center w-64 gap-2">
					<label
						htmlFor="difficulty"
						className="text-md whitespace-nowrap "
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
				<BlackCapturedPieces pieces={blackCaptured}/>
				<ChessGame
					game={game}
					setGame={setGame}
					side={side}
					isGameOver={isGameOver}
					setIsGameOver={setIsGameOver}
					difficulty={difficulty}
					setMoveHistory={setMoveHistory}
					/>
					<WhiteCapturedPieces pieces={whiteCaptured}/>
			</div>

		</div>
	);
}
