import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';


export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Manually resetting MongoDB connection');
    
    // Close existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('✅ Closed existing MongoDB connection');
    }
    
    // Clear the global cache
    if (global.mongoose) {
      global.mongoose.conn = null;
      global.mongoose.promise = null;
      console.log('✅ Cleared MongoDB connection cache');
    }
    
    return NextResponse.json({ 
      message: 'MongoDB connection reset successfully',
      previousState: mongoose.connection.readyState 
    });
  } catch (error) {
    console.error('❌ Error resetting MongoDB connection:', error);
    return NextResponse.json(
      { error: 'Failed to reset connection', details: error },
      { status: 500 }
    );
  }
}