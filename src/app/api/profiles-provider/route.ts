import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profilesProvider, users } from '@/db/schema';
import { eq, like, and, or, desc, asc, gte, sql } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    // Get single profile by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const profile = await db.select({
        id: profilesProvider.id,
        userId: profilesProvider.userId,
        shopName: profilesProvider.shopName,
        phone: profilesProvider.phone,
        address: profilesProvider.address,
        lat: profilesProvider.lat,
        lng: profilesProvider.lng,
        categories: profilesProvider.categories,
        brands: profilesProvider.brands,
        logoUrl: profilesProvider.logoUrl,
        kycStatus: profilesProvider.kycStatus,
        trustScore: profilesProvider.trustScore,
        description: profilesProvider.description,
        gallery: profilesProvider.gallery,
        createdAt: profilesProvider.createdAt,
        updatedAt: profilesProvider.updatedAt,
        userName: users.name,
        userEmail: users.email
      })
      .from(profilesProvider)
      .leftJoin(users, eq(profilesProvider.userId, users.id))
      .where(eq(profilesProvider.id, parseInt(id)))
      .limit(1);

      if (profile.length === 0) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      return NextResponse.json(profile[0]);
    }

    // Get profile by userId
    if (userId) {
      if (!userId || isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid user ID is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }

      const profile = await db.select({
        id: profilesProvider.id,
        userId: profilesProvider.userId,
        shopName: profilesProvider.shopName,
        phone: profilesProvider.phone,
        address: profilesProvider.address,
        lat: profilesProvider.lat,
        lng: profilesProvider.lng,
        categories: profilesProvider.categories,
        brands: profilesProvider.brands,
        logoUrl: profilesProvider.logoUrl,
        kycStatus: profilesProvider.kycStatus,
        trustScore: profilesProvider.trustScore,
        description: profilesProvider.description,
        gallery: profilesProvider.gallery,
        createdAt: profilesProvider.createdAt,
        updatedAt: profilesProvider.updatedAt,
        userName: users.name,
        userEmail: users.email
      })
      .from(profilesProvider)
      .leftJoin(users, eq(profilesProvider.userId, users.id))
      .where(eq(profilesProvider.userId, parseInt(userId)))
      .limit(1);

      if (profile.length === 0) {
        return NextResponse.json({ error: 'Profile not found for user' }, { status: 404 });
      }

      return NextResponse.json(profile[0]);
    }

    // List profiles with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const kycStatus = searchParams.get('kycStatus');
    const minTrustScore = searchParams.get('trustScore');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius');

    let query = db.select({
      id: profilesProvider.id,
      userId: profilesProvider.userId,
      shopName: profilesProvider.shopName,
      phone: profilesProvider.phone,
      address: profilesProvider.address,
      lat: profilesProvider.lat,
      lng: profilesProvider.lng,
      categories: profilesProvider.categories,
      brands: profilesProvider.brands,
      logoUrl: profilesProvider.logoUrl,
      kycStatus: profilesProvider.kycStatus,
      trustScore: profilesProvider.trustScore,
      description: profilesProvider.description,
      gallery: profilesProvider.gallery,
      createdAt: profilesProvider.createdAt,
      updatedAt: profilesProvider.updatedAt,
      userName: users.name,
      userEmail: users.email
    })
    .from(profilesProvider)
    .leftJoin(users, eq(profilesProvider.userId, users.id));

    const conditions = [];

    // Search functionality
    if (search) {
      conditions.push(or(
        like(profilesProvider.shopName, `%${search}%`),
        like(profilesProvider.description, `%${search}%`)
      ));
    }

    // Filter by KYC status
    if (kycStatus && ['pending', 'verified', 'rejected'].includes(kycStatus)) {
      conditions.push(eq(profilesProvider.kycStatus, kycStatus));
    }

    // Filter by minimum trust score
    if (minTrustScore && !isNaN(parseInt(minTrustScore))) {
      conditions.push(gte(profilesProvider.trustScore, parseInt(minTrustScore)));
    }

    // Location-based filtering (simplified - for production use proper spatial queries)
    if (lat && lng && radius && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng)) && !isNaN(parseInt(radius))) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusKm = parseInt(radius);
      
      // Simple bounding box approximation (for production, use proper haversine distance)
      const latDelta = radiusKm / 111; // roughly 111 km per degree
      const lngDelta = radiusKm / (111 * Math.cos(userLat * Math.PI / 180));
      
      conditions.push(and(
        gte(profilesProvider.lat, userLat - latDelta),
        sql`${profilesProvider.lat} <= ${userLat + latDelta}`,
        gte(profilesProvider.lng, userLng - lngDelta),
        sql`${profilesProvider.lng} <= ${userLng + lngDelta}`
      ));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Sorting
    const sortColumn = sort === 'trustScore' ? profilesProvider.trustScore : 
                      sort === 'shopName' ? profilesProvider.shopName :
                      profilesProvider.createdAt;
    
    query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn));

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
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const requestBody = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { 
      shopName, 
      phone, 
      address, 
      lat, 
      lng, 
      categories, 
      brands, 
      logoUrl, 
      kycStatus = 'pending', 
      trustScore = 0, 
      description, 
      gallery 
    } = requestBody;

    // Validate required fields
    if (!shopName || !shopName.trim()) {
      return NextResponse.json({ 
        error: "Shop name is required",
        code: "MISSING_SHOP_NAME" 
      }, { status: 400 });
    }

    // Validate kycStatus
    if (kycStatus && !['pending', 'verified', 'rejected'].includes(kycStatus)) {
      return NextResponse.json({ 
        error: "Invalid KYC status. Must be one of: pending, verified, rejected",
        code: "INVALID_KYC_STATUS" 
      }, { status: 400 });
    }

    // Validate trustScore range
    if (trustScore !== undefined && (isNaN(parseInt(trustScore)) || parseInt(trustScore) < 0 || parseInt(trustScore) > 100)) {
      return NextResponse.json({ 
        error: "Trust score must be between 0 and 100",
        code: "INVALID_TRUST_SCORE" 
      }, { status: 400 });
    }

    // Validate coordinates if provided
    if ((lat !== undefined && isNaN(parseFloat(lat))) || (lng !== undefined && isNaN(parseFloat(lng)))) {
      return NextResponse.json({ 
        error: "Invalid coordinates",
        code: "INVALID_COORDINATES" 
      }, { status: 400 });
    }

    // Check if user already has a provider profile
    const existingProfile = await db.select()
      .from(profilesProvider)
      .where(eq(profilesProvider.userId, user.id))
      .limit(1);

    if (existingProfile.length > 0) {
      return NextResponse.json({ 
        error: "User already has a provider profile",
        code: "DUPLICATE_PROFILE" 
      }, { status: 409 });
    }

    // Validate phone format if provided
    if (phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(phone.trim())) {
      return NextResponse.json({ 
        error: "Invalid phone format",
        code: "INVALID_PHONE" 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    const newProfile = await db.insert(profilesProvider).values({
      userId: user.id,
      shopName: shopName.trim(),
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      categories: categories || null,
      brands: brands || null,
      logoUrl: logoUrl?.trim() || null,
      kycStatus,
      trustScore: parseInt(trustScore),
      description: description?.trim() || null,
      gallery: gallery || null,
      createdAt: now,
      updatedAt: now
    }).returning();

    return NextResponse.json(newProfile[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ 
        error: "User already has a provider profile",
        code: "DUPLICATE_PROFILE" 
      }, { status: 409 });
    }
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if profile exists and belongs to user
    const existingProfile = await db.select()
      .from(profilesProvider)
      .where(and(eq(profilesProvider.id, parseInt(id)), eq(profilesProvider.userId, user.id)))
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const { 
      shopName, 
      phone, 
      address, 
      lat, 
      lng, 
      categories, 
      brands, 
      logoUrl, 
      kycStatus, 
      trustScore, 
      description, 
      gallery 
    } = requestBody;

    // Validate fields if provided
    if (shopName !== undefined && (!shopName || !shopName.trim())) {
      return NextResponse.json({ 
        error: "Shop name cannot be empty",
        code: "INVALID_SHOP_NAME" 
      }, { status: 400 });
    }

    if (kycStatus && !['pending', 'verified', 'rejected'].includes(kycStatus)) {
      return NextResponse.json({ 
        error: "Invalid KYC status. Must be one of: pending, verified, rejected",
        code: "INVALID_KYC_STATUS" 
      }, { status: 400 });
    }

    if (trustScore !== undefined && (isNaN(parseInt(trustScore)) || parseInt(trustScore) < 0 || parseInt(trustScore) > 100)) {
      return NextResponse.json({ 
        error: "Trust score must be between 0 and 100",
        code: "INVALID_TRUST_SCORE" 
      }, { status: 400 });
    }

    if ((lat !== undefined && lat !== null && isNaN(parseFloat(lat))) || 
        (lng !== undefined && lng !== null && isNaN(parseFloat(lng)))) {
      return NextResponse.json({ 
        error: "Invalid coordinates",
        code: "INVALID_COORDINATES" 
      }, { status: 400 });
    }

    if (phone && !/^\+?[\d\s\-\(\)]{10,15}$/.test(phone.trim())) {
      return NextResponse.json({ 
        error: "Invalid phone format",
        code: "INVALID_PHONE" 
      }, { status: 400 });
    }

    const updates = {};
    if (shopName !== undefined) updates.shopName = shopName.trim();
    if (phone !== undefined) updates.phone = phone?.trim() || null;
    if (address !== undefined) updates.address = address?.trim() || null;
    if (lat !== undefined) updates.lat = lat ? parseFloat(lat) : null;
    if (lng !== undefined) updates.lng = lng ? parseFloat(lng) : null;
    if (categories !== undefined) updates.categories = categories;
    if (brands !== undefined) updates.brands = brands;
    if (logoUrl !== undefined) updates.logoUrl = logoUrl?.trim() || null;
    if (kycStatus !== undefined) updates.kycStatus = kycStatus;
    if (trustScore !== undefined) updates.trustScore = parseInt(trustScore);
    if (description !== undefined) updates.description = description?.trim() || null;
    if (gallery !== undefined) updates.gallery = gallery;

    updates.updatedAt = new Date().toISOString();

    const updatedProfile = await db.update(profilesProvider)
      .set(updates)
      .where(and(eq(profilesProvider.id, parseInt(id)), eq(profilesProvider.userId, user.id)))
      .returning();

    if (updatedProfile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProfile[0]);
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
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if profile exists and belongs to user
    const existingProfile = await db.select()
      .from(profilesProvider)
      .where(and(eq(profilesProvider.id, parseInt(id)), eq(profilesProvider.userId, user.id)))
      .limit(1);

    if (existingProfile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const deletedProfile = await db.delete(profilesProvider)
      .where(and(eq(profilesProvider.id, parseInt(id)), eq(profilesProvider.userId, user.id)))
      .returning();

    if (deletedProfile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Provider profile deleted successfully',
      deletedProfile: deletedProfile[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}