"use client";

import { Chessboard } from "react-chessboard";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-2 w-[90%]">
        <div>
          <Chessboard 
            areArrowsAllowed={true}
            showBoardNotation={true}
            boardOrientation="white"
            customNotationStyle={{
              color: "black", 
            }}
          />
        </div>
        <div className="flex items-center justify-center">
          Other stuff
        </div>

      </div>
    </div>
  );
}
