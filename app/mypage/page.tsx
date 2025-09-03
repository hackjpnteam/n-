'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaVideo, FaCheckCircle, FaClock, FaTrophy, FaBook, FaChartLine, FaPlay } from 'react-icons/fa';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MyPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [watchedVideos, setWatchedVideos] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const localProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
    const completedVideos = Object.entries(localProgress)
      .filter(([_, data]: [string, any]) => data.status === 'completed')
      .map(([videoId, data]: [string, any]) => ({
        videoId,
        completedAt: data.completedAt
      }));
    setWatchedVideos(completedVideos);
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mockVideoTitles: Record<string, string> = {
    '1': 'Python機械学習入門',
    '2': 'TensorFlowディープラーニング',
    '3': 'デジタルマーケティング戦略',
    '4': 'SEO対策完全ガイド',
    '5': 'ビジネス英語プレゼンテーション',
    '6': 'TOEIC攻略法'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">マイページ</h1>
        <p className="text-gray-600">あなたの学習状況を確認できます</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FaUser className="text-2xl" />
            <span className="text-blue-100">プロフィール</span>
          </div>
          <h3 className="text-xl font-bold mb-1">{user.name}</h3>
          <p className="text-blue-100">{user.email}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FaCheckCircle className="text-2xl" />
            <span className="text-green-100">完了動画</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{watchedVideos.length}</h3>
          <p className="text-green-100">本完了</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FaTrophy className="text-2xl" />
            <span className="text-purple-100">達成率</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">{Math.round((watchedVideos.length / 6) * 100)}%</h3>
          <p className="text-purple-100">全体進捗</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <FaVideo className="text-orange-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-900">視聴完了動画</h2>
          </div>
          
          {watchedVideos.length > 0 ? (
            <div className="space-y-4">
              {watchedVideos.map(video => (
                <div key={video.videoId} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {mockVideoTitles[video.videoId] || `動画 ${video.videoId}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      完了日: {new Date(video.completedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/videos/${video.videoId}`}
                      className="text-sm bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 transition-all"
                    >
                      再視聴
                    </Link>
                    <Link
                      href={`/videos/${video.videoId}/quiz`}
                      className="text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-all"
                    >
                      クイズ
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaVideo className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">まだ視聴完了した動画がありません</p>
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-all"
              >
                <FaPlay />
                動画を見る
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <FaChartLine className="text-purple-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-900">学習統計</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FaClock className="text-orange-500" />
                <span className="font-medium text-gray-700">総学習時間</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{watchedVideos.length * 45}分</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FaBook className="text-blue-500" />
                <span className="font-medium text-gray-700">クイズ受験数</span>
              </div>
              <span className="text-xl font-bold text-gray-900">0回</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FaTrophy className="text-yellow-500" />
                <span className="font-medium text-gray-700">平均スコア</span>
              </div>
              <span className="text-xl font-bold text-gray-900">-点</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-900 mb-2">学習のヒント</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 毎日少しずつでも継続することが大切です</li>
              <li>• クイズで理解度を確認しましょう</li>
              <li>• 分からない部分は繰り返し視聴しましょう</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}