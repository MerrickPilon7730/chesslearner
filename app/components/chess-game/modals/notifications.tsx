import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { WinnerInfo } from "../chess-game";

type Props = {
  winner?: WinnerInfo;
  difficulty: number;
  side: "black" | "white";
  setSide: React.Dispatch<React.SetStateAction<"white" | "black">>;
  setDifficulty: (difficulty: number) => void;
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
			<Card className="p-6 rounded-lg shadow-xl text-center space-y-4 min-w-[40%] min-h-[20%]">
				{winner && (
				<p className="text-lg font-bold text-green-700">
					{winner.result} wins by {winner.message}
				</p>
				)}

				<CardTitle className="text-2xl font-bold">
					Select Difficulty
				</CardTitle>

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

				<div className="flex flex-col gap-y-3 md:flex-row md:gap-x-3">
					<Button variant="default" onClick={handleSwitchSides}>
						Play As {oppositeSide}
					</Button>

					<Button
						variant="default"
						onClick={reset}
					>
						Start Game
					</Button>
				</div>
			</Card>
		</div>
	);
}
