
import { useEffect, useState } from "react";
import { Chess } from "chess.js";

import { pieceValues } from "@/types/game";

type PieceKey = keyof typeof pieceValues;

function isPieceKey(key: string): key is PieceKey {
  return key in pieceValues;
}


type UseCapturedPiecesResult = {
	whiteCaptured: string[];
	blackCaptured: string[];
	whitePoints: number;
	blackPoints: number;
};

export function useCapturedPieces(moveHistory: string[]): UseCapturedPiecesResult {
  	const [whiteCaptured, setWhiteCaptured] = useState<string[]>([]);
	const [blackCaptured, setBlackCaptured] = useState<string[]>([]);
	const [whitePoints, setWhitePoints] = useState(0);
	const [blackPoints, setBlackPoints] = useState(0);

	useEffect(() => {
		const game = new Chess();
		const w: string[] = [];
		const b: string[] = [];

		moveHistory.forEach((moveStr) => {
		const move = game.move(moveStr);
		if (move && move.captured) {
			const isWhiteMove = move.color === "w";
			const capturedPiece = move.captured;
			if (isWhiteMove) {
			w.push(capturedPiece);
			} else {
			b.push(capturedPiece.toUpperCase());
			}
		}
		});

		const sortByValue = (arr: string[]) =>
			[...arr].sort((a, b) => {
			const aKey = a.toLowerCase();
			const bKey = b.toLowerCase();
			const aVal = isPieceKey(aKey) ? pieceValues[aKey] : 0;
			const bVal = isPieceKey(bKey) ? pieceValues[bKey] : 0;
			return aVal - bVal;
    	});

		const sortedWhite = sortByValue(w);
		const sortedBlack = sortByValue(b);

		setWhiteCaptured(sortedWhite);
		setBlackCaptured(sortedBlack);

		const calcPoints = (pieces: string[]) =>
			pieces.reduce((acc, p) => {
			const key = p.toLowerCase();
			return acc + (isPieceKey(key) ? pieceValues[key] : 0);
		}, 0);

		setWhitePoints(calcPoints(sortedWhite));
		setBlackPoints(calcPoints(sortedBlack));
	}, [moveHistory]);

	return { whiteCaptured, blackCaptured, whitePoints, blackPoints };
}
