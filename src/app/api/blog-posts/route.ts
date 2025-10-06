import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts, user } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to validate status
function isValidStatus(status: string): boolean {
  return ['draft', 'review', 'published'].includes(status);
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const result = await db.select({
        id: blogPosts.id,
        authorId: blogPosts.authorId,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        bodyMd: blogPosts.bodyMd,
        tags: blogPosts.tags,
        heroUrl: blogPosts.heroUrl,
        status: blogPosts.status,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        authorName: user.name,
        authorEmail: user.email,
      })
        .from(blogPosts)
        .leftJoin(user, eq(blogPosts.authorId, user.id))
        .where(and(
          eq(blogPosts.id, parseInt(id)),
          eq(blogPosts.authorId, currentUser.id)
        ))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    // List with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const authorId = searchParams.get('authorId');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Validate status filter
    if (status && !isValidStatus(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: draft, review, published',
        code: 'INVALID_STATUS' 
      }, { status: 400 });
    }

    // Validate sort field
    const validSortFields = ['createdAt', 'publishedAt', 'title', 'updatedAt'];
    if (!validSortFields.includes(sort)) {
      return NextResponse.json({ 
        error: 'Invalid sort field. Must be one of: createdAt, publishedAt, title, updatedAt',
        code: 'INVALID_SORT_FIELD' 
      }, { status: 400 });
    }

    let query = db.select({
      id: blogPosts.id,
      authorId: blogPosts.authorId,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      bodyMd: blogPosts.bodyMd,
      tags: blogPosts.tags,
      heroUrl: blogPosts.heroUrl,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
      authorName: user.name,
      authorEmail: user.email,
    })
      .from(blogPosts)
      .leftJoin(user, eq(blogPosts.authorId, user.id));

    // Build WHERE conditions
    const conditions = [eq(blogPosts.authorId, currentUser.id)];

    if (search) {
      conditions.push(
        or(
          like(blogPosts.title, `%${search}%`),
          like(blogPosts.excerpt, `%${search}%`)
        )!
      );
    }

    if (status) {
      conditions.push(eq(blogPosts.status, status));
    }

    if (authorId) {
      if (isNaN(parseInt(authorId))) {
        return NextResponse.json({ 
          error: 'Valid author ID is required',
          code: 'INVALID_AUTHOR_ID' 
        }, { status: 400 });
      }
      conditions.push(eq(blogPosts.authorId, parseInt(authorId)));
    }

    query = query.where(and(...conditions));

    // Apply sorting
    const sortColumn = sort === 'title' ? blogPosts.title :
                       sort === 'publishedAt' ? blogPosts.publishedAt :
                       sort === 'updatedAt' ? blogPosts.updatedAt :
                       blogPosts.createdAt;

    query = order === 'asc' ? query.orderBy(asc(sortColumn)) : query.orderBy(desc(sortColumn));

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
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();

    // Security check: reject if userId/authorId provided in body
    if ('userId' in body || 'user_id' in body || 'authorId' in body || 'author_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { title, slug, excerpt, bodyMd, tags, heroUrl, status } = body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!excerpt || excerpt.trim() === '') {
      return NextResponse.json({ 
        error: "Excerpt is required",
        code: "MISSING_EXCERPT" 
      }, { status: 400 });
    }

    if (!bodyMd || bodyMd.trim() === '') {
      return NextResponse.json({ 
        error: "Body content is required",
        code: "MISSING_BODY" 
      }, { status: 400 });
    }

    // Generate slug if not provided
    const finalSlug = slug && slug.trim() !== '' ? slug.trim() : generateSlug(title);

    // Check for duplicate slug
    const existingSlug = await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, finalSlug))
      .limit(1);

    if (existingSlug.length > 0) {
      return NextResponse.json({ 
        error: "A blog post with this slug already exists",
        code: "DUPLICATE_SLUG" 
      }, { status: 409 });
    }

    // Validate status
    const finalStatus = status || 'draft';
    if (!isValidStatus(finalStatus)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: draft, review, published",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate tags if provided
    let finalTags = null;
    if (tags) {
      if (!Array.isArray(tags)) {
        return NextResponse.json({ 
          error: "Tags must be an array",
          code: "INVALID_TAGS_FORMAT" 
        }, { status: 400 });
      }
      finalTags = tags;
    }

    const now = new Date().toISOString();
    const publishedAt = finalStatus === 'published' ? now : null;

    const newPost = await db.insert(blogPosts)
      .values({
        authorId: currentUser.id,
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        bodyMd: bodyMd.trim(),
        tags: finalTags,
        heroUrl: heroUrl?.trim() || null,
        status: finalStatus,
        publishedAt,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
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

    const body = await request.json();

    // Security check: reject if userId/authorId provided in body
    if ('userId' in body || 'user_id' in body || 'authorId' in body || 'author_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if record exists and belongs to user
    const existing = await db.select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.id, parseInt(id)),
        eq(blogPosts.authorId, currentUser.id)
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const currentPost = existing[0];
    const { title, slug, excerpt, bodyMd, tags, heroUrl, status } = body;

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) {
      if (title.trim() === '') {
        return NextResponse.json({ 
          error: "Title cannot be empty",
          code: "EMPTY_TITLE" 
        }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (slug !== undefined) {
      const trimmedSlug = slug.trim();
      if (trimmedSlug === '') {
        return NextResponse.json({ 
          error: "Slug cannot be empty",
          code: "EMPTY_SLUG" 
        }, { status: 400 });
      }
      
      // Check for duplicate slug (excluding current post)
      const existingSlug = await db.select()
        .from(blogPosts)
        .where(and(
          eq(blogPosts.slug, trimmedSlug),
          eq(blogPosts.authorId, currentUser.id)
        ))
        .limit(1);

      if (existingSlug.length > 0 && existingSlug[0].id !== parseInt(id)) {
        return NextResponse.json({ 
          error: "A blog post with this slug already exists",
          code: "DUPLICATE_SLUG" 
        }, { status: 409 });
      }
      
      updates.slug = trimmedSlug;
    }

    if (excerpt !== undefined) {
      if (excerpt.trim() === '') {
        return NextResponse.json({ 
          error: "Excerpt cannot be empty",
          code: "EMPTY_EXCERPT" 
        }, { status: 400 });
      }
      updates.excerpt = excerpt.trim();
    }

    if (bodyMd !== undefined) {
      if (bodyMd.trim() === '') {
        return NextResponse.json({ 
          error: "Body content cannot be empty",
          code: "EMPTY_BODY" 
        }, { status: 400 });
      }
      updates.bodyMd = bodyMd.trim();
    }

    if (tags !== undefined) {
      if (tags !== null && !Array.isArray(tags)) {
        return NextResponse.json({ 
          error: "Tags must be an array or null",
          code: "INVALID_TAGS_FORMAT" 
        }, { status: 400 });
      }
      updates.tags = tags;
    }

    if (heroUrl !== undefined) {
      updates.heroUrl = heroUrl?.trim() || null;
    }

    if (status !== undefined) {
      if (!isValidStatus(status)) {
        return NextResponse.json({ 
          error: "Invalid status. Must be one of: draft, review, published",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      updates.status = status;
      
      // Auto-set publishedAt when status changes to published
      if (status === 'published' && currentPost.status !== 'published') {
        updates.publishedAt = new Date().toISOString();
      } else if (status !== 'published' && currentPost.status === 'published') {
        updates.publishedAt = null;
      }
    }

    const updated = await db.update(blogPosts)
      .set(updates)
      .where(and(
        eq(blogPosts.id, parseInt(id)),
        eq(blogPosts.authorId, currentUser.id)
      ))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
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

    // Check if record exists and belongs to user
    const existing = await db.select()
      .from(blogPosts)
      .where(and(
        eq(blogPosts.id, parseInt(id)),
        eq(blogPosts.authorId, currentUser.id)
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const deleted = await db.delete(blogPosts)
      .where(and(
        eq(blogPosts.id, parseInt(id)),
        eq(blogPosts.authorId, currentUser.id)
      ))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Blog post deleted successfully',
      deletedPost: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}