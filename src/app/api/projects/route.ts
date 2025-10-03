import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, projectItems, catalogs, users } from '@/db/schema';
import { eq, like, and, or, desc, asc, gte, lte, isNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get single project by ID
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const includeItems = searchParams.get('includeItems') === 'true';

      const project = await db.select({
        id: projects.id,
        ownerId: projects.ownerId,
        title: projects.title,
        address: projects.address,
        city: projects.city,
        budget: projects.budget,
        currency: projects.currency,
        status: projects.status,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        ownerName: users.name,
        ownerEmail: users.email
      })
      .from(projects)
      .leftJoin(users, eq(projects.ownerId, users.id))
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

      if (project.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      let result: any = project[0];

      if (includeItems) {
        const items = await db.select({
          id: projectItems.id,
          projectId: projectItems.projectId,
          catalogId: projectItems.catalogId,
          qty: projectItems.qty,
          unit: projectItems.unit,
          note: projectItems.note,
          createdAt: projectItems.createdAt,
          catalogTitle: catalogs.title,
          catalogPrice: catalogs.price,
          catalogCurrency: catalogs.currency,
          catalogBrand: catalogs.brand
        })
        .from(projectItems)
        .leftJoin(catalogs, eq(projectItems.catalogId, catalogs.id))
        .where(eq(projectItems.projectId, parseInt(id)));

        result.items = items;

        // Calculate total estimated cost if budget is not set
        if (!result.budget && items.length > 0) {
          const totalCost = items.reduce((sum, item) => {
            if (item.catalogPrice) {
              return sum + (item.catalogPrice * item.qty);
            }
            return sum;
          }, 0);
          result.estimatedCost = totalCost;
        }
      }

      return NextResponse.json(result);
    }

    // List projects with pagination and filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const ownerId = searchParams.get('ownerId');
    const city = searchParams.get('city');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select({
      id: projects.id,
      ownerId: projects.ownerId,
      title: projects.title,
      address: projects.address,
      city: projects.city,
      budget: projects.budget,
      currency: projects.currency,
      status: projects.status,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      ownerName: users.name,
      ownerEmail: users.email
    })
    .from(projects)
    .leftJoin(users, eq(projects.ownerId, users.id));

    const conditions = [];

    if (search) {
      conditions.push(or(
        like(projects.title, `%${search}%`),
        like(projects.address, `%${search}%`),
        like(projects.city, `%${search}%`)
      ));
    }

    if (status) {
      conditions.push(eq(projects.status, status));
    }

    if (ownerId) {
      if (isNaN(parseInt(ownerId))) {
        return NextResponse.json({ 
          error: "Valid owner ID is required",
          code: "INVALID_OWNER_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(projects.ownerId, parseInt(ownerId)));
    }

    if (city) {
      conditions.push(eq(projects.city, city));
    }

    if (minBudget) {
      const minBudgetNum = parseFloat(minBudget);
      if (isNaN(minBudgetNum) || minBudgetNum < 0) {
        return NextResponse.json({ 
          error: "Valid minimum budget is required",
          code: "INVALID_MIN_BUDGET" 
        }, { status: 400 });
      }
      conditions.push(gte(projects.budget, minBudgetNum));
    }

    if (maxBudget) {
      const maxBudgetNum = parseFloat(maxBudget);
      if (isNaN(maxBudgetNum) || maxBudgetNum < 0) {
        return NextResponse.json({ 
          error: "Valid maximum budget is required",
          code: "INVALID_MAX_BUDGET" 
        }, { status: 400 });
      }
      conditions.push(lte(projects.budget, maxBudgetNum));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const orderDirection = order === 'asc' ? asc : desc;
    if (sort === 'budget') {
      query = query.orderBy(orderDirection(projects.budget));
    } else if (sort === 'title') {
      query = query.orderBy(orderDirection(projects.title));
    } else if (sort === 'city') {
      query = query.orderBy(orderDirection(projects.city));
    } else if (sort === 'status') {
      query = query.orderBy(orderDirection(projects.status));
    } else {
      query = query.orderBy(orderDirection(projects.createdAt));
    }

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
    const body = await request.json();
    const { ownerId, title, address, city, budget, currency, status } = body;

    // Validate required fields
    if (!ownerId) {
      return NextResponse.json({ 
        error: "Owner ID is required",
        code: "MISSING_OWNER_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(ownerId))) {
      return NextResponse.json({ 
        error: "Valid owner ID is required",
        code: "INVALID_OWNER_ID" 
      }, { status: 400 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!address || !address.trim()) {
      return NextResponse.json({ 
        error: "Address is required",
        code: "MISSING_ADDRESS" 
      }, { status: 400 });
    }

    if (!city || !city.trim()) {
      return NextResponse.json({ 
        error: "City is required",
        code: "MISSING_CITY" 
      }, { status: 400 });
    }

    // Validate budget if provided
    if (budget !== undefined && budget !== null) {
      const budgetNum = parseFloat(budget);
      if (isNaN(budgetNum) || budgetNum < 0) {
        return NextResponse.json({ 
          error: "Budget must be a positive number",
          code: "INVALID_BUDGET" 
        }, { status: 400 });
      }
    }

    // Validate status if provided
    const validStatuses = ['planning', 'in_progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Status must be one of: planning, in_progress, completed",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Verify owner exists
    const owner = await db.select()
      .from(users)
      .where(eq(users.id, parseInt(ownerId)))
      .limit(1);

    if (owner.length === 0) {
      return NextResponse.json({ 
        error: "Owner not found",
        code: "OWNER_NOT_FOUND" 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    const newProject = await db.insert(projects)
      .values({
        ownerId: parseInt(ownerId),
        title: title.trim(),
        address: address.trim(),
        city: city.trim(),
        budget: budget ? parseFloat(budget) : null,
        currency: currency || 'INR',
        status: status || 'planning',
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
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

    const body = await request.json();
    const { ownerId, title, address, city, budget, currency, status } = body;

    // Validate ownerId if provided
    if (ownerId !== undefined) {
      if (isNaN(parseInt(ownerId))) {
        return NextResponse.json({ 
          error: "Valid owner ID is required",
          code: "INVALID_OWNER_ID" 
        }, { status: 400 });
      }

      // Verify owner exists
      const owner = await db.select()
        .from(users)
        .where(eq(users.id, parseInt(ownerId)))
        .limit(1);

      if (owner.length === 0) {
        return NextResponse.json({ 
          error: "Owner not found",
          code: "OWNER_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    // Validate budget if provided
    if (budget !== undefined && budget !== null) {
      const budgetNum = parseFloat(budget);
      if (isNaN(budgetNum) || budgetNum < 0) {
        return NextResponse.json({ 
          error: "Budget must be a positive number",
          code: "INVALID_BUDGET" 
        }, { status: 400 });
      }
    }

    // Validate status if provided
    const validStatuses = ['planning', 'in_progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Status must be one of: planning, in_progress, completed",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (ownerId !== undefined) updates.ownerId = parseInt(ownerId);
    if (title !== undefined) updates.title = title.trim();
    if (address !== undefined) updates.address = address.trim();
    if (city !== undefined) updates.city = city.trim();
    if (budget !== undefined) updates.budget = budget ? parseFloat(budget) : null;
    if (currency !== undefined) updates.currency = currency;
    if (status !== undefined) updates.status = status;

    const updatedProject = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedProject[0]);
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

    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Delete associated project items first (cascade delete)
    await db.delete(projectItems)
      .where(eq(projectItems.projectId, parseInt(id)));

    // Delete the project
    const deletedProject = await db.delete(projects)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Project deleted successfully',
      project: deletedProject[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}