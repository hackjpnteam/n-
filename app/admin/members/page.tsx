'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaVideo, FaCheckCircle, FaClock, FaTrophy, FaBook, FaChartLine, FaUsers, FaEdit, FaEye, FaSearch, FaFilter, FaDownload, FaUserShield, FaUserCog, FaTrash } from 'react-icons/fa';
import { useSimpleAuth } from '@/lib/useSimpleAuth';
import toast from 'react-hot-toast';

function MembersContent() {
  const { user, loading: authLoading } = useSimpleAuth(true);
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>(
    roleParam === 'admin' ? 'admin' : roleParam === 'user' ? 'user' : 'all'
  );

  useEffect(() => {
    fetchMembers();
  }, []);

  // Update filter when URL params change
  useEffect(() => {
    if (roleParam === 'admin') {
      setFilterRole('admin');
    } else if (roleParam === 'user') {
      setFilterRole('user');
    }
  }, [roleParam]);

  const fetchMembers = async () => {
    console.log('🔄 [FETCH-MEMBERS] Starting fetchMembers...');
    setLoading(true);
    try {
      // Try to fetch actual user data first
      const response = await fetch('/api/admin/members', {
        credentials: 'include'
      });
      
      console.log('📡 [FETCH-MEMBERS] API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 [FETCH-MEMBERS] API Response data:', data);
        console.log('👥 [FETCH-MEMBERS] Members count:', data.members?.length || 0);
        
        // Debug role distribution
        if (data.members) {
          const adminCount = data.members.filter((m: any) => m.role === 'admin').length;
          const userCount = data.members.filter((m: any) => m.role === 'user' || !m.role).length;
          console.log('🔐 [FETCH-MEMBERS] Role distribution:', { adminCount, userCount });
          
          data.members.forEach((member: any, index: number) => {
            console.log(`👤 [FETCH-MEMBERS] Member ${index}:`, {
              id: member.id,
              name: member.name,
              email: member.email,
              role: member.role || 'user'
            });
          });
        }
        
        setMembers(data.members || []);
        console.log('✅ [FETCH-MEMBERS] Members state updated');
      } else {
        const errorData = await response.text();
        console.error('❌ [FETCH-MEMBERS] API request failed:', response.status, errorData);
        
        // Don't use mock data anymore - just show empty state
        setMembers([]);
      }
    } catch (error) {
      console.error('❌ [FETCH-MEMBERS] Error fetching members:', error);
      // Set empty array on error
      setMembers([]);
    } finally {
      setLoading(false);
      console.log('🏁 [FETCH-MEMBERS] Completed');
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`${memberName}を削除しますか？この操作は取り消せません。`)) {
      return;
    }

    try {
      console.log(`🗑️ [DELETE-MEMBER] Deleting ${memberName} (${memberId})`);
      
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      console.log(`📡 [DELETE-MEMBER] Response status:`, response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ [DELETE-MEMBER] Error response:`, errorData);
        throw new Error('メンバーの削除に失敗しました');
      }

      const result = await response.json();
      console.log(`✅ [DELETE-MEMBER] Success:`, result);

      // Update local state immediately
      setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
      toast.success(`${memberName}を削除しました`);
      
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('メンバーの削除に失敗しました');
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'user' | 'admin', memberName: string) => {
    if (!confirm(`${memberName}の権限を${newRole === 'admin' ? '管理者' : '一般ユーザー'}に変更しますか？`)) {
      return;
    }

    try {
      console.log(`🔄 [ROLE-CHANGE] Changing role for ${memberName} (${memberId}) to ${newRole}`);
      
      const response = await fetch(`/api/admin/members/${memberId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });

      console.log(`📡 [ROLE-CHANGE] Response status:`, response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`❌ [ROLE-CHANGE] Error response:`, errorData);
        throw new Error('権限変更に失敗しました');
      }

      const result = await response.json();
      console.log(`✅ [ROLE-CHANGE] Success:`, result);

      // Update local state immediately for instant UI feedback
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === memberId 
            ? { ...member, role: newRole }
            : member
        )
      );

      toast.success(`${memberName}の権限を変更しました`);
      
      // Also refetch to ensure data consistency
      setTimeout(() => {
        console.log(`🔄 [ROLE-CHANGE] Refetching members after role change`);
        fetchMembers();
      }, 500);
      
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('権限変更に失敗しました');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.profile?.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    
    return matchesSearch && matchesFilter && matchesRole;
  });

  const sortedMembers = filteredMembers.sort((a, b) => b.completionRate - a.completionRate);

  // Statistics based on current filter
  const statsMembers = roleParam === 'admin' ? members.filter(m => m.role === 'admin') : members;
  const stats = {
    totalMembers: statsMembers.length,
    activeMembers: statsMembers.filter(m => m.status === 'active').length,
    averageCompletion: statsMembers.length > 0 ? Math.round(statsMembers.reduce((sum, m) => sum + m.completionRate, 0) / statsMembers.length) : 0,
    totalWatchTime: statsMembers.reduce((sum, m) => sum + m.totalWatchTime, 0)
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {roleParam === 'admin' ? '管理者一覧' : '会員一覧'}
        </h1>
        <p className="text-gray-600">
          {roleParam === 'admin' 
            ? '管理者ユーザーの権限と状況を管理できます' 
            : 'コミュニティメンバーの学習状況を管理できます'
          }
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-2">
            {roleParam === 'admin' ? <FaUserShield className="text-2xl" /> : <FaUsers className="text-2xl" />}
            <span className="text-blue-100 text-sm">
              {roleParam === 'admin' ? '総管理者数' : '総会員数'}
            </span>
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
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-theme-500 focus:border-transparent"
            >
              <option value="all">全ての権限</option>
              <option value="user">一般ユーザー</option>
              <option value="admin">管理者</option>
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
      {sortedMembers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center">
            {roleParam === 'admin' ? <FaUserShield className="text-5xl text-gray-300 mx-auto mb-4" /> : <FaUsers className="text-5xl text-gray-300 mx-auto mb-4" />}
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {roleParam === 'admin' ? 'まだ管理者がいません' : 'まだメンバーがいません'}
            </h3>
            <p className="text-gray-500">
              {roleParam === 'admin' 
                ? '既存ユーザーに管理者権限を付与すると、ここに表示されます。'
                : '新規ユーザーが登録すると、ここに表示されます。'
              }
            </p>
          </div>
        </div>
      ) : (
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
                  権限
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
                        {member.profile?.avatarUrl && member.profile.avatarUrl !== '/default-avatar.png' ? (
                          <Image
                            src={member.profile.avatarUrl}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover"
                            sizes="40px"
                            unoptimized
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = 'w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold';
                                fallback.textContent = member.name.charAt(0);
                                parent.appendChild(fallback);
                              }
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
                      member.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {member.role === 'admin' ? '管理者' : '一般ユーザー'}
                    </span>
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
                      {member.role === 'admin' ? (
                        <button 
                          onClick={() => handleRoleChange(member.id, 'user', member.name)}
                          className="text-orange-600 hover:text-orange-900 p-1" 
                          title="管理者権限を削除"
                        >
                          <FaUserCog />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleRoleChange(member.id, 'admin', member.name)}
                          className="text-purple-600 hover:text-purple-900 p-1" 
                          title="管理者権限を付与"
                        >
                          <FaUserShield />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteMember(member.id, member.name)}
                        className="text-red-600 hover:text-red-900 p-1" 
                        title="メンバーを削除"
                      >
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
      )}

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

export default function MembersPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <MembersContent />
    </Suspense>
  );
}