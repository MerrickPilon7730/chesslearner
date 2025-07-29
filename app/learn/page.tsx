
"use client"

import { useState } from "react";

import { ChessLearnWrapper } from "./components/chess-learn-wrapper";
import { AnalysisLearnWrapper } from "./components/analysis-learn-wrapper";
import { MoveHistory } from "@/types/game";

export default function Learn() {
	const [moveHistory, setMoveHistory] = useState<MoveHistory>([]);
	const [fenHistory, setFenHistory] = useState<string[]>([]);

	return (
		<div className="flex items-center justify-center">
			<div className="grid grid-cols-1 md:grid-cols-2 w-[90%]">
				<div className="flex items-center justify-center py-5">
					<ChessLearnWrapper moveHistory={moveHistory} setMoveHistory={setMoveHistory} setFenHistory={setFenHistory}/>
				</div>
				<div className="flex items-center justify-center py-5">
					<AnalysisLearnWrapper moveHistory={moveHistory}/>
				</div>
			</div>
		</div>
	);
}
