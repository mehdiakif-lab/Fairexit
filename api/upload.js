import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).send("Upload failed");
    }

    const file = files.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    // Read file contents
    const fileBuffer = fs.readFileSync(file.filepath);
    const base64 = fileBuffer.toString("base64");

    // Store temporarily in Vercel KV (we will add this next)
    global.tempFile = base64;

    // Redirect to payment page
    res.writeHead(302, { Location: "/payment.html" });
    res.end();
  });
}

