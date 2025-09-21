'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import QuestionCard from './QuestionCard';
import ResultPanel from './ResultPanel';
import toast from 'react-hot-toast';

interface Question {
  _id: string;
  type: 'MCQ' | 'MultiSelect' | 'TrueFalse';
  prompt: string;
  choices?: { key: string; text: string }[];
}

interface Quiz {
  _id: string;
  title: string;
  passThreshold: number;
  questions: Question[];
}

interface QuizRunnerProps {
  quiz: Quiz;
  videoId: string;
}

export default function QuizRunner({ quiz, videoId }: QuizRunnerProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10分
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const resetQuiz = () => {
    setAnswers({});
    setTimeLeft(600);
    setResult(null);
    setShowResults(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (questionId: string, selectedKeys: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedKeys
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting || showResults) return;

    setIsSubmitting(true);

    const formattedAnswers = quiz.questions.map(q => ({
      questionId: q._id,
      selectedKeys: answers[q._id] || []
    }));

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quiz._id,
          videoId,
          answers: formattedAnswers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      setResult(data);
      setShowResults(true);
      toast.success('採点が完了しました');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('採点に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).filter(
    qId => answers[qId] && answers[qId].length > 0
  ).length;

  if (showResults && result) {
    return <ResultPanel result={result} quiz={quiz} answers={answers} onRetake={resetQuiz} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
        
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="text-sm font-medium text-gray-700">
            進捗: <span className="text-theme-600 font-bold">{answeredCount}</span> / {quiz.questions.length} 問回答済み
          </div>
          <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-theme-600 animate-pulse' : 'text-gray-700'}`}>
            残り時間: {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={question._id}>
            <div className="mb-2 text-sm font-medium text-gray-600">
              問題 {index + 1} / {quiz.questions.length}
            </div>
            <QuestionCard
              question={question}
              selectedKeys={answers[question._id] || []}
              onAnswer={handleAnswer}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || answeredCount === 0}
          className="btn-success text-lg px-10 py-4 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:hover:shadow-lg"
        >
          {isSubmitting ? '採点中...' : '回答送信'}
        </button>
      </div>
    </div>
  );
}