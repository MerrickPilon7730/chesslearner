
import { 
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"
import { MoveHistoryComp } from "@/app/components/analysis/move-history";
import { Opening } from "@/app/components/analysis/opening";

import { MoveHistory } from "@/types/game";

type Props = {
    moveHistory: MoveHistory;
};

export function AnalysisLearnWrapper({ moveHistory }: Props) {
    return (
        <Card className="w-full h-full max-w-[90%] max-h-90%]">
            <CardHeader className="flex items-center justify-center">
            </CardHeader>
            <CardContent className="w-full flex flex-col justify-center items-center">
                <Opening moveHistory={moveHistory}/>
                <MoveHistoryComp moveHistory={moveHistory} heightClamp="max-h-[200px]" />
            </CardContent>
        </Card>
    );
}