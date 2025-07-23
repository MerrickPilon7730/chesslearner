import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

// Properties for the component
type Props = {
    onConfirm: () => void;
    onCancel: () => void;
}

// Overlay/Modal that confirms switching sides/color
export function PlayAs({onConfirm, onCancel}: Props) {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-50">
            <Card className="bg-blue-200 dark:bg-[#3D3D3E] p-6 rounded-lg shadow-xl text-center space-y-4 min-h-[20%] min-w-[40%] max-w-[60%]">
                <CardTitle className="text-xl font-bold -mb-1">
                    Switch Sides?
                </CardTitle>
                
                <CardDescription className="text-white -my-2">
                    This will start a new game.
                </CardDescription>

				<CardContent className="flex gap-4 justify-center">
					<Button onClick={onConfirm} className="px-4 py-2 rounded transition">
						Yes
					</Button>
					<Button onClick={onCancel} className="px-4 py-2 rounded transition">
						Cancel
					</Button>
				</CardContent>
            </Card>
        </div>
    )
}