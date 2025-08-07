// app/api/openai/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { prompt } = await request.json();

	if (!prompt) {
		return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
	}

	try {
		const res = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "o3-mini",
				messages: [
				{ role: "system", content: "You are a helpful chess coach AI." },
				{ role: "user", content: prompt },
				],
			}),
		});

		const json = await res.json();
		const content = json.choices?.[0]?.message?.content;

		return NextResponse.json({ result: content });
	} catch (error: unknown) {
		let message = "Unknown error";
		if (error instanceof Error) {
			message = error.message;
		}

		return NextResponse.json({ error: message }, { status: 500 });
	}

}
