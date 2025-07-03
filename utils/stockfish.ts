
import { spawn } from "child_process";

export function analyzePosition(fen: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const engine = spawn("./engines/stockfish.exe");

    engine.stdin.write("uci\n");
    engine.stdin.write(`position fen ${fen}\n`);
    engine.stdin.write("go depth 15\n");

    let bestMove = "";

    engine.stdout.on("data", (data) => {
      const text = data.toString();
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("bestmove")) {
          bestMove = line.split(" ")[1];
          engine.kill();
          resolve(bestMove);
        }
      }
    });

    engine.stderr.on("data", (err) => {
      reject(err.toString());
    });

    engine.on("error", (err) => {
      reject(err);
    });
  });
}