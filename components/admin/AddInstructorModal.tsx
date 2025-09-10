'use client';

import { useState } from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

interface AddInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (instructor: any) => void;
}

export default function AddInstructorModal({ isOpen, onClose, onAdd }: AddInstructorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    avatarUrl: '',
    tags: [] as string[],
    currentTag: ''
  });

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.currentTag.trim()],
        currentTag: ''
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInstructor = {
      _id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      avatarUrl: formData.avatarUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
      tags: formData.tags,
      rating: 0,
      students: 0,
      courses: 0,
      createdAt: new Date().toISOString()
    };

    onAdd(newInstructor);
    setFormData({
      name: '',
      title: '',
      bio: '',
      avatarUrl: '',
      tags: [],
      currentTag: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">新しいゲストを追加</h2>
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
                ゲスト名
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ゲストの名前を入力"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                役職・肩書き
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="例: シニアソフトウェアエンジニア"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロフィール
              </label>
              <textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="ゲストの経歴や専門分野について説明してください"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロフィール画像URL（オプション）
              </label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                空白の場合はデフォルトの画像が使用されます
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                専門タグ
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.currentTag}
                  onChange={(e) => setFormData({ ...formData, currentTag: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="例: React, JavaScript, UI/UX"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center gap-1"
                >
                  <FaPlus />
                  追加
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all font-medium flex items-center justify-center gap-2"
              >
                <FaPlus />
                ゲストを追加
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