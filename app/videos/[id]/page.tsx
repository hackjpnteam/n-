'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CompleteButton from '@/components/videos/CompleteButton';
import { FaBook, FaUser, FaClock, FaEye, FaCheckCircle, FaPlayCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function VideoPage() {
  const params = useParams();
  const [video, setVideo] = useState<any>(null);
  const [instructor, setInstructor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [hasQuiz, setHasQuiz] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // YouTube URLからvideo IDを取得する関数
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Vimeo URLからvideo IDを取得する関数
  const getVimeoVideoId = (url: string): string | null => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // 動画の種類を判定する関数
  const getVideoType = (url: string): 'youtube' | 'vimeo' | 'unknown' => {
    if (getYouTubeVideoId(url)) return 'youtube';
    if (getVimeoVideoId(url)) return 'vimeo';
    return 'unknown';
  };

  useEffect(() => {
    if (params.id) {
      fetchVideoDetails();
    }
  }, [params.id]);

  const fetchVideoDetails = async () => {
    setLoading(true);
    try {
      // Fetch video details from API
      const response = await fetch(`/api/videos/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setVideo(data);
        setInstructor(data.instructor);
        
        // Record view in watch history
        await recordWatchHistory(params.id as string, 0, false);
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
                const videoId = getVimeoVideoId(video.videoUrl);
                return (
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src={`https://player.vimeo.com/video/${videoId}?h=0`}
                    title={video.title}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onLoad={() => {
                      setTimeout(() => {
                        setWatchedPercentage(100);
                        toast.success('Vimeo動画を表示しました！');
                      }, 1000);
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
            <CompleteButton 
              videoId={video._id} 
              onComplete={() => setWatchedPercentage(100)}
            />
            
            {hasQuiz && (
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
                    alt={instructor.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold hidden">
                    {instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{instructor.name}</p>
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