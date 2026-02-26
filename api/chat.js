import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const { prompt } = req.body;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  res.status(200).json({ text: response.text() });
}
