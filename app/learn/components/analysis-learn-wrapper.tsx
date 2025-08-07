
import { useEffect, useState } from "react";

import { 
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"

import { AIComponent } from "./analysis/AI-component";
import { MoveHistoryComp } from "@/app/components/analysis/move-history";
import { Opening } from "@/app/components/analysis/opening";

import { FetchAnalysis } from "./utils/fetch-analysis";
import { generateAIPrompt } from "./utils/AIPrompt";

import { 
    AIAnalysis,
    MoveHistory, 
    Side, 
} from "@/types/game";

type Props = {
    moveHistory: MoveHistory;
    fenHistory: string[];
    side: Side;
    isGameOver: boolean;
};

export function AnalysisLearnWrapper({ 
    moveHistory,
    fenHistory,
    side,
    isGameOver,
}: Props) {
    const intialAnalysis: AIAnalysis = {
        explanation: "",
        strategic: "",
        plans: "",
        threats: "",
        weaknesses: "",
    }

    const lastfen = fenHistory?.[fenHistory.length - 1]
    const [aiResponse, setAiResponse] = useState<AIAnalysis>(intialAnalysis)

    useEffect(() => {
        if (!lastfen || isGameOver) return;
        console.log(lastfen);

        (async () => {
            const result = await FetchAnalysis({
                fen: lastfen,
                side,
                difficulty: 20,
                isGameOver,
            });

            if (result.success && result.stockfishResponse) {
                const prompt = generateAIPrompt({
                    fen: lastfen,
                    stockfishResponse: result.stockfishResponse,
                });

                const aiRes = await fetch("/api/openAI-analysis", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt }),
                });

                const aiJson = await aiRes.json();
                const parsed = JSON.parse(aiJson.result);
                setAiResponse(parsed);
            }
        })();
    }, [lastfen, isGameOver, side]);


    return (
        <Card className="w-full h-full max-w-[90%] max-h-90%]">
            <CardHeader className="flex items-center justify-center">
            </CardHeader>
            <CardContent className="w-full flex flex-col justify-center items-center">
                <AIComponent analysis={aiResponse} />
                <Opening moveHistory={moveHistory}/>
                <MoveHistoryComp moveHistory={moveHistory} heightClamp="max-h-[200px]" />
            </CardContent>
        </Card>
    );
}