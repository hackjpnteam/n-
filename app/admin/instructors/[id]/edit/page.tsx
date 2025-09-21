'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaSave, FaArrowLeft, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function EditInstructorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      fetchInstructor();
    }
  }, [session, status, router]);


  const fetchInstructor = async () => {
    try {
      const response = await fetch(`/api/admin/instructors/${params.id}`);
      if (!response.ok) {
        throw new Error('講師が見つかりません');
      }
      const data = await response.json();
      setFormData(data);
      setExpertiseInput(data.expertise && Array.isArray(data.expertise) ? data.expertise.join(', ') : '');
    } catch (error) {
      console.error('Error fetching instructor:', error);
      toast.error('講師データの取得に失敗しました');
      router.push('/admin/instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const expertiseArray = expertiseInput
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const response = await fetch(`/api/admin/instructors/${params.id}`, {
        method: 'PUT',
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
        throw new Error('更新に失敗しました');
      }

      toast.success('講師情報を更新しました');
      
      // Refetch the instructor data to verify the update
      await fetchInstructor();
      
      setTimeout(() => {
        router.push('/admin/instructors');
      }, 1000);
    } catch (error) {
      console.error('Error updating instructor:', error);
      toast.error('更新に失敗しました');
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('instructorId', params.id);

      const response = await fetch('/api/upload/instructor-avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Avatar upload successful, URL:', data.avatarUrl);
        setFormData(prev => ({ ...prev, avatar: data.avatarUrl }));
        toast.success('アバター画像をアップロードしました！');
      } else {
        const errorData = await response.json();
        console.error('Avatar upload failed:', errorData);
        toast.error(errorData.error || 'アップロードに失敗しました');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('アップロード中にエラーが発生しました');
    } finally {
      setUploading(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">講師編集</h1>
        <p className="text-gray-600 mt-2">講師情報を編集します</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            名前
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            役職・肩書き
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プロフィール
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            アバター画像
          </label>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="アバター画像"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                  {formData.name.charAt(0) || '?'}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-theme-500 text-white p-2 rounded-full cursor-pointer hover:bg-theme-600 transition-colors">
                <FaCamera className="text-xs" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {uploading ? 'アップロード中...' : 'クリックして画像を変更（最大5MB、JPEG/PNG/GIF/WebP）'}
            </p>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent text-sm"
              placeholder="または画像URLを直接入力"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            専門分野（カンマ区切り）
          </label>
          <input
            type="text"
            value={expertiseInput}
            onChange={(e) => setExpertiseInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            placeholder="例: IPO戦略, 資金調達, ビジネスモデル"
          />
        </div>


        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-theme-600 text-white px-6 py-2 rounded-xl hover:bg-theme-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FaSave />
            {saving ? '保存中...' : '保存'}
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