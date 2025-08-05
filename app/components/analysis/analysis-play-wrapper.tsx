
import { 
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"
import { MoveHistoryComp } from "./move-history";
import { Opening } from "./opening";

import { MoveHistory } from "@/types/game";

type Props = {
    moveHistory: MoveHistory;
};

export function AnalysisPlayWrapper({ moveHistory }: Props) {
    return (
        <Card className="w-full h-full max-w-[90%] max-h-90%]">
            <CardHeader className="flex items-center justify-center">
            </CardHeader>
            <CardContent className="w-full flex flex-col justify-center items-center">
                <Opening moveHistory={moveHistory}/>
                <MoveHistoryComp moveHistory={moveHistory} />
            </CardContent>
        </Card>
    );
}