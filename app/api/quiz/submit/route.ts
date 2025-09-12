import { NextRequest, NextResponse } from 'next/server';
import { mockQuizzes } from '@/lib/mockData';

interface Answer {
  questionId: string;
  selectedKeys: string[];
}

interface SubmitData {
  quizId: string;
  videoId: string;
  answers: Answer[];
}


export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, videoId, answers }: SubmitData = body;

    if (!quizId || !videoId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the quiz
    const quiz = mockQuizzes.find(q => q._id === quizId);
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // 採点
    let correctCount = 0;
    const questionResults = quiz.questions.map(question => {
      const answer = answers.find(a => a.questionId === question._id);
      const selectedKeys = answer?.selectedKeys || [];
      const correctKeys = question.correctKeys || [];
      
      let isCorrect = false;
      
      if (question.type === 'TrueFalse' || question.type === 'MCQ') {
        // 単一選択
        isCorrect = selectedKeys.length === 1 && 
                   correctKeys.length === 1 && 
                   selectedKeys[0] === correctKeys[0];
      } else if (question.type === 'MultiSelect') {
        // 複数選択
        isCorrect = selectedKeys.length === correctKeys.length &&
                   selectedKeys.every(key => correctKeys.includes(key)) &&
                   correctKeys.every(key => selectedKeys.includes(key));
      }
      
      if (isCorrect) correctCount++;
      
      return {
        questionId: question._id,
        correct: isCorrect,
        correctKeys: question.correctKeys,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passThreshold;

    return NextResponse.json({
      score,
      passed,
      questions: questionResults
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}