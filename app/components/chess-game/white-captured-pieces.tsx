
import React from "react";
import Image from "next/image";

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
