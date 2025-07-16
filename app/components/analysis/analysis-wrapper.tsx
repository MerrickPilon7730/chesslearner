
import { 
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"

type Props = {
    moveHistory: string[][];
};

export function AnalysisWrapper({ moveHistory }: Props) {
    return (
        <Card className="w-full h-full bg-zinc-900">
            <CardHeader className="flex items-center justify-center">
                <CardTitle className="text-2xl text-white">
                    Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[400px] min-h-[400px] w-full flex justify-center items-start">
                <div className="w-[90%]">
                    <table className="w-full text-white text-sm table-fixed border-separate border-spacing-0 border-2">
                        <thead className="sticky top-0 bg-zinc-900 z-10">
                            <tr className="border-b-[2px] border-white">
                            <th className="text-left p-2">#</th>
                            <th className="text-left p-2">White</th>
                            <th className="text-left p-2">Black</th>
                            </tr>
                        </thead>
                        <tbody>
                            {moveHistory.map(([white, black], index) => (
                            <tr key={index} className="border-2 border-zinc-800 odd:bg-zinc-800 even:bg-zinc-700">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{white}</td>
                                <td className="p-2">{black}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}