'use client';

import { useState } from 'react';
import { FaTimes, FaPlus, FaTrash, FaImage, FaUpload } from 'react-icons/fa';

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
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ファイルサイズは5MB以下にしてください');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const uploadAvatar = async (): Promise<string> => {
    if (!avatarFile) return formData.avatarUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('avatar', avatarFile);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formDataUpload,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const data = await response.json();
      return data.avatarUrl;
    } catch (error) {
      console.error('Upload error:', error);
      alert('アバターのアップロードに失敗しました');
      return `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Upload avatar if file is selected
    const avatarUrl = await uploadAvatar();
    
    const instructorData = {
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
      avatarUrl,
      tags: formData.tags
    };

    try {
      const response = await fetch('/api/admin/instructors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(instructorData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('ゲストを追加しました！');
        
        // Create instructor object for local state update
        const newInstructor = {
          _id: result.instructor._id,
          name: instructorData.name,
          title: instructorData.title,
          bio: instructorData.bio,
          avatarUrl: instructorData.avatarUrl,
          tags: instructorData.tags,
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
        setAvatarFile(null);
        setAvatarPreview('');
        onClose();
      } else {
        const error = await response.json();
        alert('ゲストの追加に失敗しました: ' + (error.error || 'エラーが発生しました'));
      }
    } catch (error) {
      console.error('Error adding instructor:', error);
      alert('ゲストの追加中にエラーが発生しました');
    }
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
                プロフィール画像
              </label>
              <div className="space-y-3">
                {/* File upload */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                      dragActive 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <FaImage className="text-gray-400" />
                    <span className="text-gray-600">
                      {avatarFile ? avatarFile.name : '画像を選択またはドラッグ＆ドロップ'}
                    </span>
                    {uploading && <FaUpload className="animate-spin text-green-500" />}
                  </label>
                </div>

                {/* Preview */}
                {avatarPreview && (
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview('');
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 text-xs"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}

                {/* URL input (optional) */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">または、画像URLを入力：</p>
                  <input
                    type="url"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                    disabled={!!avatarFile}
                  />
                </div>
                
                <p className="text-xs text-gray-500">
                  ※ 画像を指定しない場合は、デフォルトの画像が使用されます
                </p>
              </div>
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
                disabled={uploading}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus />
                {uploading ? 'アップロード中...' : 'ゲストを追加'}
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