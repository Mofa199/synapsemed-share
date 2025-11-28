import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Toggle concept favorite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, conceptId } = body;

    if (!userId || !conceptId) {
      return NextResponse.json(
        { error: 'User ID and Concept ID are required' },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await prisma.conceptFavorite.findUnique({
      where: {
        userId_conceptId: {
          userId,
          conceptId
        }
      }
    });

    if (existing) {
      // Remove from favorites
      await prisma.conceptFavorite.delete({
        where: { id: existing.id }
      });

      return NextResponse.json({ 
        success: true, 
        favorited: false,
        message: 'Removed from favorites' 
      });
    } else {
      // Add to favorites
      await prisma.conceptFavorite.create({
        data: {
          userId,
          conceptId
        }
      });

      return NextResponse.json({ 
        success: true, 
        favorited: true,
        message: 'Added to favorites' 
      });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}
