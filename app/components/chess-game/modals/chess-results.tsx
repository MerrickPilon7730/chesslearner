import { Button } from "@/components/ui/button";

// Properties for the component
type Props = {
    // Winner of the game (White/Black/Draw)
    winner: string;
    // Function to reset the game state
    reset: () => void;
    // Difficulty level
    difficulty: number;
    // Function to set the difficulty level
    setDifficulty: (difficulty: number) => void;
}

// Overlay/Modal that displays the winner and a reset/play again button
export function ChessResults({winner, reset, difficulty, setDifficulty}: Props) {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-blue-200 dark:bg-[#3D3D3E] p-6 rounded-lg shadow-xl text-center space-y-4 min-w-[40%] min-h-[30%]">
                <h2 className="text-2xl font-bold">
                    {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
                </h2>

                <div className="flex flex-col items-center gap-2">
                    <label htmlFor="difficulty" className="text-md whitespace-nowrap">
                        Difficulty: {difficulty}
                    </label>
                    <input
                        type="range"
                        id="difficulty"
                        min={1}
                        max={20}
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                        className="w-full"
                    />
                </div>

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