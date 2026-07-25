import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "@/lib/server-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { caseData, selectedFindings, problemRepresentation, differentialDiagnoses } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
You are an expert clinical instructor grading a medical student's diagnostic submission for a simulated patient case.

Case: ${caseData.title}
Patient: ${caseData.patientAge}yo ${caseData.patientGender}
Complaint: ${caseData.chiefComplaint}
Case Description: ${caseData.description}

Student's Submitted Findings:
${selectedFindings.map((f: any) => `- ${f.name}: ${f.value}`).join('\n')}

Student's Problem Representation:
"${problemRepresentation}"

Student's Differential Diagnoses:
${differentialDiagnoses.map((d: any) => `${d.position}. ${d.diagnosis} (${d.probability}%) - ${d.reasoning}`).join('\n')}

Based on the accuracy, completeness, and clinical reasoning, grade this submission.
Return ONLY a valid JSON object in the exact following format, without markdown blocks or anything else:
{
  "score": 85, // integer 0-100
  "feedback": "Your overall feedback here (2-3 sentences max).",
  "strengths": ["List item 1", "List item 2"],
  "areasForImprovement": ["List item 1", "List item 2"]
}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Clean up response if it contains markdown JSON blocks
    if (responseText.includes('```json')) {
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    
    const gradeData = JSON.parse(responseText);

    // Award XP to the user
    const xpAwarded = Math.round(gradeData.score * 1.5); // Example XP logic
    
    const user = await prisma.user.findUnique({ where: { email: session.user.email as string } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { points: (user.points || 0) + xpAwarded }
      });

      // You could also record a `Progress` entry here for the simulation.
    }

    return NextResponse.json({
      success: true,
      grade: gradeData,
      xpAwarded
    });
  } catch (error) {
    console.error("Grading Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to grade submission' }, { status: 500 });
  }
}
