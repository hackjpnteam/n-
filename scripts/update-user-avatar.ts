import mongoose from 'mongoose';
import User from '../models/User';
import fs from 'fs';
import path from 'path';

async function updateUserAvatar() {
  try {
    // Read local users.json file
    const usersFile = path.join(process.cwd(), 'data', 'users.json');
    if (fs.existsSync(usersFile)) {
      const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      const hikaru = usersData['87831af6-5b11-4e60-9b6a-7f40f220aee6'];
      
      if (hikaru && hikaru.profile && hikaru.profile.avatarUrl) {
        console.log('Local avatar URL:', hikaru.profile.avatarUrl);
        
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://study:hj12042014@cluster0.udcucg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Update user in MongoDB
        const result = await User.findOneAndUpdate(
          { email: 'tomura@hackjpn.com' },
          { 
            $set: { 
              'profile.avatarUrl': hikaru.profile.avatarUrl,
              'profile.company': hikaru.profile.company,
              'profile.position': hikaru.profile.position,
              'profile.companyUrl': hikaru.profile.companyUrl,
              'profile.bio': hikaru.profile.bio
            }
          },
          { new: true }
        );
        
        if (result) {
          console.log('✅ Successfully updated user avatar in MongoDB');
          console.log('Updated profile:', result.profile);
        } else {
          console.log('❌ User not found in MongoDB');
        }
        
        await mongoose.disconnect();
      } else {
        console.log('No avatar URL found in local data');
      }
    } else {
      console.log('users.json file not found');
    }
  } catch (error) {
    console.error('Error updating user avatar:', error);
  }
}

updateUserAvatar();