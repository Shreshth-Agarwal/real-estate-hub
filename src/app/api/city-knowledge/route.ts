import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cityKnowledge } from '@/db/schema';
import { eq, like, desc, asc, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const regionCode = searchParams.get('regionCode');

    // Single record by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const record = await db
        .select()
        .from(cityKnowledge)
        .where(eq(cityKnowledge.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'City knowledge entry not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // Single record by regionCode
    if (regionCode) {
      const record = await db
        .select()
        .from(cityKnowledge)
        .where(eq(cityKnowledge.regionCode, regionCode))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json(
          { error: 'City knowledge entry not found for region', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination, search, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const sortField = searchParams.get('sort') || 'lastRefreshed';
    const sortOrder = searchParams.get('order') || 'desc';

    let query = db.select().from(cityKnowledge);

    // Apply search filter
    if (search) {
      query = query.where(
        or(
          like(cityKnowledge.summaryMd, `%${search}%`),
          like(cityKnowledge.regionCode, `%${search}%`)
        )
      );
    }

    // Apply sorting
    const orderBy = sortOrder === 'asc' 
      ? asc(cityKnowledge[sortField as keyof typeof cityKnowledge] || cityKnowledge.lastRefreshed)
      : desc(cityKnowledge[sortField as keyof typeof cityKnowledge] || cityKnowledge.lastRefreshed);

    const results = await query.orderBy(orderBy).limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { regionCode, summaryMd, govContacts, planningDocs, utilitySteps } = body;

    // Validate required fields
    if (!regionCode || typeof regionCode !== 'string' || regionCode.trim() === '') {
      return NextResponse.json(
        { error: 'regionCode is required and must be a non-empty string', code: 'MISSING_REGION_CODE' },
        { status: 400 }
      );
    }

    if (!summaryMd || typeof summaryMd !== 'string' || summaryMd.trim() === '') {
      return NextResponse.json(
        { error: 'summaryMd is required and must be a non-empty string', code: 'MISSING_SUMMARY' },
        { status: 400 }
      );
    }

    // Validate JSON fields if provided
    if (govContacts !== undefined && govContacts !== null && typeof govContacts !== 'object') {
      return NextResponse.json(
        { error: 'govContacts must be a valid JSON object', code: 'INVALID_GOV_CONTACTS' },
        { status: 400 }
      );
    }

    if (planningDocs !== undefined && planningDocs !== null && !Array.isArray(planningDocs)) {
      return NextResponse.json(
        { error: 'planningDocs must be a valid JSON array', code: 'INVALID_PLANNING_DOCS' },
        { status: 400 }
      );
    }

    if (utilitySteps !== undefined && utilitySteps !== null && typeof utilitySteps !== 'object') {
      return NextResponse.json(
        { error: 'utilitySteps must be a valid JSON object', code: 'INVALID_UTILITY_STEPS' },
        { status: 400 }
      );
    }

    // Check for duplicate regionCode
    const existing = await db
      .select()
      .from(cityKnowledge)
      .where(eq(cityKnowledge.regionCode, regionCode.trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'A city knowledge entry with this regionCode already exists', code: 'DUPLICATE_REGION_CODE' },
        { status: 409 }
      );
    }

    // Create new record with auto-generated fields
    const newRecord = await db
      .insert(cityKnowledge)
      .values({
        regionCode: regionCode.trim(),
        summaryMd: summaryMd.trim(),
        govContacts: govContacts || null,
        planningDocs: planningDocs || null,
        utilitySteps: utilitySteps || null,
        lastRefreshed: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newRecord[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(cityKnowledge)
      .where(eq(cityKnowledge.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'City knowledge entry not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { regionCode, summaryMd, govContacts, planningDocs, utilitySteps } = body;

    // Validate fields if provided
    if (regionCode !== undefined) {
      if (typeof regionCode !== 'string' || regionCode.trim() === '') {
        return NextResponse.json(
          { error: 'regionCode must be a non-empty string', code: 'INVALID_REGION_CODE' },
          { status: 400 }
        );
      }

      // Check for duplicate regionCode (excluding current record)
      const duplicate = await db
        .select()
        .from(cityKnowledge)
        .where(
          and(
            eq(cityKnowledge.regionCode, regionCode.trim()),
            eq(cityKnowledge.id, parseInt(id))
          )
        )
        .limit(1);

      if (duplicate.length === 0) {
        const otherDuplicate = await db
          .select()
          .from(cityKnowledge)
          .where(eq(cityKnowledge.regionCode, regionCode.trim()))
          .limit(1);

        if (otherDuplicate.length > 0) {
          return NextResponse.json(
            { error: 'A city knowledge entry with this regionCode already exists', code: 'DUPLICATE_REGION_CODE' },
            { status: 409 }
          );
        }
      }
    }

    if (summaryMd !== undefined && (typeof summaryMd !== 'string' || summaryMd.trim() === '')) {
      return NextResponse.json(
        { error: 'summaryMd must be a non-empty string', code: 'INVALID_SUMMARY' },
        { status: 400 }
      );
    }

    if (govContacts !== undefined && govContacts !== null && typeof govContacts !== 'object') {
      return NextResponse.json(
        { error: 'govContacts must be a valid JSON object', code: 'INVALID_GOV_CONTACTS' },
        { status: 400 }
      );
    }

    if (planningDocs !== undefined && planningDocs !== null && !Array.isArray(planningDocs)) {
      return NextResponse.json(
        { error: 'planningDocs must be a valid JSON array', code: 'INVALID_PLANNING_DOCS' },
        { status: 400 }
      );
    }

    if (utilitySteps !== undefined && utilitySteps !== null && typeof utilitySteps !== 'object') {
      return NextResponse.json(
        { error: 'utilitySteps must be a valid JSON object', code: 'INVALID_UTILITY_STEPS' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {
      lastRefreshed: new Date().toISOString(),
    };

    if (regionCode !== undefined) updateData.regionCode = regionCode.trim();
    if (summaryMd !== undefined) updateData.summaryMd = summaryMd.trim();
    if (govContacts !== undefined) updateData.govContacts = govContacts;
    if (planningDocs !== undefined) updateData.planningDocs = planningDocs;
    if (utilitySteps !== undefined) updateData.utilitySteps = utilitySteps;

    // Update record
    const updated = await db
      .update(cityKnowledge)
      .set(updateData)
      .where(eq(cityKnowledge.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(cityKnowledge)
      .where(eq(cityKnowledge.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'City knowledge entry not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete record
    const deleted = await db
      .delete(cityKnowledge)
      .where(eq(cityKnowledge.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'City knowledge entry deleted successfully',
        deleted: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}