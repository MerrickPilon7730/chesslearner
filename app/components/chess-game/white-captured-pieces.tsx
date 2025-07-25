
import React from "react";
import Image from "next/image";

const pieceImages: Record<string, string> = {
  p: "/chess-pieces/black/bP.png",
  n: "/chess-pieces/black/bN.png",
  b: "/chess-pieces/black/bB.png",
  r: "/chess-pieces/black/bR.png",
  q: "/chess-pieces/black/bQ.png",
};

type Props = {
	pieces: string[];
	showScore: boolean;
	score: number;
};

export function WhiteCapturedPieces({ pieces, showScore, score }: Props) {
	return (
		<div className="flex flex-col items-center min-w-[40px]">
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
