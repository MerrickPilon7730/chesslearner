
import { AIAnalysis } from "@/types/game"

type Props = {
    analysis: AIAnalysis;
}

export function AIComponent({
    analysis,
}: Props)  {


    return (
        <div className="w-[90%] text-white">
            {analysis.explanation}
        </div>
    )
}