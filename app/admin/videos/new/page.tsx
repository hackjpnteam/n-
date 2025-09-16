'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Instructor {
  _id: string;
  name: string;
}

export default function NewVideoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    durationSec: 0,
    thumbnailUrl: '',
    sourceUrl: '',
    instructor: '',
    stats: {
      views: 0,
      avgWatchRate: 0
    }
  });

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
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
      setLoading(false);
      fetchInstructors();
    }
  }, [session, status, router]);


  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors');
      const data = await response.json();
      setInstructors(data.instructors || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('追加に失敗しました');
      }

      toast.success('動画を追加しました');
      router.push('/admin/videos');
    } catch (error) {
      console.error('Error creating video:', error);
      toast.error('追加に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'views' || name === 'avgWatchRate') {
      setFormData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [name]: parseFloat(value) || 0
        }
      }));
    } else if (name === 'durationSec') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatDurationFromMinutes = (minutes: number) => {
    return minutes * 60;
  };

  const handleDurationMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      durationSec: formatDurationFromMinutes(minutes)
    }));
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">動画追加</h1>
        <p className="text-gray-600 mt-2">新しい研修動画を追加します</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="例: IPO準備における内部統制の構築"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="動画の内容や学習目標について詳しく記載してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            講師 <span className="text-red-500">*</span>
          </label>
          <select
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            {instructors.map((instructor) => (
              <option key={instructor._id} value={instructor._id}>
                {instructor.name}
              </option>
            ))}
          </select>
          {instructors.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              講師が登録されていません。先に講師を追加してください。
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            動画時間（分） <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={Math.floor(formData.durationSec / 60)}
            onChange={handleDurationMinutesChange}
            min="1"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="例: 60"
          />
          <p className="text-sm text-gray-500 mt-1">
            分単位で入力してください（例: 60分 = 3600秒）
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サムネイルURL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="例: https://images.unsplash.com/photo-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            動画URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="例: https://example.com/videos/video.mp4"
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">統計情報（オプション）</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                初期視聴回数
              </label>
              <input
                type="number"
                name="views"
                value={formData.stats.views}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                平均視聴率（%）
              </label>
              <input
                type="number"
                name="avgWatchRate"
                value={formData.stats.avgWatchRate}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving || instructors.length === 0}
            className="flex items-center gap-2 bg-theme-600 text-white px-6 py-2 rounded-xl hover:bg-theme-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FaSave />
            {saving ? '追加中...' : '追加'}
          </button>
          <Link
            href="/admin/videos"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition-all"
          >
            <FaArrowLeft />
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}