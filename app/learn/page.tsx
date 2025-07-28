
"use client"

import { useState } from "react";

import { ChessLearnWrapper } from "./components/chess-learn-wrapper";

export default function Learn() {
	const [moveHistory, setMoveHistory] = useState<string[][]>([]);

	return (
		<div className="flex items-center justify-center">
			<div className="grid grid-cols-1 md:grid-cols-2 w-[90%]">
				<div className="flex items-center justify-center py-5">
					<ChessLearnWrapper moveHistory={moveHistory} setMoveHistory={setMoveHistory}/>
				</div>
				<div className="flex items-center justify-center py-5">
					Analysis
				</div>
			</div>
		</div>
	);
}
