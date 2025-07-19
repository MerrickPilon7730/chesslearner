
import React from "react";

const pieceUnicode: Record<string, string> = {
	p: "♙", n: "♘", b: "♗", r: "♖", q: "♕",
	P: "♙", N: "♘", B: "♗", R: "♖", Q: "♕"
};

type Props = {
  	pieces: string[];
};

export function BlackCapturedPieces({ pieces }: Props) {
	return (
		<div className="flex flex-col">
			{pieces.map((p, i) => (
				<span key={i} className="text-2xl">
					{pieceUnicode[p.toUpperCase()]}
				</span>
			))}
		</div>
	);
}
