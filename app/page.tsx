import { ChessWrapper } from "./components/chess-game/chess-wrapper";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl">
        <div className="flex items-center justify-center py-10">
          <ChessWrapper />
        </div>
        <div className="flex items-center justify-center py-10">
          Moves History
        </div>
      </div>
    </div>
  );
}
