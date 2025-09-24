import mongoose from 'mongoose';
import Instructor from '../models/Instructor.js';

const avatarUrl = '/guest-instructor-avatar.png';

async function updateGuestAvatars() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all guest instructors (created by system) without avatar
    const guestInstructors = await Instructor.find({ 
      createdBy: 'system',
      $or: [
        { avatarUrl: { $exists: false } },
        { avatarUrl: null },
        { avatarUrl: '' }
      ]
    });

    console.log(`Found ${guestInstructors.length} guest instructors without avatars`);

    if (guestInstructors.length === 0) {
      console.log('No guest instructors need avatar updates');
      await mongoose.disconnect();
      return;
    }

    // Update all guest instructors to have the sample avatar
    const result = await Instructor.updateMany(
      { 
        createdBy: 'system',
        $or: [
          { avatarUrl: { $exists: false } },
          { avatarUrl: null },
          { avatarUrl: '' }
        ]
      },
      { 
        $set: { avatarUrl: avatarUrl }
      }
    );

    console.log(`Successfully updated ${result.modifiedCount} guest instructor avatars`);
    
    // Verify the update
    const updatedInstructors = await Instructor.find({ 
      createdBy: 'system',
      avatarUrl: avatarUrl
    });
    
    console.log(`Verification: ${updatedInstructors.length} guest instructors now have the avatar`);
    
    // Show some examples
    console.log('\nSample updated instructors:');
    updatedInstructors.slice(0, 5).forEach((instructor, index) => {
      console.log(`${index + 1}. ${instructor.name} - Avatar: ${instructor.avatarUrl}`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error updating guest instructor avatars:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateGuestAvatars();