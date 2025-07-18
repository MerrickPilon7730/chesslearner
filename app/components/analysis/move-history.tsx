
type Props = {
    moveHistory: string[][];
};

export function MoveHistory({moveHistory}: Props){
    return(
        <div className="w-[90%]">
            <div className="grid grid-cols-3 text-center bg-zinc-500 min-h-[30px]">
                <p>Turn #</p>
                <p>White</p>
                <p>Black</p>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-white text-sm table-fixed border-separate border-spacing-0">
                    <tbody>
                        {moveHistory.map(([white, black], index) => (
                            <tr key={index} className="border-2 border-zinc-800 odd:bg-zinc-800 even:bg-zinc-700 text-center">
                                <td className="p-2 align-middle">{index + 1}</td>
                                <td className="p-2">{white}</td>
                                <td className="p-2">{black}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};