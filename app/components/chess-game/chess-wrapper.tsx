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
	// Gives each piece a number value
	const pieceValues: Record<string, number> = {
		p: 1, n: 3, b: 3, r: 5, q: 9,
	};
	// Show modal for switching sids
	const [showSwitchSides, setShowSwitchSides] =  useState(false);
	// Show modal for resetting game
	const [showResetGame, setShowResetGame] = useState(false);
	// Show modal for changing game difficulty
	const [showChangeDifficulty, setShowChangeDifficulty] = useState(false);

	function calcPoints(pieces: string[]) {
		return pieces.reduce((acc, p) => acc + (pieceValues[p.toLowerCase()] ?? 0), 0);
	}

	const whiteScore = calcPoints(whiteCaptured);
	const blackScore = calcPoints(blackCaptured);

	const showWhiteScore = whiteScore > blackScore;
	const showBlackScore = blackScore > whiteScore;

	// Called when player wants to switch sides.
	function playAs() {
		if (moveHistory.flat().length > 1 ){
			setShowSwitchSides(true);
		}
		else{
			switchSides();
		}
	} 

	// Handles logic for switching sides
	function switchSides() {
		setSide(side === "white" ? "black" : "white");
		setString(string === "Black" ? "White" : "Black");
		newGame()
	}

	// Called when player wants to reset game
	function reset() {
		if (moveHistory.flat().length > 1){
			setShowResetGame(true);
		}
		else{
			newGame()
		}
	}

	// Resets the current game
	function newGame() {
		setGame(new Chess());
		setIsGameOver(false);
		setMoveHistory([]);
		setShowResetGame(false);
		setShowSwitchSides(false);
		setShowChangeDifficulty(false);
	}

	// Called when player wants to change difficulty
	function ChangeDifficulty() {
		setShowChangeDifficulty(true);
	}

	return (
		<div className="w-full flex flex-col justify-center items-center px-4 mr-5">
			<div className="w-full flex flex-col lg:flex-row justify-center px-4 gap-4">
				<Button variant="default" onClick={playAs}>
					Play As {string}
				</Button>
				<Button variant="default" onClick={reset}>
					Reset
				</Button>
				<Button variant="default" onClick={ChangeDifficulty}>
					Difficulty
				</Button>
				<p className="flex items-center justify-center">
					<b className="mr-1">Difficulty:</b> {difficulty}
				</p>
			</div>
			
			<div className="w-full flex justify-center mt-4 gap-x-1">
				<BlackCapturedPieces 
					pieces={blackCaptured}
					showScore={showBlackScore}
					score={blackScore - whiteScore}
				/>
				<ChessGame
					game={game}
					setGame={setGame}
					side={side}
					isGameOver={isGameOver}
					setIsGameOver={setIsGameOver}
					difficulty={difficulty}
					setMoveHistory={setMoveHistory}
					setDifficulty={setDifficulty}
					showSwitchSides={showSwitchSides}
					switchSidesConfirm={switchSides}
					switchSidesCancel = {() => setShowSwitchSides(false)}
					showResetGame={showResetGame}
					resetGameConfirm={newGame}
					resetGameCancel={() => setShowResetGame(false)}
					showChangeDifficulty={showChangeDifficulty}
					changeDifficultyConfirm={newGame}
					changeDifficultyCancel={() => setShowChangeDifficulty(false)}
				/>
				<WhiteCapturedPieces 
					pieces={whiteCaptured}
					showScore={showWhiteScore}
					score={whiteScore - blackScore}
				/>
			</div>

		</div>
	);
}
