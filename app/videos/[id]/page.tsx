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
      setHasQuiz(true); // Show quiz button for all videos
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
            <video
              ref={videoRef}
              controls
              className="w-full h-full rounded-2xl"
              src={video.sourceUrl}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                  setWatchedPercentage(Math.floor(percentage));
                }
              }}
              onEnded={() => {
                setWatchedPercentage(100);
                toast.success('動画の視聴が完了しました！');
              }}
            >
              お使いのブラウザは動画タグをサポートしていません。
            </video>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${watchedPercentage}%` }}
              />
            </div>
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
              {hasQuiz && (
                <li className="flex items-center gap-2">
                  <FaBook className="text-purple-500" />
                  理解度テストで80%以上のスコアを獲得
                </li>
              )}
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
              {hasQuiz && watchedPercentage >= 80 && (
                <Link
                  href={`/videos/${video._id}/quiz`}
                  className="block p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <p className="font-medium text-purple-900">理解度テストに挑戦</p>
                  <p className="text-sm text-purple-600">知識を確認しましょう</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}