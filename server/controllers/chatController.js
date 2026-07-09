import { GoogleGenerativeAI } from '@google/generative-ai';

// @desc    Process a chat message using Gemini API (with Mock fallback)
// @route   POST /api/chat
// @access  Public
export const handleChatMessage = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if a VALID Google API key is provided
    if (apiKey && (apiKey.startsWith('AIzaSy') || apiKey.startsWith('AQ.'))) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash"
        });

        let formattedHistory = [];
        if (history && Array.isArray(history)) {
          formattedHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts }]
          }));
        }

        const systemInstruction = `
          You are 'MediBot', an AI medical assistant for the MediCare Plus platform.
          Your job is to listen to the user's symptoms and guide them to book an appointment with the correct medical department.
          RULES:
          1. DO NOT diagnose or prescribe medication.
          2. Keep your answers short, friendly, and empathetic.
          3. End your message by gently encouraging them to close the chat and click "Find Doctors".
        `;

        const chat = model.startChat({
          history: [
            { role: "user", parts: [{ text: "SYSTEM INSTRUCTION: " + systemInstruction }] },
            { role: "model", parts: [{ text: "Understood. I am MediBot. I will follow rules." }] },
            ...formattedHistory
          ],
          generationConfig: { maxOutputTokens: 250 },
        });

        const result = await chat.sendMessage([{ text: message }]);
        return res.status(200).json({ reply: await result.response.text() });
      } catch (geminiError) {
        console.error('Gemini API Error, falling back to Mock:', geminiError.message);
      }
    }

    // --- FALLBACK MOCK AI (If API Key is missing, wrong, or rate limited) ---
    const lowerMsg = message.toLowerCase();
    let reply = "I'm MediBot! I recommend seeing a **General Physician** for a proper checkup. You can click 'Find Doctors' to book an appointment.";

    if (lowerMsg.includes('head') || lowerMsg.includes('brain') || lowerMsg.includes('migraine')) {
      reply = "Based on your symptoms, I strongly recommend booking an appointment with a **Neurologist**.";
    }
    else if (lowerMsg.includes('heart') || lowerMsg.includes('chest') || lowerMsg.includes('breath')) {
      reply = "Chest or heart-related symptoms should be taken seriously. Please book an appointment with a **Cardiologist** immediately.";
    }
    else if (lowerMsg.includes('tooth') || lowerMsg.includes('teeth') || lowerMsg.includes('gum')) {
      reply = "For dental issues, I recommend seeing a **Dentist**.";
    }
    else if (lowerMsg.includes('skin') || lowerMsg.includes('hair') || lowerMsg.includes('pimple') || lowerMsg.includes('rash')) {
      reply = "Skin and hair issues are best treated by a **Dermatologist**.";
    }
    else if (lowerMsg.includes('fever') || lowerMsg.includes('cold') || lowerMsg.includes('cough')) {
      reply = "It sounds like a common illness. I suggest booking a **General Physician**.";
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    return res.status(200).json({ reply: reply });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Sorry, I am having trouble connecting right now.' });
  }
};
