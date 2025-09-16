'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import CompletionRateChart from '@/components/charts/CompletionRateChart';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'videos' | 'quiz'>('users');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">データの読み込みに失敗しました</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">分析ダッシュボード</h1>

      {/* 全体統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl p-6 bg-theme-50">
          <h3 className="text-sm font-medium text-theme-600 mb-2">総動画数</h3>
          <p className="text-3xl font-bold text-theme-900">{data.overview.totalVideos}</p>
        </div>
        <div className="rounded-2xl p-6 bg-theme-50">
          <h3 className="text-sm font-medium text-theme-600 mb-2">視聴完了数</h3>
          <p className="text-3xl font-bold text-theme-900">{data.overview.totalCompletions}</p>
        </div>
        <div className="rounded-2xl p-6 bg-theme-50">
          <h3 className="text-sm font-medium text-theme-600 mb-2">クイズ受験数</h3>
          <p className="text-3xl font-bold text-theme-900">{data.overview.totalQuizAttempts}</p>
        </div>
        <div className="rounded-2xl p-6 bg-theme-50">
          <h3 className="text-sm font-medium text-theme-600 mb-2">完了率</h3>
          <p className="text-3xl font-bold text-theme-900">{data.overview.overallCompletionRate}%</p>
        </div>
      </div>

      {/* ランキングセクション（タブ切り替え） */}
      <div className="rounded-2xl shadow-lg bg-white mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4">総合ランキング</h2>
          
          {/* タブナビゲーション */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-theme-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ユーザー進捗度
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'bg-theme-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              動画別完了率
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-theme-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              クイズ成績
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'users' ? (
            <CompletionRateChart 
              data={data.userRanking
                ?.sort((a: any, b: any) => b.completionRate - a.completionRate)
                .slice(0, 10)
                .map((user: any) => ({
                  name: user.userName,
                  value: user.completionRate
                }))}
              title="ユーザー完了率 TOP 10"
            />
          ) : activeTab === 'videos' ? (
            <CompletionRateChart 
              data={data.progressStats
                ?.sort((a: any, b: any) => b.completionRate - a.completionRate)
                .slice(0, 10)
                .map((stat: any) => ({
                  name: stat.videoTitle,
                  value: stat.completionRate
                }))}
              title="動画別完了率 TOP 10"
            />
          ) : (
            <CompletionRateChart 
              data={data.quizStats
                ?.sort((a: any, b: any) => b.avgScore - a.avgScore)
                .slice(0, 10)
                .map((stat: any) => ({
                  name: stat.videoTitle,
                  value: stat.avgScore
                }))}
              title="クイズ平均スコア TOP 10"
            />
          )}
        </div>
      </div>

      {/* 詳細テーブルセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* ユーザー進捗テーブル */}
        <div className="rounded-2xl shadow bg-white">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-gray-900">ユーザー進捗ランキング</h3>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">順位</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ユーザー</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">完了動画数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">完了率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.userRanking
                  ?.sort((a: any, b: any) => b.completionRate - a.completionRate)
                  .map((user: any, index: number) => (
                  <tr key={user.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {index + 1 <= 3 && (
                          <span className={`mr-2 ${
                            index === 0 ? 'text-yellow-500' : 
                            index === 1 ? 'text-gray-400' : 
                            'text-amber-600'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.userName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.completedVideos} / {data.overview.totalVideos}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-theme-600 h-2 rounded-full"
                            style={{ width: `${user.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {user.completionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 動画別進捗テーブル */}
        <div className="rounded-2xl shadow bg-white">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-gray-900">動画別完了率ランキング</h3>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">順位</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">動画</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">完了数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">完了率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.progressStats
                  .sort((a: any, b: any) => b.completionRate - a.completionRate)
                  .map((stat: any, index: number) => (
                  <tr key={stat.videoId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {index + 1 <= 3 && (
                          <span className={`mr-2 ${
                            index === 0 ? 'text-yellow-500' : 
                            index === 1 ? 'text-gray-400' : 
                            'text-amber-600'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {stat.videoTitle}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {stat.completedCount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-theme-600 h-2 rounded-full"
                            style={{ width: `${stat.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {stat.completionRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* クイズ統計テーブル */}
      <div className="rounded-2xl shadow bg-white">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">クイズ成績ランキング</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">順位</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">動画タイトル</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">受験数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平均スコア</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">合格率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.quizStats
                .sort((a: any, b: any) => b.avgScore - a.avgScore)
                .map((stat: any, index: number) => (
                <tr key={stat.videoId}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      {index + 1 <= 3 && (
                        <span className={`mr-2 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          'text-amber-600'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {stat.videoTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {stat.totalAttempts}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {stat.avgScore}点
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stat.passRate >= 80 ? 'bg-green-100 text-green-800' :
                      stat.passRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-theme-100 text-theme-800'
                    }`}>
                      {stat.passRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}