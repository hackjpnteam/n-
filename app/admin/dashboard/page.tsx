'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaVideo, FaUsers, FaChartBar, FaEdit, FaTrash } from 'react-icons/fa';
import { mockVideos, mockInstructors } from '@/lib/mockData';
import AddVideoModal from '@/components/admin/AddVideoModal';
import AddInstructorModal from '@/components/admin/AddInstructorModal';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'instructors'>('overview');
  const [videos, setVideos] = useState(mockVideos);
  const [instructors, setInstructors] = useState(mockInstructors);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);

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

  if (!user || user.role !== 'admin') {
    router.push('/');
    return null;
  }

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <FaVideo className="text-3xl" />
          <span className="text-blue-100">動画</span>
        </div>
        <h3 className="text-3xl font-bold mb-1">{videos.length}</h3>
        <p className="text-blue-100">本の動画</p>
        <Link
          href="#"
          onClick={() => setActiveTab('videos')}
          className="inline-block mt-4 text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all"
        >
          管理する
        </Link>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <FaUsers className="text-3xl" />
          <span className="text-green-100">講師</span>
        </div>
        <h3 className="text-3xl font-bold mb-1">{instructors.length}</h3>
        <p className="text-green-100">人の講師</p>
        <button
          onClick={() => setActiveTab('instructors')}
          className="inline-block mt-4 text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all"
        >
          管理する
        </button>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <FaChartBar className="text-3xl" />
          <span className="text-purple-100">分析</span>
        </div>
        <h3 className="text-3xl font-bold mb-1">統計</h3>
        <p className="text-purple-100">データを確認</p>
        <Link
          href="/admin/analytics"
          className="inline-block mt-4 text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all"
        >
          表示する
        </Link>
      </div>
    </div>
  );

  const renderVideos = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">動画管理</h2>
        <button 
          onClick={() => setShowAddVideoModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-all flex items-center gap-2"
        >
          <FaPlus />
          新しい動画を追加
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">タイトル</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">講師</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">時間</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">視聴回数</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {videos.map((video) => (
              <tr key={video._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{video.title}</div>
                  <div className="text-sm text-gray-500">{video.category}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{video.instructor.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{Math.floor(video.durationSec / 60)}分</td>
                <td className="px-6 py-4 text-sm text-gray-900">{video.stats.views}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="text-orange-600 hover:text-orange-700 p-1">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-700 p-1">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInstructors = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">講師管理</h2>
        <button 
          onClick={() => setShowAddInstructorModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
        >
          <FaPlus />
          新しい講師を追加
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <div key={instructor._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={instructor.avatarUrl}
                alt={instructor.name}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl hidden">
                {instructor.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{instructor.name}</h3>
                <p className="text-sm text-gray-600">{instructor.title}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-4">{instructor.bio}</p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {instructor.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex-1 text-orange-600 hover:text-orange-700 text-sm border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-1">
                <FaEdit />
                編集
              </button>
              <button className="text-red-600 hover:text-red-700 text-sm border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">管理ダッシュボード</h1>
        <p className="text-gray-600">コンテンツと講師を管理できます</p>
      </div>

      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: 'overview', label: '概要', icon: FaChartBar },
            { id: 'videos', label: '動画管理', icon: FaVideo },
            { id: 'instructors', label: '講師管理', icon: FaUsers }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'videos' && renderVideos()}
      {activeTab === 'instructors' && renderInstructors()}
      
      <AddVideoModal
        isOpen={showAddVideoModal}
        onClose={() => setShowAddVideoModal(false)}
        onAdd={(newVideo) => setVideos([...videos, newVideo])}
      />
      
      <AddInstructorModal
        isOpen={showAddInstructorModal}
        onClose={() => setShowAddInstructorModal(false)}
        onAdd={(newInstructor) => setInstructors([...instructors, newInstructor])}
      />
    </div>
  );
}