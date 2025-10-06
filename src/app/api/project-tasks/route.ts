import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projectTasks, projects, users } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

const VALID_STATUSES = ['pending', 'in_progress', 'completed'] as const;
const VALID_SORT_FIELDS = ['createdAt', 'dueDate', 'status'] as const;

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      // Verify user has access to the project
      const taskWithProject = await db
        .select({
          task: projectTasks,
          project: projects,
          assignee: users
        })
        .from(projectTasks)
        .leftJoin(projects, eq(projectTasks.projectId, projects.id))
        .leftJoin(users, eq(projectTasks.assignedTo, users.id))
        .where(eq(projectTasks.id, parseInt(id)))
        .limit(1);

      if (taskWithProject.length === 0) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }

      // Check if user owns the project or is assigned to the task
      const isOwner = taskWithProject[0].project?.ownerId === user.id;
      const isAssignee = taskWithProject[0].task.assignedTo === user.id;

      if (!isOwner && !isAssignee) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }

      const result = {
        ...taskWithProject[0].task,
        assignee: taskWithProject[0].assignee ? {
          id: taskWithProject[0].assignee.id,
          name: taskWithProject[0].assignee.name,
          email: taskWithProject[0].assignee.email,
          avatarUrl: taskWithProject[0].assignee.avatarUrl
        } : null
      };

      return NextResponse.json(result, { status: 200 });
    }

    // List with pagination and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Validate sort field
    if (!VALID_SORT_FIELDS.includes(sort as any)) {
      return NextResponse.json({ 
        error: "Invalid sort field. Must be one of: createdAt, dueDate, status",
        code: "INVALID_SORT_FIELD" 
      }, { status: 400 });
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status as any)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: pending, in_progress, completed",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Build conditions array
    const conditions = [];

    // Filter by projectId (and verify user has access)
    if (projectId) {
      if (isNaN(parseInt(projectId))) {
        return NextResponse.json({ 
          error: "Valid projectId is required",
          code: "INVALID_PROJECT_ID" 
        }, { status: 400 });
      }

      // Verify project exists and user owns it
      const project = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, parseInt(projectId)), eq(projects.ownerId, user.id)))
        .limit(1);

      if (project.length === 0) {
        return NextResponse.json({ 
          error: "Project not found or access denied",
          code: "PROJECT_NOT_FOUND" 
        }, { status: 404 });
      }

      conditions.push(eq(projectTasks.projectId, parseInt(projectId)));
    } else {
      // If no projectId, return only tasks from projects owned by user or assigned to user
      const userProjects = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.ownerId, user.id));

      const projectIds = userProjects.map(p => p.id);

      if (projectIds.length === 0) {
        // User has no projects and no assigned tasks
        return NextResponse.json([], { status: 200 });
      }

      conditions.push(
        or(
          ...projectIds.map(pid => eq(projectTasks.projectId, pid)),
          eq(projectTasks.assignedTo, user.id)
        )
      );
    }

    // Filter by status
    if (status) {
      conditions.push(eq(projectTasks.status, status));
    }

    // Filter by assignedTo
    if (assignedTo) {
      if (isNaN(parseInt(assignedTo))) {
        return NextResponse.json({ 
          error: "Valid assignedTo is required",
          code: "INVALID_ASSIGNED_TO" 
        }, { status: 400 });
      }
      conditions.push(eq(projectTasks.assignedTo, parseInt(assignedTo)));
    }

    // Build and execute query with join to get assignee info
    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    const tasksQuery = db
      .select({
        task: projectTasks,
        assignee: users
      })
      .from(projectTasks)
      .leftJoin(users, eq(projectTasks.assignedTo, users.id));

    if (whereCondition) {
      tasksQuery.where(whereCondition);
    }

    // Apply sorting
    const sortField = projectTasks[sort as keyof typeof projectTasks];
    tasksQuery.orderBy(order === 'asc' ? asc(sortField) : desc(sortField));

    // Apply pagination
    const results = await tasksQuery.limit(limit).offset(offset);

    // Format response with assignee info
    const formattedResults = results.map(r => ({
      ...r.task,
      assignee: r.assignee ? {
        id: r.assignee.id,
        name: r.assignee.name,
        email: r.assignee.email,
        avatarUrl: r.assignee.avatarUrl
      } : null
    }));

    return NextResponse.json(formattedResults, { status: 200 });
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
    if ('userId' in body || 'user_id' in body || 'ownerId' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { projectId, title, description, status, assignedTo, dueDate } = body;

    // Validate required fields
    if (!projectId) {
      return NextResponse.json({ 
        error: "projectId is required",
        code: "MISSING_PROJECT_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(projectId))) {
      return NextResponse.json({ 
        error: "Valid projectId is required",
        code: "INVALID_PROJECT_ID" 
      }, { status: 400 });
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ 
        error: "title is required and must be a non-empty string",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    // Verify project exists and user owns it
    const project = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, parseInt(projectId)), eq(projects.ownerId, user.id)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ 
        error: "Project not found or access denied",
        code: "PROJECT_NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status as any)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: pending, in_progress, completed",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate assignedTo if provided
    if (assignedTo !== null && assignedTo !== undefined) {
      if (isNaN(parseInt(assignedTo))) {
        return NextResponse.json({ 
          error: "Valid assignedTo is required",
          code: "INVALID_ASSIGNED_TO" 
        }, { status: 400 });
      }

      // Verify user exists
      const assignee = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(assignedTo)))
        .limit(1);

      if (assignee.length === 0) {
        return NextResponse.json({ 
          error: "Assigned user not found",
          code: "ASSIGNEE_NOT_FOUND" 
        }, { status: 404 });
      }
    }

    // Validate dueDate if provided
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ 
          error: "Invalid dueDate format. Must be a valid ISO date string",
          code: "INVALID_DUE_DATE" 
        }, { status: 400 });
      }
    }

    const now = new Date().toISOString();

    // Prepare insert data
    const insertData = {
      projectId: parseInt(projectId),
      title: title.trim(),
      description: description ? description.trim() : null,
      status: status || 'pending',
      assignedTo: assignedTo ? parseInt(assignedTo) : null,
      dueDate: dueDate || null,
      createdAt: now,
      updatedAt: now
    };

    const newTask = await db
      .insert(projectTasks)
      .values(insertData)
      .returning();

    // Fetch with assignee info
    if (newTask[0].assignedTo) {
      const taskWithAssignee = await db
        .select({
          task: projectTasks,
          assignee: users
        })
        .from(projectTasks)
        .leftJoin(users, eq(projectTasks.assignedTo, users.id))
        .where(eq(projectTasks.id, newTask[0].id))
        .limit(1);

      if (taskWithAssignee.length > 0) {
        return NextResponse.json({
          ...taskWithAssignee[0].task,
          assignee: taskWithAssignee[0].assignee ? {
            id: taskWithAssignee[0].assignee.id,
            name: taskWithAssignee[0].assignee.name,
            email: taskWithAssignee[0].assignee.email,
            avatarUrl: taskWithAssignee[0].assignee.avatarUrl
          } : null
        }, { status: 201 });
      }
    }

    return NextResponse.json({ ...newTask[0], assignee: null }, { status: 201 });
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

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    // Security check: reject if userId provided in body
    if ('userId' in body || 'user_id' in body || 'ownerId' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Verify task exists and user has access
    const existingTaskWithProject = await db
      .select({
        task: projectTasks,
        project: projects
      })
      .from(projectTasks)
      .leftJoin(projects, eq(projectTasks.projectId, projects.id))
      .where(eq(projectTasks.id, parseInt(id)))
      .limit(1);

    if (existingTaskWithProject.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if user owns the project
    if (existingTaskWithProject[0].project?.ownerId !== user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const { projectId, title, description, status, assignedTo, dueDate } = body;

    // Validate projectId if provided
    if (projectId !== undefined) {
      if (isNaN(parseInt(projectId))) {
        return NextResponse.json({ 
          error: "Valid projectId is required",
          code: "INVALID_PROJECT_ID" 
        }, { status: 400 });
      }

      // Verify new project exists and user owns it
      const project = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, parseInt(projectId)), eq(projects.ownerId, user.id)))
        .limit(1);

      if (project.length === 0) {
        return NextResponse.json({ 
          error: "Project not found or access denied",
          code: "PROJECT_NOT_FOUND" 
        }, { status: 404 });
      }
    }

    // Validate title if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      return NextResponse.json({ 
        error: "title must be a non-empty string",
        code: "INVALID_TITLE" 
      }, { status: 400 });
    }

    // Validate status if provided
    if (status !== undefined && !VALID_STATUSES.includes(status as any)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: pending, in_progress, completed",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate assignedTo if provided
    if (assignedTo !== undefined && assignedTo !== null) {
      if (isNaN(parseInt(assignedTo))) {
        return NextResponse.json({ 
          error: "Valid assignedTo is required",
          code: "INVALID_ASSIGNED_TO" 
        }, { status: 400 });
      }

      // Verify user exists
      const assignee = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(assignedTo)))
        .limit(1);

      if (assignee.length === 0) {
        return NextResponse.json({ 
          error: "Assigned user not found",
          code: "ASSIGNEE_NOT_FOUND" 
        }, { status: 404 });
      }
    }

    // Validate dueDate if provided
    if (dueDate !== undefined && dueDate !== null) {
      const parsedDate = new Date(dueDate);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ 
          error: "Invalid dueDate format. Must be a valid ISO date string",
          code: "INVALID_DUE_DATE" 
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (projectId !== undefined) updateData.projectId = parseInt(projectId);
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (status !== undefined) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo ? parseInt(assignedTo) : null;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const updated = await db
      .update(projectTasks)
      .set(updateData)
      .where(eq(projectTasks.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Fetch with assignee info
    const taskWithAssignee = await db
      .select({
        task: projectTasks,
        assignee: users
      })
      .from(projectTasks)
      .leftJoin(users, eq(projectTasks.assignedTo, users.id))
      .where(eq(projectTasks.id, parseInt(id)))
      .limit(1);

    if (taskWithAssignee.length > 0) {
      return NextResponse.json({
        ...taskWithAssignee[0].task,
        assignee: taskWithAssignee[0].assignee ? {
          id: taskWithAssignee[0].assignee.id,
          name: taskWithAssignee[0].assignee.name,
          email: taskWithAssignee[0].assignee.email,
          avatarUrl: taskWithAssignee[0].assignee.avatarUrl
        } : null
      }, { status: 200 });
    }

    return NextResponse.json(updated[0], { status: 200 });
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

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Verify task exists and user has access
    const existingTaskWithProject = await db
      .select({
        task: projectTasks,
        project: projects
      })
      .from(projectTasks)
      .leftJoin(projects, eq(projectTasks.projectId, projects.id))
      .where(eq(projectTasks.id, parseInt(id)))
      .limit(1);

    if (existingTaskWithProject.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if user owns the project
    if (existingTaskWithProject[0].project?.ownerId !== user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const deleted = await db
      .delete(projectTasks)
      .where(eq(projectTasks.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Task deleted successfully',
      task: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}