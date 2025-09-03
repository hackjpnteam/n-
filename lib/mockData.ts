export const mockInstructors = [
  {
    _id: '1',
    name: '山田太郎',
    title: 'AI/機械学習エンジニア',
    bio: '10年以上のAI開発経験を持つエキスパート。大手テック企業でML エンジニアとして活躍後、現在は独立してAI教育に従事。',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    tags: ['Python', 'AI', '機械学習', 'データサイエンス'],
    socials: {
      twitter: 'https://twitter.com/yamada_ai',
      linkedin: 'https://linkedin.com/in/yamada-taro',
      website: 'https://yamada-ai.com'
    }
  },
  {
    _id: '2',
    name: '佐藤花子',
    title: 'デジタルマーケティング専門家',
    bio: 'デジタルマーケティング歴15年。複数のスタートアップでマーケティング責任者を歴任し、現在はコンサルタントとして活動。',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    tags: ['マーケティング', 'SEO', 'SNS', 'データ分析'],
    socials: {
      twitter: 'https://twitter.com/sato_marketing',
      linkedin: 'https://linkedin.com/in/sato-hanako'
    }
  },
  {
    _id: '3',
    name: 'ジョン・スミス',
    title: '英語学習コーチ',
    bio: 'アメリカ出身の英語教育専門家。20年以上の日本での英語教育経験を持ち、ビジネス英語から日常会話まで幅広く指導。',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    tags: ['英語', 'ビジネス英語', 'TOEIC', '発音'],
    socials: {
      youtube: 'https://youtube.com/johnsmith-english',
      website: 'https://johnsmith-english.com'
    }
  }
];

export const mockQuizzes = [
  {
    _id: '1',
    videoId: '1',
    title: 'Python機械学習入門 - 理解度テスト',
    passThreshold: 80,
    questions: [
      {
        _id: 'q1',
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
        _id: 'q2',
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
        _id: 'q3',
        type: 'TrueFalse',
        prompt: '訓練データとテストデータは同じデータセットから作成するべきである。',
        choices: [
          { key: 'true', text: '正しい' },
          { key: 'false', text: '間違い' }
        ],
        correctKeys: ['false'],
        explanation: '訓練データとテストデータは別々に分割し、モデルの汎化性能を正しく評価する必要があります。'
      }
    ]
  },
  {
    _id: '2',
    videoId: '3',
    title: 'デジタルマーケティング戦略 - 理解度テスト',
    passThreshold: 80,
    questions: [
      {
        _id: 'q4',
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
        _id: 'q5',
        type: 'TrueFalse',
        prompt: 'CTR（Click Through Rate）が高いほど、必ずしもCVR（Conversion Rate）も高くなる。',
        choices: [
          { key: 'true', text: '正しい' },
          { key: 'false', text: '間違い' }
        ],
        correctKeys: ['false'],
        explanation: 'CTRとCVRは別々の指標であり、必ずしも相関関係があるわけではありません。'
      }
    ]
  },
  {
    _id: '3',
    videoId: '2',
    title: 'TensorFlow ディープラーニング - 理解度テスト',
    passThreshold: 80,
    questions: [
      {
        _id: 'q6',
        type: 'MCQ',
        prompt: 'TensorFlowでニューラルネットワークを構築する際の基本的なレイヤーはどれですか？',
        choices: [
          { key: 'A', text: 'Dense' },
          { key: 'B', text: 'Conv2D' },
          { key: 'C', text: 'LSTM' },
          { key: 'D', text: 'すべて正しい' }
        ],
        correctKeys: ['D'],
        explanation: 'Dense、Conv2D、LSTMはすべてTensorFlowで使用される基本的なレイヤータイプです。'
      }
    ]
  },
  {
    _id: '4',
    videoId: '4',
    title: 'SEO対策 - 理解度テスト',
    passThreshold: 80,
    questions: [
      {
        _id: 'q7',
        type: 'MCQ',
        prompt: 'SEOで最も重要な要素はどれですか？',
        choices: [
          { key: 'A', text: 'キーワード密度' },
          { key: 'B', text: 'コンテンツの質' },
          { key: 'C', text: 'メタタグ' },
          { key: 'D', text: 'バックリンク数' }
        ],
        correctKeys: ['B'],
        explanation: '現代のSEOでは、ユーザーに価値を提供する高品質なコンテンツが最も重要です。'
      }
    ]
  },
  {
    _id: '5',
    videoId: '5',
    title: 'ビジネス英語プレゼンテーション - 理解度テスト',
    passThreshold: 80,
    questions: [
      {
        _id: 'q8',
        type: 'MCQ',
        prompt: 'プレゼンテーションの導入部で最も効果的な手法はどれですか？',
        choices: [
          { key: 'A', text: '自己紹介から始める' },
          { key: 'B', text: '質問で聴衆の関心を引く' },
          { key: 'C', text: 'アジェンダを説明する' },
          { key: 'D', text: '統計データを示す' }
        ],
        correctKeys: ['B'],
        explanation: '聴衆への質問は関心を引き、プレゼンテーションへの参加意識を高める効果的な導入手法です。'
      }
    ]
  },
  {
    _id: '6',
    videoId: '6',
    title: 'TOEIC攻略法 - 理解度テスト',
    passThreshold: 80,
    questions: [
      {
        _id: 'q9',
        type: 'MCQ',
        prompt: 'TOEICリーディングセクションで時間を効率的に使うコツはどれですか？',
        choices: [
          { key: 'A', text: '全ての文章を詳しく読む' },
          { key: 'B', text: '難しい問題から解く' },
          { key: 'C', text: 'スキャニングとスキミングを使い分ける' },
          { key: 'D', text: '時間を気にせず丁寧に解く' }
        ],
        correctKeys: ['C'],
        explanation: 'スキャニング（特定情報を探す）とスキミング（大意を把握する）の使い分けが時間効率を上げる鍵です。'
      }
    ]
  }
];

export const mockVideos = [
  {
    _id: '1',
    title: 'Python機械学習入門 - 基礎から実践まで',
    description: 'Pythonを使った機械学習の基礎を学びます。scikit-learnを使った分類・回帰の実装方法を詳しく解説します。',
    durationSec: 3600,
    thumbnailUrl: '/video-thumbnail.png',
    sourceUrl: '/videos/python-ml-basics.mp4',
    instructor: mockInstructors[0],
    stats: { views: 1250, avgWatchRate: 85.5 },
    category: 'AI・機械学習',
    tags: ['Python', 'AI', '機械学習']
  },
  {
    _id: '2',
    title: 'ディープラーニング実践講座 - TensorFlow入門',
    description: 'TensorFlowを使ったディープラーニングの実装方法を学びます。画像認識モデルの構築を通して理解を深めます。',
    durationSec: 4500,
    thumbnailUrl: '/video-thumbnail.png',
    sourceUrl: '/videos/tensorflow-intro.mp4',
    instructor: mockInstructors[0],
    stats: { views: 890, avgWatchRate: 78.2 },
    category: 'AI・機械学習',
    tags: ['TensorFlow', 'ディープラーニング', 'AI']
  },
  {
    _id: '3',
    title: 'デジタルマーケティング戦略設計',
    description: '効果的なデジタルマーケティング戦略の立て方を学びます。ターゲット設定からKPI設計まで体系的に解説。',
    durationSec: 2700,
    thumbnailUrl: '/video-thumbnail.png',
    sourceUrl: '/videos/digital-marketing-strategy.mp4',
    instructor: mockInstructors[1],
    stats: { views: 2100, avgWatchRate: 92.1 },
    category: 'マーケティング',
    tags: ['マーケティング', '戦略', 'KPI']
  },
  {
    _id: '4',
    title: 'SEO対策完全ガイド - 2024年版',
    description: '最新のSEO対策手法を詳しく解説。Googleアルゴリズムの変化に対応した効果的なSEO戦略を学びます。',
    durationSec: 3300,
    thumbnailUrl: '/video-thumbnail.png',
    sourceUrl: '/videos/seo-guide-2024.mp4',
    instructor: mockInstructors[1],
    stats: { views: 1680, avgWatchRate: 88.7 },
    category: 'マーケティング',
    tags: ['SEO', 'マーケティング', 'Google']
  },
  {
    _id: '5',
    title: 'ビジネス英語プレゼンテーション術',
    description: '効果的なビジネス英語プレゼンテーションの方法を学びます。構成から発音まで実践的にマスターしましょう。',
    durationSec: 2400,
    thumbnailUrl: '/video-thumbnail.png',
    sourceUrl: '/videos/business-english-presentation.mp4',
    instructor: mockInstructors[2],
    stats: { views: 950, avgWatchRate: 86.3 },
    category: '英語学習',
    tags: ['英語', 'プレゼンテーション', 'ビジネス']
  },
  {
    _id: '6',
    title: 'TOEIC攻略法 - スコア900点を目指す',
    description: 'TOEIC高得点を狙うための効率的な学習方法を解説。各パートの攻略法と時間配分のコツを詳しく紹介。',
    durationSec: 3900,
    thumbnailUrl: '/video-thumbnail.png',
    sourceUrl: '/videos/toeic-strategy.mp4',
    instructor: mockInstructors[2],
    stats: { views: 1450, avgWatchRate: 91.8 },
    category: '英語学習',
    tags: ['TOEIC', '英語', '試験対策']
  }
];