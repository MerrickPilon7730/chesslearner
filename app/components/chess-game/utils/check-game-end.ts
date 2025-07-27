
import { Chess } from "chess.js";

import type { 
    WinnerInfo,
    DispatchStateAction,
} from "@/types/game";

type Props = {
    game: Chess;
    setIsGameOver: DispatchStateAction<boolean>;
    setWinner: DispatchStateAction<WinnerInfo | undefined>;
    setShowNotification: DispatchStateAction<boolean>;
}

export function checkGameEnd({
    game,
    setIsGameOver,
    setWinner,
    setShowNotification,
}: Props) {
    if (game.isCheckmate()) {
        setIsGameOver(true);

        const loser = game.turn(); 
        const winnerColor = loser === 'w' ? 'Black' : 'White';

        setWinner({ result: winnerColor, message: "Checkmate" });
        setShowNotification(true);
    } else if (game.isDraw()) {
        setIsGameOver(true);

        if (game.isStalemate()) {
            setWinner({ result: "Draw", message: "Stalemate" });
        } else if (game.isThreefoldRepetition()) {
            setWinner({ result: "Draw", message: "Threefold Repetition" });
        } else if (game.isInsufficientMaterial()) {
            setWinner({ result: "Draw", message: "Insufficient Material" });
        } else {
            setWinner({ result: "Draw", message: "Draw" });
        }

        setShowNotification(true);
    }
}
