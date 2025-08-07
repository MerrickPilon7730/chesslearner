

type Props = {
    analysis: string;
}

export function AIComponent({
    analysis,
}: Props)  {


    return (
        <div className="w-[90%] text-white">
            {analysis}
        </div>
    )
}