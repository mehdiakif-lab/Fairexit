import OpenAI from "openai";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // 1. Initialize OpenAI client (key comes from environment, NOT from code)
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 2. Load the uploaded text based on jobId
    const { jobId } = req.body;
    const filePath = path.join(process.cwd(), "uploads", `${jobId}.txt`);
    const text = fs.readFileSync(filePath, "utf8");

    // 3. Send to OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert in contracts.",
        },
        {
          role: "user",
          content: `Analyze this severance agreement and provide risks, clauses, and negotiation points:\n\n${text}`,
        },
      ],
      temperature: 0.2,
    });

    const analysis = completion.choices[0].message.content;

    // 4. Save result
    const resultPath = path.join(process.cwd(), "results", `${jobId}.json`);
    fs.writeFileSync(resultPath, JSON.stringify({ analysis }, null, 2));

    // 5. Respond OK
    res.status(200).json({ success: true, jobId });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
