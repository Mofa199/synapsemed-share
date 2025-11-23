import { NextResponse } from "next/server"
import { getAnalyticsData } from '@/lib/db-utils'

export async function GET() {
  try {
    const analyticsData = await getAnalyticsData()
    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics API Error:", error)
    return NextResponse.json({ error: "Failed to get analytics data" }, { status: 500 })
  }
}
