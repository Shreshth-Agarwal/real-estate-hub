import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications, users } from '@/db/schema';
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

    // Single notification by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const notification = await db.select()
        .from(notifications)
        .where(and(
          eq(notifications.id, parseInt(id)),
          eq(notifications.userId, parseInt(user.id))
        ))
        .limit(1);

      if (notification.length === 0) {
        return NextResponse.json({ 
          error: 'Notification not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(notification[0], { status: 200 });
    }

    // List notifications with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const readFilter = searchParams.get('read');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build query conditions
    const conditions = [eq(notifications.userId, parseInt(user.id))];

    // Filter by read status if provided
    if (readFilter !== null) {
      const isRead = readFilter === 'true' || readFilter === '1';
      conditions.push(eq(notifications.read, isRead));
    }

    // Execute query with sorting
    const sortColumn = sort === 'createdAt' ? notifications.createdAt : notifications.createdAt;
    const orderFn = order === 'asc' ? asc : desc;

    const results = await db.select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET notifications error:', error);
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

    const { type, title, message, link } = body;

    // Validate required fields
    if (!type || typeof type !== 'string' || type.trim() === '') {
      return NextResponse.json({ 
        error: 'Type is required and must be a non-empty string',
        code: 'MISSING_TYPE' 
      }, { status: 400 });
    }

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ 
        error: 'Title is required and must be a non-empty string',
        code: 'MISSING_TITLE' 
      }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ 
        error: 'Message is required and must be a non-empty string',
        code: 'MISSING_MESSAGE' 
      }, { status: 400 });
    }

    // Prepare notification data
    const notificationData = {
      userId: parseInt(user.id),
      type: type.trim(),
      title: title.trim(),
      message: message.trim(),
      link: link && typeof link === 'string' ? link.trim() : null,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const newNotification = await db.insert(notifications)
      .values(notificationData)
      .returning();

    return NextResponse.json(newNotification[0], { status: 201 });
  } catch (error) {
    console.error('POST notification error:', error);
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

    // Check if notification exists and belongs to user
    const existing = await db.select()
      .from(notifications)
      .where(and(
        eq(notifications.id, parseInt(id)),
        eq(notifications.userId, parseInt(user.id))
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Notification not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Prepare update data
    const updates: any = {};

    if (body.type !== undefined) {
      if (typeof body.type !== 'string' || body.type.trim() === '') {
        return NextResponse.json({ 
          error: 'Type must be a non-empty string',
          code: 'INVALID_TYPE' 
        }, { status: 400 });
      }
      updates.type = body.type.trim();
    }

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim() === '') {
        return NextResponse.json({ 
          error: 'Title must be a non-empty string',
          code: 'INVALID_TITLE' 
        }, { status: 400 });
      }
      updates.title = body.title.trim();
    }

    if (body.message !== undefined) {
      if (typeof body.message !== 'string' || body.message.trim() === '') {
        return NextResponse.json({ 
          error: 'Message must be a non-empty string',
          code: 'INVALID_MESSAGE' 
        }, { status: 400 });
      }
      updates.message = body.message.trim();
    }

    if (body.link !== undefined) {
      updates.link = body.link && typeof body.link === 'string' ? body.link.trim() : null;
    }

    if (body.read !== undefined) {
      if (typeof body.read !== 'boolean') {
        return NextResponse.json({ 
          error: 'Read must be a boolean',
          code: 'INVALID_READ' 
        }, { status: 400 });
      }
      updates.read = body.read;
    }

    const updated = await db.update(notifications)
      .set(updates)
      .where(and(
        eq(notifications.id, parseInt(id)),
        eq(notifications.userId, parseInt(user.id))
      ))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT notification error:', error);
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

    // Check if notification exists and belongs to user
    const existing = await db.select()
      .from(notifications)
      .where(and(
        eq(notifications.id, parseInt(id)),
        eq(notifications.userId, parseInt(user.id))
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Notification not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(notifications)
      .where(and(
        eq(notifications.id, parseInt(id)),
        eq(notifications.userId, parseInt(user.id))
      ))
      .returning();

    return NextResponse.json({ 
      message: 'Notification deleted successfully',
      notification: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE notification error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}