
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { 
	Card, 
	CardContent, 
	CardDescription, 
	CardTitle 
} from "@/components/ui/card";

import { 
	Difficulty, 
	SetDifficulty, 
	SetSide, 
	Side, 
	WinnerInfo 
} from "@/types/game";

type Props = {
  winner?: WinnerInfo;
  difficulty: Difficulty
  side: Side;
  setSide: SetSide;
  setDifficulty: SetDifficulty;
  reset: () => void;
};

export function ChessNotification({
	winner,
	difficulty,
	side,
	setSide,
	setDifficulty,
	reset,
}: Props) {
	const [isMinimized, setIsMinimized] = useState(false);
	const oppositeSide = side === "white" ? "Black" : "White";

	function handleSwitchSides() {
		setSide(side === "white" ? "black" : "white");
	}

	  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
      <Card className="rounded-lg shadow-xl w-full max-w-[60%] min-w-[40%] text-center">
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
          <CardTitle className="text-xl text-white">
            {winner ? (
              winner.result === "Draw" ? (
                <p>{winner.result} by {winner.message}</p>
              ) : (
                <p>{winner.result} wins by {winner.message}</p>
              )
            ) : (
              <p>Game Settings</p>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white"
          >
            {isMinimized ? "🔼" : "🔽"}
          </Button>
        </div>

        {!isMinimized && (
          <CardContent className="space-y-4 bg-gray-900 text-white">
            <CardDescription className="text-lg font-bold text-white">
              Select Difficulty
            </CardDescription>

            <div className="flex flex-col items-center gap-2 mb-5">
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

            <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-3">
              <Button
                variant="default"
                onClick={handleSwitchSides}
                className="min-w-[50%]"
              >
                Play As {oppositeSide}
              </Button>

              <Button
                variant="default"
                onClick={reset}
                className="min-w-[50%]"
              >
                Start Game
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
