
import { Chess, Move } from "chess.js";

export function playerMove(game: Chess, move: Move | string): Chess | null {
  try {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    return result ? gameCopy : null;
  } catch (error) {
    console.warn("Invalid move attempted:", move, error);
    return null;
  }
}
