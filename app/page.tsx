"use client"

import { useState } from "react";
import { AnalysisPlayWrapper } from "./components/analysis/analysis-play-wrapper";
import { ChessPlayWrapper } from "./components/chess-game/chess-play-wrapper";

export default function Home() {
  // Tracks all moves made
  const [moveHistory, setMoveHistory] = useState<string[][]>([]);

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 w-[90%]">
        <div className="flex items-center justify-center py-5">
          <ChessPlayWrapper setMoveHistory={setMoveHistory} moveHistory={moveHistory}/>
        </div>
        <div className="flex items-center justify-center py-5">
          <AnalysisPlayWrapper moveHistory={moveHistory}/>
        </div>
      </div>
    </div>
  );
}
