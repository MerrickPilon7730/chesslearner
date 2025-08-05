
import { Chess } from "chess.js";

import { DispatchStateAction } from "@/types/game";

type Props = {
    game: Chess;
    setCheckHighlights: DispatchStateAction<{ [square: string]: React.CSSProperties }>;
}

export function highlightKingThreats({
    game,
    setCheckHighlights,
}: Props) {
    const board = game.board();
    const isCheck = game.inCheck();
    const isMate = game.isCheckmate();
    const kingColor = game.turn();

    let kingSquare: string | null = null;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece?.type === "k" && piece.color === kingColor) {
                const file = String.fromCharCode("a".charCodeAt(0) + col);
                const rank = `${8 - row}`;
                kingSquare = `${file}${rank}`;
                break;
            }
        }
    }

    if (!isCheck && !isMate) {
        setCheckHighlights({});
        return;
    }

    if (kingSquare) {
        const highlightStyle = isMate
            ? { backgroundColor: "rgba(255, 0, 0, 0.6)" }
            : {
                  boxShadow: "inset 0 0 0 5px rgba(255, 0, 0, 0.6)",
                  backgroundColor: "transparent",
              };

        setCheckHighlights({
            [kingSquare]: highlightStyle,
        });
    }
}
