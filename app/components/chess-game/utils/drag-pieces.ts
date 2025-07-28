
import type { Chess } from "chess.js";

type Props = {
	piece: string;
	game: Chess;
	isGameOver: boolean;
	sideColor: "w" | "b";
}

export function canPlayerDragPiece({
	piece,
	game,
	isGameOver,
	sideColor,
}: Props): boolean {
	if (isGameOver) return false;

	const currentTurn = game.turn(); 
	const pieceColor = piece[0];     

	return pieceColor === sideColor && currentTurn === sideColor;
}
