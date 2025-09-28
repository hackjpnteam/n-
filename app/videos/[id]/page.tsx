'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSimpleAuth } from '@/lib/useSimpleAuth';
import Link from 'next/link';
import CompleteButton from '@/components/videos/CompleteButton';
import { FaBook, FaUser, FaClock, FaEye, FaCheckCircle, FaPlayCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useSimpleAuth(); // Optional auth for videos
  const [video, setVideo] = useState<any>(null);
  const [instructor, setInstructor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [hasQuiz, setHasQuiz] = useState(false);
  const [vimeoEmbedFailed, setVimeoEmbedFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // YouTube URLからvideo IDを取得する関数
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Vimeo URLからvideo IDとハッシュを取得する関数
  const getVimeoVideoData = (url: string): { id: string; hash?: string } | null => {
    // Various Vimeo URL formats
    const patterns = [
      /(?:vimeo)\.com\/(?:video\/)?(\d+)(?:\?h=([a-f0-9]+))?/i,
      /player\.vimeo\.com\/video\/(\d+)(?:\?h=([a-f0-9]+))?/i,
      /vimeo\.com\/(\d+)(?:\?h=([a-f0-9]+))?/i
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        console.log('Vimeo data extracted:', { id: match[1], hash: match[2] });
        return {
          id: match[1],
          hash: match[2] // プライバシーハッシュ
        };
      }
    }
    
    console.log('Failed to extract Vimeo data from:', url);
    return null;
  };

  // 後方互換性のために残す
  const getVimeoVideoId = (url: string): string | null => {
    const data = getVimeoVideoData(url);
    return data ? data.id : null;
  };

  // 動画の種類を判定する関数
  const getVideoType = (url: string): 'youtube' | 'vimeo' | 'unknown' => {
    console.log('Checking video type for URL:', url);
    if (getYouTubeVideoId(url)) {
      console.log('Detected YouTube video');
      return 'youtube';
    }
    if (getVimeoVideoId(url)) {
      console.log('Detected Vimeo video');
      return 'vimeo';
    }
    console.log('Unknown video type');
    return 'unknown';
  };

  // Authentication is handled by useSimpleAuth hook

  useEffect(() => {
    if (params.id && !authLoading) {
      fetchVideoDetails();
    }
  }, [params.id, authLoading]);

  const fetchVideoDetails = async () => {
    setLoading(true);
    try {
      // Fetch video details from API with authentication
      const response = await fetch(`/api/videos/${params.id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setVideo(data);
        setInstructor(data.instructor);
        
        // Record view in watch history (only if authenticated)
        if (user) {
          await recordWatchHistory(params.id as string, 0, false);
        }
      } else {
        console.error('Failed to fetch video');
      }
      
      // Check if quiz exists
      setHasQuiz(false); // Hide quiz button for all videos
    } catch (error) {
      console.error('Error fetching video details:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordWatchHistory = async (videoId: string, progress: number, completed: boolean) => {
    try {
      await fetch('/api/watch-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          progress,
          completed
        })
      });
    } catch (error) {
      console.error('Error recording watch history:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">認証確認中...</p>
        </div>
      </div>
    );
  }

  // Allow access with or without authentication

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="aspect-video bg-gray-200 rounded-2xl mb-8"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">動画が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-video bg-black rounded-2xl mb-6 overflow-hidden shadow-2xl">
            {(() => {
              const videoType = getVideoType(video.videoUrl);
              
              if (videoType === 'youtube') {
                const videoId = getYouTubeVideoId(video.videoUrl);
                return (
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => {
                      setTimeout(() => {
                        setWatchedPercentage(100);
                        toast.success('YouTube動画を表示しました！');
                      }, 1000);
                    }}
                  />
                );
              } else if (videoType === 'vimeo') {
                const vimeoData = getVimeoVideoData(video.videoUrl);
                if (!vimeoData) {
                  return (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <div className="text-center">
                        <p className="text-lg mb-2">Vimeo動画IDを取得できませんでした</p>
                        <p className="text-sm text-gray-300">URL: {video.videoUrl}</p>
                      </div>
                    </div>
                  );
                }
                
                // Build Vimeo embed URL with privacy hash if available
                let embedUrl = `https://player.vimeo.com/video/${vimeoData.id}`;
                if (vimeoData.hash) {
                  embedUrl += `?h=${vimeoData.hash}`;
                }
                
                console.log('Using Vimeo embed URL:', embedUrl);
                
                // Try to embed first, fallback to direct link if it fails
                if (vimeoEmbedFailed) {
                  return (
                    <div className="w-full h-full bg-black rounded-2xl overflow-hidden relative">
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <div className="text-center p-8">
                          <div className="mb-6">
                            <svg className="w-20 h-20 mx-auto mb-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.9 12.9c-.2-1.4-.4-2.9-.8-4.3-.3-1.4-.8-2.7-1.5-3.9-.7-1.2-1.6-2.3-2.8-3.1C17.6.8 16.2.3 14.7.1c-1.5-.2-3-.2-4.5 0C8.7.3 7.3.8 6.1 1.6c-1.2.8-2.1 1.9-2.8 3.1-.7 1.2-1.2 2.5-1.5 3.9-.4 1.4-.6 2.9-.8 4.3-.2 1.5-.2 3 0 4.5.2 1.4.4 2.9.8 4.3.3 1.4.8 2.7 1.5 3.9.7 1.2 1.6 2.3 2.8 3.1 1.2.8 2.6 1.3 4.1 1.5 1.5.2 3 .2 4.5 0 1.5-.2 2.9-.7 4.1-1.5 1.2-.8 2.1-1.9 2.8-3.1.7-1.2 1.2-2.5 1.5-3.9.4-1.4.6-2.9.8-4.3.2-1.5.2-3 0-4.5zM9.1 18.4l8.8-5.1c.2-.1.2-.4 0-.5L9.1 7.6c-.2-.1-.4 0-.4.2v10.4c0 .2.2.3.4.2z"/>
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold mb-3 text-white">Vimeo動画</h3>
                          <p className="text-gray-300 mb-2 text-lg">{video.title}</p>
                          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto leading-relaxed">
                            この動画は埋め込み制限されています。Vimeoで直接ご視聴ください。
                          </p>
                          <a 
                            href={video.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-lg shadow-lg transform hover:scale-105"
                            onClick={() => {
                              setWatchedPercentage(100);
                              toast.success('Vimeoで動画を開きました！');
                            }}
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
                            </svg>
                            Vimeoで視聴する
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src={embedUrl}
                    title={video.title}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    allowFullScreen
                    onLoad={(e) => {
                      console.log('Vimeo iframe loaded successfully');
                      setTimeout(() => {
                        setWatchedPercentage(100);
                        toast.success('Vimeo動画を表示しました！');
                      }, 1000);
                    }}
                    onError={(e) => {
                      console.log('Vimeo embed failed, switching to fallback');
                      setVimeoEmbedFailed(true);
                    }}
                  />
                );
              } else {
                return (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <p className="text-lg mb-2">サポートされていない動画形式です</p>
                      <p className="text-sm text-gray-300">YouTubeまたはVimeoのURLを入力してください</p>
                    </div>
                  </div>
                );
              }
            })()}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
          
          <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaEye className="text-theme-500" />
              {video.stats?.views || 0}回視聴
            </span>
            <span className="flex items-center gap-1">
              <FaClock className="text-green-500" />
              {Math.floor(video.durationSec / 60)}分
            </span>
            <span className="flex items-center gap-1">
              <FaCheckCircle className="text-purple-500" />
              {video.stats?.completions || 0}人完了
            </span>
          </div>

          {/* 視聴進捗 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">視聴進捗</span>
              <span className="text-sm font-bold text-theme-600">{watchedPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${watchedPercentage}%` }}
              />
            </div>
            {watchedPercentage >= 80 && (
              <p className="text-xs text-green-600 mt-2">もう少しで完了です！</p>
            )}
          </div>

          <p className="text-gray-700 mb-6">{video.description}</p>

          {/* 学習ポイント */}
          {video.learningPoints && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBook className="text-theme-500" />
                この動画で学べること
              </h3>
              <ul className="space-y-2">
                {video.learningPoints.map((point: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {user ? (
              <CompleteButton 
                videoId={video._id} 
                onComplete={() => setWatchedPercentage(100)}
              />
            ) : (
              <Link
                href="/auth/login"
                className="rounded-2xl px-6 py-3 font-semibold shadow-lg bg-gradient-to-r from-theme-600 to-theme-700 text-white hover:from-theme-700 hover:to-theme-800 transition-all flex items-center gap-2 transform hover:scale-105"
              >
                <FaCheckCircle className="text-lg" />
                ログインして進捗を記録
              </Link>
            )}
            
            {hasQuiz && user && (
              <Link
                href={`/videos/${video._id}/quiz`}
                className="rounded-2xl px-6 py-3 font-semibold shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center gap-2 transform hover:scale-105"
              >
                <FaBook className="text-lg" />
                理解度テストを受ける
              </Link>
            )}
          </div>

          {/* 完了条件の説明 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">コース完了の条件:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <FaPlayCircle className="text-theme-500" />
                動画を最後まで視聴
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          {instructor && (
            <div className="rounded-2xl p-6 shadow-lg bg-gradient-to-br from-white to-blue-50 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaUser className="text-theme-500" />
                ゲスト情報
              </h3>
              <Link
                href={`/instructors/${instructor._id}`}
                className="block hover:bg-white/50 -m-2 p-3 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={instructor.avatarUrl}
                    alt={instructor.name || 'Instructor'}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold hidden">
                    {instructor.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{instructor.name || 'Unknown Instructor'}</p>
                    {instructor.title && (
                      <p className="text-sm text-gray-600">{instructor.title}</p>
                    )}
                  </div>
                </div>
                {instructor.bio && (
                  <p className="text-sm text-gray-700 mt-3">{instructor.bio}</p>
                )}
              </Link>
            </div>
          )}

          {/* 関連コンテンツ */}
          <div className="rounded-2xl p-6 shadow bg-white">
            <h3 className="font-bold text-gray-900 mb-4">次のステップ</h3>
            <div className="space-y-3">
              <Link
                href="/videos"
                className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <p className="font-medium text-gray-900">他の動画を見る</p>
                <p className="text-sm text-gray-600">さらに学習を進めましょう</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}