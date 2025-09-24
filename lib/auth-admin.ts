import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/models/User';

export interface AdminAuthResult {
  success: boolean;
  user?: any;
  error?: string;
  status?: number;
}

export async function verifyAdminAuth(request?: NextRequest): Promise<AdminAuthResult> {
  try {
    // Try NextAuth first
    let userEmail = null;
    
    try {
      const session = await auth();
      if (session?.user?.email) {
        userEmail = session.user.email;
        console.log('✅ NextAuth session found:', userEmail);
      }
    } catch (authError) {
      console.log('NextAuth failed, trying simple auth...', authError);
    }
    
    // If NextAuth fails, try simple auth by directly checking cookies
    if (!userEmail) {
      try {
        const cookieStore = cookies();
        const sessionToken = cookieStore.get('simple-auth-token')?.value;
        
        if (sessionToken) {
          console.log('Found simple auth token, verifying...');
          // Connect to MongoDB to verify the session directly
          await connectToMongoDB();
          
          // Parse JWT token to get user info (simple implementation)
          try {
            const tokenParts = sessionToken.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
              if (payload.email && payload.exp > Date.now() / 1000) {
                userEmail = payload.email;
                console.log('✅ Simple auth token valid:', userEmail);
              }
            }
          } catch (tokenError) {
            console.log('Token parsing failed:', tokenError);
          }
        }
      } catch (simpleAuthError) {
        console.log('Simple auth also failed:', simpleAuthError);
      }
    }
    
    if (!userEmail) {
      console.log('❌ No valid authentication found');
      return {
        success: false,
        error: 'Authentication required',
        status: 401
      };
    }

    // Check admin role in database
    await connectToMongoDB();
    const currentUser = await User.findOne({ 
      email: userEmail.toLowerCase() 
    });
    
    if (!currentUser) {
      return {
        success: false,
        error: 'User not found',
        status: 404
      };
    }
    
    if (currentUser.role !== 'admin') {
      return {
        success: false,
        error: 'Admin access required',
        status: 403
      };
    }

    return {
      success: true,
      user: currentUser
    };
  } catch (error) {
    console.error('Admin auth verification failed:', error);
    return {
      success: false,
      error: 'Authentication verification failed',
      status: 500
    };
  }
}