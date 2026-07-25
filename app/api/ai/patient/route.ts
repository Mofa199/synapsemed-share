import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { question, caseData } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { reply: "Doctor, I can't speak right now. (API key missing)" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are a patient in a medical simulation. 
Your profile:
- Age: ${caseData.patientAge}
- Gender: ${caseData.patientGender}
- Chief Complaint: ${caseData.chiefComplaint}
- Hidden Case Details: ${caseData.description}

Instructions:
1. Roleplay strictly as this patient. Do NOT act like an AI or a doctor.
2. Answer the doctor's questions based ONLY on your profile and symptoms. If asked something irrelevant, act confused.
3. Keep your responses short, conversational, and natural (1-3 sentences maximum).
4. You are currently not feeling well. Incorporate this into your tone.`;

    const chat = model.startChat({
      systemInstruction: systemPrompt,
    });

    const result = await chat.sendMessage(question);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("AI Patient Error:", error);
    return NextResponse.json(
      { reply: "Sorry doctor, I'm feeling too weak to answer that right now." },
      { status: 500 }
    );
  }
}
