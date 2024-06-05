import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs/promises'
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function summarizeContent(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const prompt = `Resuma o seguinte conteúdo: \n\n${content}`;

        const result = await model.generateContent(prompt, generationConfig);
        const response = await result.response;
        const text = await response.text();
        console.log(text);
    } catch (error) {
        console.log(`Error during AI content generation: ${error}`);
    }
}

const filePath = 'content.txt';
summarizeContent(filePath).catch(console.error);

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
