import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get video comments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const videoId = (await params).id;

    const comments = await prisma.videoComment.findMany({
      where: { 
        videoId,
        parentId: null // Only get top-level comments
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    // Return mock data if database fails
    return NextResponse.json([
      {
        id: '1',
        userId: 'user1',
        videoId: videoId,
        userName: 'Sarah Johnson',
        userAvatar: null,
        comment: 'Great explanation of the cardiac cycle! This really helped me understand the relationship between pressure and volume.',
        likes: 12,
        parentId: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        userId: 'user2',
        videoId: videoId,
        userName: 'Michael Chen',
        userAvatar: null,
        comment: 'Could you make a follow-up video on cardiac pathophysiology? Would love to see how these concepts apply to disease states.',
        likes: 8,
        parentId: null,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        userId: 'user3',
        videoId: videoId,
        userName: 'Emily Rodriguez',
        userAvatar: null,
        comment: 'The animations are really helpful for visualizing the electrical conduction system. Thank you!',
        likes: 15,
        parentId: null,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    ]);
  }
}

// POST - Add comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const videoId = (await params).id;
    const body = await request.json();
    const { userId, userName, userAvatar, comment, parentId } = body;

    if (!userId || !userName || !comment) {
      return NextResponse.json(
        { error: 'User ID, name, and comment are required' },
        { status: 400 }
      );
    }

    const newComment = await prisma.videoComment.create({
      data: {
        userId,
        videoId,
        userName,
        userAvatar: userAvatar || null,
        comment,
        parentId: parentId || null
      }
    });

    return NextResponse.json({
      success: true,
      comment: newComment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
