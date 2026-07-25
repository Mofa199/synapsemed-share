import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole, Difficulty } from "@prisma/client"
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        curriculum: true,
        module: true,
      }
    });

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json();
    
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

    const updatedArticle = await prisma.article.update({
      where: { id },
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
        publishedAt: isPublished && !data.publishedAt ? new Date() : undefined,
        curriculumId: curriculumId || null,
        moduleId: moduleId || null,
      }
    });

    return NextResponse.json({ success: true, data: updatedArticle });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.article.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}