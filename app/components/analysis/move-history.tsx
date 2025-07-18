
import { useEffect, useRef } from "react";

type Props = {
    moveHistory: string[][];
};

export function MoveHistory({moveHistory}: Props){
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [moveHistory])

    const emptyRowsCount = Math.max(0, 10 - moveHistory.length);

    return(
        <div className="w-[90%]">
            <div className="grid grid-cols-3 text-center dark:bg-zinc-500 bg-blue-800 min-h-[30px] font-bold text-white">
                <p>Turn #</p>
                <p>White</p>
                <p>Black</p>
            </div>
            <div 
                className="max-h-[400px] min-h-[0] overflow-y-auto"
                ref={scrollRef}
                >
                <table className="w-full text-white text-sm table-fixed border-separate border-spacing-0">
                    <tbody>
                        {moveHistory.map(([white, black], index) => (
                            <tr key={index} className="border-2 dark:odd:bg-zinc-800 dark:even:bg-zinc-700 odd:bg-blue-400 even:bg-blue-300 text-center">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{white}</td>
                                <td className="p-2">{black}</td>
                            </tr>
                        ))}

                        {Array.from({ length: emptyRowsCount }).map((_, i) => {
                            return (
                                <tr
                                    key={`empty-${i}`}
                                    className="border-2 dark:odd:bg-zinc-800 dark:even:bg-zinc-700 odd:bg-blue-400 even:bg-blue-300 text-center"
                                >
                                    <td className="p-2"></td>
                                    <td className="p-2">&nbsp;</td>
                                    <td className="p-2">&nbsp;</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
};