import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialComments, socialPosts, users } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single comment by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const comment = await db.select({
        id: socialComments.id,
        postId: socialComments.postId,
        authorId: socialComments.authorId,
        content: socialComments.content,
        createdAt: socialComments.createdAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        }
      })
        .from(socialComments)
        .leftJoin(users, eq(socialComments.authorId, parseInt(users.id)))
        .where(eq(socialComments.id, parseInt(id)))
        .limit(1);

      if (comment.length === 0) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }

      return NextResponse.json(comment[0]);
    }

    // List comments with pagination and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const postId = searchParams.get('postId');
    const authorId = searchParams.get('authorId');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build conditions array
    const conditions = [];

    if (postId) {
      if (isNaN(parseInt(postId))) {
        return NextResponse.json({ 
          error: "Valid postId is required",
          code: "INVALID_POST_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(socialComments.postId, parseInt(postId)));
    }

    if (authorId) {
      if (isNaN(parseInt(authorId))) {
        return NextResponse.json({ 
          error: "Valid authorId is required",
          code: "INVALID_AUTHOR_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(socialComments.authorId, parseInt(authorId)));
    }

    let query = db.select({
      id: socialComments.id,
      postId: socialComments.postId,
      authorId: socialComments.authorId,
      content: socialComments.content,
      createdAt: socialComments.createdAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      }
    })
      .from(socialComments)
      .leftJoin(users, eq(socialComments.authorId, parseInt(users.id)));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const orderFn = order === 'asc' ? asc : desc;
    if (sort === 'createdAt') {
      query = query.orderBy(orderFn(socialComments.createdAt));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const requestBody = await request.json();

    // Security check: reject if user identifiers provided in body
    if ('authorId' in requestBody || 'author_id' in requestBody || 'userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { postId, content } = requestBody;

    // Validate required fields
    if (!postId) {
      return NextResponse.json({ 
        error: "postId is required",
        code: "MISSING_POST_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(postId))) {
      return NextResponse.json({ 
        error: "Valid postId is required",
        code: "INVALID_POST_ID" 
      }, { status: 400 });
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ 
        error: "content is required and must be a non-empty string",
        code: "MISSING_CONTENT" 
      }, { status: 400 });
    }

    // Verify post exists
    const post = await db.select()
      .from(socialPosts)
      .where(eq(socialPosts.id, parseInt(postId)))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json({ 
        error: "Referenced post does not exist",
        code: "INVALID_POST_REFERENCE" 
      }, { status: 400 });
    }

    // Verify user exists (from auth system)
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(user.id)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "INVALID_USER" 
      }, { status: 400 });
    }

    // Create comment
    const newComment = await db.insert(socialComments)
      .values({
        postId: parseInt(postId),
        authorId: parseInt(user.id),
        content: content.trim(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Update comments count on post
    await db.update(socialPosts)
      .set({
        commentsCount: post[0].commentsCount + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(socialPosts.id, parseInt(postId)));

    // Fetch comment with author details
    const commentWithAuthor = await db.select({
      id: socialComments.id,
      postId: socialComments.postId,
      authorId: socialComments.authorId,
      content: socialComments.content,
      createdAt: socialComments.createdAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      }
    })
      .from(socialComments)
      .leftJoin(users, eq(socialComments.authorId, parseInt(users.id)))
      .where(eq(socialComments.id, newComment[0].id))
      .limit(1);

    return NextResponse.json(commentWithAuthor[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();

    // Security check: reject if user identifiers provided in body
    if ('authorId' in requestBody || 'author_id' in requestBody || 'userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { content } = requestBody;

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ 
        error: "content is required and must be a non-empty string",
        code: "MISSING_CONTENT" 
      }, { status: 400 });
    }

    // Check if comment exists and belongs to user
    const existingComment = await db.select()
      .from(socialComments)
      .where(and(
        eq(socialComments.id, parseInt(id)),
        eq(socialComments.authorId, parseInt(user.id))
      ))
      .limit(1);

    if (existingComment.length === 0) {
      return NextResponse.json({ 
        error: 'Comment not found or you do not have permission to update it' 
      }, { status: 404 });
    }

    // Update comment
    const updated = await db.update(socialComments)
      .set({
        content: content.trim(),
      })
      .where(and(
        eq(socialComments.id, parseInt(id)),
        eq(socialComments.authorId, parseInt(user.id))
      ))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update comment' 
      }, { status: 404 });
    }

    // Fetch updated comment with author details
    const commentWithAuthor = await db.select({
      id: socialComments.id,
      postId: socialComments.postId,
      authorId: socialComments.authorId,
      content: socialComments.content,
      createdAt: socialComments.createdAt,
      author: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      }
    })
      .from(socialComments)
      .leftJoin(users, eq(socialComments.authorId, parseInt(users.id)))
      .where(eq(socialComments.id, updated[0].id))
      .limit(1);

    return NextResponse.json(commentWithAuthor[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if comment exists and belongs to user
    const existingComment = await db.select()
      .from(socialComments)
      .where(and(
        eq(socialComments.id, parseInt(id)),
        eq(socialComments.authorId, parseInt(user.id))
      ))
      .limit(1);

    if (existingComment.length === 0) {
      return NextResponse.json({ 
        error: 'Comment not found or you do not have permission to delete it' 
      }, { status: 404 });
    }

    const postId = existingComment[0].postId;

    // Delete comment
    const deleted = await db.delete(socialComments)
      .where(and(
        eq(socialComments.id, parseInt(id)),
        eq(socialComments.authorId, parseInt(user.id))
      ))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete comment' 
      }, { status: 404 });
    }

    // Update comments count on post
    const post = await db.select()
      .from(socialPosts)
      .where(eq(socialPosts.id, postId))
      .limit(1);

    if (post.length > 0) {
      await db.update(socialPosts)
        .set({
          commentsCount: Math.max(0, post[0].commentsCount - 1),
          updatedAt: new Date().toISOString(),
        })
        .where(eq(socialPosts.id, postId));
    }

    return NextResponse.json({
      message: 'Comment deleted successfully',
      deleted: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}