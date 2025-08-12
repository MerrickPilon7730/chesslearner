
import React from "react";
import Image from "next/image";

import { Pieces } from "@/types/game";

const pieceImages: Record<string, string> = {
  p: "/images/chess-pieces/black/bP.png",
  n: "/images/chess-pieces/black/bN.png",
  b: "/images/chess-pieces/black/bB.png",
  r: "/images/chess-pieces/black/bR.png",
  q: "/images/chess-pieces/black/bQ.png",
};

type Props = {
	pieces: Pieces;
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
