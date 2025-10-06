import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialPosts } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    // Validate ID parameter
    const postId = params.id;
    if (!postId || isNaN(parseInt(postId))) {
      return NextResponse.json(
        { error: 'Valid post ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const id = parseInt(postId);

    // Check if post exists
    const existingPost = await db
      .select()
      .from(socialPosts)
      .where(eq(socialPosts.id, id))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found', code: 'POST_NOT_FOUND' },
        { status: 404 }
      );
    }

    const currentLikesCount = existingPost[0].likesCount;

    // Toggle like: increment the counter
    // In a real implementation with a likes table, we would check if user already liked
    // For now, we just increment. To simulate toggle, we could use query params
    // but requirements say "just increment the counter for now"
    const newLikesCount = currentLikesCount + 1;

    // Update post with incremented likes count and updated timestamp
    const updatedPost = await db
      .update(socialPosts)
      .set({
        likesCount: newLikesCount,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(socialPosts.id, id))
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