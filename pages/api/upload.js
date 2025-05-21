import { promises as fs } from 'fs';
import pdf from 'pdf-parse';
import multer from 'multer';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await new Promise((resolve, reject) => {
      upload.single('file')(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const data = await pdf(req.file.buffer);
    return res.status(200).json({ 
      success: true,
      text: data.text 
    });
  } catch (err) {
    console.error('PDF parsing error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to parse PDF' 
    });
  }
}