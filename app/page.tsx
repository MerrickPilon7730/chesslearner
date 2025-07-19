"use client"

import { useState } from "react";
import { AnalysisWrapper } from "./components/analysis/analysis-wrapper";
import { ChessWrapper } from "./components/chess-game/chess-wrapper";

export default function Home() {
  // Tracks all moves made
  const [moveHistory, setMoveHistory] = useState<string[][]>([]);

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 w-[90%]">
        <div className="flex items-center justify-center py-5">
          <ChessWrapper setMoveHistory={setMoveHistory} moveHistory={moveHistory}/>
        </div>
        <div className="flex items-center justify-center py-5">
          <AnalysisWrapper moveHistory={moveHistory}/>
        </div>
      </div>
    </div>
  );
}
