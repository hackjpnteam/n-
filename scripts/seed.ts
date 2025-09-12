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
        name: '大平 啓介',
        title: '株式会社ブリーチ 代表取締役社長',
        bio: '成果報酬型広告代理店という難易度の高いモデルでIPOを実現。エクイティ調達ほぼ無しで2023年7月に上場、約70億円を調達。主幹事変更の経緯や成長戦略について講演。',
        avatarUrl: '/default-avatar.png',
        tags: ['IPO', '広告代理店', '成果報酬型', '資本政策'],
        socials: {
          website: 'https://breach-inc.jp'
        }
      },
      {
        name: '稲葉 雄一',
        title: 'BBDイニシアティブ株式会社 代表取締役社長 グループCEO',
        bio: '電通テックで最先端領域を経験後、2006年創業。クラウドサービスの原型を開発し、事業会社中心の資本政策でIPOを実現。事業会社との提携や成長のきっかけを共有。',
        avatarUrl: '/default-avatar.png',
        tags: ['IPO', 'クラウドサービス', '事業提携', '資本政策'],
        socials: {
          website: 'https://bbd-initiative.com'
        }
      },
      {
        name: '徳重 徹',
        title: 'Terra Drone株式会社 代表取締役社長',
        bio: '住友海上火災保険→米ThunderbirdでMBA取得→シリコンバレーで投資支援。2010年Terra Motors創業（インド三輪EV市場トップシェア）、2016年Terra Drone創業。2024年11月上場。世界市場を舞台に挑戦し続ける経営哲学を講演。',
        avatarUrl: '/default-avatar.png',
        tags: ['IPO', 'ドローン', 'グローバル', 'EV', 'MBA'],
        socials: {
          website: 'https://terra-drone.net'
        }
      },
      {
        name: '菊地 佳宏',
        title: '株式会社VRAIN Solution 取締役 コーポレート部部長',
        bio: '2020年3月創業からわずか4年弱で2024年2月にIPOを達成。大手銀行勤務を経て創業直後に参画。資本政策と早期IPOの成功要因を講演。',
        avatarUrl: '/default-avatar.png',
        tags: ['IPO', '早期上場', '資本政策', 'コーポレート'],
        socials: {
          website: 'https://vrain-solution.com'
        }
      },
      {
        name: '伊藤 雅仁',
        title: '経営戦略センター株式会社 代表取締役',
        bio: '三菱銀行→ソフトバンクを経て2003年ファイナンス・オール代表取締役社長。ARUHI住宅ローン専門会社を創業。これまで10社以上のIPOに関与し、上場企業2社の代表取締役、5社の取締役を歴任。ベンチャー経営と起業家育成の専門家。',
        avatarUrl: '/default-avatar.png',
        tags: ['IPO', 'ベンチャー経営', '起業家育成', '住宅ローン', '金融'],
        socials: {
          website: 'https://keieisen.co.jp'
        }
      }
    ]);

    console.log(`✅ ${instructors.length}名のゲストを作成しました`);

    // 動画データを作成
    const videos = await Video.insertMany([
      {
        title: '【2024年10月】成果報酬型広告代理店でのIPO実現 - 株式会社ブリーチ',
        description: '成果報酬型広告代理店という難易度の高いビジネスモデルでIPOを実現。エクイティ調達ほぼ無しで2023年7月に上場し、約70億円を調達した経緯と戦略を詳しく解説。主幹事証券会社の変更プロセスや今後の成長戦略についても深掘りします。',
        durationSec: 5400,
        thumbnailUrl: '/default-thumbnail.png',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        instructor: instructors[0]._id,
        stats: { views: 2840, avgWatchRate: 94.2 }
      },
      {
        title: '【2024年11月】クラウドサービスの先駆者が語るIPO戦略 - BBDイニシアティブ株式会社',
        description: '電通テックでの最先端領域での経験を経て2006年に創業。クラウドサービスの原型を開発し、事業会社中心の資本政策でIPOを実現した経緯を解説。大手事業会社との戦略的提携の築き方、成長のターニングポイントとなった決断について共有します。',
        durationSec: 4800,
        thumbnailUrl: '/default-thumbnail.png',
        videoUrl: 'https://vimeo.com/148751763',
        instructor: instructors[1]._id,
        stats: { views: 2150, avgWatchRate: 91.8 }
      },
      {
        title: '【2025年7月】グローバル市場への挑戦 - Terra Drone株式会社',
        description: '住友海上火災保険から米ThunderbirdでMBA取得、シリコンバレーでの投資支援を経て起業。2010年Terra Motors創業でインド三輪EV市場トップシェア獲得、2016年Terra Drone創業で2024年11月上場。世界市場を舞台に挑戦し続ける経営哲学と、グローバル展開の戦略を講演。',
        durationSec: 6300,
        thumbnailUrl: '/default-thumbnail.png',
        videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        instructor: instructors[2]._id,
        stats: { views: 3520, avgWatchRate: 95.7 }
      },
      {
        title: '【2025年9月】創業4年弱での早期IPO成功事例 - 株式会社VRAIN Solution',
        description: '2020年3月創業からわずか4年弱で2024年2月にIPOを達成した成功事例を詳細に解説。大手銀行勤務の経験を活かし、創業直後から参画して構築した資本政策と、早期IPOを可能にした組織体制・ガバナンス構築の秘訣を共有。スタートアップのCFOに必要な視点も解説します。',
        durationSec: 5100,
        thumbnailUrl: '/default-thumbnail.png',
        videoUrl: 'https://vimeo.com/76979871',
        instructor: instructors[3]._id,
        stats: { views: 1890, avgWatchRate: 93.5 }
      }
    ]);

    console.log(`✅ ${videos.length}本の動画を作成しました`);

    // クイズとQuestion作成
    const quizData = [
      {
        video: videos[0],
        title: '株式会社ブリーチ IPO戦略 - 理解度テスト',
        questions: [
          {
            type: 'MCQ',
            prompt: 'ブリーチのビジネスモデルの特徴は何ですか？',
            choices: [
              { key: 'A', text: '固定報酬型広告代理店' },
              { key: 'B', text: '成果報酬型広告代理店' },
              { key: 'C', text: 'メディア運営' },
              { key: 'D', text: 'SaaS事業' }
            ],
            correctKeys: ['B'],
            explanation: 'ブリーチは成果報酬型広告代理店という難易度の高いビジネスモデルでIPOを実現しました。'
          },
          {
            type: 'TrueFalse',
            prompt: 'ブリーチは多額のエクイティ調達を行って上場した。',
            correctKeys: ['false'],
            explanation: 'ブリーチはエクイティ調達をほぼ行わずに2023年7月に上場を実現しました。'
          },
          {
            type: 'MCQ',
            prompt: 'ブリーチが上場時に調達した金額は約何億円ですか？',
            choices: [
              { key: 'A', text: '30億円' },
              { key: 'B', text: '50億円' },
              { key: 'C', text: '70億円' },
              { key: 'D', text: '100億円' }
            ],
            correctKeys: ['C'],
            explanation: 'ブリーチは2023年7月の上場で約70億円を調達しました。'
          },
          {
            type: 'MultiSelect',
            prompt: 'IPO準備において重要な要素をすべて選択してください。',
            choices: [
              { key: 'A', text: '主幹事証券会社の選定' },
              { key: 'B', text: '内部統制の構築' },
              { key: 'C', text: '監査法人の選定' },
              { key: 'D', text: '売上高の最大化のみ' }
            ],
            correctKeys: ['A', 'B', 'C'],
            explanation: '売上高は重要ですが、IPO準備では主幹事証券、内部統制、監査法人など多面的な準備が必要です。'
          },
          {
            type: 'TrueFalse',
            prompt: '成果報酬型のビジネスモデルはIPOにおいて有利である。',
            correctKeys: ['false'],
            explanation: '成果報酬型は収益の予測が難しく、IPOにおいては難易度の高いビジネスモデルとされています。'
          }
        ]
      },
      {
        video: videos[2],
        title: 'Terra Drone グローバル戦略 - 理解度テスト',
        questions: [
          {
            type: 'MCQ',
            prompt: '徳重氏が最初に創業した会社はどれですか？',
            choices: [
              { key: 'A', text: 'Terra Drone' },
              { key: 'B', text: 'Terra Motors' },
              { key: 'C', text: 'Terra Tech' },
              { key: 'D', text: 'Terra Mobility' }
            ],
            correctKeys: ['B'],
            explanation: '徳重氏は2010年にTerra Motorsを創業し、その後2016年にTerra Droneを創業しました。'
          },
          {
            type: 'TrueFalse',
            prompt: 'Terra Motorsはインドの三輪EV市場でトップシェアを獲得した。',
            correctKeys: ['true'],
            explanation: 'Terra Motorsはインドの三輪EV市場でトップシェアを獲得する成功を収めました。'
          },
          {
            type: 'MultiSelect',
            prompt: '徳重氏のキャリアに含まれるものをすべて選択してください。',
            choices: [
              { key: 'A', text: '住友海上火災保険での勤務' },
              { key: 'B', text: 'ThunderbirdでのMBA取得' },
              { key: 'C', text: 'シリコンバレーでの投資支援' },
              { key: 'D', text: 'Google本社での勤務' }
            ],
            correctKeys: ['A', 'B', 'C'],
            explanation: '徳重氏は住友海上火災保険、Thunderbird MBA、シリコンバレーでの投資支援の経験を持ちます。'
          },
          {
            type: 'MCQ',
            prompt: 'Terra Droneが上場したのはいつですか？',
            choices: [
              { key: 'A', text: '2023年11月' },
              { key: 'B', text: '2024年5月' },
              { key: 'C', text: '2024年11月' },
              { key: 'D', text: '2025年3月' }
            ],
            correctKeys: ['C'],
            explanation: 'Terra Droneは2024年11月に上場を実現しました。'
          },
          {
            type: 'TrueFalse',
            prompt: 'グローバル展開は日本のスタートアップにとってオプションである。',
            correctKeys: ['false'],
            explanation: 'Terra Droneの事例が示すように、グローバル展開は成長に不可欠な戦略となっています。'
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