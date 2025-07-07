import { Button } from "@/components/ui/button";


type Props = {
    winner: string;
    reset: () => void;
}

export function ChessResults({winner, reset}: Props) {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#3D3D3E] p-6 rounded-lg shadow-xl text-center space-y-4">
                <h2 className="text-2xl font-bold">
                    {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
                </h2>

                <Button
                    onClick={reset}
                    className="px-4 py-2 rounded transition"
                >
                    Play Again
                </Button>
            </div>
        </div>
    )
}