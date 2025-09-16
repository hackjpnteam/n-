'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaGoogle, FaUserPlus } from 'react-icons/fa';

export default function RegisterPage() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/mypage' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <FaUserPlus className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            新規アカウント作成
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Googleアカウントで簡単登録
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all hover:scale-[1.02]"
          >
            <FaGoogle className="text-xl" />
            Googleアカウントで登録
          </button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                すでにアカウントをお持ちですか？{' '}
              </span>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-theme-600 hover:text-theme-500"
              >
                ログイン
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            登録することで、
            <Link href="/terms" className="text-theme-600 hover:text-theme-500">利用規約</Link>
            と
            <Link href="/privacy" className="text-theme-600 hover:text-theme-500">プライバシーポリシー</Link>
            に同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  );
}