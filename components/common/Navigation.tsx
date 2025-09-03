'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUsers, FaPlay, FaChartBar, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '@/lib/useAuth';
import toast from 'react-hot-toast';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const navItems = [
    { href: '/', label: 'ホーム', icon: FaHome },
    { href: '/instructors', label: '講師', icon: FaUsers },
    { href: '/videos', label: '動画', icon: FaPlay },
    { href: '/admin/analytics', label: '分析', icon: FaChartBar },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('ログアウトしました');
    } catch (error) {
      toast.error('ログアウトに失敗しました');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo.avif" 
              alt="ナレッジシェア" 
              className="h-10 w-auto object-contain"
            />
            <span className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ナレッジシェア
            </span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span className="hidden sm:block">{item.label}</span>
                </Link>
              );
            })}

            <div className="ml-4 pl-4 border-l border-gray-200">
              {loading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={user.role === 'admin' ? '/admin/dashboard' : '/mypage'}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all"
                  >
                    <FaUser className="text-orange-600" />
                    <span className="hidden sm:block text-sm font-medium text-orange-700">
                      {user.role === 'admin' ? '管理ダッシュボード' : 'マイページ'}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="ログアウト"
                  >
                    <FaSignOutAlt />
                    <span className="hidden sm:block text-sm">ログアウト</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                  >
                    <FaSignInAlt />
                    <span className="hidden sm:block text-sm">ログイン</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-xl transition-all"
                  >
                    <FaUser />
                    <span className="hidden sm:block text-sm">登録</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}