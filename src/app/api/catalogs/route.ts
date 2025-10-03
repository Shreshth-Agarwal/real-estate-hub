import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { catalogs, users } from '@/db/schema';
import { eq, like, and, or, desc, asc, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single catalog by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const catalog = await db.select({
        id: catalogs.id,
        providerId: catalogs.providerId,
        title: catalogs.title,
        brand: catalogs.brand,
        sku: catalogs.sku,
        description: catalogs.description,
        price: catalogs.price,
        currency: catalogs.currency,
        unit: catalogs.unit,
        moq: catalogs.moq,
        stockStatus: catalogs.stockStatus,
        attributes: catalogs.attributes,
        city: catalogs.city,
        deliveryRadiusKm: catalogs.deliveryRadiusKm,
        images: catalogs.images,
        pdfUrl: catalogs.pdfUrl,
        popularityScore: catalogs.popularityScore,
        createdAt: catalogs.createdAt,
        updatedAt: catalogs.updatedAt,
        providerName: users.name,
        providerEmail: users.email
      })
      .from(catalogs)
      .leftJoin(users, eq(catalogs.providerId, users.id))
      .where(eq(catalogs.id, parseInt(id)))
      .limit(1);

      if (catalog.length === 0) {
        return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
      }

      return NextResponse.json(catalog[0]);
    }

    // List catalogs with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const stockStatus = searchParams.get('stockStatus');
    const providerId = searchParams.get('providerId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select({
      id: catalogs.id,
      providerId: catalogs.providerId,
      title: catalogs.title,
      brand: catalogs.brand,
      sku: catalogs.sku,
      description: catalogs.description,
      price: catalogs.price,
      currency: catalogs.currency,
      unit: catalogs.unit,
      moq: catalogs.moq,
      stockStatus: catalogs.stockStatus,
      attributes: catalogs.attributes,
      city: catalogs.city,
      deliveryRadiusKm: catalogs.deliveryRadiusKm,
      images: catalogs.images,
      pdfUrl: catalogs.pdfUrl,
      popularityScore: catalogs.popularityScore,
      createdAt: catalogs.createdAt,
      updatedAt: catalogs.updatedAt,
      providerName: users.name,
      providerEmail: users.email
    })
    .from(catalogs)
    .leftJoin(users, eq(catalogs.providerId, users.id));

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(catalogs.title, `%${search}%`),
          like(catalogs.brand, `%${search}%`),
          like(catalogs.description, `%${search}%`)
        )
      );
    }

    if (city) {
      conditions.push(eq(catalogs.city, city));
    }

    if (stockStatus && ['in_stock', 'out_of_stock', 'limited'].includes(stockStatus)) {
      conditions.push(eq(catalogs.stockStatus, stockStatus));
    }

    if (providerId && !isNaN(parseInt(providerId))) {
      conditions.push(eq(catalogs.providerId, parseInt(providerId)));
    }

    if (minPrice && !isNaN(parseFloat(minPrice))) {
      conditions.push(gte(catalogs.price, parseFloat(minPrice)));
    }

    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      conditions.push(lte(catalogs.price, parseFloat(maxPrice)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortField = sort === 'price' ? catalogs.price :
                     sort === 'popularityScore' ? catalogs.popularityScore :
                     sort === 'moq' ? catalogs.moq :
                     catalogs.createdAt;

    query = order === 'asc' ? 
      query.orderBy(asc(sortField)) : 
      query.orderBy(desc(sortField));

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
    const requestBody = await request.json();
    const {
      providerId,
      title,
      brand,
      sku,
      description,
      price,
      currency = 'INR',
      unit,
      moq,
      stockStatus = 'in_stock',
      attributes,
      city,
      deliveryRadiusKm,
      images,
      pdfUrl,
      popularityScore = 0
    } = requestBody;

    // Validate required fields
    if (!providerId) {
      return NextResponse.json({ 
        error: "Provider ID is required",
        code: "MISSING_PROVIDER_ID" 
      }, { status: 400 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return NextResponse.json({ 
        error: "Price must be a positive number",
        code: "INVALID_PRICE" 
      }, { status: 400 });
    }

    if (!unit || !unit.trim()) {
      return NextResponse.json({ 
        error: "Unit is required",
        code: "MISSING_UNIT" 
      }, { status: 400 });
    }

    if (!moq || isNaN(parseInt(moq)) || parseInt(moq) <= 0) {
      return NextResponse.json({ 
        error: "MOQ must be a positive integer",
        code: "INVALID_MOQ" 
      }, { status: 400 });
    }

    if (!city || !city.trim()) {
      return NextResponse.json({ 
        error: "City is required",
        code: "MISSING_CITY" 
      }, { status: 400 });
    }

    // Validate stock status
    if (stockStatus && !['in_stock', 'out_of_stock', 'limited'].includes(stockStatus)) {
      return NextResponse.json({ 
        error: "Stock status must be one of: in_stock, out_of_stock, limited",
        code: "INVALID_STOCK_STATUS" 
      }, { status: 400 });
    }

    // Validate provider exists
    const provider = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(providerId)))
      .limit(1);

    if (provider.length === 0) {
      return NextResponse.json({ 
        error: "Invalid provider ID",
        code: "INVALID_PROVIDER" 
      }, { status: 400 });
    }

    // Validate optional integer fields
    if (deliveryRadiusKm && (isNaN(parseInt(deliveryRadiusKm)) || parseInt(deliveryRadiusKm) < 0)) {
      return NextResponse.json({ 
        error: "Delivery radius must be a non-negative integer",
        code: "INVALID_DELIVERY_RADIUS" 
      }, { status: 400 });
    }

    if (popularityScore && (isNaN(parseInt(popularityScore)) || parseInt(popularityScore) < 0)) {
      return NextResponse.json({ 
        error: "Popularity score must be a non-negative integer",
        code: "INVALID_POPULARITY_SCORE" 
      }, { status: 400 });
    }

    // Create catalog
    const newCatalog = await db.insert(catalogs)
      .values({
        providerId: parseInt(providerId),
        title: title.trim(),
        brand: brand?.trim() || null,
        sku: sku?.trim() || null,
        description: description?.trim() || null,
        price: parseFloat(price),
        currency,
        unit: unit.trim(),
        moq: parseInt(moq),
        stockStatus,
        attributes: attributes || null,
        city: city.trim(),
        deliveryRadiusKm: deliveryRadiusKm ? parseInt(deliveryRadiusKm) : null,
        images: images || null,
        pdfUrl: pdfUrl?.trim() || null,
        popularityScore: popularityScore ? parseInt(popularityScore) : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();
    const {
      providerId,
      title,
      brand,
      sku,
      description,
      price,
      currency,
      unit,
      moq,
      stockStatus,
      attributes,
      city,
      deliveryRadiusKm,
      images,
      pdfUrl,
      popularityScore
    } = requestBody;

    // Check if catalog exists
    const existingCatalog = await db.select()
      .from(catalogs)
      .where(eq(catalogs.id, parseInt(id)))
      .limit(1);

    if (existingCatalog.length === 0) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    }

    // Build update object with validation
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (providerId !== undefined) {
      if (!providerId || isNaN(parseInt(providerId))) {
        return NextResponse.json({ 
          error: "Provider ID must be a valid integer",
          code: "INVALID_PROVIDER_ID" 
        }, { status: 400 });
      }
      
      // Validate provider exists
      const provider = await db.select()
        .from(users)
        .where(eq(users.id, parseInt(providerId)))
        .limit(1);

      if (provider.length === 0) {
        return NextResponse.json({ 
          error: "Invalid provider ID",
          code: "INVALID_PROVIDER" 
        }, { status: 400 });
      }
      
      updates.providerId = parseInt(providerId);
    }

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return NextResponse.json({ 
          error: "Title cannot be empty",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (brand !== undefined) {
      updates.brand = brand?.trim() || null;
    }

    if (sku !== undefined) {
      updates.sku = sku?.trim() || null;
    }

    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }

    if (price !== undefined) {
      if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        return NextResponse.json({ 
          error: "Price must be a positive number",
          code: "INVALID_PRICE" 
        }, { status: 400 });
      }
      updates.price = parseFloat(price);
    }

    if (currency !== undefined) {
      updates.currency = currency;
    }

    if (unit !== undefined) {
      if (!unit || !unit.trim()) {
        return NextResponse.json({ 
          error: "Unit cannot be empty",
          code: "INVALID_UNIT" 
        }, { status: 400 });
      }
      updates.unit = unit.trim();
    }

    if (moq !== undefined) {
      if (isNaN(parseInt(moq)) || parseInt(moq) <= 0) {
        return NextResponse.json({ 
          error: "MOQ must be a positive integer",
          code: "INVALID_MOQ" 
        }, { status: 400 });
      }
      updates.moq = parseInt(moq);
    }

    if (stockStatus !== undefined) {
      if (!['in_stock', 'out_of_stock', 'limited'].includes(stockStatus)) {
        return NextResponse.json({ 
          error: "Stock status must be one of: in_stock, out_of_stock, limited",
          code: "INVALID_STOCK_STATUS" 
        }, { status: 400 });
      }
      updates.stockStatus = stockStatus;
    }

    if (attributes !== undefined) {
      updates.attributes = attributes;
    }

    if (city !== undefined) {
      if (!city || !city.trim()) {
        return NextResponse.json({ 
          error: "City cannot be empty",
          code: "INVALID_CITY" 
        }, { status: 400 });
      }
      updates.city = city.trim();
    }

    if (deliveryRadiusKm !== undefined) {
      if (deliveryRadiusKm !== null && (isNaN(parseInt(deliveryRadiusKm)) || parseInt(deliveryRadiusKm) < 0)) {
        return NextResponse.json({ 
          error: "Delivery radius must be a non-negative integer",
          code: "INVALID_DELIVERY_RADIUS" 
        }, { status: 400 });
      }
      updates.deliveryRadiusKm = deliveryRadiusKm ? parseInt(deliveryRadiusKm) : null;
    }

    if (images !== undefined) {
      updates.images = images;
    }

    if (pdfUrl !== undefined) {
      updates.pdfUrl = pdfUrl?.trim() || null;
    }

    if (popularityScore !== undefined) {
      if (isNaN(parseInt(popularityScore)) || parseInt(popularityScore) < 0) {
        return NextResponse.json({ 
          error: "Popularity score must be a non-negative integer",
          code: "INVALID_POPULARITY_SCORE" 
        }, { status: 400 });
      }
      updates.popularityScore = parseInt(popularityScore);
    }

    const updated = await db.update(catalogs)
      .set(updates)
      .where(eq(catalogs.id, parseInt(id)))
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if catalog exists
    const existingCatalog = await db.select()
      .from(catalogs)
      .where(eq(catalogs.id, parseInt(id)))
      .limit(1);

    if (existingCatalog.length === 0) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    }

    const deleted = await db.delete(catalogs)
      .where(eq(catalogs.id, parseInt(id)))
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