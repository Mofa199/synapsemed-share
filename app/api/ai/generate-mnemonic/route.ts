import { NextRequest, NextResponse } from 'next/server';

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

    // Try to call the AI backend
    try {
      const aiResponse = await fetch('http://localhost:8000/generate-mnemonic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        return NextResponse.json(data);
      }
    } catch (aiError) {
      console.log('AI backend not available, using fallback');
    }

    // Fallback: Generate based on topic keywords
    const fallbackMnemonics = generateFallbackMnemonic(topic);
    
    return NextResponse.json(fallbackMnemonics);
  } catch (error) {
    console.error('Error generating mnemonic:', error);
    return NextResponse.json(
      { error: 'Failed to generate mnemonic' },
      { status: 500 }
    );
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
    const acronym = words.map(w => w[0].toUpperCase()).join(' ');
    
    return {
      mnemonic: acronym || "Memory Aid",
      explanation: words.map((w, i) => `${acronym[i] || ''} = ${w}`).join('\n'),
      example: `Use '${acronym || 'Memory Aid'}' to remember ${topic}`,
      category: "Acronym"
    };
  }
}
