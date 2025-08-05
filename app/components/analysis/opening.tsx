
import { useOpeningName } from "@/hooks/useOpeningName"

import { MoveHistory } from "@/types/game";

type Props ={
    moveHistory: MoveHistory;
}

export function Opening({moveHistory}: Props){
    const openingName = useOpeningName(moveHistory.flat());

    return(
        <div className="w-[90%] mb-10 text-white">
            <p className="flex justify-center text-2xl font-bold mb-2">Opening</p>
            <p className="flex justify-center bg-blue-800 dark:bg-zinc-500 text-lg">
                {openingName.trim() === "" ? <>&nbsp;</> : openingName}
            </p>
        </div>
    )
}