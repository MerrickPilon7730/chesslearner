
import { ThemeToggle } from "@/components/theme-toggle";
import { ChessWrapper } from "./components/chess-game/chess-wrapper";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-2 w-[90%]">
        <div className="flex items-center justify-center">
          <ChessWrapper />
        </div>
        <div className="flex items-center justify-center">
          <ThemeToggle />
          Other stuff
          </div>
      </div>
    </div>
  );
}
