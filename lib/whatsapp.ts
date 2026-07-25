/**
 * Utility to communicate with the self-hosted WhatsApp API Server.
 * Ensure WHATSAPP_SERVER_URL is set in your .env file.
 */

const WHATSAPP_SERVER_URL = process.env.WHATSAPP_SERVER_URL || 'http://localhost:8000';
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || '';

interface WhatsAppMessagePayload {
  phone: string;
  message: string;
  mediaUrl?: string;
}

export async function sendWhatsAppMessage(payload: WhatsAppMessagePayload) {
  try {
    const response = await fetch(`${WHATSAPP_SERVER_URL}/api/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`WhatsApp Server Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    // Depending on strictness, we can rethrow or just return null
    return null;
  }
}

export async function sendWhatsAppQuiz(phone: string, question: string, options: string[], quizId: string) {
  const formattedOptions = options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');
  const message = `📚 *SynapseMed Daily Quiz*\n\n${question}\n\n${formattedOptions}\n\n_Reply with the number of your answer or tap the link:_ https://synapsemed.co.tz/quiz/${quizId}`;
  
  return sendWhatsAppMessage({ phone, message });
}
