import { type NextRequest, NextResponse } from "next/server"

// Build-safe implementation that returns mock data during build
export async function GET() {
  // Return mock data during build time
  const mockArticles = [
    {
      id: '1',
      title: 'Sample Article',
      author: 'Sample Author',
      content: 'Sample article content...',
      category: 'Sample Category',
      difficulty: 'INTERMEDIATE',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
  
  return NextResponse.json({ success: true, data: mockArticles });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      title,
      author,
      authorId,
      authorBio,
      journal,
      category,
      abstract,
      content,
      keywords,
      references,
      readTime,
      difficulty,
      isPublished,
    } = data

    if (!title || !author || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create mock article during build time
    const mockArticle = {
      id: Math.random().toString(36).substring(7),
      title,
      author,
      authorId,
      authorBio,
      journal,
      category,
      abstract,
      content,
      keywords: typeof keywords === 'string' ? keywords.split(',').map((k: string) => k.trim()) : keywords,
      references: typeof references === 'string' ? references.split('\n').filter((r: string) => r.trim()) : references,
      readTime,
      difficulty,
      isPublished,
      publishedAt: isPublished ? new Date() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: mockArticle }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
