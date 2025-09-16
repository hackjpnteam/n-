'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaVideo, FaCheckCircle, FaClock, FaTrophy, FaBook, FaChartLine, FaUsers, FaEdit, FaEye, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      // Try to fetch actual user data first
      const response = await fetch('/api/admin/members', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        console.log('Members data:', data.members);
        
        // Debug each member's avatar URL
        data.members?.forEach((member: any, index: number) => {
          console.log(`Member ${index} (${member.name}):`, {
            id: member.id,
            avatarUrl: member.profile?.avatarUrl,
            hasProfile: !!member.profile,
            hasAvatarUrl: !!member.profile?.avatarUrl
          });
        });
        
        setMembers(data.members || []);
      } else {
        console.log('API request failed, using mock data');
        // Fallback to mock data for demo
        const mockMembers = [
          {
            id: '1',
            name: '田中学習太郎',
            email: 'tanaka@example.com',
            profile: {
              company: '株式会社テクノロジー',
              position: 'CTO',
              avatarUrl: '/uploads/avatars/87831af6-5b11-4e60-9b6a-7f40f220aee6-1757645975379.png'
            },
            joinedAt: '2024-01-15',
            lastAccess: '2024-03-15',
            completedVideos: 6,
            totalVideos: 6,
            completionRate: 100,
            quizAverage: 85,
            totalWatchTime: 270,
            status: 'active'
          },
          {
            id: '2',
            name: '佐藤勉強花子',
            email: 'sato@example.com',
            profile: {
              company: '株式会社マーケティング',
              position: '取締役',
              avatarUrl: '/uploads/avatars/87831af6-5b11-4e60-9b6a-7f40f220aee6-1757646197522.png'
            },
            joinedAt: '2024-01-20',
            lastAccess: '2024-03-14',
            completedVideos: 5,
            totalVideos: 6,
            completionRate: 83,
            quizAverage: 78,
            totalWatchTime: 225,
            status: 'active'
          },
          {
            id: '3',
            name: '鈴木学習次郎',
            email: 'suzuki@example.com',
            profile: {
              company: '株式会社イノベーション',
              position: '代表取締役',
              avatarUrl: '/default-avatar.png'
            },
            joinedAt: '2024-02-01',
            lastAccess: '2024-03-10',
            completedVideos: 4,
            totalVideos: 6,
            completionRate: 67,
            quizAverage: 72,
            totalWatchTime: 180,
            status: 'active'
          },
          {
            id: '4',
            name: '高橋知識太郎',
            email: 'takahashi@example.com',
            profile: {
              company: '株式会社フィンテック',
              position: 'VP',
              avatarUrl: '/default-avatar.png'
            },
            joinedAt: '2024-02-10',
            lastAccess: '2024-02-28',
            completedVideos: 3,
            totalVideos: 6,
            completionRate: 50,
            quizAverage: 68,
            totalWatchTime: 135,
            status: 'inactive'
          },
          {
            id: '5',
            name: '伊藤学習美',
            email: 'ito@example.com',
            profile: {
              company: '株式会社スタートアップ',
              position: 'CEO',
              avatarUrl: '/default-avatar.png'
            },
            joinedAt: '2024-02-15',
            lastAccess: '2024-03-12',
            completedVideos: 2,
            totalVideos: 6,
            completionRate: 33,
            quizAverage: 65,
            totalWatchTime: 90,
            status: 'active'
          }
        ];
        
        setMembers(mockMembers);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      // Set empty array on error
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.profile?.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const sortedMembers = filteredMembers.sort((a, b) => b.completionRate - a.completionRate);

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'active').length,
    averageCompletion: Math.round(members.reduce((sum, m) => sum + m.completionRate, 0) / members.length),
    totalWatchTime: members.reduce((sum, m) => sum + m.totalWatchTime, 0)
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">会員一覧</h1>
        <p className="text-gray-600">コミュニティメンバーの学習状況を管理できます</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <FaUsers className="text-2xl" />
            <span className="text-blue-100 text-sm">総会員数</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.totalMembers}</h3>
          <p className="text-blue-100 text-sm">人</p>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <FaCheckCircle className="text-2xl" />
            <span className="text-green-100 text-sm">アクティブ</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.activeMembers}</h3>
          <p className="text-green-100 text-sm">人</p>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <FaTrophy className="text-2xl" />
            <span className="text-purple-100 text-sm">平均完了率</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.averageCompletion}%</h3>
          <p className="text-purple-100 text-sm">全体平均</p>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between mb-2">
            <FaClock className="text-2xl" />
            <span className="text-orange-100 text-sm">総視聴時間</span>
          </div>
          <h3 className="text-3xl font-bold">{stats.totalWatchTime}</h3>
          <p className="text-orange-100 text-sm">分</p>
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="名前、メール、会社名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            >
              <option value="all">全て</option>
              <option value="active">アクティブ</option>
              <option value="inactive">非アクティブ</option>
            </select>
            
            <button className="px-4 py-3 bg-theme-600 text-white rounded-xl hover:bg-theme-700 transition-colors flex items-center gap-2">
              <FaDownload />
              CSV出力
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4">
          {filteredMembers.length}件中 {Math.min(filteredMembers.length, 20)}件を表示
        </div>
      </div>

      {/* メンバー一覧テーブル */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  順位
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  メンバー
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  会社・役職
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  進捗
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  完了率
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均スコア
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終アクセス
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedMembers.slice(0, 20).map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index + 1 <= 3 && (
                        <span className={`mr-2 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          'text-amber-600'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 mr-4">
                        {member.profile?.avatarUrl ? (
                          <Image
                            src={member.profile.avatarUrl}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover"
                            sizes="40px"
                            onLoad={() => {
                              console.log('✅ Image loaded successfully:', member.profile.avatarUrl);
                            }}
                            onError={(e) => {
                              console.error('❌ Failed to load image:', member.profile.avatarUrl);
                              console.error('Image error event:', e);
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.profile?.company || '-'}</div>
                    <div className="text-sm text-gray-500">{member.profile?.position || '-'}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {member.completedVideos} / {member.totalVideos}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-theme-600 h-2 rounded-full"
                        style={{ width: `${member.completionRate}%` }}
                      />
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.completionRate >= 80 ? 'bg-green-100 text-green-800' :
                      member.completionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {member.completionRate}%
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.quizAverage}点
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.lastAccess).toLocaleDateString('ja-JP')}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status === 'active' ? 'アクティブ' : '非アクティブ'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-theme-600 hover:text-theme-900 p-1" title="詳細表示">
                        <FaEye />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1" title="編集">
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ページネーション */}
      {filteredMembers.length > 20 && (
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              前へ
            </button>
            <button className="px-4 py-2 bg-theme-600 text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              次へ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}