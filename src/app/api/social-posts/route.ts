import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialPosts, users } from '@/db/schema';
import { eq, like, and, or, desc, asc, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const post = await db
        .select({
          id: socialPosts.id,
          authorId: socialPosts.authorId,
          content: socialPosts.content,
          mediaUrls: socialPosts.mediaUrls,
          likesCount: socialPosts.likesCount,
          commentsCount: socialPosts.commentsCount,
          createdAt: socialPosts.createdAt,
          updatedAt: socialPosts.updatedAt,
          author: {
            id: users.id,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          }
        })
        .from(socialPosts)
        .leftJoin(users, eq(socialPosts.authorId, users.id))
        .where(eq(socialPosts.id, parseInt(id)))
        .limit(1);

      if (post.length === 0) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      return NextResponse.json(post[0], { status: 200 });
    }

    // List with pagination, filtering, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const authorId = searchParams.get('authorId');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build conditions array
    const conditions = [];

    // Filter by authorId if provided
    if (authorId) {
      const authorIdNum = parseInt(authorId);
      if (!isNaN(authorIdNum)) {
        conditions.push(eq(socialPosts.authorId, authorIdNum));
      }
    }

    // Search in content
    if (search) {
      conditions.push(like(socialPosts.content, `%${search}%`));
    }

    // Build query
    let query = db
      .select({
        id: socialPosts.id,
        authorId: socialPosts.authorId,
        content: socialPosts.content,
        mediaUrls: socialPosts.mediaUrls,
        likesCount: socialPosts.likesCount,
        commentsCount: socialPosts.commentsCount,
        createdAt: socialPosts.createdAt,
        updatedAt: socialPosts.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        }
      })
      .from(socialPosts)
      .leftJoin(users, eq(socialPosts.authorId, users.id));

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const validSortFields = ['createdAt', 'likesCount', 'commentsCount'];
    if (validSortFields.includes(sort)) {
      const sortColumn = sort === 'createdAt' ? socialPosts.createdAt :
                        sort === 'likesCount' ? socialPosts.likesCount :
                        socialPosts.commentsCount;
      query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn));
    } else {
      query = query.orderBy(desc(socialPosts.createdAt));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
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

    const body = await request.json();

    // Security check: reject if userId or authorId provided in body
    if ('userId' in body || 'user_id' in body || 'authorId' in body || 'author_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { content, mediaUrls } = body;

    // Validate required fields
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ 
        error: "Content is required and must be a non-empty string",
        code: "MISSING_CONTENT" 
      }, { status: 400 });
    }

    // Validate mediaUrls format if provided
    if (mediaUrls !== undefined && mediaUrls !== null) {
      if (!Array.isArray(mediaUrls)) {
        return NextResponse.json({ 
          error: "mediaUrls must be an array",
          code: "INVALID_MEDIA_URLS" 
        }, { status: 400 });
      }
      
      for (const url of mediaUrls) {
        if (typeof url !== 'string') {
          return NextResponse.json({ 
            error: "All media URLs must be strings",
            code: "INVALID_MEDIA_URL_TYPE" 
          }, { status: 400 });
        }
      }
    }

    // Verify user exists
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, parseInt(user.id)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ 
        error: "Referenced user does not exist",
        code: "INVALID_USER_REFERENCE" 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    // Insert new post
    const newPost = await db.insert(socialPosts)
      .values({
        authorId: parseInt(user.id),
        content: content.trim(),
        mediaUrls: mediaUrls || null,
        likesCount: 0,
        commentsCount: 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Fetch with author info
    const postWithAuthor = await db
      .select({
        id: socialPosts.id,
        authorId: socialPosts.authorId,
        content: socialPosts.content,
        mediaUrls: socialPosts.mediaUrls,
        likesCount: socialPosts.likesCount,
        commentsCount: socialPosts.commentsCount,
        createdAt: socialPosts.createdAt,
        updatedAt: socialPosts.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        }
      })
      .from(socialPosts)
      .leftJoin(users, eq(socialPosts.authorId, users.id))
      .where(eq(socialPosts.id, newPost[0].id))
      .limit(1);

    return NextResponse.json(postWithAuthor[0], { status: 201 });
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    // Security check: reject if userId or authorId provided in body
    if ('userId' in body || 'user_id' in body || 'authorId' in body || 'author_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Reject if trying to manually set counts
    if ('likesCount' in body || 'likes_count' in body || 'commentsCount' in body || 'comments_count' in body) {
      return NextResponse.json({ 
        error: "Counts cannot be manually updated",
        code: "COUNTS_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if post exists and belongs to user
    const existing = await db
      .select()
      .from(socialPosts)
      .where(and(
        eq(socialPosts.id, parseInt(id)),
        eq(socialPosts.authorId, parseInt(user.id))
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const { content, mediaUrls } = body;
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Validate and add content if provided
    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim() === '') {
        return NextResponse.json({ 
          error: "Content must be a non-empty string",
          code: "INVALID_CONTENT" 
        }, { status: 400 });
      }
      updates.content = content.trim();
    }

    // Validate and add mediaUrls if provided
    if (mediaUrls !== undefined) {
      if (mediaUrls !== null && !Array.isArray(mediaUrls)) {
        return NextResponse.json({ 
          error: "mediaUrls must be an array or null",
          code: "INVALID_MEDIA_URLS" 
        }, { status: 400 });
      }
      
      if (Array.isArray(mediaUrls)) {
        for (const url of mediaUrls) {
          if (typeof url !== 'string') {
            return NextResponse.json({ 
              error: "All media URLs must be strings",
              code: "INVALID_MEDIA_URL_TYPE" 
            }, { status: 400 });
          }
        }
      }
      
      updates.mediaUrls = mediaUrls;
    }

    // Update post
    const updated = await db
      .update(socialPosts)
      .set(updates)
      .where(and(
        eq(socialPosts.id, parseInt(id)),
        eq(socialPosts.authorId, parseInt(user.id))
      ))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Fetch with author info
    const postWithAuthor = await db
      .select({
        id: socialPosts.id,
        authorId: socialPosts.authorId,
        content: socialPosts.content,
        mediaUrls: socialPosts.mediaUrls,
        likesCount: socialPosts.likesCount,
        commentsCount: socialPosts.commentsCount,
        createdAt: socialPosts.createdAt,
        updatedAt: socialPosts.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        }
      })
      .from(socialPosts)
      .leftJoin(users, eq(socialPosts.authorId, users.id))
      .where(eq(socialPosts.id, parseInt(id)))
      .limit(1);

    return NextResponse.json(postWithAuthor[0], { status: 200 });
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if post exists and belongs to user
    const existing = await db
      .select()
      .from(socialPosts)
      .where(and(
        eq(socialPosts.id, parseInt(id)),
        eq(socialPosts.authorId, parseInt(user.id))
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Delete post
    const deleted = await db
      .delete(socialPosts)
      .where(and(
        eq(socialPosts.id, parseInt(id)),
        eq(socialPosts.authorId, parseInt(user.id))
      ))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Social post deleted successfully',
      deleted: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}