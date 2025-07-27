
import { Chess } from "chess.js";

import { DispatchStateAction } from "@/types/game";

type Props = {
    gameInstance: Chess;
    setCheckHighlights: DispatchStateAction<{ [square: string]: React.CSSProperties }>;
}

export function highlightKingThreats({
    gameInstance,
    setCheckHighlights,
}: Props) {
    const board = gameInstance.board();
    const isCheck = gameInstance.inCheck();
    const isMate = gameInstance.isCheckmate();
    const kingColor = gameInstance.turn();

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
