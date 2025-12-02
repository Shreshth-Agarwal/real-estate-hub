import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialPosts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    // Validate ID parameter
    const { id } = await params;
    const postId = id;
    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json(
        { error: 'Valid post ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const parsedId = parseInt(postId);

    // Check if post exists
    const existingPost = await db
      .select()
      .from(socialPosts)
      .where(eq(socialPosts.id, parsedId))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found', code: 'POST_NOT_FOUND' },
        { status: 404 }
      );
    }

    const currentLikesCount = existingPost[0].likesCount;

    // Toggle like: increment the counter
    const newLikesCount = currentLikesCount + 1;

    // Update post with incremented likes count and updated timestamp
    const updatedPost = await db
      .update(socialPosts)
      .set({
        likesCount: newLikesCount,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(socialPosts.id, parsedId))
      .returning();

    if (updatedPost.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update post', code: 'UPDATE_FAILED' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPost[0], { status: 200 });
  } catch (error) {
    console.error('POST like toggle error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}