const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const pdfcoKey = process.env.PDFCO_API_KEY;
    if (!pdfcoKey) return res.status(500).json({ error: 'PDFCO_API_KEY not configured' });

    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
      const { filename, contentBase64 } = req.body;
      if (!contentBase64) return res.status(400).json({ error: 'Missing contentBase64' });
      const buffer = Buffer.from(contentBase64, 'base64');
      const form = new FormData();
      form.append('file', buffer, { filename: filename || 'upload.png' });

      const response = await axios.post('https://api.pdf.co/v1/file/convert/image/to/pdf', form, {
        headers: { ...form.getHeaders(), 'x-api-key': pdfcoKey },
        maxBodyLength: Infinity
      });

      return res.status(200).json(response.data);
    }

    return res.status(400).json({ error: 'Unsupported content type. Please send JSON { filename, contentBase64 }' });

  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'Image to PDF failed', details: err?.response?.data || err.message });
  }
};
