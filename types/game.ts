import { Chess } from "chess.js";
import { 
	Dispatch, 
	SetStateAction 
} from "react";

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type Difficulty = number;
export type SetDifficulty = Setter<Difficulty>;

export type Side = "black" | "white";
export type SetSide = Setter<Side>;

export type MoveHistory = string[][];

export type WinnerInfo = {
    result: "White" | "Black" | "Draw" | null;
    message: string;
};

export type Move = {
    from: string;
    to: string;
    promotion?: string;
}

export type AIMoveResult = {
	success: boolean;
	move?: Move;
	updatedGame?: Chess;
	score?: number;
	error?: string;
	
}

export type Pieces = string[];
export type PieceValues = Record<"p" | "n" | "b" | "r" | "q", number>;
export const pieceValues: PieceValues = {
	p: 1,
	n: 3,
	b: 3,
	r: 5,
	q: 9,
};

export type DispatchStateAction<T> = Dispatch<SetStateAction<T>>;

export type PVLine = {
    multiPv: number;
    score: string;
    moves: string;
};

export type StockfishResponse = {
    bestMove: string;
    lines: PVLine[];
};

export type StockfishResult = {
	success: boolean;
	stockfishResponse?: StockfishResponse;
	error?: string;
	 
}

export type AIAnalysis = {
	explanation: string;
	strategic: string;
	plans: string;
	threats: string;
	weaknesses: string;
}