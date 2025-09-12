import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Video from '../models/Video';
import Instructor from '../models/Instructor';
import { connectDB } from '../lib/db';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function restoreOriginalVideos() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Get all instructors
    const instructors = await Instructor.find();
    console.log(`Found ${instructors.length} instructors`);

    if (instructors.length === 0) {
      console.error('No instructors found. Please add instructors first.');
      process.exit(1);
    }

    // Original training videos
    const originalVideos = [
      {
        title: 'Python機械学習入門 - 基礎から実践まで',
        description: 'Pythonを使った機械学習の基礎から実践的なモデル構築まで学べる包括的なコースです。scikit-learn、pandas、NumPyを使用した実践的な内容を提供します。',
        durationSec: 3600,
        thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
        sourceUrl: 'https://example.com/videos/python-ml-intro.mp4',
        instructor: instructors[0]._id,
        stats: { views: 1250, avgWatchRate: 92 }
      },
      {
        title: 'TensorFlowで学ぶディープラーニング',
        description: 'TensorFlowを使用してニューラルネットワークの基礎から応用まで学習。画像認識、自然言語処理の実装方法を解説します。',
        durationSec: 4200,
        thumbnailUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
        sourceUrl: 'https://example.com/videos/tensorflow-deep-learning.mp4',
        instructor: instructors[1]._id,
        stats: { views: 980, avgWatchRate: 88 }
      },
      {
        title: 'データサイエンスのためのR言語',
        description: 'R言語を使った統計解析とデータ可視化の手法を学習。ggplot2、dplyrを使った実践的なデータ分析スキルを身につけます。',
        durationSec: 3000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        sourceUrl: 'https://example.com/videos/r-data-science.mp4',
        instructor: instructors[2]._id,
        stats: { views: 756, avgWatchRate: 85 }
      },
      {
        title: 'AWS実践ガイド - クラウドインフラ構築',
        description: 'Amazon Web Servicesを使用したクラウドインフラの設計と構築。EC2、S3、RDS、Lambdaなど主要サービスの実践的な活用方法を解説。',
        durationSec: 3900,
        thumbnailUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
        sourceUrl: 'https://example.com/videos/aws-guide.mp4',
        instructor: instructors[3]._id,
        stats: { views: 1100, avgWatchRate: 90 }
      },
      {
        title: 'Kubernetes入門 - コンテナオーケストレーション',
        description: 'Kubernetesの基本概念から本番環境での運用まで。Dockerコンテナの管理、スケーリング、デプロイメント戦略を学習します。',
        durationSec: 3300,
        thumbnailUrl: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?w=800&q=80',
        sourceUrl: 'https://example.com/videos/kubernetes-intro.mp4',
        instructor: instructors[0]._id,
        stats: { views: 890, avgWatchRate: 87 }
      },
      {
        title: 'React.js実践開発 - モダンフロントエンド',
        description: 'React.jsを使用した実践的なWebアプリケーション開発。Hooks、Context API、Reduxを使った状態管理まで幅広くカバー。',
        durationSec: 4500,
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
        sourceUrl: 'https://example.com/videos/react-development.mp4',
        instructor: instructors[1]._id,
        stats: { views: 1450, avgWatchRate: 94 }
      }
    ];

    // Delete existing videos
    await Video.deleteMany({});
    console.log('Cleared existing videos');

    // Insert original videos
    const insertedVideos = await Video.insertMany(originalVideos);
    console.log(`Successfully restored ${insertedVideos.length} original training videos`);

    // Display restored videos
    console.log('\nRestored videos:');
    insertedVideos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error restoring videos:', error);
    process.exit(1);
  }
}

restoreOriginalVideos();