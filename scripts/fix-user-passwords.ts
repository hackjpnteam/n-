import { connectDB } from '../lib/db';
import User from '../models/User';
import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function fixUserPasswords() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Update user passwords with correct hashes
    const updates = [
      {
        email: 'tomura@hackjpn.com',
        password: 'admin',
        newHash: hashPassword('admin')
      },
      {
        email: 'tanaka@example.com', 
        password: 'password123',
        newHash: hashPassword('password123')
      },
      {
        email: 'sato@startup.jp',
        password: 'password123',
        newHash: hashPassword('password123')
      },
      {
        email: 'yamada@fintech.co.jp',
        password: 'password123',
        newHash: hashPassword('password123')
      }
    ];

    for (const update of updates) {
      await User.findOneAndUpdate(
        { email: update.email },
        { passwordHash: update.newHash },
        { upsert: false }
      );
      console.log(`Updated password for: ${update.email}`);
    }

    console.log('✅ User passwords updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating user passwords:', error);
    process.exit(1);
  }
}

fixUserPasswords();