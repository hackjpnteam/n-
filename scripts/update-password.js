const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function updatePassword() {
  const email = 'tomura@hackjpn.com';
  const newPassword = 'hikarutomura';
  
  // Hash the new password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newPassword, saltRounds);
  
  console.log('New password hash:', passwordHash);
  
  // Read current users.json
  const usersPath = path.join(__dirname, '..', 'data', 'users.json');
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  
  // Find and update the user
  for (const userId in users) {
    if (users[userId].email === email) {
      users[userId].passwordHash = passwordHash;
      console.log(`Updated password for ${email}`);
      break;
    }
  }
  
  // Write back to file
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  console.log('Password updated successfully!');
}

updatePassword().catch(console.error);