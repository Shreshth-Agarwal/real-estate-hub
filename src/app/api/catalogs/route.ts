import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { catalog, user } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';
import { getCurrentUserFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromCookies();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const catalogData = await db.select({
        id: catalog.id,
        userId: catalog.userId,
        title: catalog.title,
        description: catalog.description,
        category: catalog.category,
        subCategory: catalog.subCategory,
        images: catalog.images,
        pdfUrl: catalog.pdfUrl,
        items: catalog.items,
        isPublic: catalog.isPublic,
        createdAt: catalog.createdAt,
        updatedAt: catalog.updatedAt,
        userName: user.name,
        userEmail: user.email
      })
      .from(catalog)
      .leftJoin(user, eq(catalog.userId, user.id))
      .where(eq(catalog.id, parseInt(id)))
      .limit(1);

      if (catalogData.length === 0) {
        return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
      }

      const catalogItem = catalogData[0];
      
      if (!catalogItem.isPublic && (!currentUser || catalogItem.userId !== currentUser.id)) {
        return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
      }

      return NextResponse.json(catalogItem);
    }

    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const userIdParam = searchParams.get('userId');
    const isPublicParam = searchParams.get('isPublic');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const conditions = [];

    // Secure authorization logic
    if (!currentUser) {
      // Unauthenticated users: ONLY public catalogs, IGNORE all userId/isPublic params
      conditions.push(eq(catalog.isPublic, true));
    } else {
      // Authenticated users: Validate userId and isPublic params
      // Only use userId filter if it matches the current user's ID
      const isOwnUserIdFilter = userIdParam && userIdParam === currentUser.id.toString();
      
      if (isOwnUserIdFilter && isPublicParam === 'false') {
        // Current user's private catalogs only
        conditions.push(eq(catalog.userId, currentUser.id));
        conditions.push(eq(catalog.isPublic, false));
      } else if (isOwnUserIdFilter && isPublicParam === 'true') {
        // Current user's public catalogs only
        conditions.push(eq(catalog.userId, currentUser.id));
        conditions.push(eq(catalog.isPublic, true));
      } else if (isOwnUserIdFilter) {
        // All of current user's catalogs (public + private)
        conditions.push(eq(catalog.userId, currentUser.id));
      } else if (isPublicParam === 'false') {
        // Only current user's private catalogs (ignore invalid userId)
        conditions.push(eq(catalog.userId, currentUser.id));
        conditions.push(eq(catalog.isPublic, false));
      } else if (isPublicParam === 'true') {
        // All public catalogs
        conditions.push(eq(catalog.isPublic, true));
      } else {
        // No filters or invalid userId: public catalogs + current user's own catalogs
        conditions.push(
          or(
            eq(catalog.isPublic, true),
            eq(catalog.userId, currentUser.id)
          )
        );
      }
    }

    // Apply other safe filters
    if (search) {
      conditions.push(
        or(
          like(catalog.title, `%${search}%`),
          like(catalog.description, `%${search}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(catalog.category, category));
    }

    const sortField = sort === 'title' ? catalog.title :
                     sort === 'category' ? catalog.category :
                     catalog.createdAt;

    const sortOrder = order === 'asc' ? asc(sortField) : desc(sortField);

    let query = db.select({
      id: catalog.id,
      userId: catalog.userId,
      title: catalog.title,
      description: catalog.description,
      category: catalog.category,
      subCategory: catalog.subCategory,
      images: catalog.images,
      pdfUrl: catalog.pdfUrl,
      items: catalog.items,
      isPublic: catalog.isPublic,
      createdAt: catalog.createdAt,
      updatedAt: catalog.updatedAt,
      userName: user.name,
      userEmail: user.email
    })
    .from(catalog)
    .leftJoin(user, eq(catalog.userId, user.id))
    .orderBy(sortOrder)
    .limit(limit)
    .offset(offset);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const results = await query;

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
    const currentUser = await getCurrentUserFromCookies();
    
    if (!currentUser) {
      return NextResponse.json({ 
        error: "Unauthorized - Authentication required",
        code: "UNAUTHORIZED" 
      }, { status: 401 });
    }

    const requestBody = await request.json();
    const {
      title,
      description,
      category,
      subCategory,
      images,
      pdfUrl,
      items,
      isPublic = true
    } = requestBody;

    if (!title || !title.trim()) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    const newCatalog = await db.insert(catalog)
      .values({
        userId: currentUser.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: category?.trim() || null,
        subCategory: subCategory?.trim() || null,
        images: images || [],
        pdfUrl: pdfUrl?.trim() || null,
        items: items || [],
        isPublic: isPublic
      })
      .returning();

    return NextResponse.json(newCatalog[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromCookies();
    
    if (!currentUser) {
      return NextResponse.json({ 
        error: "Unauthorized - Authentication required",
        code: "UNAUTHORIZED" 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const existingCatalog = await db.select()
      .from(catalog)
      .where(eq(catalog.id, parseInt(id)))
      .limit(1);

    if (existingCatalog.length === 0) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    }

    if (existingCatalog[0].userId !== currentUser.id) {
      return NextResponse.json({ 
        error: "Forbidden - You don't have permission to update this catalog",
        code: "FORBIDDEN" 
      }, { status: 403 });
    }

    const requestBody = await request.json();
    const {
      title,
      description,
      category,
      subCategory,
      images,
      pdfUrl,
      items,
      isPublic
    } = requestBody;

    const updates: any = {};

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return NextResponse.json({ 
          error: "Title cannot be empty",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }

    if (category !== undefined) {
      updates.category = category?.trim() || null;
    }

    if (subCategory !== undefined) {
      updates.subCategory = subCategory?.trim() || null;
    }

    if (images !== undefined) {
      updates.images = images;
    }

    if (pdfUrl !== undefined) {
      updates.pdfUrl = pdfUrl?.trim() || null;
    }

    if (items !== undefined) {
      updates.items = items;
    }

    if (isPublic !== undefined) {
      updates.isPublic = isPublic;
    }

    updates.updatedAt = new Date();

    const updated = await db.update(catalog)
      .set(updates)
      .where(eq(catalog.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromCookies();
    
    if (!currentUser) {
      return NextResponse.json({ 
        error: "Unauthorized - Authentication required",
        code: "UNAUTHORIZED" 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const existingCatalog = await db.select()
      .from(catalog)
      .where(eq(catalog.id, parseInt(id)))
      .limit(1);

    if (existingCatalog.length === 0) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    }

    if (existingCatalog[0].userId !== currentUser.id) {
      return NextResponse.json({ 
        error: "Forbidden - You don't have permission to delete this catalog",
        code: "FORBIDDEN" 
      }, { status: 403 });
    }

    const deleted = await db.delete(catalog)
      .where(eq(catalog.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Catalog deleted successfully',
      catalog: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}
