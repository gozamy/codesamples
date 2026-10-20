# PDF + QR demo

A small Node.js example that generates a PDF with a QR code pointing to a hosted profile URL.

## What it demonstrates

- QR code generation with the `qrcode` package.
- PDF creation with PDFKit.
- Stream-based PDF output to a file.
- An AWS Lambda-style handler that returns a generated PDF as a base64-encoded API response.

## Requirements

- Node.js 20 or newer
- npm

## Run the local example

```bash
pnpm install
pnpm generate
```

The script writes `candidate-demo.pdf` to the project root.

The candidate details and profile URL are demo values. The QR code will point to `https://example.com/candidates/demo-id` until you change the `candidate` object in `src/generate-pdf.mjs`.

## AWS Lambda handler

`src/lambda.mjs` exports a `handler` suitable as a starting point for an API Gateway / Lambda integration. It returns the PDF as a base64-encoded response with `isBase64Encoded: true`.

For an actual deployment, configure API Gateway binary response handling as appropriate for your integration, test the download behaviour, and add authentication, authorisation, input validation, logging, rate limits and suitable error handling.

## Important limitations

This is a portfolio demonstration, not a production-ready implementation. It does not verify a candidate's identity, create a signed/verified, upload CVs, record video, store candidate data, or implement analytics. A QR code only points to a URL; any verification claim must be backed by real server-side verification and controlled profile data.


## Example output

The script generates a candidate PDF containing profile details and a QR code linking to the candidate's hosted profile.

![PitchID candidate PDF example](./screenshots/pdf-demo-output.png)

