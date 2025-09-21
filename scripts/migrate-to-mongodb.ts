import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import User from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

async function migrateUsersToMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Read users.json file
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    
    if (!fs.existsSync(usersPath)) {
      console.error('❌ users.json file not found');
      process.exit(1);
    }

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    console.log(`📁 Found ${Object.keys(usersData).length} users in users.json`);

    // Clear existing users in MongoDB (optional)
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing users in MongoDB`);
      console.log('🗑️  Clearing existing users...');
      await User.deleteMany({});
    }

    // Migrate each user
    let migratedCount = 0;
    for (const [userId, userData] of Object.entries(usersData)) {
      try {
        const user = userData as any;
        
        // Create new user in MongoDB
        const newUser = new User({
          name: user.name,
          email: user.email.toLowerCase(),
          passwordHash: user.passwordHash,
          role: user.role || 'user',
          profile: {
            company: user.profile?.company || '',
            position: user.profile?.position || '',
            companyUrl: user.profile?.companyUrl || '',
            bio: user.profile?.bio || '',
            avatarUrl: user.profile?.avatarUrl || ''
          },
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date()
        });

        await newUser.save();
        migratedCount++;
        
        console.log(`✅ Migrated user: ${user.name} (${user.email})`);
      } catch (error) {
        console.error(`❌ Error migrating user ${userId}:`, error);
      }
    }

    console.log(`🎉 Migration completed! Migrated ${migratedCount} users to MongoDB`);
    
    // Verify migration
    const finalCount = await User.countDocuments();
    console.log(`📊 Total users in MongoDB: ${finalCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrateUsersToMongoDB();