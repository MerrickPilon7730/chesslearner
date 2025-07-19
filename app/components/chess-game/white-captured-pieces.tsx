
import React from "react";

const pieceUnicode: Record<string, string> = {
	p: "♙", n: "♘", b: "♗", r: "♖", q: "♕",
	P: "♙", N: "♘", B: "♗", R: "♖", Q: "♕"
};

type Props = {
	pieces: string[];
};

export function WhiteCapturedPieces({ pieces }: Props) {
	return (
		<div className="flex flex-col">
			{pieces.map((p, i) => (
				<span key={i} className="text-2xl text-black dark:text-gray-400">
					{pieceUnicode[p.toUpperCase()]}
				</span>
			))}
		</div>
	);
}
