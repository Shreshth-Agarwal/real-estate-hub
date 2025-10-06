import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projectDocs, projects, users } from '@/db/schema';
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

      const doc = await db.select({
        id: projectDocs.id,
        projectId: projectDocs.projectId,
        title: projectDocs.title,
        docUrl: projectDocs.docUrl,
        uploadedBy: projectDocs.uploadedBy,
        createdAt: projectDocs.createdAt,
        uploader: {
          id: users.id,
          name: users.name,
          email: users.email,
        }
      })
        .from(projectDocs)
        .leftJoin(users, eq(projectDocs.uploadedBy, users.id))
        .where(eq(projectDocs.id, parseInt(id)))
        .limit(1);

      if (doc.length === 0) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
      }

      return NextResponse.json(doc[0], { status: 200 });
    }

    // List with pagination and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const projectId = searchParams.get('projectId');
    const uploadedBy = searchParams.get('uploadedBy');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select({
      id: projectDocs.id,
      projectId: projectDocs.projectId,
      title: projectDocs.title,
      docUrl: projectDocs.docUrl,
      uploadedBy: projectDocs.uploadedBy,
      createdAt: projectDocs.createdAt,
      uploader: {
        id: users.id,
        name: users.name,
        email: users.email,
      }
    })
      .from(projectDocs)
      .leftJoin(users, eq(projectDocs.uploadedBy, users.id));

    // Build where conditions
    const conditions = [];
    
    if (projectId) {
      if (isNaN(parseInt(projectId))) {
        return NextResponse.json({ 
          error: "Valid projectId is required",
          code: "INVALID_PROJECT_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(projectDocs.projectId, parseInt(projectId)));
    }

    if (uploadedBy) {
      if (isNaN(parseInt(uploadedBy))) {
        return NextResponse.json({ 
          error: "Valid uploadedBy is required",
          code: "INVALID_UPLOADED_BY" 
        }, { status: 400 });
      }
      conditions.push(eq(projectDocs.uploadedBy, parseInt(uploadedBy)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sort === 'createdAt' ? projectDocs.createdAt : projectDocs.id;
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

    // Security check: reject if uploadedBy provided in body
    if ('uploadedBy' in body || 'uploaded_by' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { projectId, title, docUrl } = body;

    // Validate required fields
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json({ 
        error: "Valid projectId is required",
        code: "MISSING_PROJECT_ID" 
      }, { status: 400 });
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ 
        error: "Title is required and must be non-empty",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!docUrl || typeof docUrl !== 'string' || docUrl.trim().length === 0) {
      return NextResponse.json({ 
        error: "Document URL is required and must be non-empty",
        code: "MISSING_DOC_URL" 
      }, { status: 400 });
    }

    // Validate project exists
    const project = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(projectId)))
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json({ 
        error: "Project not found",
        code: "PROJECT_NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate user exists (getCurrentUser ensures this, but double-check for integrity)
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(user.id)))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 404 });
    }

    // Create document
    const newDoc = await db.insert(projectDocs)
      .values({
        projectId: parseInt(projectId),
        title: title.trim(),
        docUrl: docUrl.trim(),
        uploadedBy: parseInt(user.id),
        createdAt: new Date().toISOString(),
      })
      .returning();

    // Fetch with uploader information
    const docWithUploader = await db.select({
      id: projectDocs.id,
      projectId: projectDocs.projectId,
      title: projectDocs.title,
      docUrl: projectDocs.docUrl,
      uploadedBy: projectDocs.uploadedBy,
      createdAt: projectDocs.createdAt,
      uploader: {
        id: users.id,
        name: users.name,
        email: users.email,
      }
    })
      .from(projectDocs)
      .leftJoin(users, eq(projectDocs.uploadedBy, users.id))
      .where(eq(projectDocs.id, newDoc[0].id))
      .limit(1);

    return NextResponse.json(docWithUploader[0], { status: 201 });
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

    // Security check: reject if uploadedBy provided in body
    if ('uploadedBy' in body || 'uploaded_by' in body) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    const { title, docUrl } = body;

    // Check if document exists
    const existing = await db.select()
      .from(projectDocs)
      .where(eq(projectDocs.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Document not found',
        code: 'DOCUMENT_NOT_FOUND' 
      }, { status: 404 });
    }

    // Prepare updates object
    const updates: { title?: string; docUrl?: string } = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json({ 
          error: "Title must be non-empty",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (docUrl !== undefined) {
      if (typeof docUrl !== 'string' || docUrl.trim().length === 0) {
        return NextResponse.json({ 
          error: "Document URL must be non-empty",
          code: "INVALID_DOC_URL" 
        }, { status: 400 });
      }
      updates.docUrl = docUrl.trim();
    }

    // If no valid updates, return error
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: "No valid fields to update",
        code: "NO_UPDATES" 
      }, { status: 400 });
    }

    // Update document
    const updated = await db.update(projectDocs)
      .set(updates)
      .where(eq(projectDocs.id, parseInt(id)))
      .returning();

    // Fetch with uploader information
    const docWithUploader = await db.select({
      id: projectDocs.id,
      projectId: projectDocs.projectId,
      title: projectDocs.title,
      docUrl: projectDocs.docUrl,
      uploadedBy: projectDocs.uploadedBy,
      createdAt: projectDocs.createdAt,
      uploader: {
        id: users.id,
        name: users.name,
        email: users.email,
      }
    })
      .from(projectDocs)
      .leftJoin(users, eq(projectDocs.uploadedBy, users.id))
      .where(eq(projectDocs.id, updated[0].id))
      .limit(1);

    return NextResponse.json(docWithUploader[0], { status: 200 });
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

    // Check if document exists
    const existing = await db.select()
      .from(projectDocs)
      .where(eq(projectDocs.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Document not found',
        code: 'DOCUMENT_NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete document
    const deleted = await db.delete(projectDocs)
      .where(eq(projectDocs.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Document deleted successfully',
      deleted: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}