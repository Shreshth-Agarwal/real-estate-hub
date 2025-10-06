import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialGroups, users } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';
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

      const record = await db.select({
        id: socialGroups.id,
        name: socialGroups.name,
        description: socialGroups.description,
        visibility: socialGroups.visibility,
        ownerId: socialGroups.ownerId,
        membersCount: socialGroups.membersCount,
        createdAt: socialGroups.createdAt,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
        }
      })
        .from(socialGroups)
        .leftJoin(users, eq(socialGroups.ownerId, users.id))
        .where(eq(socialGroups.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with pagination, search, and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const visibility = searchParams.get('visibility');
    const ownerId = searchParams.get('ownerId');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let conditions = [];

    // Search across name and description
    if (search) {
      conditions.push(
        or(
          like(socialGroups.name, `%${search}%`),
          like(socialGroups.description, `%${search}%`)
        )
      );
    }

    // Filter by visibility
    if (visibility && (visibility === 'public' || visibility === 'private')) {
      conditions.push(eq(socialGroups.visibility, visibility));
    }

    // Filter by ownerId
    if (ownerId && !isNaN(parseInt(ownerId))) {
      conditions.push(eq(socialGroups.ownerId, parseInt(ownerId)));
    }

    let query = db.select({
      id: socialGroups.id,
      name: socialGroups.name,
      description: socialGroups.description,
      visibility: socialGroups.visibility,
      ownerId: socialGroups.ownerId,
      membersCount: socialGroups.membersCount,
      createdAt: socialGroups.createdAt,
      owner: {
        id: users.id,
        name: users.name,
        email: users.email,
      }
    })
      .from(socialGroups)
      .leftJoin(users, eq(socialGroups.ownerId, users.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sort === 'membersCount' 
      ? socialGroups.membersCount 
      : sort === 'name' 
      ? socialGroups.name 
      : socialGroups.createdAt;

    query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn));

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

    // Security check: reject if ownerId provided in body
    if ('ownerId' in body || 'owner_id' in body) {
      return NextResponse.json({ 
        error: "Owner ID cannot be provided in request body",
        code: "OWNER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Security check: reject if membersCount provided in body
    if ('membersCount' in body || 'members_count' in body) {
      return NextResponse.json({ 
        error: "Members count cannot be manually set",
        code: "MEMBERS_COUNT_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { name, description, visibility } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    // Validate visibility
    const validVisibility = visibility || 'public';
    if (validVisibility !== 'public' && validVisibility !== 'private') {
      return NextResponse.json({ 
        error: "Visibility must be either 'public' or 'private'",
        code: "INVALID_VISIBILITY" 
      }, { status: 400 });
    }

    // Validate description if provided
    if (description !== undefined && description !== null && typeof description !== 'string') {
      return NextResponse.json({ 
        error: "Description must be a string",
        code: "INVALID_DESCRIPTION" 
      }, { status: 400 });
    }

    // Check if owner exists in users table
    const ownerExists = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (ownerExists.length === 0) {
      return NextResponse.json({ 
        error: "Owner user does not exist",
        code: "INVALID_OWNER" 
      }, { status: 400 });
    }

    // Insert new group
    const newGroup = await db.insert(socialGroups)
      .values({
        name: name.trim(),
        description: description ? description.trim() : null,
        visibility: validVisibility,
        ownerId: user.id,
        membersCount: 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Fetch with owner information
    const groupWithOwner = await db.select({
      id: socialGroups.id,
      name: socialGroups.name,
      description: socialGroups.description,
      visibility: socialGroups.visibility,
      ownerId: socialGroups.ownerId,
      membersCount: socialGroups.membersCount,
      createdAt: socialGroups.createdAt,
      owner: {
        id: users.id,
        name: users.name,
        email: users.email,
      }
    })
      .from(socialGroups)
      .leftJoin(users, eq(socialGroups.ownerId, users.id))
      .where(eq(socialGroups.id, newGroup[0].id))
      .limit(1);

    return NextResponse.json(groupWithOwner[0], { status: 201 });
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

    // Security check: reject if ownerId provided in body
    if ('ownerId' in body || 'owner_id' in body) {
      return NextResponse.json({ 
        error: "Owner ID cannot be provided in request body",
        code: "OWNER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Security check: reject if membersCount provided in body
    if ('membersCount' in body || 'members_count' in body) {
      return NextResponse.json({ 
        error: "Members count cannot be manually updated",
        code: "MEMBERS_COUNT_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if record exists and belongs to authenticated user
    const existingGroup = await db.select()
      .from(socialGroups)
      .where(and(
        eq(socialGroups.id, parseInt(id)),
        eq(socialGroups.ownerId, user.id)
      ))
      .limit(1);

    if (existingGroup.length === 0) {
      return NextResponse.json({ 
        error: 'Group not found or you do not have permission to update it' 
      }, { status: 404 });
    }

    const { name, description, visibility } = body;
    const updates: any = {};

    // Validate and update name
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json({ 
          error: "Name must be a non-empty string",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updates.name = name.trim();
    }

    // Validate and update description
    if (description !== undefined) {
      if (description !== null && typeof description !== 'string') {
        return NextResponse.json({ 
          error: "Description must be a string or null",
          code: "INVALID_DESCRIPTION" 
        }, { status: 400 });
      }
      updates.description = description ? description.trim() : null;
    }

    // Validate and update visibility
    if (visibility !== undefined) {
      if (visibility !== 'public' && visibility !== 'private') {
        return NextResponse.json({ 
          error: "Visibility must be either 'public' or 'private'",
          code: "INVALID_VISIBILITY" 
        }, { status: 400 });
      }
      updates.visibility = visibility;
    }

    // If no fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: "No valid fields to update",
        code: "NO_UPDATES" 
      }, { status: 400 });
    }

    // Perform update
    const updated = await db.update(socialGroups)
      .set(updates)
      .where(and(
        eq(socialGroups.id, parseInt(id)),
        eq(socialGroups.ownerId, user.id)
      ))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update group' 
      }, { status: 500 });
    }

    // Fetch with owner information
    const groupWithOwner = await db.select({
      id: socialGroups.id,
      name: socialGroups.name,
      description: socialGroups.description,
      visibility: socialGroups.visibility,
      ownerId: socialGroups.ownerId,
      membersCount: socialGroups.membersCount,
      createdAt: socialGroups.createdAt,
      owner: {
        id: users.id,
        name: users.name,
        email: users.email,
      }
    })
      .from(socialGroups)
      .leftJoin(users, eq(socialGroups.ownerId, users.id))
      .where(eq(socialGroups.id, parseInt(id)))
      .limit(1);

    return NextResponse.json(groupWithOwner[0], { status: 200 });
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

    // Check if record exists and belongs to authenticated user
    const existingGroup = await db.select()
      .from(socialGroups)
      .where(and(
        eq(socialGroups.id, parseInt(id)),
        eq(socialGroups.ownerId, user.id)
      ))
      .limit(1);

    if (existingGroup.length === 0) {
      return NextResponse.json({ 
        error: 'Group not found or you do not have permission to delete it' 
      }, { status: 404 });
    }

    // Delete the group
    const deleted = await db.delete(socialGroups)
      .where(and(
        eq(socialGroups.id, parseInt(id)),
        eq(socialGroups.ownerId, user.id)
      ))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete group' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Group deleted successfully',
      deletedGroup: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}