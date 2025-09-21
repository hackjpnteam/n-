"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

type Member = { 
  _id: string; 
  name?: string;
  email?: string;
  profile?: {
    company?: string;
    position?: string;
    companyUrl?: string;
    bio?: string;
    avatarUrl?: string;
  };
  joinedAt?: string;
};

async function fetchJSON(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    credentials: "include",
    cache: "no-store",
    ...init,
  });
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} | ${text.slice(0,120)}`);
  }
  if (!ct.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(`Expected JSON but got ${ct}. Body: ${text.slice(0,120)}`);
  }
  return res.json();
}

export default function MembersPage() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJSON("/api/members")
      .then((r) => setData(r.items ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">メンバー情報を読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-500 text-lg mb-4">エラーが発生しました</div>
            <div className="text-gray-600 text-sm bg-white p-4 rounded-lg shadow-sm max-w-md mx-auto">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">まだメンバーがいません</h3>
            <p className="text-gray-500">新しいメンバーが参加すると、ここに表示されます。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">コミュニティメンバー</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            私たちのコミュニティに参加している素晴らしいメンバーたちをご紹介します
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <FaUser className="text-blue-500" />
            <span>{data.length}名のメンバーが参加中</span>
          </div>
        </div>

        {/* メンバーカード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.map((member) => (
            <div key={member._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
              {/* お気に入りボタン */}
              <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all opacity-0 group-hover:opacity-100">
                <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* プロフィール画像 */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                {member.profile?.avatarUrl && member.profile.avatarUrl !== '/default-avatar.png' ? (
                  <Image
                    src={member.profile.avatarUrl}
                    alt={member.name || 'User'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                    {(member.name || 'U').charAt(0)}
                  </div>
                )}
                
              </div>

              {/* カード情報 */}
              <div className="p-4">
                {/* 名前と認証バッジ */}
                <div className="flex items-center gap-1 mb-1">
                  <h3 className="font-bold text-gray-900 truncate">{member.name || 'ユーザー'}</h3>
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* 役職・専門分野 */}
                <p className="text-sm text-gray-700 font-medium mb-3 line-clamp-2">
                  {member.profile?.position || '専門分野未設定'}
                  {member.profile?.company && ` at ${member.profile.company}`}
                </p>

                {/* 自己紹介 */}
                {member.profile?.bio && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {member.profile.bio}
                  </p>
                )}

                {/* 会社URL */}
                {member.profile?.companyUrl && (
                  <div className="mb-3">
                    <a 
                      href={member.profile.companyUrl.startsWith('http') ? member.profile.companyUrl : `https://${member.profile.companyUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                    >
                      {member.profile.companyUrl}
                    </a>
                  </div>
                )}

                {/* フッター情報 */}
                <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
                  <p>参加: {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short'
                  }) : '不明'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        <div className="text-center mt-16 py-8">
          <div className="inline-block bg-gray-50 rounded-full px-6 py-3">
            <p className="text-gray-600 text-sm">
              🎉 一緒に学び、成長していきましょう！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}