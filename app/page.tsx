import { AnalysisWrapper } from "./components/analysis/analysis-wrapper";
import { ChessWrapper } from "./components/chess-game/chess-wrapper";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 w-[90%]">
        <div className="flex items-center justify-center py-10">
          <ChessWrapper />
        </div>
        <div className="flex items-center justify-center py-10">
          <AnalysisWrapper />
        </div>
      </div>
    </div>
  );
}
