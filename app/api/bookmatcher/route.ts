import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromRequest } from '@/lib/db-utils'

// AI-powered book matching algorithm
export async function POST(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { query, level, field } = body

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query is required'
      }, { status: 400 })
    }

    // In production, this would use AI backend to match books
    // For now, we'll use a smart matching algorithm
    const allBooks = [
      {
        id: '1',
        title: "Gray's Anatomy for Students",
        author: "Richard Drake, A. Wayne Vogl, Adam W.M. Mitchell",
        category: "Anatomy",
        difficulty: "Beginner",
        pages: 1161,
        rating: 4.8,
        keywords: ["anatomy", "medical students", "comprehensive", "illustrated"]
      },
      {
        id: '2',
        title: "Guyton and Hall Textbook of Medical Physiology",
        author: "John E. Hall",
        category: "Physiology",
        difficulty: "Intermediate",
        pages: 1152,
        rating: 4.7,
        keywords: ["physiology", "cardiovascular", "renal", "respiratory", "comprehensive"]
      },
      {
        id: '3',
        title: "Rang and Dale's Pharmacology",
        author: "Humphrey P. Rang, Maureen M. Dale",
        category: "Pharmacology",
        difficulty: "Intermediate",
        pages: 792,
        rating: 4.6,
        keywords: ["pharmacology", "drug mechanisms", "therapeutics", "clinical"]
      },
      {
        id: '4',
        title: "Robbins Basic Pathology",
        author: "Vinay Kumar, Abul K. Abbas, Jon C. Aster",
        category: "Pathology",
        difficulty: "Intermediate",
        pages: 928,
        rating: 4.7,
        keywords: ["pathology", "disease mechanisms", "clinical correlations"]
      },
      {
        id: '5',
        title: "First Aid for the USMLE Step 1",
        author: "Tao Le, Vikas Bhushan",
        category: "Clinical",
        difficulty: "Advanced",
        pages: 816,
        rating: 4.9,
        keywords: ["usmle", "exam prep", "high-yield", "comprehensive review"]
      },
      {
        id: '6',
        title: "Netter's Atlas of Human Anatomy",
        author: "Frank H. Netter",
        category: "Anatomy",
        difficulty: "Beginner",
        pages: 672,
        rating: 4.9,
        keywords: ["anatomy", "atlas", "visual", "illustrated", "comprehensive"]
      },
      {
        id: '7',
        title: "Harrison's Principles of Internal Medicine",
        author: "J. Larry Jameson, Anthony S. Fauci",
        category: "Clinical",
        difficulty: "Advanced",
        pages: 4688,
        rating: 4.8,
        keywords: ["internal medicine", "clinical practice", "comprehensive", "reference"]
      },
      {
        id: '8',
        title: "Lippincott Illustrated Reviews: Biochemistry",
        author: "Denise R. Ferrier",
        category: "Biochemistry",
        difficulty: "Beginner",
        pages: 560,
        rating: 4.5,
        keywords: ["biochemistry", "metabolism", "molecular biology", "illustrated"]
      }
    ]

    // Calculate relevance scores
    const queryLower = query.toLowerCase()
    const matches = allBooks
      .map(book => {
        let score = 0
        let matchReasons: string[] = []

        // Keyword matching
        book.keywords.forEach(keyword => {
          if (queryLower.includes(keyword.toLowerCase())) {
            score += 25
            matchReasons.push(`Covers ${keyword}`)
          }
        })

        // Title matching
        if (book.title.toLowerCase().includes(queryLower)) {
          score += 30
          matchReasons.push("Directly matches your search")
        }

        // Category matching
        if (field && book.category.toLowerCase() === field.toLowerCase()) {
          score += 20
          matchReasons.push(`Perfect for ${field}`)
        }

        // Level matching
        if (level && book.difficulty.toLowerCase() === level.toLowerCase()) {
          score += 15
          matchReasons.push(`Matches your ${level} level`)
        } else if (!level) {
          score += 5
        }

        // Rating bonus
        if (book.rating >= 4.7) {
          score += 10
          matchReasons.push("Highly rated by students")
        }

        return {
          ...book,
          relevance: Math.min(100, score),
          reason: matchReasons.length > 0 
            ? matchReasons.slice(0, 2).join(". ") + "."
            : "Recommended based on your learning profile."
        }
      })
      .filter(book => book.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8) // Top 8 matches

    return NextResponse.json({
      success: true,
      data: matches
    })
  } catch (error) {
    console.error('Error matching books:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to match books'
    }, { status: 500 })
  }
}
