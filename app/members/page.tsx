'use client';

// Force Vercel rebuild - Members page for community feature

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaBuilding, FaBriefcase, FaGlobe, FaEnvelope, FaCrown, FaUsers, FaStar } from 'react-icons/fa';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  profile: {
    company: string;
    position: string;
    companyUrl: string;
    bio: string;
    avatarUrl?: string;
  };
}

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        console.log('Members data:', data.members);
        if (data.members) {
          data.members.forEach((member: any) => {
            console.log(`Member: ${member.name}, avatarUrl: "${member.profile?.avatarUrl}"`);
          });
        }
        setMembers(data.members || []);
        setCurrentUserId(data.currentUserId || '');
        console.log(`Loaded ${data.members?.length || 0} members`);
      } else if (response.status === 401) {
        console.log('Authentication required, redirecting to login');
        router.push('/auth/login');
      } else {
        console.error('Failed to fetch members:', response.status, response.statusText);
        // Still set empty array to show empty state
        setMembers([]);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      // Set empty array to show empty state instead of loading forever
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaUsers className="text-3xl text-theme-600" />
          <h1 className="text-3xl font-bold text-gray-900">会員一覧</h1>
        </div>
        <p className="text-gray-600">
          コミュニティメンバーとつながり、交流を深めましょう
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {members.length}名のメンバーが参加しています
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className={`bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
              member.id === currentUserId 
                ? 'ring-2 ring-theme-200' 
                : 'hover:shadow-xl'
            }`}
          >
            {/* Large Profile Image */}
            <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
              {(member.profile.avatarUrl && member.profile.avatarUrl !== '') ? (
                <img
                  src={member.profile.avatarUrl}
                  alt={`${member.name}のプロフィール画像`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <img
                  src="/default-avatar.png"
                  alt={`${member.name}のプロフィール画像`}
                  className="w-full h-full object-cover"
                />
              )}
              
              
              {/* Registration Date */}
              <div className="absolute top-4 right-4">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <span className="text-xs font-semibold text-gray-900">
                    since {new Date(member.createdAt).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  {member.role === 'admin' && (
                    <FaCrown className="text-yellow-500 text-sm" title="管理者" />
                  )}
                  {member.id === currentUserId && (
                    <span className="text-xs bg-theme-100 text-theme-700 px-2 py-1 rounded-full">
                      あなた
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  since {new Date(member.createdAt).toLocaleDateString('en-US', {
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {/* Position and Company */}
              <div className="mb-4">
                {member.profile.position && (
                  <p className="text-gray-700 font-medium mb-1">{member.profile.position}</p>
                )}
                {member.profile.company && (
                  <p className="text-gray-500 text-sm">{member.profile.company}</p>
                )}
              </div>

              {/* Bio */}
              {member.profile.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {member.profile.bio}
                </p>
              )}

              {/* Company URL */}
              {member.profile.companyUrl && (
                <div className="mb-4">
                  <a 
                    href={member.profile.companyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-theme-600 hover:text-theme-700 hover:underline text-sm flex items-center gap-1"
                  >
                    <FaGlobe className="text-xs" />
                    {(() => {
                      try {
                        return new URL(member.profile.companyUrl).hostname.replace('www.', '');
                      } catch {
                        return member.profile.companyUrl;
                      }
                    })()}
                  </a>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && !loading && (
        <div className="text-center py-12">
          <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            まだメンバーがいません
          </h3>
          <p className="text-gray-500 mb-4">
            コミュニティメンバーを表示するには、プロフィールで会社名を設定してください
          </p>
          <button
            onClick={() => router.push('/mypage')}
            className="bg-theme-600 text-white px-6 py-2 rounded-xl hover:bg-theme-700 transition-colors"
          >
            プロフィール設定
          </button>
        </div>
      )}
    </div>
  );
}