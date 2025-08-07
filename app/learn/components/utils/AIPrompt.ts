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
        You are a chess coach AI. You will receive a FEN position, a best move, and a principal variation.

        FEN: ${fen}
        Best move: ${bestMove}
        Principal variation: ${pv}
        Side to move: ${side}

        Your task:
        - Explain why ${bestMove} is the best move in the current position.
        - Describe strategic and tactical ideas.
        - Suggest follow-up plans for ${side}.
        - Identify threats and weaknesses.

        Please return your analysis in **valid JSON** with the following structure:

        {
            "explanation": "<plain English explanation of why the move is best>",
            "strategic": "<strategic and tactical reasons for the move>",
            "plans": "<possible plans and ideas for the side to move>",
            "threats": "<key threats or tactical ideas in the position>",
            "weaknesses": "<any weaknesses the side to move must watch out for>"
        }

        Only output valid JSON. Do not include commentary or text outside the JSON.
    `.trim();
}
