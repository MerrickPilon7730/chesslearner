
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
    fenHistory: string[];
}

export function checkGameEnd({
    game,
    setIsGameOver,
    setWinner,
    setShowNotification,
    fenHistory
}: Props) {
    if (game.isCheckmate()) {
        setIsGameOver(true);

        const loser = game.turn(); 
        const winnerColor = loser === 'w' ? 'Black' : 'White';

        setWinner({ result: winnerColor, message: "Checkmate" });
        setShowNotification(true);
    }else if (isStalemate(fenHistory)) {
        setIsGameOver(true);
        setWinner({ result: "Draw", message: "Stalemate" });
        setShowNotification(true);
    } else if (isThreefoldRepetition(fenHistory)) {
        setIsGameOver(true);
        setWinner({ result: "Draw", message: "Threefold Repetition" });
        setShowNotification(true);
    } else if (game.isInsufficientMaterial()) {
        setIsGameOver(true);
        setWinner({ result: "Draw", message: "Insufficient Material" });
        setShowNotification(true);
    }
}

function isThreefoldRepetition(fenHistory: string[]): boolean{
    const positionCount = new Map<string, number>();

    for (const fen of fenHistory) {
        const key = fen.split(' ').slice(0, 4).join(' ');
        positionCount.set(key, (positionCount.get(key) ?? 0) + 1);
        if (positionCount.get(key) === 3) return true;
    }

    return false;
}
        

function isStalemate(fenHistory: string[]){
    if (fenHistory.length === 0) return false;

    const lastFen = fenHistory[fenHistory.length - 1];

    const game = new Chess(lastFen);

    const noLegalMoves = game.moves().length === 0;
    const notInCheck = !game.inCheck();

    return noLegalMoves && notInCheck;
}