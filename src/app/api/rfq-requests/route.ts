import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rfqRequests, users, catalogs } from '@/db/schema';
import { eq, like, and, or, desc, asc, gte, lte } from 'drizzle-orm';

const VALID_STATUSES = ['draft', 'submitted', 'responded', 'accepted', 'rejected', 'expired'];
const VALID_STATUS_TRANSITIONS = {
  draft: ['submitted'],
  submitted: ['responded', 'rejected', 'expired'],
  responded: ['accepted', 'rejected'],
  accepted: [],
  rejected: [],
  expired: []
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Single RFQ request by ID
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const rfqRecord = await db.select({
        id: rfqRequests.id,
        catalogId: rfqRequests.catalogId,
        consumerId: rfqRequests.consumerId,
        providerId: rfqRequests.providerId,
        quantity: rfqRequests.quantity,
        unit: rfqRequests.unit,
        message: rfqRequests.message,
        preferredDate: rfqRequests.preferredDate,
        status: rfqRequests.status,
        createdAt: rfqRequests.createdAt,
        updatedAt: rfqRequests.updatedAt,
        catalog: {
          id: catalogs.id,
          title: catalogs.title,
          brand: catalogs.brand,
          sku: catalogs.sku
        },
        consumer: {
          id: users.id,
          name: users.name,
          email: users.email
        }
      })
      .from(rfqRequests)
      .leftJoin(catalogs, eq(rfqRequests.catalogId, catalogs.id))
      .leftJoin(users, eq(rfqRequests.consumerId, users.id))
      .where(eq(rfqRequests.id, parseInt(id)))
      .limit(1);

      if (rfqRecord.length === 0) {
        return NextResponse.json({ error: 'RFQ request not found' }, { status: 404 });
      }

      return NextResponse.json(rfqRecord[0]);
    }

    // List RFQ requests with pagination and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const consumerId = searchParams.get('consumerId');
    const providerId = searchParams.get('providerId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select({
      id: rfqRequests.id,
      catalogId: rfqRequests.catalogId,
      consumerId: rfqRequests.consumerId,
      providerId: rfqRequests.providerId,
      quantity: rfqRequests.quantity,
      unit: rfqRequests.unit,
      message: rfqRequests.message,
      preferredDate: rfqRequests.preferredDate,
      status: rfqRequests.status,
      createdAt: rfqRequests.createdAt,
      updatedAt: rfqRequests.updatedAt,
      catalog: {
        id: catalogs.id,
        title: catalogs.title,
        brand: catalogs.brand,
        sku: catalogs.sku
      },
      consumer: {
        id: users.id,
        name: users.name,
        email: users.email
      }
    })
    .from(rfqRequests)
    .leftJoin(catalogs, eq(rfqRequests.catalogId, catalogs.id))
    .leftJoin(users, eq(rfqRequests.consumerId, users.id));

    // Build where conditions
    const conditions = [];

    if (status && VALID_STATUSES.includes(status)) {
      conditions.push(eq(rfqRequests.status, status));
    }

    if (consumerId && !isNaN(parseInt(consumerId))) {
      conditions.push(eq(rfqRequests.consumerId, parseInt(consumerId)));
    }

    if (providerId && !isNaN(parseInt(providerId))) {
      conditions.push(eq(rfqRequests.providerId, parseInt(providerId)));
    }

    if (fromDate) {
      conditions.push(gte(rfqRequests.createdAt, fromDate));
    }

    if (toDate) {
      conditions.push(lte(rfqRequests.createdAt, toDate));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = sort === 'preferredDate' ? rfqRequests.preferredDate 
                     : sort === 'quantity' ? rfqRequests.quantity
                     : sort === 'status' ? rfqRequests.status
                     : sort === 'updatedAt' ? rfqRequests.updatedAt
                     : rfqRequests.createdAt;

    if (order === 'asc') {
      query = query.orderBy(asc(sortColumn));
    } else {
      query = query.orderBy(desc(sortColumn));
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
    const requestBody = await request.json();
    const { catalogId, consumerId, providerId, quantity, unit, message, preferredDate, status = 'draft' } = requestBody;

    // Validate required fields
    if (!consumerId) {
      return NextResponse.json({ 
        error: "Consumer ID is required",
        code: "MISSING_CONSUMER_ID" 
      }, { status: 400 });
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json({ 
        error: "Quantity must be a positive number",
        code: "INVALID_QUANTITY" 
      }, { status: 400 });
    }

    if (!unit) {
      return NextResponse.json({ 
        error: "Unit is required",
        code: "MISSING_UNIT" 
      }, { status: 400 });
    }

    // Validate status
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: "Invalid status value",
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate foreign key references
    if (consumerId) {
      const consumerExists = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.id, parseInt(consumerId)))
        .limit(1);

      if (consumerExists.length === 0) {
        return NextResponse.json({ 
          error: "Invalid consumer ID",
          code: "INVALID_CONSUMER_ID" 
        }, { status: 400 });
      }
    }

    if (catalogId) {
      const catalogExists = await db.select({ id: catalogs.id })
        .from(catalogs)
        .where(eq(catalogs.id, parseInt(catalogId)))
        .limit(1);

      if (catalogExists.length === 0) {
        return NextResponse.json({ 
          error: "Invalid catalog ID",
          code: "INVALID_CATALOG_ID" 
        }, { status: 400 });
      }
    }

    if (providerId) {
      const providerExists = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.id, parseInt(providerId)))
        .limit(1);

      if (providerExists.length === 0) {
        return NextResponse.json({ 
          error: "Invalid provider ID",
          code: "INVALID_PROVIDER_ID" 
        }, { status: 400 });
      }
    }

    // Validate business logic
    if ((status === 'responded' || status === 'accepted' || status === 'rejected') && !providerId) {
      return NextResponse.json({ 
        error: "Provider ID is required for status 'responded' or later",
        code: "PROVIDER_REQUIRED" 
      }, { status: 400 });
    }

    const insertData = {
      catalogId: catalogId ? parseInt(catalogId) : null,
      consumerId: parseInt(consumerId),
      providerId: providerId ? parseInt(providerId) : null,
      quantity: parseFloat(quantity),
      unit: unit.trim(),
      message: message ? message.trim() : null,
      preferredDate: preferredDate || null,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newRfqRequest = await db.insert(rfqRequests)
      .values(insertData)
      .returning();

    return NextResponse.json(newRfqRequest[0], { status: 201 });

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

    const requestBody = await request.json();
    const { catalogId, consumerId, providerId, quantity, unit, message, preferredDate, status } = requestBody;

    // Check if record exists
    const existingRecord = await db.select()
      .from(rfqRequests)
      .where(eq(rfqRequests.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'RFQ request not found' }, { status: 404 });
    }

    const currentRecord = existingRecord[0];
    const updates: any = { updatedAt: new Date().toISOString() };

    // Validate and prepare updates
    if (catalogId !== undefined) {
      if (catalogId) {
        const catalogExists = await db.select({ id: catalogs.id })
          .from(catalogs)
          .where(eq(catalogs.id, parseInt(catalogId)))
          .limit(1);

        if (catalogExists.length === 0) {
          return NextResponse.json({ 
            error: "Invalid catalog ID",
            code: "INVALID_CATALOG_ID" 
          }, { status: 400 });
        }
        updates.catalogId = parseInt(catalogId);
      } else {
        updates.catalogId = null;
      }
    }

    if (consumerId !== undefined) {
      const consumerExists = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.id, parseInt(consumerId)))
        .limit(1);

      if (consumerExists.length === 0) {
        return NextResponse.json({ 
          error: "Invalid consumer ID",
          code: "INVALID_CONSUMER_ID" 
        }, { status: 400 });
      }
      updates.consumerId = parseInt(consumerId);
    }

    if (providerId !== undefined) {
      if (providerId) {
        const providerExists = await db.select({ id: users.id })
          .from(users)
          .where(eq(users.id, parseInt(providerId)))
          .limit(1);

        if (providerExists.length === 0) {
          return NextResponse.json({ 
            error: "Invalid provider ID",
            code: "INVALID_PROVIDER_ID" 
          }, { status: 400 });
        }
        updates.providerId = parseInt(providerId);
      } else {
        updates.providerId = null;
      }
    }

    if (quantity !== undefined) {
      if (quantity <= 0) {
        return NextResponse.json({ 
          error: "Quantity must be a positive number",
          code: "INVALID_QUANTITY" 
        }, { status: 400 });
      }
      updates.quantity = parseFloat(quantity);
    }

    if (unit !== undefined) {
      if (!unit) {
        return NextResponse.json({ 
          error: "Unit cannot be empty",
          code: "INVALID_UNIT" 
        }, { status: 400 });
      }
      updates.unit = unit.trim();
    }

    if (message !== undefined) {
      updates.message = message ? message.trim() : null;
    }

    if (preferredDate !== undefined) {
      updates.preferredDate = preferredDate || null;
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ 
          error: "Invalid status value",
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }

      // Validate status transitions
      if (currentRecord.status !== status) {
        const allowedTransitions = VALID_STATUS_TRANSITIONS[currentRecord.status];
        if (!allowedTransitions.includes(status)) {
          return NextResponse.json({ 
            error: `Cannot transition from '${currentRecord.status}' to '${status}'`,
            code: "INVALID_STATUS_TRANSITION" 
          }, { status: 400 });
        }

        // Validate business logic for status transitions
        const finalProviderId = updates.providerId !== undefined ? updates.providerId : currentRecord.providerId;
        if ((status === 'responded' || status === 'accepted' || status === 'rejected') && !finalProviderId) {
          return NextResponse.json({ 
            error: "Provider ID is required for status 'responded' or later",
            code: "PROVIDER_REQUIRED" 
          }, { status: 400 });
        }
      }

      updates.status = status;
    }

    const updated = await db.update(rfqRequests)
      .set(updates)
      .where(eq(rfqRequests.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);

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

    // Check if record exists
    const existingRecord = await db.select()
      .from(rfqRequests)
      .where(eq(rfqRequests.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'RFQ request not found' }, { status: 404 });
    }

    // Only allow deletion of draft status RFQs
    if (existingRecord[0].status !== 'draft') {
      return NextResponse.json({ 
        error: "Only draft RFQ requests can be deleted",
        code: "DELETE_NOT_ALLOWED" 
      }, { status: 403 });
    }

    const deleted = await db.delete(rfqRequests)
      .where(eq(rfqRequests.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: "RFQ request deleted successfully",
      deleted: deleted[0] 
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}