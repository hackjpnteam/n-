'use client';

import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface Attempt {
  _id: string;
  score: number;
  passed: boolean;
  takenAt: string;
}

interface AttemptsTableProps {
  attempts: Attempt[];
  passThreshold: number;
}

export default function AttemptsTable({ attempts, passThreshold }: AttemptsTableProps) {
  if (attempts.length === 0) {
    return (
      <div className="rounded-2xl p-8 bg-gray-50 text-center">
        <p className="text-gray-600">まだ受験履歴がありません</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl shadow bg-white overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              受験日時
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              スコア
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              合否
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {attempts.map((attempt, index) => (
            <tr key={attempt._id} className={index === 0 ? 'bg-blue-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(attempt.takenAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                {index === 0 && (
                  <span className="ml-2 text-xs text-theme-600 font-semibold">最新</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`text-lg font-semibold ${
                  attempt.score >= passThreshold ? 'text-green-600' : 'text-gray-700'
                }`}>
                  {attempt.score}点
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {attempt.passed ? (
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <FaCheckCircle />
                    合格
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-theme-600 font-semibold">
                    <FaTimesCircle />
                    不合格
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}