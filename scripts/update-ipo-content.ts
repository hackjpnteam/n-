import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Video from '../models/Video';
import Instructor from '../models/Instructor';
import { connectDB } from '../lib/db';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function updateIPOContent() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing instructors and videos
    await Instructor.deleteMany({});
    await Video.deleteMany({});
    console.log('Cleared existing data');

    // Create new instructors based on IPO speakers
    const instructorsData = [
      {
        name: '大平 啓介',
        title: '株式会社ブリーチ 代表取締役社長',
        bio: '成果報酬型広告代理店という難易度の高いビジネスモデルでIPOを実現。エクイティ調達ほぼ無しで2023年7月に上場を達成し、約70億円を調達。証券コード: 9162',
        avatar: '/instructors/ohira.jpg',
        expertise: ['IPO戦略', 'ビジネスモデル構築', '資金調達'],
        rating: 4.9,
        totalStudents: 2150,
        totalCourses: 3
      },
      {
        name: '稲葉 雄一',
        title: 'BBDイニシアティブ株式会社 代表取締役社長 グループCEO',
        bio: '電通テックで最先端領域を経験後、2006年創業。クラウドサービスの原型を開発し、事業会社中心の資本政策でIPOを実現。証券コード: 5259',
        avatar: '/instructors/inaba.jpg',
        expertise: ['クラウドサービス', '資本政策', '事業提携'],
        rating: 4.8,
        totalStudents: 1850,
        totalCourses: 2
      },
      {
        name: '徳重 徹',
        title: 'Terra Drone株式会社 代表取締役社長',
        bio: '住友海上火災保険→米ThunderbirdでMBA取得→シリコンバレーで投資支援。2016年Terra Drone創業、2024年11月上場。世界市場を舞台に挑戦し続ける。証券コード: 278A',
        avatar: '/instructors/tokushige.jpg',
        expertise: ['グローバル経営', 'ドローンビジネス', 'ベンチャー投資'],
        rating: 4.9,
        totalStudents: 1920,
        totalCourses: 2
      },
      {
        name: '菊地 佳宏',
        title: '株式会社VRAIN Solution 取締役 コーポレート部部長',
        bio: '大手銀行勤務を経て創業直後に参画。2020年3月創業からわずか4年弱で2024年2月にIPOを達成。資本政策と早期IPOの成功要因を熟知。証券コード: 135A',
        avatar: '/instructors/kikuchi.jpg',
        expertise: ['早期IPO', '資本政策', 'コーポレート戦略'],
        rating: 4.7,
        totalStudents: 1680,
        totalCourses: 2
      }
    ];

    const instructors = await Instructor.insertMany(instructorsData);
    console.log(`Created ${instructors.length} instructors`);

    // Create videos based on the seminar content
    const videosData = [
      {
        title: '【2024年10月】成果報酬型広告代理店でIPOを実現する方法',
        description: '株式会社ブリーチ 大平啓介社長による講演。難易度の高いビジネスモデルでありながら、エクイティ調達ほぼ無しで2023年7月に上場を達成。約70億円の調達に成功した経緯、主幹事変更の背景、今後の成長戦略について詳しく解説します。',
        durationSec: 5400,
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        sourceUrl: 'https://example.com/videos/breach-ipo.mp4',
        instructor: instructors[0]._id,
        stats: { views: 3250, avgWatchRate: 94 }
      },
      {
        title: '【2024年11月】クラウドサービス×事業会社中心の資本政策でIPO実現',
        description: 'BBDイニシアティブ 稲葉雄一社長による講演。電通テックでの経験を活かし2006年に創業。クラウドサービスの原型を開発し、事業会社中心の独自の資本政策でIPOを実現。事業会社との戦略的提携と成長のきっかけを詳しく共有します。',
        durationSec: 4800,
        thumbnailUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
        sourceUrl: 'https://example.com/videos/bbd-ipo.mp4',
        instructor: instructors[1]._id,
        stats: { views: 2890, avgWatchRate: 92 }
      },
      {
        title: '【2025年7月予定】世界市場への挑戦 - Terra Droneの経営哲学',
        description: 'Terra Drone 徳重徹社長による講演。住友海上火災保険から米ThunderbirdでMBA取得、シリコンバレーでの投資支援を経て起業。2010年Terra Motors創業（インド三輪EV市場トップシェア）、2016年Terra Drone創業、2024年11月上場。グローバル市場での挑戦について語ります。',
        durationSec: 6000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
        sourceUrl: 'https://example.com/videos/terra-drone.mp4',
        instructor: instructors[2]._id,
        stats: { views: 1450, avgWatchRate: 89 }
      },
      {
        title: '【2025年9月予定】創業4年でIPO達成 - VRAIN Solutionの早期上場戦略',
        description: '株式会社VRAIN Solution 菊地佳宏取締役による講演。2020年3月創業からわずか4年弱で2024年2月にIPOを達成。大手銀行勤務を経て創業直後に参画した経験から、資本政策の立案と早期IPOの成功要因について詳しく解説します。',
        durationSec: 4200,
        thumbnailUrl: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&q=80',
        sourceUrl: 'https://example.com/videos/vrain-ipo.mp4',
        instructor: instructors[3]._id,
        stats: { views: 980, avgWatchRate: 87 }
      },
      {
        title: '主幹事証券変更の実践ノウハウ - ブリーチの事例から学ぶ',
        description: '株式会社ブリーチが経験した主幹事証券会社変更の実例を詳細に解説。変更に至った経緯、交渉のポイント、スケジュール調整の実務など、IPO準備企業が知っておくべき重要なノウハウを共有します。',
        durationSec: 3600,
        thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
        sourceUrl: 'https://example.com/videos/lead-underwriter-change.mp4',
        instructor: instructors[0]._id,
        stats: { views: 2100, avgWatchRate: 91 }
      },
      {
        title: '事業会社との戦略的資本提携 - BBDイニシアティブの成功法則',
        description: 'BBDイニシアティブが実践した事業会社中心の資本政策について詳しく解説。VCに頼らない独自の資金調達戦略、事業シナジーの創出方法、IPO後の成長加速について実例を交えて説明します。',
        durationSec: 3900,
        thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
        sourceUrl: 'https://example.com/videos/strategic-alliance.mp4',
        instructor: instructors[1]._id,
        stats: { views: 1850, avgWatchRate: 88 }
      },
      {
        title: 'グローバル展開とIPO - Terra Droneの世界戦略',
        description: 'ドローン産業で世界をリードするTerra Droneの成長戦略を解説。海外展開のタイミング、現地パートナーシップの構築、グローバル人材の採用と育成、IPOに向けた準備について詳しく説明します。',
        durationSec: 4500,
        thumbnailUrl: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80',
        sourceUrl: 'https://example.com/videos/global-expansion.mp4',
        instructor: instructors[2]._id,
        stats: { views: 1680, avgWatchRate: 90 }
      },
      {
        title: '早期IPOの資本政策設計 - VRAIN Solution実践編',
        description: '創業から4年でのIPO実現に必要な資本政策の設計方法を詳細に解説。適切な株主構成、ストックオプション設計、各ラウンドでの調達戦略、バリュエーション交渉のポイントを実例とともに紹介します。',
        durationSec: 3300,
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        sourceUrl: 'https://example.com/videos/early-ipo-capital.mp4',
        instructor: instructors[3]._id,
        stats: { views: 1420, avgWatchRate: 86 }
      },
      {
        title: 'エクイティ調達に頼らない成長戦略 - ブリーチの実例',
        description: '外部資本調達を最小限に抑えながら成長を実現した株式会社ブリーチの戦略を解説。キャッシュフロー経営、成果報酬型モデルの構築、内部留保の活用など、独自の成長戦略について詳しく説明します。',
        durationSec: 3000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
        sourceUrl: 'https://example.com/videos/non-equity-growth.mp4',
        instructor: instructors[0]._id,
        stats: { views: 2450, avgWatchRate: 93 }
      }
    ];

    const videos = await Video.insertMany(videosData);
    console.log(`Created ${videos.length} videos`);

    console.log('\n✅ Successfully updated with IPO seminar content!');
    console.log('\nInstructors:');
    instructors.forEach(instructor => {
      console.log(`- ${instructor.name} (${instructor.title})`);
    });
    console.log('\nVideos:');
    videos.forEach(video => {
      console.log(`- ${video.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error updating content:', error);
    process.exit(1);
  }
}

updateIPOContent();