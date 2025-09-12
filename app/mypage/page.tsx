'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaVideo, FaCheckCircle, FaClock, FaTrophy, FaBook, FaChartLine, FaPlay, FaHistory, FaCog, FaEdit, FaSave, FaBuilding, FaBriefcase, FaGlobe, FaCamera } from 'react-icons/fa';
import useSWR from 'swr';
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [watchedVideos, setWatchedVideos] = useState<any[]>([]);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    company: '',
    position: '',
    companyUrl: '',
    bio: '',
    avatarUrl: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (data.user) {
          setUser(data.user);
          // Initialize profile data
          setProfileData({
            name: data.user.name || '',
            company: data.user.profile?.company || '',
            position: data.user.profile?.position || '',
            companyUrl: data.user.profile?.companyUrl || '',
            bio: data.user.profile?.bio || '',
            avatarUrl: data.user.profile?.avatarUrl || ''
          });
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch watch history from API
  useEffect(() => {
    if (user) {
      fetchWatchHistory();
    }
  }, [user]);

  const fetchWatchHistory = async () => {
    try {
      const response = await fetch('/api/watch-history', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setRecentVideos(data.history || []);
      }
    } catch (error) {
      console.error('Error fetching watch history:', error);
    }
  };

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

  const handleSaveProfile = async () => {
    console.log('Starting profile save...');
    console.log('Profile data to save:', profileData);
    setSavingProfile(true);
    try {
      console.log('Making API call to /api/profile...');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });

      console.log('API response status:', response.status);
      console.log('API response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Profile saved successfully:', data);
        setUser(data.user);
        // Update profileData state to reflect the saved values
        setProfileData({
          name: data.user.name || '',
          company: data.user.profile?.company || '',
          position: data.user.profile?.position || '',
          companyUrl: data.user.profile?.companyUrl || '',
          bio: data.user.profile?.bio || '',
          avatarUrl: data.user.profile?.avatarUrl || ''
        });
        setEditingProfile(false);
        toast.success('プロフィールを保存しました！');
      } else {
        const errorData = await response.text();
        console.error('Failed to save profile:', response.status, errorData);
        toast.error('プロフィールの保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('プロフィールの保存中にエラーが発生しました');
    } finally {
      setSavingProfile(false);
      console.log('Profile save process completed');
    }
  };

  const handleCancelEdit = () => {
    // Reset profile data to original values
    setProfileData({
      name: user.name || '',
      company: user.profile?.company || '',
      position: user.profile?.position || '',
      companyUrl: user.profile?.companyUrl || '',
      bio: user.profile?.bio || '',
      avatarUrl: user.profile?.avatarUrl || ''
    });
    setEditingProfile(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log('Starting avatar upload...');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful, avatar URL:', data.avatarUrl);
        
        // Update profileData state for immediate UI update
        setProfileData({ ...profileData, avatarUrl: data.avatarUrl });
        
        // Save the avatar URL to user profile
        const updatedProfileData = { 
          name: user.name,
          company: user.profile?.company || '',
          position: user.profile?.position || '',
          companyUrl: user.profile?.companyUrl || '',
          bio: user.profile?.bio || '',
          avatarUrl: data.avatarUrl 
        };
        
        const saveResponse = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updatedProfileData)
        });

        console.log('Profile save response status:', saveResponse.status);
        
        if (saveResponse.ok) {
          const savedData = await saveResponse.json();
          console.log('Profile saved successfully:', savedData);
          setUser(savedData.user);
          toast.success('プロフィール画像を保存しました！');
        } else {
          console.error('Failed to save profile with avatar');
          toast.error('プロフィールの保存に失敗しました');
        }
        
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        toast.error(errorData.error || 'アップロードに失敗しました');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('アップロード中にエラーが発生しました');
    }
  };

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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">マイページ</h1>
          <p className="text-gray-600">あなたの学習状況を確認できます</p>
        </div>
        {user.role === 'admin' && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
          >
            <FaCog />
            管理画面
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {user.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt="プロフィール画像"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-300"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <button
              onClick={() => setEditingProfile(true)}
              className="text-blue-100 hover:text-white transition-colors"
              title="プロフィール編集"
            >
              <FaEdit />
            </button>
          </div>
          <h3 className="text-xl font-bold mb-1">{user.name}</h3>
          <p className="text-blue-100">{user.email}</p>
          {user.profile?.company && (
            <p className="text-blue-100 text-sm mt-2">{user.profile.company}</p>
          )}
          {user.profile?.position && (
            <p className="text-blue-100 text-sm">{user.profile.position}</p>
          )}
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

      {/* 直近の視聴履歴セクション */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <FaHistory className="text-orange-600 text-xl" />
          <h2 className="text-xl font-bold text-gray-900">直近の視聴研修</h2>
        </div>
        
        {recentVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentVideos.slice(0, 6).map((item: any) => (
              <Link
                key={item._id}
                href={`/videos/${item.video?._id}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all group-hover:shadow-md">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    {item.video?.thumbnailUrl && (
                      <img 
                        src={item.video.thumbnailUrl} 
                        alt={item.video?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {item.video?.title || '動画タイトル'}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {item.video?.instructor?.name || '講師名'}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {new Date(item.watchedAt).toLocaleDateString('ja-JP')}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      item.completed 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.completed ? '完了' : `${item.progress}%`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaHistory className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">まだ視聴した研修がありません</p>
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 bg-theme-600 text-white px-4 py-2 rounded-xl hover:bg-theme-700 transition-all"
            >
              <FaPlay />
              研修動画を見る
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <FaVideo className="text-theme-600 text-xl" />
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
                      className="text-sm bg-theme-600 text-white px-3 py-1 rounded-lg hover:bg-theme-700 transition-all"
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
                className="inline-flex items-center gap-2 bg-theme-600 text-white px-4 py-2 rounded-xl hover:bg-theme-700 transition-all"
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
                <FaClock className="text-theme-500" />
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

      {/* プロフィール編集モーダル */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">プロフィール編集</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* プロフィール画像 */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {profileData.avatarUrl ? (
                      <img
                        src={profileData.avatarUrl}
                        alt="プロフィール画像"
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                      <FaCamera className="text-xs" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    クリックして画像を変更（最大5MB、JPEG/PNG/GIF/WebP）
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2" />
                    お名前
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="お名前を入力してください"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="inline mr-2" />
                    会社名
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="会社名を入力してください"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBriefcase className="inline mr-2" />
                    役職
                  </label>
                  <input
                    type="text"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="役職を入力してください"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaGlobe className="inline mr-2" />
                    会社URL
                  </label>
                  <input
                    type="url"
                    value={profileData.companyUrl}
                    onChange={(e) => setProfileData({ ...profileData, companyUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    自己紹介
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="自己紹介文を入力してください"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  {savingProfile ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}