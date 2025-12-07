# Deploying VIP PDF MAKER on Vercel

## Prerequisites
- Vercel account (free tier). Sign up at https://vercel.com
- PDF.co API key (create an account at https://pdf.co if you don't have one)

## Steps
1. Clone or copy the project to a local folder.
2. Install Vercel CLI (optional for local dev): `npm i -g vercel`
3. From project root run `vercel login` then `vercel` to deploy interactively.
4. In the Vercel dashboard: go to your project Settings → Environment Variables and add:
   - `PDFCO_API_KEY` = *your_pdfco_api_key*
   Set it for both `Production` and `Preview` as needed.
5. Deploy. The static frontend will be served; serverless endpoints will be available under `/api/*`.

## Local testing (optional)
Install dependencies and run `vercel dev`:

```bash
npm install
vercel dev
```

This will run a local environment that mimics Vercel serverless behavior.

## Notes
- The frontend converts files to base64 before uploading. This reduces need for heavy multipart parsers in serverless functions.
- Keep `PDFCO_API_KEY` private and only in environment variables.


## Updated: Added Split, Rotate, Protect, Unlock frontend handlers and APIs.
