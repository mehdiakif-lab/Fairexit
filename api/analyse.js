import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!global.uploadedText) {
    return res.status(400).json({ error: "No uploaded text found" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are an expert in Canadian and US employment law. Analyze the following severance agreement text and produce a structured JSON output.

TEXT:
${global.uploadedText}

Return ONLY valid JSON with the following fields:

{
  "summary": "...",
  "key_terms": [...],
  "risks": [...],
  "missing_protections": [...],
  "deadlines": [...],
  "negotiation_leverage": [...],
  "overall_assessment": "..."
}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a legal analysis assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    const result = completion.choices[0].message.content;

    // Store result in memory
    global.analysisResult = result;

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("AI error:", error);
    return res.status(500).json({ error: "AI analysis failed" });
  }
}
