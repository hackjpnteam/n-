import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Video from '../models/Video';
import Instructor from '../models/Instructor';
import { connectDB } from '../lib/db';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function addVideos() {
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

    // Define new training videos
    const newVideos = [
      {
        title: 'IPO準備における内部統制の構築',
        description: 'IPO準備企業が必ず整備すべき内部統制の基本から実践まで。SOX法対応、リスク管理体制、内部監査の実施方法を具体的に解説します。',
        durationSec: 3600,
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        sourceUrl: 'https://example.com/videos/internal-control.mp4',
        instructor: instructors[0]._id,
        stats: { views: 1250, avgWatchRate: 92 }
      },
      {
        title: '株式上場の実務と手続き',
        description: '東証プライム・スタンダード・グロース市場への上場申請から承認までの実務を詳細に解説。必要書類の準備、審査対応のポイントを学びます。',
        durationSec: 4200,
        thumbnailUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
        sourceUrl: 'https://example.com/videos/ipo-procedure.mp4',
        instructor: instructors[1]._id,
        stats: { views: 980, avgWatchRate: 88 }
      },
      {
        title: 'J-SOX対応の実践ガイド',
        description: '金融商品取引法に基づく内部統制報告制度への対応方法。3点セットの作成、RCMの構築、IT統制の整備について実例を交えて説明します。',
        durationSec: 3900,
        thumbnailUrl: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&q=80',
        sourceUrl: 'https://example.com/videos/j-sox.mp4',
        instructor: instructors[2]._id,
        stats: { views: 1100, avgWatchRate: 90 }
      },
      {
        title: 'IPO準備企業の資本政策',
        description: '成功するIPOのための資本政策立案。資金調達、株主構成の最適化、ストックオプション設計など、実務に即した内容を解説します。',
        durationSec: 3300,
        thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        sourceUrl: 'https://example.com/videos/capital-policy.mp4',
        instructor: instructors[3]._id,
        stats: { views: 850, avgWatchRate: 85 }
      },
      {
        title: '上場審査の重要ポイント',
        description: '証券取引所の上場審査で重視される項目と対策。ガバナンス体制、業績管理、コンプライアンス等の審査基準を詳しく解説します。',
        durationSec: 4500,
        thumbnailUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
        sourceUrl: 'https://example.com/videos/ipo-review.mp4',
        instructor: instructors[0]._id,
        stats: { views: 1450, avgWatchRate: 94 }
      },
      {
        title: 'IPOに向けた管理会計の構築',
        description: '上場企業に求められる管理会計体制の構築方法。予実管理、セグメント別損益、KPI設定など実践的な内容を学びます。',
        durationSec: 3600,
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        sourceUrl: 'https://example.com/videos/management-accounting.mp4',
        instructor: instructors[1]._id,
        stats: { views: 920, avgWatchRate: 87 }
      },
      {
        title: 'IR活動の基礎と実践',
        description: '上場後のIR活動の重要性と実施方法。決算説明会の運営、適時開示、機関投資家対応など、IR担当者必須の知識を提供します。',
        durationSec: 2700,
        thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        sourceUrl: 'https://example.com/videos/ir-basics.mp4',
        instructor: instructors[2]._id,
        stats: { views: 750, avgWatchRate: 82 }
      },
      {
        title: 'コーポレートガバナンスの強化',
        description: 'CGコードに対応したガバナンス体制の構築。取締役会の実効性評価、社外取締役の活用、委員会設置等について解説します。',
        durationSec: 3000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
        sourceUrl: 'https://example.com/videos/corporate-governance.mp4',
        instructor: instructors[3]._id,
        stats: { views: 680, avgWatchRate: 79 }
      },
      {
        title: 'IPO準備企業の労務管理',
        description: '上場審査で問われる労務管理のポイント。労働時間管理、就業規則の整備、労使関係の構築など重要事項を網羅します。',
        durationSec: 2400,
        thumbnailUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
        sourceUrl: 'https://example.com/videos/labor-management.mp4',
        instructor: instructors[0]._id,
        stats: { views: 890, avgWatchRate: 86 }
      },
      {
        title: '財務報告と開示実務',
        description: '有価証券報告書・四半期報告書の作成実務。開示府令に基づく記載要領、監査対応、XBRL提出まで実践的に学習します。',
        durationSec: 4800,
        thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
        sourceUrl: 'https://example.com/videos/financial-reporting.mp4',
        instructor: instructors[1]._id,
        stats: { views: 1320, avgWatchRate: 91 }
      }
    ];

    // Delete existing videos to avoid duplicates
    await Video.deleteMany({});
    console.log('Cleared existing videos');

    // Insert new videos
    const insertedVideos = await Video.insertMany(newVideos);
    console.log(`Successfully added ${insertedVideos.length} training videos`);

    // Display added videos
    console.log('\nAdded videos:');
    insertedVideos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error adding videos:', error);
    process.exit(1);
  }
}

addVideos();