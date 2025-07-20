
import { useMemo } from "react";
import openings from "@/data/openings/openings.json";

function cleanPGN(pgn: string): string {
	return pgn
		.replace(/\d+\.(\.\.)?/g, "") // remove move numbers
		.replace(/\s+/g, " ")         // collapse whitespace
		.trim()
		.toLowerCase();
}

export function useOpeningName(moveHistory: string[]) {
  	return useMemo(() => {
    	const gameMoves = moveHistory.join(" ").toLowerCase();

    	// Find the longest matching opening
    	let bestMatch = null;
    	let bestLength = 0;

    	for (const opening of openings) {
    		const cleaned = cleanPGN(opening.pgn);
        	if (gameMoves.startsWith(cleaned) && cleaned.length > bestLength) {
        		bestMatch = opening;
        		bestLength = cleaned.length;
      		}
    	}

    	return bestMatch?.name ?? " ";
  	}, [moveHistory]);
}
