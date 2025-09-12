import { NextRequest, NextResponse } from 'next/server';
import { mockQuizzes } from '@/lib/mockData';


export const dynamic = 'force-dynamic';
export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const quiz = mockQuizzes.find(q => q.videoId === params.videoId);
    
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found for this video' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: quiz._id,
      title: quiz.title,
      passThreshold: quiz.passThreshold,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        type: q.type,
        prompt: q.prompt,
        choices: q.choices
      }))
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}