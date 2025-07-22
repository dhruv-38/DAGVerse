import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/upload-to-ipfs', upload.single('file'), async (req, res) => {
  try {
    const jwt = process.env.PINATA_JWT;
    if (!jwt) return res.status(500).json({ error: 'Pinata JWT not set' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Use native FormData and Blob in Node.js 20+
    const formData = new FormData();
    formData.append('file', new Blob([req.file.buffer]), req.file.originalname);
    formData.append('network', 'public');
    const response = await fetch('https://uploads.pinata.cloud/v3/files', {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}` },
      body: formData,
    });
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 