export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload error" });
    }

    const file = files.file;
    const filePath = file.filepath;

    // Read file as text (simple MVP extraction)
    const text = fs.readFileSync(filePath, "utf8");

    // Store in memory
    global.uploadedText = text;

    return res.status(200).json({ success: true });
  });
}
