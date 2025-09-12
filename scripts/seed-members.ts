import { connectDB } from '../lib/db';
import User from '../models/User';

async function seedMembers() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log(`Found ${existingUsers} existing users`);
      return;
    }

    // Create sample members with company profiles
    const sampleUsers = [
      {
        name: 'HIkaru Tomura',
        email: 'tomura@hackjpn.com',
        passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
        role: 'admin',
        profile: {
          company: 'hackjpn',
          position: 'CEO',
          companyUrl: 'https://hackjpn.com',
          bio: 'エンジニア育成とスタートアップ支援に従事',
          avatarUrl: '/default-avatar.png'
        }
      },
      {
        name: '田中太郎',
        email: 'tanaka@example.com',
        passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
        role: 'user',
        profile: {
          company: 'テクノロジー株式会社',
          position: 'フルスタックエンジニア',
          companyUrl: 'https://tech-company.jp',
          bio: 'React/Next.jsを使ったWebアプリケーション開発が専門です。',
          avatarUrl: '/default-avatar.png'
        }
      },
      {
        name: '佐藤花子',
        email: 'sato@startup.jp',
        passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
        role: 'user',
        profile: {
          company: 'スタートアップ・ジャパン',
          position: 'プロダクトマネージャー',
          companyUrl: 'https://startup.jp',
          bio: 'プロダクト開発とチームマネジメントを行っています。',
          avatarUrl: '/default-avatar.png'
        }
      },
      {
        name: '山田一郎',
        email: 'yamada@fintech.co.jp',
        passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
        role: 'user',
        profile: {
          company: 'フィンテック株式会社',
          position: 'システムアーキテクト',
          companyUrl: 'https://fintech.co.jp',
          bio: '金融システムの設計・開発を担当しています。',
          avatarUrl: '/default-avatar.png'
        }
      }
    ];

    // Insert sample users
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.name}`);
    }

    console.log('✅ Sample members seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding members:', error);
    process.exit(1);
  }
}

seedMembers();