import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-theme-400/20 to-theme-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-theme-400/20 to-theme-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="mb-8 flex justify-center items-center">
            <img 
              src="/n-minus-logo-final.png" 
              alt="Nマイナス by 上場の法則" 
              className="h-32 w-auto object-contain"
            />
          </div>
          
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-2xl text-gray-700 leading-relaxed mb-4">
              5年以内の<br className="hidden md:block" />
              IPOを目指す<br className="hidden md:block" />
              経営者コミュニティ
            </p>
            <p className="text-xl text-theme-700 font-medium">
              共に駆け上がる、IPOへの最短距離
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 bg-white/70 backdrop-blur rounded-full text-gray-700 border border-white/50">✨ 理解度テスト</span>
            <span className="px-4 py-2 bg-white/70 backdrop-blur rounded-full text-gray-700 border border-white/50">📈 進捗管理</span>
            <span className="px-4 py-2 bg-white/70 backdrop-blur rounded-full text-gray-700 border border-white/50">👥 専門ゲスト</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Link
            href="/instructors"
            className="relative group block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-theme-700 to-theme-800 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 text-center transform group-hover:scale-105 group-hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-theme-600 to-theme-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                👨‍🏫
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-theme-800 transition-colors">
                ゲスト一覧
              </h2>
              <p className="text-gray-600 leading-relaxed">
                経験豊富なゲスト陣のプロフィールと担当動画をご覧いただけます
              </p>
              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-theme-100 text-theme-700 rounded-full text-sm font-medium">
                  詳細を見る →
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/videos"
            className="relative group block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-theme-700 to-theme-800 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 text-center transform group-hover:scale-105 group-hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-theme-600 to-theme-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                🎥
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-theme-800 transition-colors">
                動画一覧
              </h2>
              <p className="text-gray-600 leading-relaxed">
                豊富な学習コンテンツから、あなたの興味に合った動画を見つけましょう
              </p>
              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-theme-100 text-theme-700 rounded-full text-sm font-medium">
                  詳細を見る →
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            className="relative group block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-theme-700 to-theme-800 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 text-center transform group-hover:scale-105 group-hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-theme-600 to-theme-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-theme-800 transition-colors">
                分析ダッシュボード
              </h2>
              <p className="text-gray-600 leading-relaxed">
                学習進捗とクイズ結果の詳細な分析データをご確認いただけます
              </p>
              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-theme-100 text-theme-700 rounded-full text-sm font-medium">
                  詳細を見る →
                </span>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Features section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">プラットフォームの特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-theme-500 to-theme-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                🎯
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">個別進捗管理</h3>
              <p className="text-sm text-gray-600">動画ごとの視聴状況を詳細に記録</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-theme-500 to-theme-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                🧠
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">理解度テスト</h3>
              <p className="text-sm text-gray-600">学習内容の理解度を客観的に測定</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-theme-500 to-theme-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                👨‍🎓
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">専門講師陣</h3>
              <p className="text-sm text-gray-600">各分野のエキスパートによる指導</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-theme-500 to-theme-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                📊
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">詳細分析</h3>
              <p className="text-sm text-gray-600">学習データの可視化と洞察</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}