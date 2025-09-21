'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import QuizRunner from '@/components/quiz/QuizRunner';
import AttemptsTable from '@/components/quiz/AttemptsTable';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showQuiz, setShowQuiz] = useState(false);

  const { data: quiz, error: quizError } = useSWR(
    `/api/quiz/${params.id}`,
    fetcher
  );

  const { data: attempts, mutate: mutateAttempts } = useSWR(
    session?.user ? `/api/quiz/attempts?videoId=${params.id}` : null,
    fetcher
  );

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (quizError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">クイズの読み込みに失敗しました</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (showQuiz && quiz) {
    return <QuizRunner quiz={quiz} videoId={params.id as string} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">理解度テスト</h1>
      
      {quiz && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{quiz.title}</h2>
          
          <div className="rounded-2xl p-6 bg-blue-50 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">テスト情報</h3>
            <ul className="space-y-2 text-blue-800">
              <li>問題数: {quiz.questions?.length || 0}問</li>
              <li>合格基準: {quiz.passThreshold}点以上</li>
              <li>制限時間: 10分</li>
              <li>再受験: 可能</li>
            </ul>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowQuiz(true)}
              className="rounded-2xl px-8 py-4 font-semibold shadow-lg text-lg bg-green-600 text-white hover:bg-green-700 transition-all"
            >
              {attempts && attempts.length > 0 ? 'もう一度受験する' : '開始'}
            </button>
          </div>
        </div>
      )}

      {attempts && attempts.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">受験履歴</h3>
          <AttemptsTable attempts={attempts} passThreshold={quiz?.passThreshold || 80} />
        </div>
      )}
    </div>
  );
}