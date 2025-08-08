

type Props = {
    analysis: string;
    isThinking: boolean;
}

export function AIComponent({
    analysis,
    isThinking,
}: Props)  {

    if (isThinking){
        return (
            <div className="w-[90%] overflow-auto text-white max-h-[200px] min-h-[200px] flex flex-col">
                <p className="text-2xl font-bold text-center mb-2">Analysis</p>

                <div className="flex-1 flex items-center justify-center">
                    <p className="italic">Thinking...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-[90%] overflow-auto text-white max-h-[200px] min-h-[200px]">
            <p className="flex justify-center text-2xl font-bold mb-2">Analysis</p>
            <p>{analysis}</p>
        </div>
    )
}