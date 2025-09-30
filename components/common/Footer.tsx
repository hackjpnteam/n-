import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ナレッジシェア</h3>
            <p className="text-gray-400 text-sm">
              最高品質のオンライン学習体験を提供します。
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">学習コンテンツ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/videos" className="hover:text-white">動画一覧</Link></li>
              <li><Link href="/instructors" className="hover:text-white">ゲスト一覧</Link></li>
              <li><a href="#" className="hover:text-white">カテゴリ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">サポート</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/help" className="hover:text-white">ヘルプセンター</Link></li>
              <li><Link href="/contact" className="hover:text-white">お問い合わせ</Link></li>
              <li><Link href="/terms" className="hover:text-white">利用規約</Link></li>
              <li><Link href="/privacy" className="hover:text-white">プライバシーポリシー</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 hackjpn inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}