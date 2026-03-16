import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getMotivationalTip() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Give me a short, powerful motivational tip (max 20 words) for a teenager from a single-parent household who is trying to stay focused on school and emotional well-being. Make it supportive and empowering.",
      config: {
        temperature: 0.8,
      }
    });
    return response.text || "You are stronger than you think. Keep pushing forward!";
  } catch (error) {
    console.error("Error fetching tip:", error);
    return "Your potential is limitless. One step at a time.";
  }
}

export async function askAIAssistant(question: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: "You are a supportive and knowledgeable AI tutor for teenagers. Your goal is to help with homework and exam preparation. Provide clear, factual, and easy-to-understand explanations. Use Google Search to verify facts and provide real, correct answers. If a question is about emotional well-being, be empathetic and supportive. Keep responses concise and focused.",
        temperature: 0.3, // Lower temperature for more factual responses
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response. Could you try rephrasing your question?";
  } catch (error) {
    console.error("Error in AI Assistant:", error);
    return "I'm having a bit of trouble connecting right now. Please try again in a moment.";
  }
}

export async function generateExamPrepSuggestions(subject: string, taskHistory: string) {
  try {
    const prompt = `I need help preparing for an exam in ${subject}. 
    Here is some context about my recent school tasks and homework:
    ${taskHistory}
    
    Based on this, please provide real and correct information for:
    1. Key study materials or topics I should focus on (based on current educational standards).
    2. A few practice questions or concepts to test my knowledge (provide correct answers or explanations).
    3. A simple study schedule for the next 3 days.
    
    Use Google Search to ensure the topics and questions are accurate and relevant to the subject. Keep the tone encouraging and supportive for a teenager. Use markdown for formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert academic coach and tutor. You specialize in creating personalized study plans and practice materials for students. Always use Google Search to provide factual and up-to-date educational content.",
        temperature: 0.3,
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "I couldn't generate suggestions right now. Try again?";
  } catch (error) {
    console.error("Error generating exam prep:", error);
    return "I'm having trouble creating your study plan. Please try again later.";
  }
}
