"use client";

import { useMemo } from "react";

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
	// Converts move history from string[][] to string[]
	const flatMoveHistory = useMemo(() => moveHistory.flat(), [moveHistory]);
	// Uses flatMoveHistory to keep track of pieces captured
	const {whiteCaptured, blackCaptured} = useCapturedPieces(flatMoveHistory);
	// Gives each piece a number value
	const pieceValues: Record<string, number> = {
		p: 1, n: 3, b: 3, r: 5, q: 9,
	};

	function calcPoints(pieces: string[]) {
		return pieces.reduce((acc, p) => acc + (pieceValues[p.toLowerCase()] ?? 0), 0);
	}

	const whiteScore = calcPoints(whiteCaptured);
	const blackScore = calcPoints(blackCaptured);

	const showWhiteScore = whiteScore > blackScore;
	const showBlackScore = blackScore > whiteScore;

	return (
		<div className="w-full flex flex-col justify-center items-center px-4 mr-5">
			<div className="w-full flex justify-center mt-4 gap-x-1">
				<BlackCapturedPieces 
					pieces={blackCaptured}
					showScore={showBlackScore}
					score={blackScore - whiteScore}
				/>
				<ChessGame
					setMoveHistory={setMoveHistory}
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
