
import { Chess } from "chess.js";
import type { Square } from "chess.js";

import { DispatchStateAction } from "@/types/game";

type Props ={
    square: string;
    game: Chess;
    isGameOver: boolean;
    isPlayerPiece: (square: Square) => boolean;
    setLegalMoveHighlights: DispatchStateAction<{ [square: string]: React.CSSProperties }>;
}

export function highlightLegalMoves({
    square,
    game,
    isGameOver,
    isPlayerPiece,
    setLegalMoveHighlights,
}: Props) {
    if (isGameOver || !isPlayerPiece(square as Square)) return;

    const moves = game.moves({ square: square as Square, verbose: true }) as Array<{ to: string }>;

    if (moves.length === 0) {
        setLegalMoveHighlights({});
        return;
    }

    const newHighlights: { [square: string]: React.CSSProperties } = {};

    moves.forEach((move) => {
        newHighlights[move.to] = {
            boxShadow: "inset 0 0 0 5px #baca44",
            backgroundColor: "transparent",
        };
    });

    setLegalMoveHighlights(newHighlights);
}
