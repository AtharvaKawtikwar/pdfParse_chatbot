import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the correct model ID
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent("Your prompt here");
const response = await result.response;
const text = response.text();
