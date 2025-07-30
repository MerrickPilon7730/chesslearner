
import { 
    useState,
    useEffect,
    useCallback
} from "react";

import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { Chessboard } from "react-chessboard";

import { 
    DispatchStateAction, 
    MoveHistory, 
    WinnerInfo 
} from "@/types/game";

import { highlightLegalMoves } from "@/app/components/chess-game/utils/highlight-legal-moves";
import { highlightKingThreats } from "@/app/components/chess-game/utils/highlight-king-threats";
import { pawnPromotion } from "@/app/components/chess-game/utils/pawn-promotion";
import { handlePawnPromotion } from "@/app/components/chess-game/utils/confirm-promotion";
import { handleMove } from "@/app/components/chess-game/utils/handle-move";
import { canPlayerDragPiece } from "@/app/components/chess-game/utils/drag-pieces";
import { checkGameEnd } from "@/app/components/chess-game/utils/check-game-end";
import { ChessNotification } from "@/app/components/chess-game/modals/notifications";
import { handleAIMove } from "@/app/components/chess-game/utils/handle-AI-move";

type Props = {
    setMoveHistory: DispatchStateAction<MoveHistory>;
    setFenHistory: DispatchStateAction<string[]>;
    fenHistory: string[];
}

export function ChessPlayGame({
    setMoveHistory,
    setFenHistory,
    fenHistory
}: Props){
    const [game, setGame] = useState(new Chess());
    const [side, setSide] = useState<"black" | "white">("white");
    const [legalMoveHighlights, setLegalMoveHighlights] = useState<{[square: string]: React.CSSProperties;}>({});
    const [checkhighlights, setCheckHighlights] = useState<{[square: string]: React.CSSProperties;}>({});
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState<WinnerInfo | undefined>(undefined);
    const [showNotification, setShowNotification] = useState(true);
    const [difficulty, setDifficulty] = useState(5);

    function isPlayerPiece(square: Square): boolean {
        const piece = game.get(square);
        return piece?.color === side[0];
    }

    function onPromotionCheck(
        sourceSquare: Square,
        targetSquare: Square,
        piece: string,
    ): boolean {

        const isPromotion = pawnPromotion({
            sourceSquare,
            targetSquare,
            piece,
        });

        return isPromotion;
    }

    function onPromotionPieceSelect(
        piece?: string, 
        promoteFromSquare?: Square,
        promoteToSquare?: Square
    ): boolean {
        if (!piece || !promoteFromSquare || !promoteToSquare || !game) return false;

        const pieceString = piece[1].toLowerCase();

        const move = {
            from: promoteFromSquare,
            to: promoteToSquare,
            promotion: pieceString,
        };

        const result = game.move(move);
        if (!result) return false;

        const updatedGame = new Chess(game.fen());
        setGame(updatedGame);
        setFenHistory((prev) => [...prev, updatedGame.fen()])

        setMoveHistory((prev) => {
            const newHistory = [...prev];
            if (result.color === "w") {
                newHistory.push([result.san]);
            } else {
                const last = newHistory.pop() || [""];
                last[1] = result.san;
                newHistory.push(last);
            }
            return newHistory;
        });

        setLegalMoveHighlights({});
        highlightKingThreats({ game, setCheckHighlights });
        checkGameEnd({ 
            game, 
            setIsGameOver, 
            setWinner, 
            setShowNotification, 
            fenHistory
        });

        return true;
    }

    function onSquareClick(square: string){
        highlightLegalMoves({
            square,
            game,
            isGameOver,
            isPlayerPiece,
            setLegalMoveHighlights,
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function isDraggablePiece({ piece, sourceSquare: _sourceSquare }: { piece: string; sourceSquare: Square }): boolean {
        const sideColor = side[0] as "w" | "b";
        const canDrag = canPlayerDragPiece({
            piece,
            game,
            isGameOver,
            sideColor,
        });
        return canDrag;
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

        const newFen = updatedGame.fen();
        const newFenHistory = [...fenHistory, newFen]

        setFenHistory(newFenHistory);

        const lastMove = updatedGame.history({ verbose: true }).at(-1);
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

        highlightKingThreats({
            game: updatedGame,
            setCheckHighlights,
        })

        checkGameEnd({
            game: updatedGame,
            setIsGameOver,
            setWinner,
            setShowNotification,
            fenHistory: newFenHistory
        });

        return true;
    }

    const handleAIResponse = useCallback((fen: string) => {
        if (isGameOver) return false;

        handleAIMove({
            fen,
            side,
            difficulty, 
            isGameOver,
        }).then((result) => {
            if (result.success && result.move && result.updatedGame) {
                setGame(result.updatedGame);

                const lastMove = result.updatedGame.history({ verbose: true }).at(-1);
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

                const newFen = result.updatedGame.fen();
                const updatedFenHistory = [...fenHistory, newFen];
                setFenHistory(updatedFenHistory);

                highlightKingThreats({
                    game: result.updatedGame,
                    setCheckHighlights,
                });

                checkGameEnd({
                    game: result.updatedGame,
                    setIsGameOver,
                    setWinner,
                    setShowNotification,
                    fenHistory: updatedFenHistory,
                });
            } else {
                console.warn("AI move failed:", result.error);
            }
        });

        return true;
    }, [difficulty, fenHistory, setFenHistory, isGameOver, setMoveHistory, side]);

    function reset() {
        setShowNotification(false);
        setIsGameOver(false);
        setMoveHistory([]);
        setFenHistory([])
        setGame(new Chess());
        setCheckHighlights({});
    }

    useEffect(() => {
        if (!isGameOver && !showNotification && game.turn() !== side[0]) {
            handleAIResponse(game.fen());
        }
    },[isGameOver, showNotification, side, game, handleAIResponse]);

    return(
        <div className="relative w-full max-w-[700px] border-2 dark:border-2 aspect-square">
            <Chessboard 
                position={game.fen()}
                boardOrientation={side}
                onSquareClick={onSquareClick}
                isDraggablePiece={isDraggablePiece}
                onPieceDragBegin={onPieceDragBegin}
                customSquareStyles={{ ...legalMoveHighlights, ...checkhighlights}}
                onPieceDrop={onDrop}
                onPromotionCheck={onPromotionCheck}
                onPromotionPieceSelect={onPromotionPieceSelect}
                arePiecesDraggable={!isGameOver}
            />

            {showNotification && (
                <ChessNotification 
                    winner={winner}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    side={side}
                    setSide={setSide}
                    reset={reset}
                />
            )}
        </div>
    )

}