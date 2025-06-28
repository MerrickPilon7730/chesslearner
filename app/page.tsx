import { ChessGame } from "./components/chess-game";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-2 w-[90%]">
        <div className="flex items-center justify-center">
          <ChessGame />
        </div>
        <div className="flex items-center justify-center">Other stuff</div>
      </div>
    </div>
  );
}
