export default function handler(req, res) {
  if (!global.analysisResult) {
    return res.status(400).json({ error: "No analysis available" });
  }

  return res.status(200).json({
    result: global.analysisResult
  });
}


