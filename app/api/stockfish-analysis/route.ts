import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(request: Request) {
    const body = await request.json();
    const fen = body.fen;

    if (!fen) {
        return NextResponse.json({ error: "FEN is required" }, { status: 400 });
    }

    const enginePath = path.resolve("engines", process.platform === "win32" ? "stockfish.exe" : "stockfish");

    return new Promise((resolve, reject) => {
        const stockfish = spawn(enginePath);

        stockfish.stdin.write("uci\n");
        stockfish.stdin.write(`position fen ${fen}\n`);
        stockfish.stdin.write("go depth 15\n");

        let output = "";

        stockfish.stdout.on("data", (data) => {
        output += data.toString();

        if (output.includes("bestmove")) {
            const match = output.match(/bestmove\s(\w+)(\s|$)/);
            const bestMove = match ? match[1] : null;

            stockfish.kill();
            resolve(NextResponse.json({ move: bestMove }));
        }
        });

        stockfish.stderr.on("data", (data) => {
        console.error("Stockfish error:", data.toString());
        });

        stockfish.on("error", (err) => {
        reject(NextResponse.json({ error: "Stockfish failed to start", details: err.message }, { status: 500 }));
        });
    });
}
