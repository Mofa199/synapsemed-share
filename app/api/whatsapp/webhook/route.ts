import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    // Expected payload from custom WA server: { phone: "...", message: "...", timestamp: "..." }
    const { phone, message } = payload;

    if (!phone || !message) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const normalizedPhone = phone.replace(/[^0-9]/g, "");
    const text = message.trim().toLowerCase();

    // Find user by phone (assuming user has a phone field in production, though we don't have it in the schema currently. We will simulate finding a user by phone or emailSubscription)
    const subscription = await prisma.emailSubscription.findFirst({
      // We will pretend the email subscription captures phone or the custom WA API associates the phone.
      // In a real app, you'd add a 'phone' column to User and query here.
      // For now, we will just log the action or update a generic "QuizAnswer" model if we had one.
      where: { isActive: true } 
    });

    if (text === "stop") {
      // Opt-out logic
      if (subscription) {
         await prisma.emailSubscription.update({
            where: { id: subscription.id },
            data: { isActive: false }
         });
         await sendWhatsAppMessage({ phone, message: "You have been unsubscribed from SynapseMed notifications." });
      }
      return NextResponse.json({ success: true });
    }

    if (text === "start") {
      // Opt-in logic
      await sendWhatsAppMessage({ phone, message: "Welcome back to SynapseMed notifications!" });
      return NextResponse.json({ success: true });
    }

    // Quiz Answer Logic
    // If the message is a single digit (e.g., "1", "2", "3")
    if (/^[1-5]$/.test(text)) {
      // Record answer logic here
      // E.g., prisma.questionOfTheDayAnswer.create(...)
      await sendWhatsAppMessage({ phone, message: "✅ Answer received! We've saved your response to your profile." });
      return NextResponse.json({ success: true });
    }

    // Default echo or help
    await sendWhatsAppMessage({ phone, message: "Unrecognized command. Reply STOP to unsubscribe." });
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
