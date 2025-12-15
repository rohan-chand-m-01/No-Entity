import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

async function verify() {
    try {
        // 1. Read .env manually
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) {
            console.error("❌ .env file not found at " + envPath);
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf-8');
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);

        if (!match || !match[1]) {
            console.error("❌ VITE_GEMINI_API_KEY not found in .env");
            return;
        }

        const apiKey = match[1].trim();
        console.log(`🔑 Found API Key: ${apiKey.substring(0, 5)}...${apiKey.slice(-4)}`);

        // 2. Test API
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("⏳ Testing connection to Gemini API...");
        const result = await model.generateContent("Say 'Connection Successful'");
        const response = await result.response;
        const text = response.text();

        console.log("✅ API Connection Successful!");
        console.log("🤖 Response:", text);

    } catch (error) {
        console.error("❌ API Verification Failed:", error.message);
    }
}

verify();
