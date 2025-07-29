import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

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
	const oppositeSide = side === "white" ? "Black" : "White";

	function handleSwitchSides() {
		setSide(side === "white" ? "black" : "white");
	}

	return (
		<div className="absolute inset-0 flex items-center justify-center z-50">
			<Card className="p-6 rounded-lg shadow-xl text-center space-y-4 min-w-[50%] min-h-[20%]">
				{winner && (
					<CardTitle className="text-2xl font-bold -mb-2">
						{winner.result === "Draw" ? (
							<p className="text-green-700">{winner.result} by {winner.message}</p>
						) : (
							<p className="text-green-700">{winner.result} wins by {winner.message}</p>
						)}
					</CardTitle>
				)}


				<CardDescription className="text-xl font-bold text-white -mb-2">
					Select Difficulty
				</CardDescription>

				<CardContent>
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
			</Card>
		</div>
	);
}
