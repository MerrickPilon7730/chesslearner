
import React from "react";
import Image from "next/image";

const pieceImages: Record<string, string> = {
  P: "/chess-pieces/white/wP.png",
  N: "/chess-pieces/white/wN.png",
  B: "/chess-pieces/white/wB.png",
  R: "/chess-pieces/white/wR.png",
  Q: "/chess-pieces/white/wQ.png",
};

type Props = {
  	pieces: string[];
	showScore: boolean;
	score: number;
};

export function BlackCapturedPieces({ pieces, showScore, score }: Props) {
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
