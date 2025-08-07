
import { AIAnalysis } from "@/types/game"

type Props = {
    analysis: AIAnalysis;
}

export function AIComponent({
    analysis,
}: Props)  {


    return (
        <div>
            {analysis.explanation}
        </div>
    )
}