'use client';

import { QuestionType } from '@/models/Question';

interface Choice {
  key: string;
  text: string;
}

interface QuestionCardProps {
  question: {
    _id: string;
    type: QuestionType;
    prompt: string;
    choices?: Choice[];
  };
  selectedKeys: string[];
  onAnswer: (questionId: string, keys: string[]) => void;
  showResult?: boolean;
  correctKeys?: string[];
  explanation?: string;
}

export default function QuestionCard({
  question,
  selectedKeys,
  onAnswer,
  showResult = false,
  correctKeys = [],
  explanation
}: QuestionCardProps) {
  const handleSingleSelect = (key: string) => {
    if (!showResult) {
      onAnswer(question._id, [key]);
    }
  };

  const handleMultiSelect = (key: string) => {
    if (!showResult) {
      const newKeys = selectedKeys.includes(key)
        ? selectedKeys.filter(k => k !== key)
        : [...selectedKeys, key];
      onAnswer(question._id, newKeys);
    }
  };

  const isCorrect = (key: string) => correctKeys.includes(key);
  
  const getOptionClass = (key: string) => {
    if (!showResult) {
      return selectedKeys.includes(key)
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-300 hover:border-gray-400';
    }
    
    const correct = isCorrect(key);
    const selected = selectedKeys.includes(key);
    
    if (correct && selected) return 'border-green-500 bg-green-50';
    if (correct && !selected) return 'border-green-500 bg-green-50 opacity-60';
    if (!correct && selected) return 'border-theme-500 bg-theme-50';
    return 'border-gray-300 opacity-50';
  };

  const renderTrueFalse = () => (
    <div className="space-y-3">
      {[
        { key: 'true', text: '○ 正しい' },
        { key: 'false', text: '× 間違い' }
      ].map(choice => (
        <button
          key={choice.key}
          onClick={() => handleSingleSelect(choice.key)}
          disabled={showResult}
          className={`
            w-full p-4 rounded-lg border-2 text-left transition-all
            ${getOptionClass(choice.key)}
            ${!showResult && 'hover:shadow-md'}
          `}
        >
          <span className="text-lg">{choice.text}</span>
          {showResult && isCorrect(choice.key) && (
            <span className="ml-2 text-green-600 font-semibold">正解</span>
          )}
        </button>
      ))}
    </div>
  );

  const renderChoices = () => {
    if (!question.choices) return null;

    return (
      <div className="space-y-3">
        {question.choices.map(choice => (
          <button
            key={choice.key}
            onClick={() => 
              question.type === 'MCQ' 
                ? handleSingleSelect(choice.key)
                : handleMultiSelect(choice.key)
            }
            disabled={showResult}
            className={`
              w-full p-4 rounded-lg border-2 text-left transition-all
              ${getOptionClass(choice.key)}
              ${!showResult && 'hover:shadow-md'}
            `}
          >
            <div className="flex items-start gap-3">
              {question.type === 'MultiSelect' && (
                <input
                  type="checkbox"
                  checked={selectedKeys.includes(choice.key)}
                  readOnly
                  className="mt-1"
                />
              )}
              <div className="flex-1">
                <span className="text-lg">{choice.text}</span>
                {showResult && isCorrect(choice.key) && (
                  <span className="ml-2 text-green-600 font-semibold">正解</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
          {question.type === 'MCQ' && '単一選択'}
          {question.type === 'MultiSelect' && '複数選択'}
          {question.type === 'TrueFalse' && '○×問題'}
        </span>
        <h3 className="text-xl font-semibold text-gray-900">{question.prompt}</h3>
      </div>

      {question.type === 'TrueFalse' ? renderTrueFalse() : renderChoices()}

      {showResult && explanation && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">解説</h4>
          <p className="text-blue-800">{explanation}</p>
        </div>
      )}
    </div>
  );
}