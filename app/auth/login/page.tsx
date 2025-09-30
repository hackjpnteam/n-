"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { signIn, getSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication using NextAuth and auth-simple session APIs
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try NextAuth session first
        const nextAuthResponse = await fetch('/api/auth/session');
        const nextAuthData = await nextAuthResponse.json();
        
        if (nextAuthData && nextAuthData.user) {
          console.log('✅ NextAuth session found on login page:', nextAuthData.user);
          setSession(nextAuthData);
          router.push('/mypage');
          return;
        }
        
        // Fallback to auth-simple session
        const response = await fetch('/api/auth-simple/session');
        const sessionData = await response.json();
        
        if (sessionData && sessionData.user) {
          console.log('✅ Auth-simple session found on login page:', sessionData.user);
          setSession(sessionData);
          router.push('/mypage');
          return;
        }
        
        console.log('❌ No session found on login page');
        setSession(null);
      } catch (error) {
        console.error('Auth check failed:', error);
        setSession(null);
      } finally {
        setSessionLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth-simple/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('ログインしました');
        // Redirect all users to mypage after login
        window.location.href = '/mypage';
      } else {
        toast.error(data.error || 'ログインに失敗しました');
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
      console.log('🔥 Starting Google sign in...');
      
      // Use redirect: true to allow normal OAuth flow
      const result = await signIn("google", { 
        callbackUrl: "/mypage",
        redirect: true  // Changed to true for proper OAuth flow
      });
      
      console.log('🔥 SignIn result:', result);
      
    } catch (error) {
      console.error('Google signin error:', error);
      toast.error('Googleログインでエラーが発生しました');
      setIsLoading(false);
    }
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