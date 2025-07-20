
import { useOpeningName } from "@/hooks/useOpeningName"

type Props ={
    moveHistory: string[];
}

export function Opening({moveHistory}: Props){
    const openingName = useOpeningName(moveHistory);

    return(
        <div className="w-[90%] mb-10">
            <p className="flex justify-center text-2xl font-bold mb-2">Opening</p>
            <p className="flex justify-center bg-blue-800 dark:bg-zinc-500 text-lg">
                {openingName ?? ""}
            </p>
        </div>
    )
}