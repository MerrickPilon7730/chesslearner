import { StockfishResponse } from "@/types/game";

type Props = {
    fen: string;
    stockfishResponse: StockfishResponse;
};

export function generateAIPrompt({
    fen,
    stockfishResponse,
}: Props) {

    function getTurnFromFEN(fen: string): "White" | "Black" {
        const parts = fen.split(" ");
        if (parts.length < 2) throw new Error("Invalid FEN string");
        return parts[1] === "w" ? "White" : "Black";
    }

    const side = getTurnFromFEN(fen);
    const bestMove = stockfishResponse.bestMove;
    const pv = stockfishResponse.lines?.[0] || "";

    return `
        FEN: ${fen}
        Best move: ${bestMove}
        Side to move: ${side}
        PV: ${pv}

        Explain why ${bestMove} for ${side} is the best move according to the PV. Return a string only:
    `.trim();

}
 