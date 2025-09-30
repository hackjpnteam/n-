'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaUpload, FaImage } from 'react-icons/fa';

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
    thumbnailUrl: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);

  // Fetch instructors from API
  useEffect(() => {
    if (isOpen) {
      fetchInstructors();
    }
  }, [isOpen]);

  const fetchInstructors = async () => {
    setLoadingInstructors(true);
    try {
      console.log('🚀 [MODAL] Starting fetchInstructors...');
      const response = await fetch('/api/instructors?limit=1000&page=1', {
        credentials: 'include'
      });
      console.log('📡 [MODAL] Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 [MODAL] API Response data:', data);
        console.log('👥 [MODAL] Instructors count:', data.instructors?.length || 0);
        console.log('🔍 [MODAL] Looking for "太平" or "大平"...');
        
        if (data.instructors) {
          const taiheInstructor = data.instructors.find((i: any) => 
            i.name.includes('太平') || i.name.includes('大平')
          );
          if (taiheInstructor) {
            console.log('✅ [MODAL] Found instructor:', taiheInstructor);
          } else {
            console.log('❌ [MODAL] "太平"/"大平" instructor not found in response');
            console.log('📋 [MODAL] All instructor names:', data.instructors.map((i: any) => i.name));
          }
        }
        
        setInstructors(data.instructors || []);
        console.log('✅ [MODAL] Instructors state updated');
      } else {
        const errorText = await response.text();
        console.error('❌ [MODAL] Failed to fetch instructors:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ [MODAL] Error fetching instructors:', error);
    } finally {
      setLoadingInstructors(false);
      console.log('🏁 [MODAL] fetchInstructors completed');
    }
  };

  if (!isOpen) return null;

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setThumbnailFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) return formData.thumbnailUrl || '/default-thumbnail.png';

    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('file', thumbnailFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      alert('サムネイルのアップロードに失敗しました');
      return '/default-thumbnail.png';
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const instructor = instructors.find(i => i._id === formData.instructorId);
    if (!instructor) {
      alert('ゲスト講師を選択してください');
      return;
    }

    console.log('🎯 [MODAL] Selected instructor data:', instructor);

    // Upload thumbnail if file is selected
    const thumbnailUrl = await uploadThumbnail();

    const videoData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      instructor: {
        _id: instructor._id,
        name: instructor.name,
        title: instructor.title || '',
        bio: instructor.bio || '',
        avatarUrl: instructor.avatarUrl || instructor.avatar || '/guest-instructor-avatar.png',
        tags: instructor.tags || []
      },
      thumbnailUrl: thumbnailUrl,
      sourceUrl: formData.videoUrl
    };

    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(videoData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('動画を追加しました！');
        
        // Create video object for local state update
        const newVideo = {
          _id: result.video.id,
          title: videoData.title,
          description: videoData.description,
          category: videoData.category,
          instructor: {
            name: instructor.name,
            avatarUrl: instructor.avatarUrl
          },
          thumbnailUrl: thumbnailUrl,
          videoUrl: videoData.sourceUrl,
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
          thumbnailUrl: ''
        });
        setThumbnailFile(null);
        setThumbnailPreview('');
        onClose();
      } else {
        const error = await response.json();
        alert('動画の追加に失敗しました: ' + (error.error || 'エラーが発生しました'));
      }
    } catch (error) {
      console.error('Error adding video:', error);
      alert('動画の追加中にエラーが発生しました');
    }
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
                  disabled={loadingInstructors}
                >
                  <option value="">
                    {loadingInstructors ? '読み込み中...' : 'ゲストを選択'}
                  </option>
                  {instructors.map((instructor) => (
                    <option key={instructor._id} value={instructor._id}>
                      {instructor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                動画URL（YouTube または Vimeo）
              </label>
              <input
                type="url"
                required
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=... または https://vimeo.com/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                YouTubeまたはVimeoの動画URLを入力してください
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サムネイル画像
              </label>
              <div className="space-y-3">
                {/* File upload */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-theme-500 transition-colors"
                  >
                    <FaImage className="text-gray-400" />
                    <span className="text-gray-600">
                      {thumbnailFile ? thumbnailFile.name : '画像を選択またはドラッグ＆ドロップ'}
                    </span>
                  </label>
                </div>

                {/* Preview */}
                {thumbnailPreview && (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview('');
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
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
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
                    placeholder="https://example.com/thumbnail.jpg"
                    disabled={!!thumbnailFile}
                  />
                </div>
                
                <p className="text-xs text-gray-500">
                  ※ 画像を指定しない場合は、デフォルトのサムネイルが使用されます
                </p>
              </div>
            </div>


            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={uploadingThumbnail}
                className="flex-1 bg-theme-600 text-white py-3 rounded-xl hover:bg-theme-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaUpload />
                {uploadingThumbnail ? 'アップロード中...' : '動画を追加'}
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