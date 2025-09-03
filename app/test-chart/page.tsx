'use client';

import CompletionRateChart from '@/components/charts/CompletionRateChart';

export default function TestChartPage() {
  const testData = [
    { name: "田中学習太郎", value: 100 },
    { name: "佐藤勉強花子", value: 82 },
    { name: "鈴木学習次郎", value: 64 },
    { name: "高橋知識太郎", value: 49 },
    { name: "伊藤学習美", value: 31 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        横向き棒グラフのテスト
      </h1>
      
      <CompletionRateChart 
        data={testData}
        title="完了率ランキング"
      />
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-2">実装された機能:</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>✅ layout="vertical" で横向き表示</li>
          <li>✅ X軸: 0〜100%の数値、Y軸: ユーザー名</li>
          <li>✅ グラデーション（#22c55e → #10b981）</li>
          <li>✅ 右端のみ角丸（radius=[0,12,12,0]）</li>
          <li>✅ 棒の右端に値ラベル表示</li>
          <li>✅ 薄いドットグリッド背景</li>
          <li>✅ 80%位置に破線の基準線（「目標: 80%」ラベル付き）</li>
          <li>✅ カスタムツールチップ（ホバーで名前と完了率表示）</li>
          <li>✅ Tailwindでカード風スタイル</li>
        </ul>
      </div>
    </div>
  );
}