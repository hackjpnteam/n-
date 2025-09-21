'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<string>('');

  const testAuth = async () => {
    try {
      // Test NextAuth session instead of old API
      if (status === 'loading') {
        setTestResult('Status: Loading session...');
        return;
      }
      
      if (status === 'unauthenticated') {
        setTestResult('Status: 401, Data: { "error": "Not authenticated" }');
        return;
      }
      
      if (session?.user) {
        setTestResult(`Status: 200, Data: ${JSON.stringify({ user: session.user }, null, 2)}`);
        return;
      }
      
      setTestResult('Status: Unknown, Data: { "error": "Unexpected session state" }');
    } catch (error) {
      setTestResult(`Error: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      await signIn('google');
      toast.success('ログイン中...');
    } catch (error) {
      toast.error('ログイン失敗');
    }
  };

  const testLogout = async () => {
    try {
      await signOut();
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
            <p><strong>Status:</strong> {status}</p>
            <p><strong>User:</strong> {session?.user ? JSON.stringify(session.user, null, 2) : 'Not logged in'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">テスト機能</h2>
          <div className="flex gap-4 mb-4">
            <button onClick={testAuth} className="btn-primary">
              NextAuth Session をテスト
            </button>
            <button onClick={testLogin} className="btn-success">
              Googleログイン
            </button>
            <button onClick={testLogout} className="bg-theme-600 text-white px-4 py-2 rounded-xl">
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