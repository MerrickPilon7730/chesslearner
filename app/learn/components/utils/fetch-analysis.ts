
import { Chess } from "chess.js";

import { StockfishResult } from "@/types/game";

type Props = {
    fen: string;
    side: string;
    difficulty: number;
    isGameOver: boolean;
}

export async function FetchAnalysis({
    fen,
    side,
    difficulty,
    isGameOver,
}: Props) : Promise<StockfishResult> {
    if (isGameOver) return { success: false, error: "Game is over." };

    difficulty = 20;

    const game = new Chess(fen);

    if (game.turn() !== side[0]) return { success: false, error: "Not player's turn." };

    try{
        const response = await fetch("/api/stockfish-analysis/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fen, difficulty }),
        });

        const data = await response.json();

        if (!data || !data.bestMove || !Array.isArray(data.lines) || !data.lines[0]) return { success: false, error: "Incomplete data from Stockfish."};

        return {
            success: true,
            stockfishResponse: data,
        }
    } catch (err) {
        console.error("Failed to fetch stockfish data.", err);
        return {success: false, error: "Fetch or parsing error."}
    }
}