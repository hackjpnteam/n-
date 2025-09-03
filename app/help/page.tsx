export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ヘルプセンター</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">よくある質問</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">動画が再生されません</h3>
              <p className="text-gray-600">ブラウザを最新版に更新するか、別のブラウザをお試しください。</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">クイズに合格できません</h3>
              <p className="text-gray-600">動画をもう一度視聴して、理解を深めてから再挑戦してください。</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">進捗が保存されません</h3>
              <p className="text-gray-600">ログインしていることを確認してください。ログインしていない場合、進捗は保存されません。</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">お困りの際は</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700">
              上記で解決しない場合は、お問い合わせページからご連絡ください。
              営業時間内（平日9:00-18:00）に対応いたします。
            </p>
            <Link href="/contact" className="inline-block mt-4 text-orange-600 hover:text-blue-800 font-medium">
              お問い合わせ →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}