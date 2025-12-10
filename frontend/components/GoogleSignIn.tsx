'use client';

import { useEffect } from 'react';

interface GoogleSignInProps {
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleSignIn({ onSuccess, onError }: GoogleSignInProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          onSuccess(response.credential);
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 300,
        }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onSuccess]);

  return (
    <div className="text-center">
      <div className="text-6xl mb-6">🎄</div>
      <h1 className="text-3xl font-bold text-green-700 mb-4">Christmas Friend Selector</h1>
      <p className="text-gray-600 mb-8">Sign in with your college email to discover your Secret Santa!</p>
      <div id="google-signin-button" className="flex justify-center"></div>
    </div>
  );
}