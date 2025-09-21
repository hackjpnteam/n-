'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaVideo, FaUsers, FaChartBar, FaEdit, FaTrash, FaEye, FaBuilding, FaBriefcase } from 'react-icons/fa';
import { mockVideos, mockInstructors } from '@/lib/mockData';
import AddVideoModal from '@/components/admin/AddVideoModal';
import AddInstructorModal from '@/components/admin/AddInstructorModal';
import Image from 'next/image';
import toast from 'react-hot-toast';

type Member = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  profile?: {
    company?: string;
    position?: string;
    companyUrl?: string;
    bio?: string;
    avatarUrl?: string;
  };
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Get tab from URL params
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const tabFromUrl = searchParams?.get('tab') as 'overview' | 'videos' | 'instructors' | 'members' | 'admins' || 'overview';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'videos' | 'instructors' | 'members' | 'admins'>(tabFromUrl);
  const [members, setMembers] = useState<Member[]>([]);
  const [admins, setAdmins] = useState<Member[]>([]);
  const [videos, setVideos] = useState(mockVideos);
  const [instructors, setInstructors] = useState(mockInstructors);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const allUsers = data.users || [];
        
        // Separate users and admins
        setMembers(allUsers.filter((user: Member) => user.role === 'user'));
        setAdmins(allUsers.filter((user: Member) => user.role === 'admin'));
      } else {
        console.error('Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('このメンバーを削除しますか？')) return;
    
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast.success('メンバーを削除しました');
        fetchMembers(); // Refresh the list
      } else {
        toast.error('削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('削除中にエラーが発生しました');
    }
  };

  const handleToggleRole = async (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        toast.success(`権限を${newRole === 'admin' ? '管理者' : 'ユーザー'}に変更しました`);
        fetchMembers(); // Refresh the list
      } else {
        toast.error('権限変更に失敗しました');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('権限変更中にエラーが発生しました');
    }
  };

  if (status === 'loading') {
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

  if (!session?.user || session.user.role !== 'admin') {
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
          <span className="text-green-100">メンバー</span>
        </div>
        <h3 className="text-3xl font-bold mb-1">{members.length}</h3>
        <p className="text-green-100">人のメンバー</p>
        <button
          onClick={() => setActiveTab('members')}
          className="inline-block mt-4 text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all"
        >
          管理する
        </button>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <FaUsers className="text-3xl" />
          <span className="text-purple-100">管理者</span>
        </div>
        <h3 className="text-3xl font-bold mb-1">{admins.length}</h3>
        <p className="text-purple-100">人の管理者</p>
        <button
          onClick={() => setActiveTab('admins')}
          className="inline-block mt-4 text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all"
        >
          管理する
        </button>
      </div>
    </div>
  );

  const renderVideos = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">動画管理</h2>
        <button 
          onClick={() => setShowAddVideoModal(true)}
          className="bg-theme-600 text-white px-4 py-2 rounded-xl hover:bg-theme-700 transition-all flex items-center gap-2"
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ゲスト</th>
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
                    <button className="text-theme-600 hover:text-theme-700 p-1">
                      <FaEdit />
                    </button>
                    <button className="text-theme-600 hover:text-theme-700 p-1">
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
        <h2 className="text-2xl font-bold text-gray-900">ゲスト管理</h2>
        <button 
          onClick={() => setShowAddInstructorModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all flex items-center gap-2"
        >
          <FaPlus />
          新しいゲストを追加
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
              <button className="flex-1 text-theme-600 hover:text-theme-700 text-sm border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-1">
                <FaEdit />
                編集
              </button>
              <button className="text-theme-600 hover:text-theme-700 text-sm border border-theme-200 px-3 py-2 rounded-lg hover:bg-theme-50 transition-all">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMembers = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">メンバー管理</h2>
        <div className="text-sm text-gray-600">
          総メンバー数: {members.length}名
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">メンバー</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">会社・役職</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">権限</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">登録日</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        {member.profile?.avatarUrl && member.profile.avatarUrl !== '/default-avatar.png' ? (
                          <Image
                            src={member.profile.avatarUrl}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {member.profile?.company && (
                        <div className="flex items-center gap-1 text-gray-900 mb-1">
                          <FaBuilding className="text-xs text-gray-400" />
                          {member.profile.company}
                        </div>
                      )}
                      {member.profile?.position && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaBriefcase className="text-xs text-gray-400" />
                          {member.profile.position}
                        </div>
                      )}
                      {!member.profile?.company && !member.profile?.position && (
                        <span className="text-gray-400">未設定</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.role === 'admin' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {member.role === 'admin' ? '管理者' : 'ユーザー'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(member.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/members/${member.id}`}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                        title="詳細表示"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => handleToggleRole(member.id, member.role)}
                        className="text-orange-600 hover:text-orange-700 p-1 rounded hover:bg-orange-50"
                        title={`${member.role === 'admin' ? 'ユーザー' : '管理者'}に変更`}
                      >
                        <FaEdit />
                      </button>
                      {member.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          title="削除"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {members.length === 0 && !loading && (
            <div className="text-center py-12">
              <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">登録されているメンバーがありません</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAdmins = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">管理者管理</h2>
        <div className="text-sm text-gray-600">
          総管理者数: {admins.length}名
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">管理者</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">会社・役職</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">権限</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">登録日</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        {admin.profile?.avatarUrl && admin.profile.avatarUrl !== '/default-avatar.png' ? (
                          <Image
                            src={admin.profile.avatarUrl}
                            alt={admin.name}
                            fill
                            className="rounded-full object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                            {admin.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{admin.name}</div>
                        <div className="text-sm text-gray-500">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {admin.profile?.company && (
                        <div className="flex items-center gap-1 text-gray-900 mb-1">
                          <FaBuilding className="text-xs text-gray-400" />
                          {admin.profile.company}
                        </div>
                      )}
                      {admin.profile?.position && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaBriefcase className="text-xs text-gray-400" />
                          {admin.profile.position}
                        </div>
                      )}
                      {!admin.profile?.company && !admin.profile?.position && (
                        <span className="text-gray-400">未設定</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      管理者
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(admin.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/members/${admin.id}`}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                        title="詳細表示"
                      >
                        <FaEye />
                      </Link>
                      <button
                        onClick={() => handleToggleRole(admin.id, admin.role)}
                        className="text-orange-600 hover:text-orange-700 p-1 rounded hover:bg-orange-50"
                        title="ユーザーに変更"
                      >
                        <FaEdit />
                      </button>
                      <span className="text-gray-300 p-1" title="管理者は削除できません">
                        <FaTrash />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {admins.length === 0 && !loading && (
            <div className="text-center py-12">
              <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">登録されている管理者がありません</p>
            </div>
          )}
        </div>
      )}
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
            { id: 'members', label: 'メンバー管理', icon: FaUsers },
            { id: 'admins', label: '管理者管理', icon: FaUsers },
            { id: 'instructors', label: 'ゲスト管理', icon: FaUsers }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-theme-600 shadow-sm'
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
      {activeTab === 'members' && renderMembers()}
      {activeTab === 'admins' && renderAdmins()}
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