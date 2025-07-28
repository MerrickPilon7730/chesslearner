
import { Chess } from "chess.js";

import { Move } from "@/types/game";

export function playerMove(game: Chess, move: Move): Chess | null {
  try {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    return result ? gameCopy : null;
  } catch (error) {
    console.warn("Invalid move attempted:", move, error);
    return null;
  }
}
