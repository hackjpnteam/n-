import mongoose from 'mongoose';
import Video from '../models/Video.js';
import Instructor from '../models/Instructor.js';

const MONGODB_URI = "mongodb+srv://study:hj12042014@cluster0.udcucg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function updateVideoInstructors() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all videos
    const videos = await Video.find({}).lean();
    console.log(`📹 Found ${videos.length} videos to update`);

    let updatedCount = 0;

    for (const video of videos) {
      // Check if instructor object exists and has an _id
      if (video.instructor && video.instructor._id) {
        console.log(`\n🔧 Updating video: ${video.title}`);
        console.log(`   Current instructor: ${video.instructor.name || 'Unknown'}`);

        // Get full instructor data from database
        const instructor = await Instructor.findById(video.instructor._id).lean();
        
        if (instructor) {
          console.log(`   Found instructor: ${instructor.name}`);
          console.log(`   Title: ${instructor.title || 'No title'}`);
          console.log(`   Bio: ${instructor.bio ? instructor.bio.substring(0, 50) + '...' : 'No bio'}`);
          
          // Update video with complete instructor object
          await Video.findByIdAndUpdate(video._id, {
            instructor: {
              _id: instructor._id.toString(),
              name: instructor.name,
              title: instructor.title || '',
              bio: instructor.bio || '',
              avatarUrl: instructor.avatarUrl || '/guest-instructor-avatar.png',
              tags: instructor.tags || []
            }
          });
          
          console.log(`   ✅ Updated instructor data for: ${video.title}`);
          updatedCount++;
        } else {
          console.log(`   ❌ Instructor not found for ID: ${video.instructor._id}`);
        }
      } else {
        console.log(`❌ Video "${video.title}" has no instructor._id`);
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} videos`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating video instructors:', error);
    process.exit(1);
  }
}

updateVideoInstructors();