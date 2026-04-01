import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set in environment variables.' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `
You are SynapseMedAI, an expert at creating memorable mnemonics for medical students.
Create a powerful mnemonic device for the topic: ${topic}

Generate a mnemonic that helps students remember key concepts about this topic.

Return the output strictly in the following JSON schema:
{
  "mnemonic": "The catchy phrase or acronym",
  "explanation": "Breakdown of what each part means",
  "example": "How to use this mnemonic when studying",
  "category": "Acronym" | "Rhyme" | "Phrase" | "Song"
}`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up potential markdown formatting
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating mnemonic:', error);
    
    // Fallback: Generate based on topic keywords
    const fallbackMnemonics = generateFallbackMnemonic(topic);
    
    return NextResponse.json(fallbackMnemonics);
  }
}

function generateFallbackMnemonic(topic: string) {
  // Simple fallback logic based on topic
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('cardiac') || topicLower.includes('heart')) {
    return {
      mnemonic: "Hearts Beat Constantly",
      explanation: "H = Heart structure\nB = Blood flow\nC = Cardiac cycle phases",
      example: "Use 'Hearts Beat Constantly' to remember the key aspects of cardiac physiology",
      category: "Acronym"
    };
  } else if (topicLower.includes('respir') || topicLower.includes('lung')) {
    return {
      mnemonic: "Lungs Always Breathe",
      explanation: "L = Lung anatomy\nA = Airway mechanics\nB = Blood gas exchange",
      example: "Remember 'Lungs Always Breathe' for respiratory system basics",
      category: "Acronym"
    };
  } else if (topicLower.includes('neuro') || topicLower.includes('brain')) {
    return {
      mnemonic: "Nerves Send Signals",
      explanation: "N = Neuron structure\nS = Synapse function\nS = Signal transmission",
      example: "Use 'Nerves Send Signals' for neuroscience concepts",
      category: "Acronym"
    };
  } else {
    // Generic template
    const words = topic.split(' ').filter(w => w.length > 2);
    const acronym = words.map(w => w[0].toUpperCase()).join('');
    
    return {
      mnemonic: acronym || "Memory Aid",
      explanation: words.map((w, i) => `${acronym[i] || ''} = ${w}`).join('\n'),
      example: `Use '${acronym || 'Memory Aid'}' to remember ${topic}`,
      category: "Acronym"
    };
  }
}
