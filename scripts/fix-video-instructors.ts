import mongoose from 'mongoose';
import Video from '../models/Video.js';
import Instructor from '../models/Instructor.js';

const MONGODB_URI = "mongodb+srv://study:hj12042014@cluster0.udcucg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function fixVideoInstructors() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all videos with instructor as string
    const videos = await Video.find({}).lean();
    console.log(`📹 Found ${videos.length} videos to check`);

    let fixedCount = 0;

    for (const video of videos) {
      // Check if instructor is a string (ID only)
      if (typeof video.instructor === 'string') {
        console.log(`\n🔧 Fixing video: ${video.title}`);
        console.log(`   Current instructor: ${video.instructor}`);

        // Get full instructor data
        const instructor = await Instructor.findById(video.instructor).lean();
        
        if (instructor) {
          console.log(`   Found instructor: ${instructor.name}`);
          
          // Update video with full instructor object
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
          
          console.log(`   ✅ Fixed instructor data for: ${video.title}`);
          fixedCount++;
        } else {
          console.log(`   ❌ Instructor not found for ID: ${video.instructor}`);
        }
      } else {
        console.log(`✓ Video "${video.title}" already has proper instructor object`);
      }
    }

    console.log(`\n🎉 Fixed ${fixedCount} videos`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing video instructors:', error);
    process.exit(1);
  }
}

fixVideoInstructors();