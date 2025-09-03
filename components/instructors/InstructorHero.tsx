'use client';

import Image from 'next/image';
import { FaTwitter, FaLinkedin, FaYoutube, FaGlobe } from 'react-icons/fa';
import { useState } from 'react';

interface InstructorHeroProps {
  instructor: {
    _id: string;
    name: string;
    title?: string;
    bio?: string;
    avatarUrl?: string;
    tags: string[];
    socials?: {
      twitter?: string;
      linkedin?: string;
      youtube?: string;
      website?: string;
    };
  };
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

export default function InstructorHero({ instructor, isFollowing = false, onFollowToggle }: InstructorHeroProps) {
  const [localFollowing, setLocalFollowing] = useState(isFollowing);

  const handleFollowClick = () => {
    setLocalFollowing(!localFollowing);
    onFollowToggle?.();
  };

  return (
    <div className="gradient-hero text-white rounded-2xl p-8 shadow-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <Image
              src={instructor.avatarUrl || '/default-avatar.png'}
              alt={instructor.name}
              fill
              className="rounded-full object-cover border-4 border-white"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{instructor.name}</h1>
            {instructor.title && (
              <p className="text-xl opacity-90 mb-4">{instructor.title}</p>
            )}
            {instructor.bio && (
              <p className="text-lg opacity-85 mb-4 max-w-3xl">{instructor.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {instructor.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 glass rounded-full text-sm font-medium backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-4 items-center justify-center md:justify-start">
              <button
                onClick={handleFollowClick}
                className={`px-8 py-3 rounded-full font-semibold transition-all shadow-lg ${
                  localFollowing
                    ? 'bg-white text-purple-600 hover:bg-gray-100 hover:shadow-xl'
                    : 'bg-white/20 backdrop-blur text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                {localFollowing ? 'フォロー中' : 'フォローする'}
              </button>
              
              {instructor.socials && (
                <div className="flex gap-3">
                  {instructor.socials.twitter && (
                    <a href={instructor.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                      <FaTwitter size={20} />
                    </a>
                  )}
                  {instructor.socials.linkedin && (
                    <a href={instructor.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  {instructor.socials.youtube && (
                    <a href={instructor.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                      <FaYoutube size={20} />
                    </a>
                  )}
                  {instructor.socials.website && (
                    <a href={instructor.socials.website} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                      <FaGlobe size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}