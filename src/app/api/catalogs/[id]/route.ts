import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { catalog, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const catalogId = parseInt(params.id);

    if (isNaN(catalogId)) {
      return NextResponse.json({ error: 'Invalid catalog ID' }, { status: 400 });
    }

    const result = await db.select({
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
      userImage: user.image,
      userPhone: user.phoneNumber,
    })
    .from(catalog)
    .leftJoin(user, eq(catalog.userId, user.id))
    .where(eq(catalog.id, catalogId))
    .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    }

    return NextResponse.json({ catalog: result[0] }, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
