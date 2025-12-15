import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = 

async function run() {
    console.log("Testing Gemini API with key: " + apiKey.substring(0, 10) + "...");
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Hello";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (error: any) {
        console.log("API TEST FAILED");
        if (error.message) console.log("Error Message:", error.message);
        if (error.statusText) console.log("Status Text:", error.statusText);
        if (error.status) console.log("Status Code:", error.status);
        console.log("Full Error:", JSON.stringify(error, null, 2));
    }
}

run();
