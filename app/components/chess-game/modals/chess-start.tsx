import { Button } from "@/components/ui/button";

// Properties for the component
type Props = {
    // Function to reset the game state
    setGameStart: React.Dispatch<React.SetStateAction<boolean>>;
    // Difficulty level
    difficulty: number;
    // Function to set the difficulty level
    setDifficulty: (difficulty: number) => void;
}

// Overlay/Modal that displays the winner and a reset/play again button
export function ChessStart({setGameStart, difficulty, setDifficulty}: Props) {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-blue-200 dark:bg-[#3D3D3E] p-6 rounded-lg shadow-xl text-center space-y-4 min-w-[40%] min-h-[20%]">
                <h2 className="text-2xl font-bold">
                    Select Difficulty
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
                    onClick={() => setGameStart(false)}
                    className="px-4 py-2 rounded transition"
                >
                    Start
                </Button>
            </div>
        </div>
    )
}