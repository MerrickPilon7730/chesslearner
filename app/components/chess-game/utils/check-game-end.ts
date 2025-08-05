
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
    } else if (isInsufficientMaterial(fenHistory)) {
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

export function isInsufficientMaterial(fenHistory: string[]): boolean {
    const lastFen = fenHistory[fenHistory.length - 1]

	const game = new Chess(lastFen);
	const board = game.board();

	const whitePieces = [];
	const blackPieces = [];

	for (const row of board) {
		for (const piece of row) {
			if (!piece) continue;

			const entry = piece.type + piece.color;
			if (piece.color === "w") whitePieces.push(entry);
			else blackPieces.push(entry);
		}
	}

	const allPieces = [...whitePieces, ...blackPieces];

	const filtered = allPieces.filter(p => p[0] !== 'k');

	// King vs King
	if (filtered.length === 0) return true;

	// King and Bishop vs King
	if (filtered.length === 1 && (filtered[0][0] === 'b' || filtered[0][0] === 'n')) return true;

	// King and Knight vs King
	if (filtered.length === 1 && filtered[0][0] === 'n') return true;

	// King and Bishop vs King and Bishop (same color)
	if (filtered.length === 2 && filtered.every(p => p[0] === 'b')) {
		// Check bishop square colors
		const squares: boolean[] = [];
		board.forEach((row, rIdx) => {
			row.forEach((p, cIdx) => {
				if (p && p.type === 'b') {
					const isLight = (rIdx + cIdx) % 2 === 0;
					squares.push(isLight);
				}
			});
		});

		// All bishops on same color
		if (squares.length === 2 && squares.every(c => c === squares[0])) {
			return true;
		}
	}

	return false;
}