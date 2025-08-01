
"use client"

import { useState } from "react";

import { ChessLearnWrapper } from "./components/chess-learn-wrapper";
import { AnalysisLearnWrapper } from "./components/analysis-learn-wrapper";

import { 
	MoveHistory, 
	Side 
} from "@/types/game";

export default function Learn() {
	const [moveHistory, setMoveHistory] = useState<MoveHistory>([]);
	const [fenHistory, setFenHistory] = useState<string[]>([]);
	const [side, setSide] = useState<Side>("white");
	const [isGameOver, setIsGameOver] = useState(false);

	return (
		<div className="flex items-center justify-center">
			<div className="grid grid-cols-1 md:grid-cols-2 w-[90%]">
				<div className="flex items-center justify-center py-5">
					<ChessLearnWrapper 
						setMoveHistory={setMoveHistory} 
						moveHistory={moveHistory} 
						fenHistory={fenHistory} 
						setFenHistory={setFenHistory}
						side={side}
						setSide={setSide}
						isGameOver={isGameOver}
						setIsGameOver={setIsGameOver}
					/>
				</div>
				<div className="flex items-center justify-center py-7">
					<AnalysisLearnWrapper 
						moveHistory={moveHistory} 
						fenHistory={fenHistory}
						side={side}
						isGameOver={isGameOver}
					/>
				</div>
			</div>
		</div>
	);
}
