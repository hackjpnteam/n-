import mongoose from 'mongoose';
import User from '../models/User';

async function checkProdMembers() {
  try {
    const MONGODB_URI = 'mongodb+srv://study:hj12042014@cluster0.udcucg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Count total users
    const totalUsers = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);
    
    // Find users with company profile
    const membersWithCompany = await User.find({
      'profile.company': { $exists: true, $ne: '', $regex: /.+/ }
    }).select('name email profile.company profile.avatarUrl createdAt');
    
    console.log(`\n👥 Members with company profile: ${membersWithCompany.length}`);
    
    if (membersWithCompany.length > 0) {
      console.log('\n📋 Member list:');
      membersWithCompany.forEach((member: any) => {
        console.log(`  - ${member.name} (${member.email})`);
        console.log(`    Company: ${member.profile?.company || 'N/A'}`);
        console.log(`    Avatar: ${member.profile?.avatarUrl || 'No avatar'}`);
      });
    } else {
      console.log('\n⚠️  No members with company profiles found!');
      
      // Check if there are any users at all
      const allUsers = await User.find().select('name email profile');
      console.log('\n📋 All users in database:');
      allUsers.forEach((user: any) => {
        console.log(`  - ${user.name} (${user.email})`);
        console.log(`    Has profile: ${!!user.profile}`);
        if (user.profile) {
          console.log(`    Company: ${user.profile.company || 'Not set'}`);
        }
      });
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProdMembers();