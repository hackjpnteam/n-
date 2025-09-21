"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        callbackUrl: '/mypage',
        redirect: false,
      });

      if (result?.error) {
        console.error('Login error:', result.error);
        if (result.error === 'CredentialsSignin') {
          toast.error('メールアドレスまたはパスワードが正しくありません');
        } else {
          toast.error('ログインに失敗しました: ' + result.error);
        }
      } else if (result?.ok) {
        toast.success('ログインしました');
        // Use Next.js router for consistent navigation
        router.push('/mypage');
        router.refresh();
        // Fallback for production environments
        setTimeout(() => {
          window.location.href = '/mypage';
        }, 1000);
      } else {
        toast.error('ログインに失敗しました');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('サーバーエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", { 
        callbackUrl: "/mypage",
        redirect: false 
      });
      
      if (result?.error) {
        toast.error('Googleログインでエラーが発生しました: ' + result.error);
      } else if (result?.ok || result?.url) {
        toast.success('Googleログインしました');
        router.push('/mypage');
        router.refresh();
        // Fallback for production environments
        setTimeout(() => {
          window.location.href = '/mypage';
        }, 1000);
      }
    } catch (error) {
      console.error('Google signin error:', error);
      toast.error('Googleログインでエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGmailSignIn = async () => {
    toast.error('Gmail APIログインは現在利用できません。Googleログインをご利用ください。');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <FaSignInAlt className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            メールアドレスまたはGoogleアカウントでログイン
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="パスワード"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full mt-4 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all hover:scale-[1.02]"
            >
              <FaGoogle className="text-xl" />
              Googleでログイン
            </button>

            <button
              onClick={handleGmailSignIn}
              className="w-full mt-3 flex items-center justify-center gap-3 bg-red-50 border border-red-200 text-red-700 py-3 px-4 rounded-xl font-semibold hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all hover:scale-[1.02]"
            >
              <FaGoogle className="text-xl" />
              Gmailでログイン（Gmail API）
            </button>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                アカウントをお持ちでない場合は{' '}
              </span>
              <Link
                href="/auth/register"
                className="text-sm font-medium text-theme-600 hover:text-theme-500"
              >
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}