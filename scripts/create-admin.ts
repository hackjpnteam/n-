import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const connectToMongoDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');
};

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastAccess: { type: Date, default: Date.now },
  profile: {
    company: String,
    position: String,
    companyUrl: String,
    bio: String,
    avatarUrl: String
  }
}, { timestamps: true });

const User = mongoose.models?.User || mongoose.model('User', UserSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve));
};

async function createAdmin() {
  try {
    await connectToMongoDB();
    
    console.log('🔧 管理者アカウント作成ツール\n');
    
    const name = await question('管理者の名前を入力してください: ');
    const email = await question('メールアドレスを入力してください: ');
    const password = await question('パスワードを入力してください: ');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ このメールアドレスは既に登録されています');
      process.exit(1);
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create admin user
    const adminUser = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
      profile: {
        position: '管理者'
      }
    });
    
    await adminUser.save();
    
    console.log('✅ 管理者アカウントが作成されました');
    console.log(`名前: ${name}`);
    console.log(`メール: ${email}`);
    console.log(`権限: 管理者`);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();