'use client';

import { useState, useEffect } from 'react';
import { useSimpleAuth } from '@/lib/useSimpleAuth';
import { FaUser, FaEdit, FaTrash, FaSave, FaTimes, FaComment } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

interface CommentSectionProps {
  videoId: string;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const { user, loading: authLoading } = useSimpleAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('コメントするにはログインが必要です');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('コメント内容を入力してください');
      return;
    }
    
    if (newComment.length > 1000) {
      toast.error('コメントは1000文字以内で入力してください');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: newComment.trim() }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setNewComment('');
        toast.success('コメントを投稿しました！');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'コメントの投稿に失敗しました');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('コメントの投稿中にエラーが発生しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('コメント内容を入力してください');
      return;
    }
    
    if (editContent.length > 1000) {
      toast.error('コメントは1000文字以内で入力してください');
      return;
    }
    
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: editContent.trim() }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(comments.map(comment => 
          comment.id === commentId ? data.comment : comment
        ));
        setEditingId(null);
        setEditContent('');
        toast.success('コメントを更新しました！');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'コメントの更新に失敗しました');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('コメントの更新中にエラーが発生しました');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    const isOwnComment = user?.email === comment?.user.email;
    const isAdmin = user?.role === 'admin';
    
    let confirmMessage = 'このコメントを削除しますか？';
    if (isAdmin && !isOwnComment) {
      confirmMessage = '管理者権限でこのコメントを削除しますか？';
    }
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId));
        toast.success('コメントを削除しました');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'コメントの削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('コメントの削除中にエラーが発生しました');
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return diffMinutes < 1 ? 'たった今' : `${diffMinutes}分前`;
    } else if (diffHours < 24) {
      return `${diffHours}時間前`;
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else {
      return date.toLocaleDateString('ja-JP');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FaComment className="text-blue-500" />
        コメント ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを書く..."
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={1000}
                disabled={submitting}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {newComment.length}/1000文字
                </span>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '投稿中...' : 'コメント'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600 mb-3">コメントするにはログインが必要です</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaUser />
            ログイン
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <FaComment className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">まだコメントがありません</p>
          <p className="text-sm text-gray-500">最初のコメントを投稿してみませんか？</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {comment.user.avatarUrl ? (
                    <img
                      src={comment.user.avatarUrl}
                      alt={comment.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                      {comment.user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {comment.user.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                        {comment.createdAt !== comment.updatedAt && ' (編集済み)'}
                      </span>
                    </div>
                    {(user?.email === comment.user.email || user?.role === 'admin') && (
                      <div className="flex gap-1">
                        {user?.email === comment.user.email && (
                          <button
                            onClick={() => startEdit(comment)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="編集"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title={user?.role === 'admin' && user?.email !== comment.user.email ? '管理者権限で削除' : '削除'}
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingId === comment.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        maxLength={1000}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {editContent.length}/1000文字
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            <FaSave className="inline mr-1" />
                            保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                          >
                            <FaTimes className="inline mr-1" />
                            キャンセル
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}