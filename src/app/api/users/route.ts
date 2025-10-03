import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, or, desc, asc, and, not } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const userType = searchParams.get('userType');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required", 
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const user = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
      if (user.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user[0]);
    } else {
      let query = db.select().from(users);
      
      const conditions = [];
      
      if (search) {
        conditions.push(
          or(
            like(users.name, `%${search}%`),
            like(users.email, `%${search}%`)
          )
        );
      }
      
      if (userType && ['consumer', 'provider', 'admin'].includes(userType)) {
        conditions.push(eq(users.userType, userType));
      }
      
      if (conditions.length > 0) {
        query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
      }
      
      // Apply sorting
      const sortColumn = sort === 'name' ? users.name :
                        sort === 'email' ? users.email :
                        sort === 'userType' ? users.userType :
                        users.createdAt;
      
      query = order === 'asc' ? 
        query.orderBy(asc(sortColumn)) : 
        query.orderBy(desc(sortColumn));
      
      const records = await query.limit(limit).offset(offset);
      return NextResponse.json(records);
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, userType = 'consumer', avatarUrl, locale = 'en' } = await request.json();
    
    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ 
        error: "Name is required", 
        code: "MISSING_NAME" 
      }, { status: 400 });
    }
    
    if (!email || !email.trim()) {
      return NextResponse.json({ 
        error: "Email is required", 
        code: "MISSING_EMAIL" 
      }, { status: 400 });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ 
        error: "Invalid email format", 
        code: "INVALID_EMAIL" 
      }, { status: 400 });
    }
    
    // Validate userType
    if (!['consumer', 'provider', 'admin'].includes(userType)) {
      return NextResponse.json({ 
        error: "User type must be one of: consumer, provider, admin", 
        code: "INVALID_USER_TYPE" 
      }, { status: 400 });
    }
    
    // Check for duplicate email
    const existingUser = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ 
        error: "Email already exists", 
        code: "DUPLICATE_EMAIL" 
      }, { status: 409 });
    }
    
    const newUser = await db.insert(users).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      userType,
      avatarUrl: avatarUrl?.trim() || null,
      locale,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    
    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
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
    
    const updates = await request.json();
    const { name, email, userType, avatarUrl, locale } = updates;
    
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };
    
    if (name !== undefined) {
      if (!name || !name.trim()) {
        return NextResponse.json({ 
          error: "Name cannot be empty", 
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updateData.name = name.trim();
    }
    
    if (email !== undefined) {
      if (!email || !email.trim()) {
        return NextResponse.json({ 
          error: "Email cannot be empty", 
          code: "INVALID_EMAIL" 
        }, { status: 400 });
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json({ 
          error: "Invalid email format", 
          code: "INVALID_EMAIL" 
        }, { status: 400 });
      }
      
      // Check for duplicate email (excluding current user)
      const emailCheck = await db.select()
        .from(users)
        .where(and(eq(users.email, email.trim().toLowerCase()), not(eq(users.id, parseInt(id)))))
        .limit(1);
      
      if (emailCheck.length > 0) {
        return NextResponse.json({ 
          error: "Email already exists", 
          code: "DUPLICATE_EMAIL" 
        }, { status: 409 });
      }
      
      updateData.email = email.trim().toLowerCase();
    }
    
    if (userType !== undefined) {
      if (!['consumer', 'provider', 'admin'].includes(userType)) {
        return NextResponse.json({ 
          error: "User type must be one of: consumer, provider, admin", 
          code: "INVALID_USER_TYPE" 
        }, { status: 400 });
      }
      updateData.userType = userType;
    }
    
    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl?.trim() || null;
    }
    
    if (locale !== undefined) {
      updateData.locale = locale || 'en';
    }
    
    const updatedUser = await db.update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(id)))
      .returning();
    
    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
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
    
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const deletedUser = await db.delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      message: 'User deleted successfully',
      user: deletedUser[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}