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
            <p className="text-xl text-theme-700 font-medium">
              共に駆け上がる、最高のパフォーマンスへ
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
            href="/members"
            className="relative group block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-theme-700 to-theme-800 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 text-center transform group-hover:scale-105 group-hover:-translate-y-2 border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-theme-600 to-theme-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                👥
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-theme-800 transition-colors">
                会員一覧
              </h2>
              <p className="text-gray-600 leading-relaxed">
                コミュニティメンバーの学習進捗と活動状況をご確認いただけます
              </p>
              <div className="mt-6">
                <span className="inline-block px-4 py-2 bg-theme-100 text-theme-700 rounded-full text-sm font-medium">
                  詳細を見る →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}