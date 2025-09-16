'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaVideo, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Video {
  _id: string;
  title: string;
  description: string;
  durationSec: number;
  thumbnailUrl: string;
  sourceUrl: string;
  instructor: {
    _id: string;
    name: string;
  };
  stats: {
    views: number;
    avgWatchRate?: number;
  };
}

export default function AdminVideosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setAuthLoading(true);
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user && session.user.role !== 'admin') {
      toast.error('管理者権限が必要です');
      router.push('/');
      return;
    }

    if (session?.user) {
      setUser(session.user);
      setAuthLoading(false);
      fetchVideos();
    }
  }, [session, status, router]);


  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('動画データの取得に失敗しました');
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`「${title}」を削除してもよろしいですか？`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      toast.success('動画を削除しました');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('削除に失敗しました');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  if (authLoading || dataLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">動画管理</h1>
          <p className="text-gray-600 mt-2">研修動画の追加・編集・削除ができます</p>
        </div>
        <Link
          href="/admin/videos/new"
          className="flex items-center gap-2 bg-theme-600 text-white px-4 py-2 rounded-xl hover:bg-theme-700 transition-all"
        >
          <FaPlus />
          新規追加
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  講師
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  時間
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  視聴数
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  完了率
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {videos.map((video) => (
                <tr key={video._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-10 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
                        <FaVideo className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {video.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {video.instructor?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FaClock className="mr-1 text-gray-400" />
                      {formatDuration(video.durationSec)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {video.stats.views.toLocaleString()}回
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {video.stats.avgWatchRate ? `${video.stats.avgWatchRate}%` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <Link
                        href={`/admin/videos/${video._id}/edit`}
                        className="text-theme-600 hover:text-theme-900"
                      >
                        <FaEdit className="text-lg" />
                      </Link>
                      <button
                        onClick={() => handleDelete(video._id, video.title)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/admin"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-all"
        >
          管理画面に戻る
        </Link>
      </div>
    </div>
  );
}