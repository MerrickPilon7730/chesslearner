
import { useEffect, useState } from "react";
import { Chess } from "chess.js";

const pieceUnicode: Record<string, string> = {
	p: "♙", n: "♘", b: "♗", r: "♖", q: "♕",
    P: "♙", N: "♘", B: "♗", R: "♖", Q: "♕"
};

const pieceValues: Record<string, number> = {
    p: 1, n: 3, b: 3, r: 5, q: 9
};

type Props = {
    moveHistory: string[]; 
};

export function CapturedPieces({ moveHistory }: Props) {
	const [whiteCaptured, setWhiteCaptured] = useState<string[]>([]);
	const [blackCaptured, setBlackCaptured] = useState<string[]>([]);

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

		setWhiteCaptured(sortByValue(w));
		setBlackCaptured(sortByValue(b));
	}, [moveHistory]);

	const calcPoints = (pieces: string[]) =>
		pieces.reduce((acc, p) => acc + pieceValues[p.toLowerCase()] || 0, 0);

	const whitePoints = calcPoints(blackCaptured); 
	const blackPoints = calcPoints(whiteCaptured); 
	const diff = whitePoints - blackPoints;

	return (
		<div className="p-4 text-white space-y-2">
			<div className="flex flex-col">
				{whiteCaptured.map((p, i) => (
					<span key={i} className="text-black dark:text-gray-400 text-2xl">{pieceUnicode[p.toUpperCase()]}</span>
				))}
			</div>
			<div className="flex flex-col">
				{blackCaptured.map((p, i) => (
					<span key={i} className="text-2xl">{pieceUnicode[p.toUpperCase()]}</span>
				))}
			</div>
			<div className="pt-2">
				<strong>Material:</strong>{" "}
				{diff > 0 ? `+${diff} Black` : diff < 0 ? `+${-diff} White` : "Equal"}
			</div>
		</div>
	);
}
