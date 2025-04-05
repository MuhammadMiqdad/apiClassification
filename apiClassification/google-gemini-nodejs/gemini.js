import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import mime from 'mime-types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);

const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

export const classifyImage = async (filePath, mimeType) => {
  const imageFile = await fs.readFile(filePath);
  const imageBase64 = imageFile.toString('base64');

  const promptConfig = [
    {
      text: 'Ini adalah gambar sampah. Tolong klasifikasikan (misalnya baterai, kaca, logam, plastik, kertas, organik, minyak jelatah). \n jelaskan secara singkat \n berikan rekomendasi singkat untuk pengolahan sampah'
    },
    {
      inlineData: {
        mimeType: mimeType, 
        data: imageBase64,
      },
    },
  ];

  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: promptConfig }],
  });

  const response = await result.response;
  return response.text();
};

