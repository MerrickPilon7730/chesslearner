
import { Chess } from "chess.js"

import { DispatchStateAction } from "@/types/game";

type Props = {
    from: string;
    to: string;
    promotion?: string;
    game: Chess;
    setGame: DispatchStateAction<Chess>;
}

export function applyMove({
    from,
    to,
    promotion,
    game,
    setGame,
}: Props){
    const move = game.move({from, to, promotion});

    if (!move) return false;

    const updatedGame = new Chess(game.fen());
    setGame(updatedGame);

    return true;
}