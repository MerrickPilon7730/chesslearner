
import React from "react";

const pieceImages: Record<string, string> = {
  P: "https://chessboardjs.com/img/chesspieces/wikipedia/wP.png",
  N: "https://chessboardjs.com/img/chesspieces/wikipedia/wN.png",
  B: "https://chessboardjs.com/img/chesspieces/wikipedia/wB.png",
  R: "https://chessboardjs.com/img/chesspieces/wikipedia/wR.png",
  Q: "https://chessboardjs.com/img/chesspieces/wikipedia/wQ.png",
};

type Props = {
  	pieces: string[];
	showScore: boolean;
	score: number;
};

export function BlackCapturedPieces({ pieces, showScore, score }: Props) {
	return (
		<div className="flex flex-col items-center">
			{pieces.map((p, i) => (
				<img
					key={i}
					src={pieceImages[p]}
					alt={p}
					className="w-6 h-6"
				/>
			))}
			{showScore && score > 0 && (
				<p>+{score}</p>
			)}
		</div>
	);
}
