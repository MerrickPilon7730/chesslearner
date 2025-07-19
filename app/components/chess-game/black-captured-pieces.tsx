
import React from "react";
import Image from "next/image";

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
		<div className="flex flex-col items-center px-1">
			{pieces.map((p, i) => (
				<Image
					key={i}
					src={pieceImages[p]}
					alt={p}
					width={30}
					height={30}
				/>
			))}
			{showScore && score > 0 && (
				<p>+{score}</p>
			)}
		</div>
	);
}
