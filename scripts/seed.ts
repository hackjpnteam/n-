import mongoose from 'mongoose';
import { connectDB } from '../lib/db';
import Instructor from '../models/Instructor';
import Video from '../models/Video';
import Quiz from '../models/Quiz';
import Question from '../models/Question';

async function seed() {
  try {
    await connectDB();
    
    console.log('🌱 シードデータを作成開始...');

    // 既存データをクリア
    await Promise.all([
      Instructor.deleteMany({}),
      Video.deleteMany({}),
      Quiz.deleteMany({}),
      Question.deleteMany({})
    ]);

    // ゲストデータを作成
    const instructors = await Instructor.insertMany([
      {
        name: '山田太郎',
        title: 'AI/機械学習エンジニア',
        bio: '10年以上のAI開発経験を持つエキスパート。大手テック企業でML エンジニアとして活躍後、現在は独立してAI教育に従事。',
        avatarUrl: '/instructors/yamada.jpg',
        tags: ['Python', 'AI', '機械学習', 'データサイエンス'],
        socials: {
          twitter: 'https://twitter.com/yamada_ai',
          linkedin: 'https://linkedin.com/in/yamada-taro',
          website: 'https://yamada-ai.com'
        }
      },
      {
        name: '佐藤花子',
        title: 'デジタルマーケティング専門家',
        bio: 'デジタルマーケティング歴15年。複数のスタートアップでマーケティング責任者を歴任し、現在はコンサルタントとして活動。',
        avatarUrl: '/instructors/sato.jpg',
        tags: ['マーケティング', 'SEO', 'SNS', 'データ分析'],
        socials: {
          twitter: 'https://twitter.com/sato_marketing',
          linkedin: 'https://linkedin.com/in/sato-hanako'
        }
      },
      {
        name: 'ジョン・スミス',
        title: '英語学習コーチ',
        bio: 'アメリカ出身の英語教育専門家。20年以上の日本での英語教育経験を持ち、ビジネス英語から日常会話まで幅広く指導。',
        avatarUrl: '/instructors/smith.jpg',
        tags: ['英語', 'ビジネス英語', 'TOEIC', '発音'],
        socials: {
          youtube: 'https://youtube.com/johnsmith-english',
          website: 'https://johnsmith-english.com'
        }
      }
    ]);

    console.log(`✅ ${instructors.length}名のゲストを作成しました`);

    // 動画データを作成
    const videos = await Video.insertMany([
      {
        title: 'Python機械学習入門 - 基礎から実践まで',
        description: 'Pythonを使った機械学習の基礎を学びます。scikit-learnを使った分類・回帰の実装方法を詳しく解説します。',
        durationSec: 3600,
        thumbnailUrl: '/video-thumbnail.png',
        sourceUrl: '/videos/python-ml-basics.mp4',
        instructor: instructors[0]._id,
        stats: { views: 1250, avgWatchRate: 85.5 }
      },
      {
        title: 'ディープラーニング実践講座 - TensorFlow入門',
        description: 'TensorFlowを使ったディープラーニングの実装方法を学びます。画像認識モデルの構築を通して理解を深めます。',
        durationSec: 4500,
        thumbnailUrl: '/video-thumbnail.png',
        sourceUrl: '/videos/tensorflow-intro.mp4',
        instructor: instructors[0]._id,
        stats: { views: 890, avgWatchRate: 78.2 }
      },
      {
        title: 'デジタルマーケティング戦略設計',
        description: '効果的なデジタルマーケティング戦略の立て方を学びます。ターゲット設定からKPI設計まで体系的に解説。',
        durationSec: 2700,
        thumbnailUrl: '/video-thumbnail.png',
        sourceUrl: '/videos/digital-marketing-strategy.mp4',
        instructor: instructors[1]._id,
        stats: { views: 2100, avgWatchRate: 92.1 }
      },
      {
        title: 'SEO対策完全ガイド - 2024年版',
        description: '最新のSEO対策手法を詳しく解説。Googleアルゴリズムの変化に対応した効果的なSEO戦略を学びます。',
        durationSec: 3300,
        thumbnailUrl: '/video-thumbnail.png',
        sourceUrl: '/videos/seo-guide-2024.mp4',
        instructor: instructors[1]._id,
        stats: { views: 1680, avgWatchRate: 88.7 }
      },
      {
        title: 'ビジネス英語プレゼンテーション術',
        description: '効果的なビジネス英語プレゼンテーションの方法を学びます。構成から発音まで実践的にマスターしましょう。',
        durationSec: 2400,
        thumbnailUrl: '/video-thumbnail.png',
        sourceUrl: '/videos/business-english-presentation.mp4',
        instructor: instructors[2]._id,
        stats: { views: 950, avgWatchRate: 86.3 }
      },
      {
        title: 'TOEIC攻略法 - スコア900点を目指す',
        description: 'TOEIC高得点を狙うための効率的な学習方法を解説。各パートの攻略法と時間配分のコツを詳しく紹介。',
        durationSec: 3900,
        thumbnailUrl: '/video-thumbnail.png',
        sourceUrl: '/videos/toeic-strategy.mp4',
        instructor: instructors[2]._id,
        stats: { views: 1450, avgWatchRate: 91.8 }
      }
    ]);

    console.log(`✅ ${videos.length}本の動画を作成しました`);

    // クイズとQuestion作成
    const quizData = [
      {
        video: videos[0],
        title: 'Python機械学習入門 - 理解度テスト',
        questions: [
          {
            type: 'MCQ',
            prompt: 'scikit-learnで線形回帰を実装する際に使用するクラスはどれですか？',
            choices: [
              { key: 'A', text: 'LinearRegression' },
              { key: 'B', text: 'LogisticRegression' },
              { key: 'C', text: 'DecisionTree' },
              { key: 'D', text: 'RandomForest' }
            ],
            correctKeys: ['A'],
            explanation: 'LinearRegressionクラスは線形回帰を実装するためのscikit-learnの基本クラスです。'
          },
          {
            type: 'MultiSelect',
            prompt: '機械学習の主要な種類として正しいものをすべて選択してください。',
            choices: [
              { key: 'A', text: '教師あり学習' },
              { key: 'B', text: '教師なし学習' },
              { key: 'C', text: '強化学習' },
              { key: 'D', text: 'ディープラーニング' }
            ],
            correctKeys: ['A', 'B', 'C'],
            explanation: 'ディープラーニングは機械学習の手法の一つであり、学習の種類ではありません。'
          },
          {
            type: 'TrueFalse',
            prompt: '訓練データとテストデータは同じデータセットから作成するべきである。',
            correctKeys: ['false'],
            explanation: '訓練データとテストデータは別々に分割し、モデルの汎化性能を正しく評価する必要があります。'
          },
          {
            type: 'MCQ',
            prompt: '過学習（オーバーフィッティング）を防ぐ方法として適切でないものはどれですか？',
            choices: [
              { key: 'A', text: '正則化の使用' },
              { key: 'B', text: 'クロスバリデーション' },
              { key: 'C', text: '訓練データの増加' },
              { key: 'D', text: 'モデルの複雑さを増す' }
            ],
            correctKeys: ['D'],
            explanation: 'モデルの複雑さを増すことは過学習を促進してしまいます。'
          },
          {
            type: 'MCQ',
            prompt: 'F1スコアは何の調和平均ですか？',
            choices: [
              { key: 'A', text: '精度と再現率' },
              { key: 'B', text: '適合率と再現率' },
              { key: 'C', text: '精度と適合率' },
              { key: 'D', text: 'TPRとFPR' }
            ],
            correctKeys: ['B'],
            explanation: 'F1スコアは適合率（Precision）と再現率（Recall）の調和平均です。'
          }
        ]
      },
      {
        video: videos[2],
        title: 'デジタルマーケティング戦略 - 理解度テスト',
        questions: [
          {
            type: 'MCQ',
            prompt: 'カスタマージャーニーマップで最も重要な要素はどれですか？',
            choices: [
              { key: 'A', text: 'タッチポイントの特定' },
              { key: 'B', text: '顧客の感情の理解' },
              { key: 'C', text: 'ペルソナの設定' },
              { key: 'D', text: 'すべて同程度に重要' }
            ],
            correctKeys: ['D'],
            explanation: 'カスタマージャーニーマップでは、タッチポイント、感情、ペルソナすべてが重要な要素です。'
          },
          {
            type: 'TrueFalse',
            prompt: 'CTR（Click Through Rate）が高いほど、必ずしもCVR（Conversion Rate）も高くなる。',
            correctKeys: ['false'],
            explanation: 'CTRとCVRは別々の指標であり、必ずしも相関関係があるわけではありません。'
          },
          {
            type: 'MultiSelect',
            prompt: 'デジタルマーケティングで重要なKPIとして適切なものをすべて選択してください。',
            choices: [
              { key: 'A', text: 'CAC（顧客獲得コスト）' },
              { key: 'B', text: 'LTV（顧客生涯価値）' },
              { key: 'C', text: 'ROI（投資収益率）' },
              { key: 'D', text: 'フォロワー数' }
            ],
            correctKeys: ['A', 'B', 'C'],
            explanation: 'フォロワー数は参考指標ですが、ビジネス成果に直結するKPIではありません。'
          },
          {
            type: 'MCQ',
            prompt: 'A/Bテストで最も重要な原則はどれですか？',
            choices: [
              { key: 'A', text: '統計的有意性の確認' },
              { key: 'B', text: '一度に一つの要素のみをテスト' },
              { key: 'C', text: '十分なサンプルサイズの確保' },
              { key: 'D', text: 'すべて重要' }
            ],
            correctKeys: ['D'],
            explanation: 'A/Bテストでは統計的有意性、変数の統制、サンプルサイズすべてが重要です。'
          },
          {
            type: 'TrueFalse',
            prompt: 'リターゲティング広告は新規顧客獲得に最も効果的な手法である。',
            correctKeys: ['false'],
            explanation: 'リターゲティングは既存の見込み客に対する手法で、新規顧客獲得には適していません。'
          }
        ]
      }
    ];

    // クイズとQuestionを作成
    for (const quizInfo of quizData) {
      const quiz = await Quiz.create({
        video: quizInfo.video._id,
        title: quizInfo.title,
        passThreshold: 80,
        questions: []
      });

      const questions = await Question.insertMany(
        quizInfo.questions.map(q => ({
          ...q,
          quiz: quiz._id
        }))
      );

      quiz.questions = questions.map(q => q._id) as mongoose.Types.ObjectId[];
      await quiz.save();

      console.log(`✅ ${quizInfo.title}を作成しました（${questions.length}問）`);
    }

    console.log('🎉 シードデータの作成が完了しました！');
    console.log(`
📊 作成されたデータ:
- ゲスト: ${instructors.length}名
- 動画: ${videos.length}本  
- クイズ: ${quizData.length}件
`);

  } catch (error) {
    console.error('❌ シードデータ作成中にエラーが発生しました:', error);
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  seed();
}

export default seed;