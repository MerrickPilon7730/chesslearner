
import { useEffect, useState } from "react";
import { Chess } from "chess.js";

const pieceValues: Record<string, number> = {
  	p: 1, n: 3, b: 3, r: 5, q: 9
};

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
		[...arr].sort(
			(a, b) =>
			(pieceValues[a.toLowerCase()] ?? 0) -
			(pieceValues[b.toLowerCase()] ?? 0)
		);

		const sortedWhite = sortByValue(w);
		const sortedBlack = sortByValue(b);

		setWhiteCaptured(sortedWhite);
		setBlackCaptured(sortedBlack);

		const calcPoints = (pieces: string[]) =>
		pieces.reduce((acc, p) => acc + (pieceValues[p.toLowerCase()] ?? 0), 0);

		setWhitePoints(calcPoints(sortedWhite));
		setBlackPoints(calcPoints(sortedBlack));
	}, [moveHistory]);

	return { whiteCaptured, blackCaptured, whitePoints, blackPoints };
}
