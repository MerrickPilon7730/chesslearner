
import React from "react";

const pieceImages: Record<string, string> = {
  p: "https://chessboardjs.com/img/chesspieces/wikipedia/bP.png",
  n: "https://chessboardjs.com/img/chesspieces/wikipedia/bN.png",
  b: "https://chessboardjs.com/img/chesspieces/wikipedia/bB.png",
  r: "https://chessboardjs.com/img/chesspieces/wikipedia/bR.png",
  q: "https://chessboardjs.com/img/chesspieces/wikipedia/bQ.png",
};

type Props = {
	pieces: string[];
	showScore: boolean;
	score: number;
};

export function WhiteCapturedPieces({ pieces, showScore, score }: Props) {
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
