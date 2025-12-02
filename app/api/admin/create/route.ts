import { runStartup } from "@/lib/startup"

export async function GET() {
    await runStartup()
    return Response.json({ ok: true })
}