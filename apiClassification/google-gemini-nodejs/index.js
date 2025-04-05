import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { classifyImage } from './gemini.js';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/classify', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const result = await classifyImage(filePath, mimeType);
    
    // opsional: hapus file
    await fs.promises.unlink(filePath);

    res.json({ result });
  } catch (err) {
    console.error('Classification error:', err);
    res.status(500).json({ error: 'Failed to classify image' });
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to Gemini Trash Classification API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("KEY:", process.env.API_KEY); // Debug
});
