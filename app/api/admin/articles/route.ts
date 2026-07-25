import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { UserRole, Difficulty } from "@prisma/client"
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
    
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

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
      curriculumId,
      moduleId,
    } = data

    if (!title || !author || !content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, author, and content are required." },
        { status: 400 }
      )
    }

    const article = await prisma.article.create({
      data: {
        title,
        author,
        authorId: authorId || null,
        authorBio: authorBio || null,
        journal: journal || null,
        category: category || null,
        abstract: abstract || null,
        content,
        keywords: Array.isArray(keywords) ? keywords.join(", ") : (keywords || ""),
        references: Array.isArray(references) ? references.join("\n") : (references || ""),
        readTime: readTime || null,
        difficulty: (difficulty as Difficulty) || Difficulty.BEGINNER,
        isPublished: !!isPublished,
        publishedAt: isPublished ? new Date() : null,
        curriculumId: curriculumId || null,
        moduleId: moduleId || null,
      },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create article" },
      { status: 500 }
    );
  }
}
