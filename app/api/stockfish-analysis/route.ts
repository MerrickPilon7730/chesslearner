
import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(request: Request){
    const body = await request.json();
    const {fen, difficulty} = body;
    
    const skillLevel = Math.max(1, Math.min(20, parseInt(difficulty, 10) || 5));

    if (!fen) {
        return NextResponse.json({ error: "FEN is required" }, { status: 400 });
    }

    const enginePath = path.resolve("engines", process.platform === "win32" ? "stockfish.exe" : "stockfish");

    return new Promise((resolve, reject) => {
        const stockfish = spawn(enginePath);

        stockfish.stdin.write("uci\n");
        stockfish.stdin.write(`setoption name Skill Level value ${skillLevel}\n`);
        stockfish.stdin.write("setoption name MultiPV value 3\n");
        stockfish.stdin.write(`position fen ${fen}\n`);
        stockfish.stdin.write("go depth 14\n");

        const pvLines: Array<{ multipv: number; score: string; moves: string }> = [];

        stockfish.stdout.on("data", (data) => {
            const text = data.toString();
            const lines = text.split("\n");

            for (const line of lines) {
                const pvMatch = line.match(/info .* multipv (\d+) score (cp|mate) (-?\d+) .* pv (.+)/);
                if (pvMatch) {
                    const multipv = parseInt(pvMatch[1], 10);
                    const scoreType = pvMatch[2];
                    const scoreValue = parseInt(pvMatch[3], 10);
                    const moves = pvMatch[4].trim();

                    let scoreStr = "";
                    if (scoreType === "cp") {
                        scoreStr = (scoreValue / 100).toFixed(2);
                        if (scoreValue > 0) scoreStr = "+" + scoreStr;
                    } else if (scoreType === "mate") {
                        scoreStr = `Mate in ${Math.abs(scoreValue)}`;
                    }

                    pvLines[multipv - 1] = { multipv, score: scoreStr, moves };
                }

                if (line.startsWith("bestmove")) {
                    stockfish.kill();

                    const result = pvLines.filter(Boolean);

                    resolve(NextResponse.json(result));
                }
            }
        });

        stockfish.stderr.on("data", (data) => {
            console.error("Stockfish error:", data.toString());
        });

        stockfish.on("error", (err) => {
            reject(
                NextResponse.json(
                    { error: "Stockfish failed to start", details: err.message },
                    { status: 500 }
                )
            );
        });
    });

}
