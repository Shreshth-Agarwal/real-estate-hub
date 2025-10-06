import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projectMembers, projects, users } from '@/db/schema';
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
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const membership = await db.select({
        id: projectMembers.id,
        projectId: projectMembers.projectId,
        userId: projectMembers.userId,
        role: projectMembers.role,
        joinedAt: projectMembers.joinedAt,
        project: {
          id: projects.id,
          title: projects.title,
          address: projects.address,
          city: projects.city,
          status: projects.status
        },
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
          userType: users.userType
        }
      })
        .from(projectMembers)
        .leftJoin(projects, eq(projectMembers.projectId, projects.id))
        .leftJoin(users, eq(projectMembers.userId, users.id))
        .where(eq(projectMembers.id, parseInt(id)))
        .limit(1);

      if (membership.length === 0) {
        return NextResponse.json({ error: 'Project membership not found' }, { status: 404 });
      }

      // Check if user has access to this membership (is the project owner or the member themselves)
      const projectId = membership[0].projectId;
      const memberUserId = membership[0].userId;
      
      const project = await db.select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      const isProjectOwner = project.length > 0 && project[0].ownerId === user.id;
      const isMemberSelf = memberUserId === user.id;

      if (!isProjectOwner && !isMemberSelf) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      return NextResponse.json(membership[0], { status: 200 });
    }

    // List with pagination and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');
    const sort = searchParams.get('sort') || 'joinedAt';
    const order = searchParams.get('order') || 'desc';

    // Build where conditions
    const conditions = [];

    if (projectId) {
      if (isNaN(parseInt(projectId))) {
        return NextResponse.json({ 
          error: "Valid projectId is required",
          code: "INVALID_PROJECT_ID" 
        }, { status: 400 });
      }

      // Verify user has access to this project
      const project = await db.select()
        .from(projects)
        .where(eq(projects.id, parseInt(projectId)))
        .limit(1);

      if (project.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      // Check if user is project owner or member
      const isProjectOwner = project[0].ownerId === user.id;
      const isMember = await db.select()
        .from(projectMembers)
        .where(
          and(
            eq(projectMembers.projectId, parseInt(projectId)),
            eq(projectMembers.userId, user.id)
          )
        )
        .limit(1);

      if (!isProjectOwner && isMember.length === 0) {
        return NextResponse.json({ error: 'Access denied to this project' }, { status: 403 });
      }

      conditions.push(eq(projectMembers.projectId, parseInt(projectId)));
    }

    if (userId) {
      if (isNaN(parseInt(userId))) {
        return NextResponse.json({ 
          error: "Valid userId is required",
          code: "INVALID_USER_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(projectMembers.userId, parseInt(userId)));
    }

    if (role) {
      if (!['owner', 'member'].includes(role)) {
        return NextResponse.json({ 
          error: "Role must be 'owner' or 'member'",
          code: "INVALID_ROLE" 
        }, { status: 400 });
      }
      conditions.push(eq(projectMembers.role, role));
    }

    let query = db.select({
      id: projectMembers.id,
      projectId: projectMembers.projectId,
      userId: projectMembers.userId,
      role: projectMembers.role,
      joinedAt: projectMembers.joinedAt,
      project: {
        id: projects.id,
        title: projects.title,
        address: projects.address,
        city: projects.city,
        status: projects.status
      },
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        userType: users.userType
      }
    })
      .from(projectMembers)
      .leftJoin(projects, eq(projectMembers.projectId, projects.id))
      .leftJoin(users, eq(projectMembers.userId, users.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sort === 'joinedAt' ? projectMembers.joinedAt : projectMembers.id;
    query = order === 'asc' 
      ? query.orderBy(asc(sortColumn))
      : query.orderBy(desc(sortColumn));

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
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { projectId, userId: memberUserId, role } = body;

    // Validate required fields
    if (!projectId) {
      return NextResponse.json({ 
        error: "projectId is required",
        code: "MISSING_PROJECT_ID" 
      }, { status: 400 });
    }

    if (!memberUserId) {
      return NextResponse.json({ 
        error: "userId is required for the member to add",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(projectId))) {
      return NextResponse.json({ 
        error: "Valid projectId is required",
        code: "INVALID_PROJECT_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(memberUserId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    // Validate role
    const memberRole = role || 'member';
    if (!['owner', 'member'].includes(memberRole)) {
      return NextResponse.json({ 
        error: "Role must be 'owner' or 'member'",
        code: "INVALID_ROLE" 
      }, { status: 400 });
    }

    // Verify project exists
    const project = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(projectId)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: 'PROJECT_NOT_FOUND' 
      }, { status: 404 });
    }

    // Only project owner can add members
    if (project[0].ownerId !== user.id) {
      return NextResponse.json({ 
        error: 'Only project owner can add members',
        code: 'ACCESS_DENIED' 
      }, { status: 403 });
    }

    // Verify user to add exists
    const userToAdd = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(memberUserId)))
      .limit(1);

    if (userToAdd.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND' 
      }, { status: 404 });
    }

    // Check for duplicate membership
    const existingMembership = await db.select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.projectId, parseInt(projectId)),
          eq(projectMembers.userId, parseInt(memberUserId))
        )
      )
      .limit(1);

    if (existingMembership.length > 0) {
      return NextResponse.json({ 
        error: 'User is already a member of this project',
        code: 'DUPLICATE_MEMBERSHIP' 
      }, { status: 409 });
    }

    // Create membership
    const newMembership = await db.insert(projectMembers)
      .values({
        projectId: parseInt(projectId),
        userId: parseInt(memberUserId),
        role: memberRole,
        joinedAt: new Date().toISOString()
      })
      .returning();

    // Fetch full membership details with joins
    const fullMembership = await db.select({
      id: projectMembers.id,
      projectId: projectMembers.projectId,
      userId: projectMembers.userId,
      role: projectMembers.role,
      joinedAt: projectMembers.joinedAt,
      project: {
        id: projects.id,
        title: projects.title,
        address: projects.address,
        city: projects.city,
        status: projects.status
      },
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        userType: users.userType
      }
    })
      .from(projectMembers)
      .leftJoin(projects, eq(projectMembers.projectId, projects.id))
      .leftJoin(users, eq(projectMembers.userId, users.id))
      .where(eq(projectMembers.id, newMembership[0].id))
      .limit(1);

    return NextResponse.json(fullMembership[0], { status: 201 });
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

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { role } = body;

    // Validate role
    if (!role) {
      return NextResponse.json({ 
        error: "role is required",
        code: "MISSING_ROLE" 
      }, { status: 400 });
    }

    if (!['owner', 'member'].includes(role)) {
      return NextResponse.json({ 
        error: "Role must be 'owner' or 'member'",
        code: "INVALID_ROLE" 
      }, { status: 400 });
    }

    // Check if membership exists
    const membership = await db.select()
      .from(projectMembers)
      .where(eq(projectMembers.id, parseInt(id)))
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ error: 'Project membership not found' }, { status: 404 });
    }

    // Verify project ownership
    const project = await db.select()
      .from(projects)
      .where(eq(projects.id, membership[0].projectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Only project owner can update member roles
    if (project[0].ownerId !== user.id) {
      return NextResponse.json({ 
        error: 'Only project owner can update member roles',
        code: 'ACCESS_DENIED' 
      }, { status: 403 });
    }

    // Update membership
    const updated = await db.update(projectMembers)
      .set({
        role
      })
      .where(eq(projectMembers.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Failed to update membership' }, { status: 500 });
    }

    // Fetch full membership details with joins
    const fullMembership = await db.select({
      id: projectMembers.id,
      projectId: projectMembers.projectId,
      userId: projectMembers.userId,
      role: projectMembers.role,
      joinedAt: projectMembers.joinedAt,
      project: {
        id: projects.id,
        title: projects.title,
        address: projects.address,
        city: projects.city,
        status: projects.status
      },
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        userType: users.userType
      }
    })
      .from(projectMembers)
      .leftJoin(projects, eq(projectMembers.projectId, projects.id))
      .leftJoin(users, eq(projectMembers.userId, users.id))
      .where(eq(projectMembers.id, parseInt(id)))
      .limit(1);

    return NextResponse.json(fullMembership[0], { status: 200 });
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

    // Check if membership exists
    const membership = await db.select()
      .from(projectMembers)
      .where(eq(projectMembers.id, parseInt(id)))
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json({ error: 'Project membership not found' }, { status: 404 });
    }

    // Verify project ownership
    const project = await db.select()
      .from(projects)
      .where(eq(projects.id, membership[0].projectId))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Only project owner can remove members (or members can remove themselves)
    const isProjectOwner = project[0].ownerId === user.id;
    const isSelfRemoval = membership[0].userId === user.id;

    if (!isProjectOwner && !isSelfRemoval) {
      return NextResponse.json({ 
        error: 'Only project owner can remove members, or members can remove themselves',
        code: 'ACCESS_DENIED' 
      }, { status: 403 });
    }

    // Prevent removing the project owner
    if (membership[0].role === 'owner' && membership[0].userId === project[0].ownerId) {
      return NextResponse.json({ 
        error: 'Cannot remove the project owner',
        code: 'CANNOT_REMOVE_OWNER' 
      }, { status: 400 });
    }

    // Delete membership
    const deleted = await db.delete(projectMembers)
      .where(eq(projectMembers.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Failed to delete membership' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Project membership removed successfully',
      deleted: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}