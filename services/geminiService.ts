import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const refineNoteToSOAP = async (rawInput: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `
      You are a professional medical scribe assistant.
      Convert the following raw clinical notes into a structured SOAP format (Subjective, Objective, Assessment, Plan).
      Do not invent information. If information for a section is missing, state "Not recorded".
      Keep it professional, concise, and clinical.
      
      Raw Notes: "${rawInput}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate note.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to AI service. Please check your API key.";
  }
};

export const generatePatientEmail = async (
  patientName: string,
  topic: string,
  keyDetails: string
): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `
      Write a professional, empathetic, and concise email to a patient named ${patientName}.
      The topic is: ${topic}.
      Key details to include: ${keyDetails}.
      Sign off as "The Practice Team".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate email.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating email.";
  }
};