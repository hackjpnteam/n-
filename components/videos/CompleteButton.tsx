'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface CompleteButtonProps {
  videoId: string;
  defaultCompleted?: boolean;
  onComplete?: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CompleteButton({ videoId, defaultCompleted = false, onComplete }: CompleteButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isCompleted, setIsCompleted] = useState(defaultCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const { data: progress } = useSWR(
    session?.user ? `/api/progress?videoId=${videoId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data?.status === 'completed') {
          setIsCompleted(true);
        }
      }
    }
  );

  const handleComplete = async () => {
    if (isCompleted) return;

    setIsLoading(true);
    
    try {
      // Always mark as completed locally for UI feedback
      setIsCompleted(true);
      onComplete?.(); // Update progress bar to 100%
      toast.success('視聴完了を記録しました！');

      // Try to save to server if user is logged in
      if (session?.user) {
        const response = await fetch('/api/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            videoId,
            status: 'completed',
          }),
        });

        if (!response.ok) {
          console.warn('Failed to save progress to server, but marked as completed locally');
        }
      } else {
        // Store in localStorage for non-logged users
        const localProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
        localProgress[videoId] = { status: 'completed', completedAt: new Date().toISOString() };
        localStorage.setItem('videoProgress', JSON.stringify(localProgress));
      }
    } catch (error) {
      console.error('Error marking video as completed:', error);
      // Don't show error to user since local completion worked
    } finally {
      setIsLoading(false);
    }
  };

  // Check localStorage for completion status if not logged in
  useEffect(() => {
    if (!session?.user && !isCompleted) {
      const localProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
      if (localProgress[videoId]?.status === 'completed') {
        setIsCompleted(true);
      }
    }
  }, [session?.user, videoId, isCompleted]);

  return (
    <button
      onClick={handleComplete}
      disabled={isCompleted || isLoading}
      className={`
        flex items-center gap-3 text-lg transition-all duration-300
        ${
          isCompleted
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed rounded-2xl px-6 py-3 font-semibold shadow-lg'
            : 'btn-primary'
        }
      `}
    >
      {isCompleted ? (
        <>
          <FaCheckCircle className="text-xl" />
          <span>視聴完了</span>
        </>
      ) : (
        <span>{isLoading ? '記録中...' : '視聴完了として記録'}</span>
      )}
    </button>
  );
}