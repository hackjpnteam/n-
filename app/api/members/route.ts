export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAllUsers } from '@/lib/session';

export async function GET() {
  try {
    // Load all users from MongoDB
    const users = await getAllUsers();
    console.log('Loaded users for members API:', users.length);
    
    // Ensure users is an array
    if (!Array.isArray(users)) {
      console.error('Users is not an array:', users);
      return NextResponse.json({ ok: false, error: "Users data is invalid" }, { status: 500 });
    }
    
    // Transform users to member format for public view
    const members = users
      .map((user: any) => ({
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        profile: {
          company: user.profile?.company || '',
          position: user.profile?.position || '',
          companyUrl: user.profile?.companyUrl || '',
          bio: user.profile?.bio || '',
          avatarUrl: user.profile?.avatarUrl || '/default-avatar.png'
        },
        joinedAt: user.createdAt
      }));
    
    return NextResponse.json({ ok: true, items: members }, { status: 200 });
  } catch (e: any) {
    console.error('Error in /api/members:', e);
    return NextResponse.json({ ok: false, error: e?.message ?? "INTERNAL_ERROR" }, { status: 500 });
  }
}