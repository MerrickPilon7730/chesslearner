
import { 
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"
import { MoveHistory } from "./move-history";
import { Opening } from "./opening";

type Props = {
    moveHistory: string[][];
};

export function AnalysisWrapper({ moveHistory }: Props) {
    console.log("Flat moveHistory:", moveHistory.flat());
    return (
        <Card className="w-full h-full">
            <CardHeader className="flex items-center justify-center">
            </CardHeader>
            <CardContent className="w-full flex flex-col justify-center items-center">
                <Opening moveHistory={moveHistory.flat()}/>
                <MoveHistory moveHistory={moveHistory} />
            </CardContent>
        </Card>
    );
}