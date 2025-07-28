
import { useState } from "react";

import { Chess, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";

import { SetMoveHistory } from "@/types/game";

import { highlightLegalMoves } from "@/app/components/chess-game/utils/highlight-legal-moves";
import { highlightKingThreats } from "@/app/components/chess-game/utils/highlight-king-threats";
import { pawnPromotion } from "@/app/components/chess-game/utils/pawn-promotion";
import { handlePawnPromotion } from "@/app/components/chess-game/utils/confirm-promotion";
import { handleMove } from "@/app/components/chess-game/utils/handle-move";
import { canPlayerDragPiece } from "@/app/components/chess-game/utils/drag-pieces";

type Props = {
    setMoveHistory: SetMoveHistory;
}

export function ChessLearnGame({
    setMoveHistory
}: Props){
    const [game, setGame] = useState(new Chess());
    const [side, setSide] = useState<"black" | "white">("white");
    const [legalMoveHighlights, setLegalMoveHighlights] = useState<{[square: string]: React.CSSProperties;}>({});
    const [checkhighlights, setCheckHighlights] = useState<{[square: string]: React.CSSProperties;}>({});
    const [isGameOver, setIsGameOver] = useState(false);

    function isPlayerPiece(square: Square): boolean {
        const piece = game.get(square);
        return piece?.color === side[0];
    }

    function onSquareClick(square: string){
        console.log("Clicked:", square);
        highlightLegalMoves({
            square,
            game,
            isGameOver,
            isPlayerPiece,
            setLegalMoveHighlights,
        })
    }

    function onPieceDragBegin(piece: string, sourceSquare: string) {
        const sideColor = side[0] as "w" | "b";
        const canDrag = canPlayerDragPiece({
            piece,
            game,
            isGameOver,
            sideColor,
        });

        if (!canDrag) return;

        console.log("Dragged:", sourceSquare);
        highlightLegalMoves({
            square: sourceSquare,
            game,
            isGameOver,
            isPlayerPiece,
            setLegalMoveHighlights,
        });
    }

    function onDrop( from: Square, to: Square): boolean {
        if (isGameOver) return false;

        const piece = game.get(from);
        if (!piece) return false;

        const isPromotion = pawnPromotion({
            sourceSquare: from,
            targetSquare: to,
            piece: `${piece.color}${piece.type}`,
        })

        let updatedGame: Chess | null = null;

        if (isPromotion) {
            const promotionResult = handlePawnPromotion(piece.type, from, to, game);
            if (!promotionResult.success || !promotionResult.updatedGame) return false;
            updatedGame = promotionResult.updatedGame;
        } else {
            updatedGame = handleMove(game, {
                from,
                to,
            });
            if (!updatedGame) return false;
        }

        setGame(updatedGame);
        setLegalMoveHighlights({});

        const lastMove = game.history({ verbose: true }).at(-1);
        if (lastMove) {
            setMoveHistory((prev) => {
                const newHistory = [...prev];
                if (lastMove.color === "w") {
                    newHistory.push([lastMove.san]);
                } else {
                    const last = newHistory.pop() || [""];
                    last[1] = lastMove.san;
                    newHistory.push(last);
                }
                return newHistory;
            });
        }

        return true;
    }

    return(
        <div className="relative w-full max-w-[700px] border-2 dark:border-2 aspect-square">
            <Chessboard 
                position={game.fen()}
                boardOrientation={side}
                onSquareClick={onSquareClick}
                onPieceDragBegin={onPieceDragBegin}
                customSquareStyles={{ ...legalMoveHighlights, ...checkhighlights}}
                onPieceDrop={onDrop}
            />
        </div>
    )

}