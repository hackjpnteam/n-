import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// DELETE member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin role
    await connectToMongoDB();
    const currentUser = await User.findOne({ 
      email: session.user.email?.toLowerCase() 
    });
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const memberId = params.id;
    
    const member = await User.findById(memberId);
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Prevent self-deletion
    if ((currentUser._id as any).toString() === memberId) {
      return NextResponse.json(
        { error: '自分自身を削除することはできません' },
        { status: 400 }
      );
    }

    // Delete the user
    await User.findByIdAndDelete(memberId);
    
    return NextResponse.json({ 
      message: 'メンバーを削除しました',
      deleted: {
        id: memberId,
        name: member.name,
        email: member.email
      }
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH member (update role)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin role
    await connectToMongoDB();
    const currentUser = await User.findOne({ 
      email: session.user.email?.toLowerCase() 
    });
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const memberId = params.id;
    const { role } = await request.json();
    
    const member = await User.findById(memberId);
    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Update the user role
    member.role = role;
    await member.save();
    
    return NextResponse.json({ 
      message: 'Member role updated successfully',
      user: {
        id: (member as any)._id.toString(),
        name: member.name,
        email: member.email,
        role: member.role
      }
    });
  } catch (error) {
    console.error('Error updating member role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}