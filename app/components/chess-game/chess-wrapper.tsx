"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ChessGame } from "./chess-game";

export function ChessWrapper() {
    const [side, setSide] = useState<"black" | "white">("black")
    const [string, setString] = useState<"Black" | "White">("Black")

    function onClick() {
        setSide(side === "black" ? "white": "black");
        setString(string === "Black" ? "White": "Black")
    }
    
    return (
        <div className="w-full flex flex-col justify-center items-center px-4">
            <div className="w-full flex justify-start px-4">
                <Button variant="default" onClick={onClick}>Play As {string}</Button>
            </div>
            <div className="w-full flex justify-center mt-4">
                <ChessGame side={side}/>
            </div>
        </div>
    );
}
