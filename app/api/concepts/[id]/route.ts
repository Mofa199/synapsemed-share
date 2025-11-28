import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get concept details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conceptId = params.id;

    let concept = await prisma.concept.findUnique({
      where: { id: conceptId },
      include: {
        mnemonics: {
          orderBy: { upvotes: 'desc' }
        }
      }
    });

    // If not in database, return mock data
    if (!concept) {
      concept = {
        id: conceptId,
        title: "Cardiac Cycle",
        description: "Detailed explanation of the cardiac cycle including systole and diastole phases.",
        content: `
          <h2>Overview</h2>
          <p>The cardiac cycle is the sequence of events that occurs when the heart beats. It consists of two main phases: systole (contraction) and diastole (relaxation).</p>
          
          <h2>Phases of the Cardiac Cycle</h2>
          
          <h3>1. Atrial Systole</h3>
          <p>The atria contract, pushing blood into the ventricles. The AV valves are open, and the semilunar valves are closed.</p>
          
          <h3>2. Isovolumetric Contraction</h3>
          <p>All valves are closed, ventricular pressure increases rapidly without change in volume.</p>
          
          <h3>3. Ventricular Ejection</h3>
          <p>Semilunar valves open, blood is ejected from the ventricles into the aorta and pulmonary artery.</p>
          
          <h3>4. Isovolumetric Relaxation</h3>
          <p>All valves are closed again, ventricular pressure decreases rapidly.</p>
          
          <h3>5. Ventricular Filling</h3>
          <p>AV valves open, blood flows from atria into ventricles. About 70% of filling is passive.</p>
          
          <h2>Clinical Significance</h2>
          <p>Understanding the cardiac cycle is essential for:</p>
          <ul>
            <li>Interpreting heart sounds</li>
            <li>Understanding cardiac pathophysiology</li>
            <li>Analyzing ECG patterns</li>
            <li>Diagnosing heart valve disorders</li>
          </ul>
          
          <h2>Key Points</h2>
          <ul>
            <li>Systole = Contraction, Diastole = Relaxation</li>
            <li>Atrial systole contributes 20-30% to ventricular filling</li>
            <li>Isovolumetric phases occur when all valves are closed</li>
            <li>Normal heart rate: 60-100 bpm at rest</li>
          </ul>
        `,
        category: "Cardiology",
        difficulty: "INTERMEDIATE" as any,
        readTime: "8 min",
        tags: JSON.stringify(["Heart", "Physiology", "Blood Flow"]),
        summary: "The cardiac cycle consists of systole and diastole phases, involving coordinated atrial and ventricular contractions.",
        keyPoints: JSON.stringify([
          "Systole = contraction, Diastole = relaxation",
          "Five distinct phases in each cardiac cycle",
          "Atrial kick contributes 20-30% to ventricular filling",
          "Isovolumetric phases occur when all valves closed"
        ]),
        isPublished: true,
        views: 1234,
        createdAt: new Date(),
        updatedAt: new Date(),
        mnemonics: [
          {
            id: '1',
            conceptId,
            title: "Phases of Cardiac Cycle",
            mnemonic: "A Is Very Important Forever",
            explanation: "A = Atrial Systole\nI = Isovolumetric Contraction\nV = Ventricular Ejection\nI = Isovolumetric Relaxation\nF = (Ventricular) Filling",
            example: "Remember: A Is Very Important Forever when thinking about cardiac cycle phases",
            category: "Acronym",
            upvotes: 45,
            downvotes: 3,
            createdBy: null,
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            conceptId,
            title: "Heart Sounds",
            mnemonic: "Lub-Dub",
            explanation: "Lub (S1) = AV valves closing (start of systole)\nDub (S2) = Semilunar valves closing (start of diastole)",
            example: "When you hear 'Lub-Dub', think 'systole starts-diastole starts'",
            category: "Sound-based",
            upvotes: 38,
            downvotes: 1,
            createdBy: null,
            isVerified: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '3',
            conceptId,
            title: "Valve Closure Sequence",
            mnemonic: "All People Enjoy Time Magazine",
            explanation: "A = Aortic valve opens\nP = Pulmonic valve opens\nE = End of ejection (semilunar valves close)\nT = Tricuspid valve opens\nM = Mitral valve opens",
            example: "Use this to remember the sequence of valve events during the cardiac cycle",
            category: "Acronym",
            upvotes: 29,
            downvotes: 5,
            createdBy: null,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };
    }

    // Increment views
    await prisma.concept.update({
      where: { id: conceptId },
      data: { views: { increment: 1 } }
    }).catch(() => {
      // Ignore if concept doesn't exist in DB
    });

    return NextResponse.json(concept);
  } catch (error) {
    console.error('Error fetching concept:', error);
    return NextResponse.json(
      { error: 'Failed to fetch concept' },
      { status: 500 }
    );
  }
}
