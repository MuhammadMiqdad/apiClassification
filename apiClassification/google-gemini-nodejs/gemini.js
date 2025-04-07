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
      text: `Klasifikasikan gambar sampah ini dan berikan hasilnya dalam format teks dengan struktur seperti berikut: 
      Jenis Klasifikasi Sampah: <pilih salah satu dari baterai / kaca / logam / plastik / kertas / organik / anorganik / minyak jelatah / barang elektronik>
      Deskripsi: <deskripsi singkat tentang jenis sampah yang terdeteksi pada gambar>
      Rekomendasi Pengolahan:
      * <rekomendasi pengolahan pertama>
      * <rekomendasi pengolahan kedua>
      * <dst.>
      
      Gunakan bahasa Indonesia. Jangan memberikan penjelasan di luar format tersebut. Fokus pada satu jenis sampah yang paling dominan dalam gambar.`
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

