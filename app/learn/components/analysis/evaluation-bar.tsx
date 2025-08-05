import { StockfishResponse } from "@/types/game"

type Props ={
    stockfishData: StockfishResponse | undefined;
}

export function EvaluationBar({
    stockfishData,
}: Props)  {
    return (
        <div>
            Evaluation Bar
        </div>
    )
}