import { runStartup } from "@/lib/startup"
import { NextResponse } from "next/server"

export async function GET() {
    await runStartup()
    return NextResponse.json({ ok: true })
}