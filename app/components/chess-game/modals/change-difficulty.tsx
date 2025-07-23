

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

// Properties for the component
type Props = {
    // Function to confirm the game state and change difficulty
    onConfirm: () => void;
    // Function to decline the reset and change difficulty
    onCancel: () => void;
    // Difficulty level
    difficulty: number;
    // Function to set the difficulty level
    setDifficulty: (difficulty: number) => void;
}

// Overlay/Modal that confirms and changes difficulty level
export function ChangeDifficulty({onConfirm, onCancel, difficulty, setDifficulty}: Props) {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <Card className="bg-blue-200 dark:bg-[#3D3D3E] p-6 rounded-lg shadow-xl text-center space-y-4 min-w-[40%] min-h-[30%]">
                <CardTitle className="text-2xl font-bold -mb-1">
                    Change Dificulty?
                </CardTitle>

                <CardDescription className="text-white text-md -my-2">
                    This will start a new game.
                </CardDescription>

                <CardContent>
                    <div className="flex flex-col items-center gap-2 mx-auto min-w-[60%]">
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

                    <div className="flex gap-4 justify-center mt-3">
                        <Button onClick={onConfirm} className="px-4 py-2 rounded transition">
                            Yes
                        </Button>
                        <Button onClick={onCancel} className="px-4 py-2 rounded transition">
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}