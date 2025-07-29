
import { AIMoveResult } from "@/types/game";
import { Chess } from "chess.js";

interface Props {
    fen: string;
    side: string;
    difficulty: number;
    isGameOver: boolean;
}

export async function handleAIMove({
    fen,
    side,
    difficulty,
    isGameOver,
}: Props): Promise<AIMoveResult> {
    if (isGameOver) return { success: false, error: "Game is over." };

    const game = new Chess(fen);
    if (game.turn() === side[0]) return { success: false, error: "Not AI's turn." };

    try {
        const response = await fetch("/api/stockfish-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fen, difficulty }),
        });

        const data = await response.json();
        const bestMove: string = data.move;

        if (!bestMove || bestMove.length < 4) {
            return { success: false, error: "Invalid move format from Stockfish." };
        }

        const from = bestMove.slice(0, 2);
        const to = bestMove.slice(2, 4);
        const promotion = bestMove.length === 5 ? bestMove[4] : undefined;

        const updatedGame = new Chess(fen);
        const move = updatedGame.move({ from, to, promotion });

        if (!move) return { success: false, error: "Move could not be applied." };

        return {
            success: true,
            move: {
                from,
                to,
                promotion,
            },
            updatedGame,
        };
    } catch (err) {
        console.error("AI move failed:", err);
        return { success: false, error: "Fetch or parsing error." };
    }

}
