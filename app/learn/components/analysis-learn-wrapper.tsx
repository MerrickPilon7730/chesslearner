
import { useEffect, useState } from "react";

import { 
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"

import { EvaluationBar } from "./analysis/evaluation-bar";
import { MoveHistoryComp } from "@/app/components/analysis/move-history";
import { Opening } from "@/app/components/analysis/opening";

import { FetchAnalysis } from "./utils/fetch-analysis";

import { 
    MoveHistory, 
    Side, 
    StockfishResponse
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
    const [stockfishData, setStockfishData] = useState<StockfishResponse>();
    const lastfen = fenHistory?.[fenHistory.length - 1]

    useEffect(() => {
        if (!lastfen || isGameOver) return;

        FetchAnalysis({
            fen: lastfen,
            side,
            difficulty: 20,
            isGameOver,
        }).then((result) => {
            if (result.success && result.stockfishResponse) {
                setStockfishData(result.stockfishResponse);
            }
        });
    }, [lastfen, isGameOver, side]);

    return (
        <Card className="w-full h-full max-w-[90%] max-h-90%]">
            <CardHeader className="flex items-center justify-center">
            </CardHeader>
            <CardContent className="w-full flex flex-col justify-center items-center">
                <EvaluationBar stockfishData={stockfishData}/>
                <Opening moveHistory={moveHistory}/>
                <MoveHistoryComp moveHistory={moveHistory} heightClamp="max-h-[200px]" />
            </CardContent>
        </Card>
    );
}