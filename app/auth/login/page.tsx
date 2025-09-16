"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await signIn("google", { 
        callbackUrl: "/mypage",
        redirect: false 
      });
      if (result?.error) {
        setError(`ログインエラー: ${result.error}`);
      }
    } catch (err) {
      setError(`エラーが発生しました: ${err}`);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Use legacy auth system for demo until Google is configured
      const { fetchJSON } = await import('@/lib/fetchJSON');
      const data = await fetchJSON('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@example.com',
          password: 'password123'
        }),
      });
      
      if (data.user) {
        window.location.href = '/mypage';
      } else {
        setError('デモログインに失敗しました');
      }
    } catch (err) {
      setError(`デモログインエラー: ${err}`);
      console.error("Demo login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center flex-col space-y-4">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-4 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>
        
        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full px-6 py-3 rounded-md bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "ログイン中..." : "デモアカウントでログイン"}
        </button>
        
        <div className="text-center text-gray-500">または</div>
        
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full px-6 py-3 rounded-md border bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "ログイン中..." : "Googleでログイン"}
        </button>
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center mt-4">
          <p><strong>デモアカウント:</strong></p>
          <p>Email: demo@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}