'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuestionCard from './QuestionCard';
import { FaCheckCircle, FaTimesCircle, FaRedoAlt } from 'react-icons/fa';

interface ResultPanelProps {
  result: {
    score: number;
    passed: boolean;
    questions: Array<{
      questionId: string;
      correct: boolean;
      correctKeys: string[];
      explanation?: string;
    }>;
  };
  quiz: {
    _id: string;
    title: string;
    passThreshold: number;
    questions: Array<{
      _id: string;
      type: 'MCQ' | 'MultiSelect' | 'TrueFalse';
      prompt: string;
      choices?: { key: string; text: string }[];
    }>;
  };
  answers: Record<string, string[]>;
  onRetake?: () => void;
}

export default function ResultPanel({ result, quiz, answers, onRetake }: ResultPanelProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(true);

  const handleRetake = () => {
    if (onRetake) {
      onRetake();
    } else {
      router.refresh();
    }
  };

  const getQuestionResult = (questionId: string) => {
    return result.questions.find(q => q.questionId === questionId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{quiz.title} - 結果</h1>
        
        <div className={`rounded-2xl p-8 text-center ${
          result.passed 
            ? 'bg-gradient-to-r from-green-500 to-green-600' 
            : 'bg-gradient-to-r from-theme-500 to-theme-600'
        } text-white`}>
          <div className="mb-4">
            {result.passed ? (
              <FaCheckCircle className="text-6xl mx-auto mb-4" />
            ) : (
              <FaTimesCircle className="text-6xl mx-auto mb-4" />
            )}
          </div>
          
          <h2 className="text-4xl font-bold mb-2">
            あなたのスコア: {result.score}点
          </h2>
          
          <p className="text-xl mb-4">
            合格基準: {quiz.passThreshold}点
          </p>
          
          <div className="text-2xl font-bold">
            {result.passed ? '合格' : '不合格'}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleRetake}
            className="rounded-2xl px-6 py-3 font-semibold shadow bg-theme-600 text-white hover:bg-theme-700 transition-all flex items-center gap-2"
          >
            <FaRedoAlt />
            再受験
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="rounded-2xl px-6 py-3 font-semibold shadow bg-gray-600 text-white hover:bg-gray-700 transition-all"
          >
            {showDetails ? '詳細を隠す' : '詳細を表示'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">解答と解説</h3>
          
          {quiz.questions.map((question, index) => {
            const questionResult = getQuestionResult(question._id);
            if (!questionResult) return null;

            return (
              <div key={question._id}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    問題 {index + 1} / {quiz.questions.length}
                  </span>
                  {questionResult.correct ? (
                    <span className="text-green-600 font-semibold flex items-center gap-1">
                      <FaCheckCircle /> 正解
                    </span>
                  ) : (
                    <span className="text-theme-600 font-semibold flex items-center gap-1">
                      <FaTimesCircle /> 不正解
                    </span>
                  )}
                </div>
                
                <QuestionCard
                  question={question}
                  selectedKeys={answers[question._id] || []}
                  onAnswer={() => {}}
                  showResult={true}
                  correctKeys={questionResult.correctKeys}
                  explanation={questionResult.explanation}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}