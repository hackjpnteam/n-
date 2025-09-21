'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function NewInstructorPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    avatar: '',
    expertise: [] as string[]
  });
  const [expertiseInput, setExpertiseInput] = useState('');

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
    }
  }, [session, status, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const expertiseArray = expertiseInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const response = await fetch('/api/admin/instructors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          expertise: expertiseArray
        }),
      });

      if (!response.ok) {
        throw new Error('追加に失敗しました');
      }

      toast.success('講師を追加しました');
      router.push('/admin/instructors');
    } catch (error) {
      console.error('Error creating instructor:', error);
      toast.error('追加に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        <h1 className="text-3xl font-bold text-gray-900">講師追加</h1>
        <p className="text-gray-600 mt-2">新しい講師を追加します</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="例: 田中 太郎"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            役職・肩書き <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="例: 株式会社○○ 代表取締役社長"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プロフィール <span className="text-red-500">*</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="講師の経歴や専門性について詳しく記載してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            アバター画像URL
          </label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="例: /instructors/name.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            専門分野（カンマ区切り） <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={expertiseInput}
            onChange={(e) => setExpertiseInput(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="例: IPO戦略, 資金調達, ビジネスモデル"
          />
          <p className="text-sm text-gray-500 mt-1">
            専門分野をカンマで区切って入力してください
          </p>
        </div>


        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-theme-600 text-white px-6 py-2 rounded-xl hover:bg-theme-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FaSave />
            {saving ? '追加中...' : '追加'}
          </button>
          <Link
            href="/admin/instructors"
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