import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get user's favorite videos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const favorites = await prisma.videoFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST - Toggle favorite (add or remove)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, videoId } = body;

    if (!userId || !videoId) {
      return NextResponse.json(
        { error: 'User ID and Video ID are required' },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await prisma.videoFavorite.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId
        }
      }
    });

    if (existing) {
      // Remove from favorites
      await prisma.videoFavorite.delete({
        where: { id: existing.id }
      });

      return NextResponse.json({ 
        success: true, 
        favorited: false,
        message: 'Removed from favorites' 
      });
    } else {
      // Add to favorites
      await prisma.videoFavorite.create({
        data: {
          userId,
          videoId
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
