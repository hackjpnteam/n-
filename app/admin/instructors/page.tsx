'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Instructor {
  _id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  expertise: string[];
  rating: number;
  totalStudents: number;
  totalCourses: number;
}

export default function AdminInstructorsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchInstructors();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (!data.user || data.user.role !== 'admin') {
        toast.error('管理者権限が必要です');
        router.push('/');
        return;
      }
      
      setUser(data.user);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/');
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors');
      const data = await response.json();
      console.log('🔍 Fetched instructors for admin page:', data.instructors);
      setInstructors(data.instructors || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('講師データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${name}を削除してもよろしいですか？`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/instructors/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      toast.success('講師を削除しました');
      fetchInstructors();
    } catch (error) {
      console.error('Error deleting instructor:', error);
      toast.error('削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">講師管理</h1>
          <p className="text-gray-600 mt-2">講師の追加・編集・削除ができます</p>
        </div>
        <Link
          href="/admin/instructors/new"
          className="flex items-center gap-2 bg-theme-600 text-white px-4 py-2 rounded-xl hover:bg-theme-700 transition-all"
        >
          <FaPlus />
          新規追加
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  講師
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  役職
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  専門分野
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  評価
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  受講者数
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {instructors.map((instructor) => (
                <tr key={instructor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0">
                        {instructor.avatar ? (
                          <img
                            src={instructor.avatar}
                            alt={instructor.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <FaUser className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {instructor.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{instructor.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {(instructor.expertise || instructor.tags || []).slice(0, 2).map((exp, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                        >
                          {exp}
                        </span>
                      ))}
                      {(instructor.expertise || instructor.tags || []).length > 2 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                          +{(instructor.expertise || instructor.tags || []).length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ⭐ {instructor.rating || '0.0'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {(instructor.totalStudents || 0).toLocaleString()}人
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <Link
                        href={`/admin/instructors/${instructor._id}/edit`}
                        className="text-theme-600 hover:text-theme-900"
                      >
                        <FaEdit className="text-lg" />
                      </Link>
                      <button
                        onClick={() => handleDelete(instructor._id, instructor.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/admin"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-all"
        >
          管理画面に戻る
        </Link>
      </div>
    </div>
  );
}