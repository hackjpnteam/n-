'use client';

import { useAuth } from '@/lib/useAuth';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AuthTestPage() {
  const { user, loading, login, logout } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  const testAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setTestResult(`Status: ${response.status}, Data: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      await login('demo@example.com', 'password123');
      toast.success('デモログイン成功');
    } catch (error) {
      toast.error('ログイン失敗');
    }
  };

  const testLogout = async () => {
    try {
      await logout();
      toast.success('ログアウト成功');
    } catch (error) {
      toast.error('ログアウト失敗');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">認証システムテスト</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">現在の認証状態</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'Not logged in'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">テスト機能</h2>
          <div className="flex gap-4 mb-4">
            <button onClick={testAuth} className="btn-primary">
              /api/auth/me をテスト
            </button>
            <button onClick={testLogin} className="btn-success">
              デモログイン
            </button>
            <button onClick={testLogout} className="bg-red-600 text-white px-4 py-2 rounded-xl">
              ログアウト
            </button>
          </div>
          
          {testResult && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">API レスポンス:</h3>
              <pre className="text-sm overflow-auto">{testResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}