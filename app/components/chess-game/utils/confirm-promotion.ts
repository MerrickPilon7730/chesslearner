import type { Square } from "chess.js";
import { Chess} from "chess.js";
import { playerMove } from "./player-move";

type PromotionResult = {
    success: boolean;
    updatedGame?: Chess;
};

export function handlePawnPromotion(
    piece: string | undefined,
    promoteFromSquare: Square | undefined,
    promoteToSquare: Square | undefined,
    currentGame: Chess,
): PromotionResult {
    if (!piece || !promoteFromSquare || !promoteToSquare) {
        return { success: false };
    };

    const promotion = piece[piece.length - 1].toLowerCase() as "q" | "r" | "b" | "n";

    const updatedGame = playerMove(currentGame, {
        from: promoteFromSquare,
        to: promoteToSquare,
        promotion,
    });

    if (!updatedGame) {
        return { success: false };
    };

    return {
        success: true,
        updatedGame,
    };
}
