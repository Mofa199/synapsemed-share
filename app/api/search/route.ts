import { type NextRequest, NextResponse } from "next/server"
import { searchContent } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const field = searchParams.get("field")
    const difficulty = searchParams.get("difficulty")

    if (!query.trim()) {
      return NextResponse.json({ results: [] })
    }

    // Set up filters
    const filters: any = {}
    
    if (type && type !== "all") {
      const typeMap: Record<string, string[]> = {
        "book": ["BOOK"],
        "article": ["ARTICLE"],
        "drug": ["DRUG"],
        "topic": ["TOPIC"],
        "study-guide": ["STUDY_GUIDE"],
        "question-bank": ["QUESTION_BANK"]
      }
      filters.type = typeMap[type] || [type.toUpperCase()]
    }
    
    if (category && category !== "all") {
      filters.category = category
    }
    
    if (field && field !== "all") {
      filters.field = field.toUpperCase()
    }
    
    if (difficulty && difficulty !== "all") {
      filters.difficulty = difficulty.toUpperCase()
    }

    const results = await searchContent(query, filters)

    // Ensure results is an array
    const resultsArray = Array.isArray(results) ? results : []

    // Transform results to include type field for frontend compatibility
    const transformedResults = resultsArray.map((result: any) => ({
      ...result,
      type: result.resourceType?.toLowerCase() || 'unknown'
    }))

    return NextResponse.json({ 
      results: transformedResults.slice(0, 20), // Limit to 20 results
      total: transformedResults.length
    })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json({ error: "Failed to process search request" }, { status: 500 })
  }
}
