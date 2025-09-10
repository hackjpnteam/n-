'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaYoutube, FaGlobe } from 'react-icons/fa';

interface InstructorCardProps {
  instructor: {
    _id: string;
    name: string;
    title?: string;
    avatarUrl?: string;
    tags: string[];
    socials?: {
      twitter?: string;
      linkedin?: string;
      youtube?: string;
      website?: string;
    };
  };
  videoCount?: number;
  totalViews?: number;
}

export default function InstructorCard({ instructor, videoCount = 0, totalViews = 0 }: InstructorCardProps) {
  return (
    <div className="card group">
      <Link href={`/instructors/${instructor._id}`} className="block">
        <div className="flex items-start gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={instructor.avatarUrl || '/default-avatar.png'}
              alt={instructor.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{instructor.name}</h3>
            {instructor.title && (
              <p className="text-sm text-gray-600 mt-1">{instructor.title}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {instructor.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full border border-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>{videoCount}本の動画</span>
              <span>{totalViews.toLocaleString()}回視聴</span>
            </div>
          </div>
        </div>
      </Link>
      
      {instructor.socials && (
        <div className="flex gap-3 mt-4 pt-4 border-t">
          {instructor.socials.twitter && (
            <a href={instructor.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500">
              <FaTwitter />
            </a>
          )}
          {instructor.socials.linkedin && (
            <a href={instructor.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-theme-600">
              <FaLinkedin />
            </a>
          )}
          {instructor.socials.youtube && (
            <a href={instructor.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-theme-600">
              <FaYoutube />
            </a>
          )}
          {instructor.socials.website && (
            <a href={instructor.socials.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600">
              <FaGlobe />
            </a>
          )}
        </div>
      )}
    </div>
  );
}