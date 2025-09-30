'use client';

import { useState, useEffect } from 'react';
import InstructorCard from '@/components/instructors/InstructorCard';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    fetchInstructors();
  }, [search, sort, page, selectedTags]);

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sort,
        ...(search && { search }),
        ...(selectedTags.length > 0 && { tags: selectedTags.join(',') })
      });

      const response = await fetch(`/api/instructors?${params}`);
      const data = await response.json();

      setInstructors(data.instructors);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTags = async () => {
    try {
      const response = await fetch('/api/instructors');
      const data = await response.json();
      const allTags = new Set<string>();
      data.instructors.forEach((instructor: any) => {
        instructor.tags?.forEach((tag: string) => allTags.add(tag));
      });
      setAvailableTags(Array.from(allTags));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchInstructors();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearch('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">ゲスト一覧</h1>

      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ゲスト名やカテゴリで検索"
              className="input-field pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="btn-primary"
          >
            検索
          </button>
        </form>

        {/* タグフィルター */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">タグで絞り込み:</span>
            {selectedTags.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-theme-600 hover:text-theme-800 underline"
              >
                クリア
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {(showAllTags ? availableTags : availableTags.slice(0, 10)).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-theme-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
            {availableTags.length > 10 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-theme-600 hover:bg-gray-200 transition-colors"
              >
                {showAllTags ? (
                  <>
                    <FaChevronUp className="text-xs" />
                    閉じる
                  </>
                ) : (
                  <>
                    <FaChevronDown className="text-xs" />
                    もっと見る ({availableTags.length - 10})
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <span className="text-gray-700">並び替え:</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="input-field w-auto"
          >
            <option value="createdAt">登録順</option>
            <option value="popular">人気順</option>
          </select>
        </div>

        {/* アクティブフィルター表示 */}
        {(selectedTags.length > 0 || search) && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">フィルター中:</span>
              {search && (
                <span className="px-2 py-1 bg-white rounded text-sm">
                  検索: {search}
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-white rounded text-sm">
                  タグ: {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-2xl p-5 shadow bg-gray-200 h-40"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor: any) => (
              <InstructorCard
                key={instructor._id}
                instructor={instructor}
                videoCount={instructor.videoCount}
                totalViews={instructor.totalViews}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                前へ
              </button>
              <span className="px-4 py-2">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}