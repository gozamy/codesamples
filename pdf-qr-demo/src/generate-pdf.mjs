import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidate = {
  name: "James Jones",
  headline: "Frontend Developer",
  location: "Manchester, UK",
  summary:
    "A short, job-specific introduction from the candidate. Replace this demo text with approved profile content.",
  profileUrl: "https://example.com/candidates/demo-id",
  id: "DEMO-001",
};

async function generatePdf(candidate, outputPath) {
  // Create the QR code as an in-memory PNG buffer.
  const qrPng = await QRCode.toBuffer(candidate.profileUrl, {
    type: "png",
    width: 240,
    margin: 1,
    errorCorrectionLevel: "M",
  });

  // PDFKit streams the generated PDF directly to the output file.
  // In a web/API route, pipe the document to the HTTP response instead.
  const doc = new PDFDocument({ size: "A4", margin: 52 });
  const output = fs.createWriteStream(outputPath);

  doc.pipe(output);

  doc.fontSize(24).fillColor("#30214f").text("DEMOID", { continued: true });
  doc.fontSize(10).fillColor("#666666").text("  |  Verified PDF");

  doc.moveDown(1.5);
  doc.moveTo(52, doc.y).lineTo(543, doc.y).strokeColor("#dddddd").stroke();
  doc.moveDown(1.5);

  doc.fontSize(22).fillColor("#222222").text(candidate.name);
  doc.moveDown(0.3);
  doc.fontSize(13).fillColor("#555555").text(candidate.headline);
  doc.fontSize(10).text(candidate.location);

  doc.moveDown(1.5);
  doc.fontSize(13).fillColor("#30214f").text("Candidate introduction");
  doc.moveDown(0.4);
  doc.fontSize(11).fillColor("#333333").text(candidate.summary, {
    width: 310,
    lineGap: 4,
  });

  const qrX = 380;
  const qrY = 205;
  doc.image(qrPng, qrX, qrY, { width: 120, height: 120 });
  doc.fontSize(9).fillColor("#555555").text("Scan to view the candidate's profile", qrX - 22, qrY + 130, {
    width: 164,
    align: "center",
  });

  doc.moveDown(5);
  doc.fontSize(10).fillColor("#666666").text(`DEMOID reference: ${candidate.id}`);
  doc.moveDown(0.5);
  doc.fontSize(9).fillColor("#777777").text(
    "Demo only. The QR code links to the example URL above; replace it with a real hosted candidate profile."
  );

  doc.end();

  await new Promise((resolve, reject) => {
    output.on("finish", resolve);
    output.on("error", reject);
    doc.on("error", reject);
  });
}

const outputPath = path.resolve(__dirname, "../demo-candidate.pdf");
await generatePdf(candidate, outputPath);
console.log(`Created ${outputPath}`);
