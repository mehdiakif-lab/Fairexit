export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // Make sure we have the uploaded file content
    if (!global.tempFile) {
      return res.status(400).send("No document found to analyze");
    }

    // Convert back to buffer
    const buffer = Buffer.from(global.tempFile, "base64");
    const text = buffer.toString("utf8");

    // --- AI ANALYSIS LOGIC ---
    // Replace this with your AI provider (OpenAI, Anthropic, Azure, etc.)
    // For now, we simulate a response:
    const analysis = `
Severance Analysis Summary
--------------------------

Document length: ${text.length} characters

Key Findings:
- This is a placeholder analysis.
- Once AI is connected, this will summarize:
  • Termination reason
  • Notice period
  • Severance pay
  • Release clauses
  • Deadlines
  • Risks
  • Missing protections
`;

    // Save the result temporarily
    global.analysisResult = analysis;

    // Redirect to results page
    res.writeHead(302, { Location: "/result.html" });
    res.end();

  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).send("Analysis failed");
  }
}

