'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaVideo, FaChartBar, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (!data.user) {
        router.push('/auth/login');
        return;
      }
      
      if (data.user.role !== 'admin') {
        toast.error('管理者権限が必要です');
        router.push('/');
        return;
      }
      
      setUser(data.user);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const adminMenus = [
    {
      title: '講師管理',
      description: 'ゲスト講師の追加・編集・削除',
      icon: FaUsers,
      href: '/admin/instructors',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: '動画管理',
      description: '研修動画の追加・編集・削除',
      icon: FaVideo,
      href: '/admin/videos',
      color: 'from-green-500 to-green-600'
    },
    {
      title: '統計情報',
      description: '視聴統計とユーザー分析',
      icon: FaChartBar,
      href: '/admin/analytics',
      color: 'from-purple-500 to-purple-600',
      disabled: true
    },
    {
      title: 'システム設定',
      description: 'アプリケーション設定',
      icon: FaCog,
      href: '/admin/settings',
      color: 'from-orange-500 to-orange-600',
      disabled: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
        <p className="text-gray-600 mt-2">ようこそ、{user.name}さん</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminMenus.map((menu) => (
          <Link
            key={menu.title}
            href={menu.disabled ? '#' : menu.href}
            className={`group ${menu.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className={`bg-gradient-to-br ${menu.color} rounded-2xl p-6 text-white transform transition-all ${!menu.disabled ? 'hover:scale-105 hover:shadow-xl' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <menu.icon className="text-3xl" />
                {menu.disabled && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">準備中</span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{menu.title}</h3>
              <p className="text-white/80 text-sm">{menu.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">クイックアクション</h2>
        <div className="space-y-3">
          <Link
            href="/admin/instructors/new"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">新規講師を追加</div>
              <div className="text-sm text-gray-600">ゲスト講師を新しく登録します</div>
            </div>
          </Link>
          
          <Link
            href="/admin/videos/new"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaVideo className="text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">新規動画を追加</div>
              <div className="text-sm text-gray-600">研修動画を新しく登録します</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/mypage"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-all"
        >
          マイページに戻る
        </Link>
      </div>
    </div>
  );
}