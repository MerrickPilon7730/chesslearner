
import { 
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { MoveHistory } from "./move-history";

type Props = {
    moveHistory: string[][];
};

export function AnalysisWrapper({ moveHistory }: Props) {
    return (
        <Card className="w-full h-full">
            <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-2xl text-white">
                    Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="w-full flex justify-center items-start">
                <MoveHistory moveHistory={moveHistory} />
            </CardContent>
        </Card>
    );
}