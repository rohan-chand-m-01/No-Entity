import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function verify() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

        if (!match) {
            console.log("KEY_MISSING");
            return;
        }

        const apiKey = match[1].trim();
        console.log("Key found: " + apiKey.substring(0, 4) + "...");

        const genAI = new GoogleGenerativeAI(apiKey);
        const models = ["gemini-1.5-flash", "gemini-pro"];

        for (const m of models) {
            console.log(`Testing ${m}...`);
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("Test");
                console.log(`SUCCESS with ${m}`);
                return;
            } catch (e) {
                console.log(`FAILED ${m}: ${e.message}`);
            }
        }

    } catch (error) {
        console.log("FATAL: " + error.message);
    }
}

verify();
