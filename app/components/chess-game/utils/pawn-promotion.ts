
import type { Square } from "chess.js";

type Props = {
    sourceSquare: Square;
    targetSquare: Square;
    piece: string;
}

export function pawnPromotion({
    sourceSquare,
    targetSquare,
    piece,
}: Props){
    const isWhitePromotion = piece === "wP" && sourceSquare[1] === "7" && targetSquare[1] === "8";
    const isBlackPromotion = piece === "bP" && sourceSquare[1] === "2" && targetSquare[1] === "1";

    return isWhitePromotion || isBlackPromotion;
}