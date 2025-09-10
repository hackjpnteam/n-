'use client';

import { useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import { mockInstructors } from '@/lib/mockData';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (video: any) => void;
}

export default function AddVideoModal({ isOpen, onClose, onAdd }: AddVideoModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructorId: '',
    videoUrl: '',
    thumbnailUrl: '',
    durationSec: 0,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const instructor = mockInstructors.find(i => i._id === formData.instructorId);
    if (!instructor) return;

    const newVideo = {
      _id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      instructor: {
        name: instructor.name,
        avatarUrl: instructor.avatarUrl
      },
      thumbnailUrl: formData.thumbnailUrl || '/video-thumbnail.png',
      videoUrl: formData.videoUrl,
      durationSec: formData.durationSec,
      difficulty: formData.difficulty,
      stats: {
        views: 0,
        likes: 0,
        rating: 0
      },
      createdAt: new Date().toISOString()
    };

    onAdd(newVideo);
    setFormData({
      title: '',
      description: '',
      category: '',
      instructorId: '',
      videoUrl: '',
      thumbnailUrl: '',
      durationSec: 0,
      difficulty: 'beginner'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">新しい動画を追加</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                動画タイトル
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                placeholder="動画のタイトルを入力"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                placeholder="動画の説明を入力"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリー
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                >
                  <option value="">カテゴリーを選択</option>
                  <option value="プログラミング">プログラミング</option>
                  <option value="デザイン">デザイン</option>
                  <option value="マーケティング">マーケティング</option>
                  <option value="ビジネス">ビジネス</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ゲスト
                </label>
                <select
                  required
                  value={formData.instructorId}
                  onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                >
                  <option value="">ゲストを選択</option>
                  {mockInstructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                動画URL
              </label>
              <input
                type="url"
                required
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サムネイルURL（オプション）
              </label>
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  再生時間（分）
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={Math.floor(formData.durationSec / 60)}
                  onChange={(e) => setFormData({ ...formData, durationSec: parseInt(e.target.value) * 60 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  難易度
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                >
                  <option value="beginner">初級</option>
                  <option value="intermediate">中級</option>
                  <option value="advanced">上級</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-theme-600 text-white py-3 rounded-xl hover:bg-theme-700 transition-all font-medium flex items-center justify-center gap-2"
              >
                <FaUpload />
                動画を追加
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}