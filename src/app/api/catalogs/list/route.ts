import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { catalog, user } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
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
      userEmail: user.email,
    })
    .from(catalog)
    .leftJoin(user, eq(catalog.userId, user.id))
    .where(eq(catalog.isPublic, true));

    const conditions = [eq(catalog.isPublic, true)];

    if (search) {
      conditions.push(
        or(
          like(catalog.title, `%${search}%`),
          like(catalog.description, `%${search}%`)
        )!
      );
    }

    if (category && category !== '') {
      conditions.push(eq(catalog.category, category));
    }

    if (conditions.length > 0) {
      query = db.select({
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
        userEmail: user.email,
      })
      .from(catalog)
      .leftJoin(user, eq(catalog.userId, user.id))
      .where(and(...conditions));
    }

    const results = await query.orderBy(desc(catalog.createdAt)).limit(50);

    return NextResponse.json({ catalogs: results }, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function dynamic() {
  return 'force-dynamic';
}
