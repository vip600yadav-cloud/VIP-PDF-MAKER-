const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const pdfcoKey = process.env.PDFCO_API_KEY;
  if (!pdfcoKey) return res.status(500).json({ error: 'PDFCO_API_KEY not configured' });

  try {
    const { files } = req.body || {};
    if (!files || !files.length) return res.status(400).json({ error: 'Missing files array' });

    const form = new FormData();
    files.forEach((f, i) => {
      const buffer = Buffer.from(f.contentBase64, 'base64');
      form.append('files[]', buffer, { filename: f.filename || `file${i + 1}.pdf` });
    });

    const response = await axios.post('https://api.pdf.co/v1/pdf/merge', form, {
      headers: { ...form.getHeaders(), 'x-api-key': pdfcoKey },
      maxBodyLength: Infinity
    });

    res.json(response.data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'Merge failed', details: err?.response?.data || err.message });
  }
};
