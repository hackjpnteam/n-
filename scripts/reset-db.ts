import mongoose from 'mongoose';
import { connectDB } from '../lib/db';

async function resetDB() {
  try {
    await connectDB();
    
    console.log('🗑️  データベースをリセット中...');

    // コレクションを削除
    if (!mongoose.connection.db) {
      console.error('データベース接続が確立されていません');
      return;
    }
    const collections = await mongoose.connection.db.collections();
    
    for (const collection of collections) {
      try {
        await collection.drop();
        console.log(`✅ ${collection.collectionName} コレクションを削除しました`);
      } catch (error: any) {
        if (error.message === 'ns not found') {
          console.log(`ℹ️  ${collection.collectionName} コレクションは存在しません`);
        } else {
          console.error(`❌ ${collection.collectionName} コレクションの削除に失敗:`, error.message);
        }
      }
    }

    console.log('🎉 データベースのリセットが完了しました！');

  } catch (error) {
    console.error('❌ データベースリセット中にエラーが発生しました:', error);
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  resetDB();
}

export default resetDB;