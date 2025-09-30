'use client';

import { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface SaveButtonProps {
  videoId: string;
  videoData?: {
    title: string;
    instructor?: string;
    thumbnailUrl?: string;
  };
  onSaveChange?: (isSaved: boolean) => void;
}

export default function SaveButton({ videoId, videoData, onSaveChange }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if video is already saved
  useEffect(() => {
    checkSavedStatus();
  }, [videoId]);

  const checkSavedStatus = async () => {
    try {
      const response = await fetch('/api/saved-videos', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        const savedVideos = data.savedVideos || [];
        const isVideoSaved = savedVideos.some((v: any) => v.id === videoId);
        setIsSaved(isVideoSaved);
      } else {
        // Fallback to localStorage for non-authenticated users
        const savedData = localStorage.getItem('savedVideos');
        if (savedData) {
          const savedVideos = JSON.parse(savedData);
          const isVideoSaved = savedVideos.some((v: any) => v.id === videoId);
          setIsSaved(isVideoSaved);
        }
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
      // Fallback to localStorage
      const savedData = localStorage.getItem('savedVideos');
      if (savedData) {
        const savedVideos = JSON.parse(savedData);
        const isVideoSaved = savedVideos.some((v: any) => v.id === videoId);
        setIsSaved(isVideoSaved);
      }
    }
  };

  const handleSaveToggle = async () => {
    setIsLoading(true);
    
    try {
      if (isSaved) {
        // Remove from saved
        const response = await fetch(`/api/saved-videos?videoId=${videoId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setIsSaved(false);
          toast.success('保存を解除しました');
          onSaveChange?.(false);
        } else {
          // Fallback to localStorage
          const savedData = localStorage.getItem('savedVideos');
          if (savedData) {
            const savedVideos = JSON.parse(savedData);
            const updatedVideos = savedVideos.filter((v: any) => v.id !== videoId);
            localStorage.setItem('savedVideos', JSON.stringify(updatedVideos));
            setIsSaved(false);
            toast.success('保存を解除しました');
            onSaveChange?.(false);
          }
        }
      } else {
        // Add to saved
        const saveData = {
          id: videoId,
          title: videoData?.title || '動画タイトル',
          instructor: videoData?.instructor || '講師名',
          thumbnailUrl: videoData?.thumbnailUrl,
          savedAt: new Date().toISOString()
        };

        const response = await fetch('/api/saved-videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ videoId })
        });

        if (response.ok) {
          setIsSaved(true);
          toast.success('動画を保存しました！');
          onSaveChange?.(true);
        } else {
          // Fallback to localStorage
          const savedData = localStorage.getItem('savedVideos');
          const savedVideos = savedData ? JSON.parse(savedData) : [];
          savedVideos.push(saveData);
          localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
          setIsSaved(true);
          toast.success('動画を保存しました！');
          onSaveChange?.(true);
        }
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      toast.error('保存の変更に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSaveToggle}
      disabled={isLoading}
      className={`
        flex items-center gap-3 px-6 py-3 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105
        ${
          isSaved
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⏳</span>
          <span>処理中...</span>
        </>
      ) : isSaved ? (
        <>
          <FaBookmark className="text-xl" />
          <span>保存済み</span>
        </>
      ) : (
        <>
          <FaRegBookmark className="text-xl" />
          <span>保存する</span>
        </>
      )}
    </button>
  );
}