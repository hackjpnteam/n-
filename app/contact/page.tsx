'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // デモ用の処理
    setTimeout(() => {
      alert('お問い合わせを受け付けました。2営業日以内にご連絡いたします。');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">お問い合わせ</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">お気軽にご連絡ください</h2>
          <p className="text-gray-600 mb-6">
            ご不明な点やご要望がございましたら、以下のフォームからお問い合わせください。
            通常2営業日以内にご返信いたします。
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">連絡先情報</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>hackjpn, inc.</p>
              <p>営業時間: 平日 9:00-18:00</p>
              <p>Email: team@hackjpn.com</p>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                お名前 *
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス *
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                件名 *
              </label>
              <select
                id="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="technical">技術的な問題</option>
                <option value="account">アカウントについて</option>
                <option value="content">コンテンツについて</option>
                <option value="billing">料金について</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                メッセージ *
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="詳細をご記入ください"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '送信中...' : '送信'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}