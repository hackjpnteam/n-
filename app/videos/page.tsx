'use client';

import { useState, useMemo } from 'react';
import { mockVideos } from '../../lib/mockData';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = Array.from(new Set(mockVideos.map(video => video.category)));

  const filteredVideos = useMemo(() => {
    return mockVideos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !selectedCategory || video.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">動画一覧</h1>
      
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="動画タイトルやタグで検索"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべてのカテゴリ</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(mockVideos.flatMap(video => video.tags))).map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        {filteredVideos.length}件の動画が見つかりました
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Link key={video._id} href={`/videos/${video._id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{video.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{video.instructor.name}</span>
                  <span>{Math.floor(video.durationSec / 60)}分</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                  <span>{video.stats.views}回視聴</span>
                  <span>平均視聴率 {video.stats.avgWatchRate}%</span>
                </div>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {video.category}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}