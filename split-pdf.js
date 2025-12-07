const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const pdfcoKey = process.env.PDFCO_API_KEY;
  if (!pdfcoKey) return res.status(500).json({ error: 'PDFCO_API_KEY not configured' });

  try {
    const { filename, contentBase64, pages } = req.body || {};
    if (!contentBase64) return res.status(400).json({ error: 'Missing contentBase64' });
    const form = new FormData();
    const buffer = Buffer.from(contentBase64, 'base64');
    form.append('file', buffer, { filename: filename || 'file.pdf' });
    if (pages) form.append('pages', pages);

    const response = await axios.post('https://api.pdf.co/v1/pdf/split', form, {
      headers: { ...form.getHeaders(), 'x-api-key': pdfcoKey },
      maxBodyLength: Infinity
    });

    res.json(response.data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'Split failed', details: err?.response?.data || err.message });
  }
};
