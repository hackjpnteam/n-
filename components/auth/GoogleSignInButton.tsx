'use client'

import { FaGoogle } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface GoogleSignInButtonProps {
  callbackUrl?: string
}

export default function GoogleSignInButton({ callbackUrl = '/' }: GoogleSignInButtonProps) {
  const handleGoogleSignIn = () => {
    // Real Google OAuth 2.0 flow
    const clientId = '770946554968-aab4jhigdcjhroij05r8jvcac3v18j9i.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent(window.location.origin + '/api/auth/google/callback');
    const scope = encodeURIComponent('openid email profile');
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state for security verification
    sessionStorage.setItem('oauth_state', state);
    
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    window.location.href = googleAuthUrl;
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
    >
      <FaGoogle className="text-red-500 text-lg" />
      <span>Googleでログイン</span>
    </button>
  )
}