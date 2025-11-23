import { type NextRequest, NextResponse } from "next/server"

// GET /api/admin/simulations/results
export async function GET(req: NextRequest) {
  try {
    // For now, return mock data since we don't have a specific simulation results model
    // In a real implementation, this would query a simulation results table
    const mockResults = [
      {
        id: "1",
        userId: "user1",
        simulationId: "sim1",
        userName: "John Doe",
        simulationTitle: "Acute Myocardial Infarction",
        score: 85,
        timeTaken: "25 min",
        completedAt: new Date().toISOString(),
        attempts: 2,
        isCompleted: true,
      },
      {
        id: "2",
        userId: "user2",
        simulationId: "sim1",
        userName: "Jane Smith",
        simulationTitle: "Acute Myocardial Infarction",
        score: 92,
        timeTaken: "22 min",
        completedAt: new Date().toISOString(),
        attempts: 1,
        isCompleted: true,
      },
      {
        id: "3",
        userId: "user3",
        simulationId: "sim2",
        userName: "Robert Johnson",
        simulationTitle: "Pneumonia Case Study",
        score: 78,
        timeTaken: "30 min",
        completedAt: new Date().toISOString(),
        attempts: 3,
        isCompleted: true,
      },
    ]

    return NextResponse.json({ success: true, data: mockResults })
  } catch (error) {
    console.error("Error fetching simulation results:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}