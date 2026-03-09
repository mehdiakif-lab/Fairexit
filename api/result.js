export default function handler(req, res) {
  if (!global.analysisResult) {
    return res.status(404).send("No analysis available");
  }

  res.status(200).send(global.analysisResult);
}

