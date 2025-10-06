import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialGroupMembers, users, socialGroups } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';
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
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        }, { status: 400 });
      }

      const membership = await db.select({
        id: socialGroupMembers.id,
        groupId: socialGroupMembers.groupId,
        userId: socialGroupMembers.userId,
        role: socialGroupMembers.role,
        joinedAt: socialGroupMembers.joinedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
        },
        group: {
          id: socialGroups.id,
          name: socialGroups.name,
          description: socialGroups.description,
          visibility: socialGroups.visibility,
        },
      })
        .from(socialGroupMembers)
        .leftJoin(users, eq(socialGroupMembers.userId, users.id))
        .leftJoin(socialGroups, eq(socialGroupMembers.groupId, socialGroups.id))
        .where(eq(socialGroupMembers.id, parseInt(id)))
        .limit(1);

      if (membership.length === 0) {
        return NextResponse.json({ 
          error: 'Membership not found',
          code: 'NOT_FOUND'
        }, { status: 404 });
      }

      return NextResponse.json(membership[0], { status: 200 });
    }

    // List with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const groupId = searchParams.get('groupId');
    const userId = searchParams.get('userId');
    const sort = searchParams.get('sort') || 'joinedAt';
    const order = searchParams.get('order') || 'desc';

    // Build query with joins
    let query = db.select({
      id: socialGroupMembers.id,
      groupId: socialGroupMembers.groupId,
      userId: socialGroupMembers.userId,
      role: socialGroupMembers.role,
      joinedAt: socialGroupMembers.joinedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
      group: {
        id: socialGroups.id,
        name: socialGroups.name,
        description: socialGroups.description,
        visibility: socialGroups.visibility,
      },
    })
      .from(socialGroupMembers)
      .leftJoin(users, eq(socialGroupMembers.userId, users.id))
      .leftJoin(socialGroups, eq(socialGroupMembers.groupId, socialGroups.id));

    // Apply filters
    const conditions = [];
    if (groupId) {
      if (isNaN(parseInt(groupId))) {
        return NextResponse.json({ 
          error: 'Valid groupId is required',
          code: 'INVALID_GROUP_ID'
        }, { status: 400 });
      }
      conditions.push(eq(socialGroupMembers.groupId, parseInt(groupId)));
    }
    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: 'Valid userId is required',
          code: 'INVALID_USER_ID'
        }, { status: 400 });
      }
      conditions.push(eq(socialGroupMembers.userId, parseInt(userId)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortField = sort === 'joinedAt' ? socialGroupMembers.joinedAt : socialGroupMembers.joinedAt;
    query = order === 'asc' ? query.orderBy(asc(sortField)) : query.orderBy(desc(sortField));

    // Apply pagination
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

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: 'User ID cannot be provided in request body',
        code: 'USER_ID_NOT_ALLOWED'
      }, { status: 400 });
    }

    const { groupId, role } = body;

    // Validate required fields
    if (!groupId) {
      return NextResponse.json({ 
        error: 'groupId is required',
        code: 'MISSING_GROUP_ID'
      }, { status: 400 });
    }

    if (isNaN(parseInt(groupId))) {
      return NextResponse.json({ 
        error: 'Valid groupId is required',
        code: 'INVALID_GROUP_ID'
      }, { status: 400 });
    }

    // Validate role if provided
    if (role && !['member', 'admin'].includes(role)) {
      return NextResponse.json({ 
        error: 'role must be either "member" or "admin"',
        code: 'INVALID_ROLE'
      }, { status: 400 });
    }

    // Check if group exists
    const groupExists = await db.select()
      .from(socialGroups)
      .where(eq(socialGroups.id, parseInt(groupId)))
      .limit(1);

    if (groupExists.length === 0) {
      return NextResponse.json({ 
        error: 'Group not found',
        code: 'GROUP_NOT_FOUND'
      }, { status: 404 });
    }

    // Check if user exists (using auth user table)
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(user.id)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    // Check for duplicate membership
    const existingMembership = await db.select()
      .from(socialGroupMembers)
      .where(
        and(
          eq(socialGroupMembers.groupId, parseInt(groupId)),
          eq(socialGroupMembers.userId, parseInt(user.id))
        )
      )
      .limit(1);

    if (existingMembership.length > 0) {
      return NextResponse.json({ 
        error: 'User is already a member of this group',
        code: 'DUPLICATE_MEMBERSHIP'
      }, { status: 409 });
    }

    // Create membership
    const newMembership = await db.insert(socialGroupMembers)
      .values({
        groupId: parseInt(groupId),
        userId: parseInt(user.id),
        role: role || 'member',
        joinedAt: new Date().toISOString(),
      })
      .returning();

    // Update group members count
    await db.update(socialGroups)
      .set({
        membersCount: groupExists[0].membersCount + 1,
      })
      .where(eq(socialGroups.id, parseInt(groupId)));

    // Fetch complete membership data with joins
    const membershipWithDetails = await db.select({
      id: socialGroupMembers.id,
      groupId: socialGroupMembers.groupId,
      userId: socialGroupMembers.userId,
      role: socialGroupMembers.role,
      joinedAt: socialGroupMembers.joinedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
      group: {
        id: socialGroups.id,
        name: socialGroups.name,
        description: socialGroups.description,
        visibility: socialGroups.visibility,
      },
    })
      .from(socialGroupMembers)
      .leftJoin(users, eq(socialGroupMembers.userId, users.id))
      .leftJoin(socialGroups, eq(socialGroupMembers.groupId, socialGroups.id))
      .where(eq(socialGroupMembers.id, newMembership[0].id))
      .limit(1);

    return NextResponse.json(membershipWithDetails[0], { status: 201 });
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
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: 'User ID cannot be provided in request body',
        code: 'USER_ID_NOT_ALLOWED'
      }, { status: 400 });
    }

    const { role } = body;

    // Validate role
    if (!role) {
      return NextResponse.json({ 
        error: 'role is required',
        code: 'MISSING_ROLE'
      }, { status: 400 });
    }

    if (!['member', 'admin'].includes(role)) {
      return NextResponse.json({ 
        error: 'role must be either "member" or "admin"',
        code: 'INVALID_ROLE'
      }, { status: 400 });
    }

    // Check if membership exists
    const existingMembership = await db.select()
      .from(socialGroupMembers)
      .where(eq(socialGroupMembers.id, parseInt(id)))
      .limit(1);

    if (existingMembership.length === 0) {
      return NextResponse.json({ 
        error: 'Membership not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    // Check if user is group owner or admin
    const group = await db.select()
      .from(socialGroups)
      .where(eq(socialGroups.id, existingMembership[0].groupId))
      .limit(1);

    const userMembership = await db.select()
      .from(socialGroupMembers)
      .where(
        and(
          eq(socialGroupMembers.groupId, existingMembership[0].groupId),
          eq(socialGroupMembers.userId, parseInt(user.id))
        )
      )
      .limit(1);

    const isOwner = group[0].ownerId === parseInt(user.id);
    const isAdmin = userMembership.length > 0 && userMembership[0].role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ 
        error: 'Only group owners and admins can update member roles',
        code: 'FORBIDDEN'
      }, { status: 403 });
    }

    // Update membership
    const updated = await db.update(socialGroupMembers)
      .set({ role })
      .where(eq(socialGroupMembers.id, parseInt(id)))
      .returning();

    // Fetch complete membership data with joins
    const membershipWithDetails = await db.select({
      id: socialGroupMembers.id,
      groupId: socialGroupMembers.groupId,
      userId: socialGroupMembers.userId,
      role: socialGroupMembers.role,
      joinedAt: socialGroupMembers.joinedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      },
      group: {
        id: socialGroups.id,
        name: socialGroups.name,
        description: socialGroups.description,
        visibility: socialGroups.visibility,
      },
    })
      .from(socialGroupMembers)
      .leftJoin(users, eq(socialGroupMembers.userId, users.id))
      .leftJoin(socialGroups, eq(socialGroupMembers.groupId, socialGroups.id))
      .where(eq(socialGroupMembers.id, parseInt(id)))
      .limit(1);

    return NextResponse.json(membershipWithDetails[0], { status: 200 });
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
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    // Check if membership exists
    const existingMembership = await db.select()
      .from(socialGroupMembers)
      .where(eq(socialGroupMembers.id, parseInt(id)))
      .limit(1);

    if (existingMembership.length === 0) {
      return NextResponse.json({ 
        error: 'Membership not found',
        code: 'NOT_FOUND'
      }, { status: 404 });
    }

    // Check if user can delete (owner, admin, or self)
    const group = await db.select()
      .from(socialGroups)
      .where(eq(socialGroups.id, existingMembership[0].groupId))
      .limit(1);

    const userMembership = await db.select()
      .from(socialGroupMembers)
      .where(
        and(
          eq(socialGroupMembers.groupId, existingMembership[0].groupId),
          eq(socialGroupMembers.userId, parseInt(user.id))
        )
      )
      .limit(1);

    const isOwner = group[0].ownerId === parseInt(user.id);
    const isAdmin = userMembership.length > 0 && userMembership[0].role === 'admin';
    const isSelf = existingMembership[0].userId === parseInt(user.id);

    if (!isOwner && !isAdmin && !isSelf) {
      return NextResponse.json({ 
        error: 'You do not have permission to remove this member',
        code: 'FORBIDDEN'
      }, { status: 403 });
    }

    // Delete membership
    const deleted = await db.delete(socialGroupMembers)
      .where(eq(socialGroupMembers.id, parseInt(id)))
      .returning();

    // Update group members count
    await db.update(socialGroups)
      .set({
        membersCount: Math.max(0, group[0].membersCount - 1),
      })
      .where(eq(socialGroups.id, existingMembership[0].groupId));

    return NextResponse.json({ 
      message: 'Member removed successfully',
      membership: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}