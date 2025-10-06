import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { blogPosts, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { 
          error: 'Valid slug is required',
          code: 'INVALID_SLUG'
        },
        { status: 400 }
      );
    }

    // Get current user (if authenticated)
    const currentUser = await getCurrentUser(request);

    // Query blog post with author information
    const result = await db
      .select({
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
        author: {
          name: users.name,
          email: users.email,
        }
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.slug, slug.trim()))
      .limit(1);

    // Check if post exists
    if (result.length === 0) {
      return NextResponse.json(
        { 
          error: 'Blog post not found',
          code: 'POST_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const post = result[0];

    // Authorization check: Only show non-published posts to author or admin
    if (post.status !== 'published') {
      if (!currentUser) {
        return NextResponse.json(
          { 
            error: 'Blog post not found',
            code: 'POST_NOT_FOUND'
          },
          { status: 404 }
        );
      }

      // Check if current user is the author or admin
      const isAuthor = currentUser.id === post.authorId?.toString();
      
      // Get user type to check for admin
      const userData = await db
        .select({ userType: users.userType })
        .from(users)
        .where(eq(users.id, parseInt(currentUser.id)))
        .limit(1);

      const isAdmin = userData.length > 0 && userData[0].userType === 'admin';

      if (!isAuthor && !isAdmin) {
        return NextResponse.json(
          { 
            error: 'Blog post not found',
            code: 'POST_NOT_FOUND'
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(post, { status: 200 });

  } catch (error) {
    console.error('GET blog post by slug error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error
      },
      { status: 500 }
    );
  }
}