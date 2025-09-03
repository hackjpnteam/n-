'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import InstructorHero from '@/components/instructors/InstructorHero';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaStar } from 'react-icons/fa';

export default function InstructorDetailPage() {
  const params = useParams();
  const [instructor, setInstructor] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInstructorDetails();
    }
  }, [params.id]);

  const fetchInstructorDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/instructors/${params.id}`);
      const data = await response.json();

      setInstructor(data.instructor);
      setVideos(data.videos);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching instructor details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">講師が見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <InstructorHero instructor={instructor} />

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">担当動画</h2>
        
        {videos.length === 0 ? (
          <p className="text-gray-600">まだ動画がありません</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video._id}
                href={`/videos/${video._id}`}
                className="block rounded-2xl shadow bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video">
                  <Image
                    src={video.thumbnailUrl || '/default-thumbnail.jpg'}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <FaPlay className="text-white text-4xl" />
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{video.stats?.views || 0}回視聴</span>
                    {video.stats?.avgWatchRate && (
                      <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-500" />
                        {video.stats.avgWatchRate.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}