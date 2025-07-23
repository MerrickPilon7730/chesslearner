import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

// Handles post request sent to thus API route
export async function POST(request: Request) {
    // Parse the JSON body from the request
    const body = await request.json();
    const {fen, difficulty} = body;

    // Sanitize and clamp the skill level from 1-20, default of 5.
    const skillLevel = Math.max(1, Math.min(20, parseInt(difficulty, 10) || 5));

    // Ensure that a FEN string was provided
    if (!fen) {
        return NextResponse.json({ error: "FEN is required" }, { status: 400 });
    }

    // Path to Stockfish engine
    const enginePath = path.resolve("engines", process.platform === "win32" ? "stockfish.exe" : "stockfish");

    // Return a promise after Stockfish returns the best move
    return new Promise((resolve, reject) => {
        // Spawn a Stockfish process 
        const stockfish = spawn(enginePath);

        // Send UCI commands to Stockfish to start and provide positions
        stockfish.stdin.write("uci\n");
        stockfish.stdin.write(`setoption name Skill Level value ${skillLevel}\n`);
        stockfish.stdin.write(`position fen ${fen}\n`);
        stockfish.stdin.write("go depth 20\n");

        let output = "";

        // Listen for a response from Stockfish
        stockfish.stdout.on("data", (data) => {
            output += data.toString();

            // When a response is given parse and return it 
            if (output.includes("bestmove")) {
                const match = output.match(/bestmove\s(\w+)(\s|$)/);
                const bestMove = match ? match[1] : null;

                // End the Stockfish process after a result is returned
                stockfish.kill();
                // Resolve the API response with best move
                resolve(NextResponse.json({ move: bestMove }));
            }
        });

        // Handle and log any errors from Stockfish
        stockfish.stderr.on("data", (data) => {
            console.error("Stockfish error:", data.toString());
        });

        // Handle any errors 
        stockfish.on("error", (err) => {
            reject(NextResponse.json({ error: "Stockfish failed to start", details: err.message }, { status: 500 }));
        });
    });
}
