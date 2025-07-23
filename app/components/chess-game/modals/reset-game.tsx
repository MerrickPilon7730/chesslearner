import { Button } from "@/components/ui/button";

// Properties for the component
type Props = {
    onConfirm: () => void;
    onCancel: () => void;
}

// Overlay/Modal that displays the winner and a reset/play again button
export function ResetGame({onConfirm, onCancel}: Props) {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="bg-blue-200 dark:bg-[#3D3D3E] p-6 rounded-lg shadow-xl text-center space-y-4 min-h-[30%] min-w-[40%] max-w-[60%]">
                <h2 className="text-2xl font-bold">
                    Are you sure you want reset the game?
                </h2>

				<div className="flex gap-4 justify-center">
					<Button onClick={onConfirm} className="px-4 py-2 rounded transition">
						Yes
					</Button>
					{onCancel && (
						<Button onClick={onCancel} className="px-4 py-2 rounded transition">
							Cancel
						</Button>
					)}
				</div>
            </div>
        </div>
    )
}