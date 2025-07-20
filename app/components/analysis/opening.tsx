
import { useOpeningName } from "@/hooks/useOpeningName"

type Props ={
    moveHistory: string[];
}

export function Opening({moveHistory}: Props){
    const openingName = useOpeningName(moveHistory);

    return(
        <div className="w-[90%] mb-10">
            <p className="flex justify-center bg-blue-800 dark:bg-zinc-500 text-xl">
                <b className="mr-2">Opening:</b>{openingName ?? ""}
            </p>
        </div>
    )
}