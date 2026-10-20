import PDFDocument from "pdfkit";
import QRCode from "qrcode";

export const handler = async (event = {}) => {
  // Example input: { "name": "James Jones", "profileUrl": "https://example.com/candidates/123" }
  // Validate and authorise real user input before using it in a production endpoint.
  const name = typeof event.name === "string" ? event.name.slice(0, 120) : "Demo Candidate";
  const profileUrl =
    typeof event.profileUrl === "string" ? event.profileUrl : "https://example.com/candidates/demo";

  let parsedUrl;
  try {
    parsedUrl = new URL(profileUrl);
  } catch {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "profileUrl must be a valid URL" }),
    };
  }

  if (!["https:", "http:"].includes(parsedUrl.protocol)) {
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "profileUrl must use HTTP or HTTPS" }),
    };
  }

  const qrPng = await QRCode.toBuffer(parsedUrl.toString(), {
    type: "png",
    width: 240,
    margin: 1,
  });

  const doc = new PDFDocument({ size: "A4", margin: 52 });
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  const pdfReady = new Promise((resolve, reject) => {
    doc.on("end", resolve);
    doc.on("error", reject);
  });

  doc.fontSize(24).fillColor("#30214f").text("DEMOID");
  doc.moveDown(1.5);
  doc.fontSize(22).fillColor("#222222").text(name);
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor("#555555").text("Verified PDF profile");
  doc.moveDown(1.5);
  doc.image(qrPng, 52, doc.y, { width: 140, height: 140 });
  doc.moveDown(10);
  doc.fontSize(10).fillColor("#555555").text("Scan the QR code to view the candidate profile.");
  doc.end();

  await pdfReady;
  const pdfBuffer = Buffer.concat(chunks);

  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": 'inline; filename="demo-candidate.pdf"',
      "cache-control": "no-store",
    },
    body: pdfBuffer.toString("base64"),
  };
};
