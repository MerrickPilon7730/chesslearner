

type Props = {
    analysis: string;
}

export function AIComponent({
    analysis,
}: Props)  {


    return (
        <div className="w-[90%] overflow-auto text-white max-h-[200px]">
            <p className="flex justify-center text-2xl font-bold mb-2">Analysis</p>
            <p>{analysis}</p>
        </div>
    )
}