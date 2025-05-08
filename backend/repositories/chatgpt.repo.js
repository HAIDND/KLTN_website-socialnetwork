const { GoogleGenAI } = require("@google/genai");
//1.5pero  AIzaSyB5MvFMgptQOHQV-DqpCP-S_Nclos42YyQ
///2.- flash   AIzaSyDFtTK2Q2mheV0c50xLSisub5-sflY5_Nc
const API_KEY = "AIzaSyDFtTK2Q2mheV0c50xLSisub5-sflY5_Nc";

const ai = new GoogleGenAI({ apiKey: API_KEY });

const chatbotRepo = {
  createResponse: async (contents) => {
    try {
      console.log("contents before ");
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash", // old version api  "gemini-1.5-pro",
        contents,
      });
      console.log("contents", response);
      return response.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

module.exports = chatbotRepo;
