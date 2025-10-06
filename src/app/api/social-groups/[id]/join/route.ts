import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { socialGroups, socialGroupMembers, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authentication check
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Validate group ID
    const groupId = params.id;
    if (!groupId || isNaN(parseInt(groupId))) {
      return NextResponse.json(
        { error: 'Valid group ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const parsedGroupId = parseInt(groupId);

    // Check if group exists
    const group = await db
      .select()
      .from(socialGroups)
      .where(eq(socialGroups.id, parsedGroupId))
      .limit(1);

    if (group.length === 0) {
      return NextResponse.json(
        { error: 'Group not found', code: 'GROUP_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMembership = await db
      .select()
      .from(socialGroupMembers)
      .where(
        and(
          eq(socialGroupMembers.groupId, parsedGroupId),
          eq(socialGroupMembers.userId, parseInt(currentUser.id))
        )
      )
      .limit(1);

    if (existingMembership.length > 0) {
      return NextResponse.json(
        { error: 'You are already a member of this group', code: 'ALREADY_MEMBER' },
        { status: 409 }
      );
    }

    // Create membership record
    const newMembership = await db
      .insert(socialGroupMembers)
      .values({
        groupId: parsedGroupId,
        userId: parseInt(currentUser.id),
        role: 'member',
        joinedAt: new Date().toISOString(),
      })
      .returning();

    // Increment members count
    const updatedGroup = await db
      .update(socialGroups)
      .set({
        membersCount: group[0].membersCount + 1,
      })
      .where(eq(socialGroups.id, parsedGroupId))
      .returning();

    // Fetch user details for response
    const userDetails = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.id, parseInt(currentUser.id)))
      .limit(1);

    // Return membership details with user and group info
    return NextResponse.json(
      {
        membership: newMembership[0],
        user: userDetails[0],
        group: updatedGroup[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}