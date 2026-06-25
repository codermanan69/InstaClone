import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0b0f19',
          color: '#f1f5f9',
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        <div 
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        >
          InstaClone
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1.02); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    const hasVisited = localStorage.getItem("instaclone_has_visited");
    if (!hasVisited) {
      localStorage.setItem("instaclone_has_visited", "true");
      return <Navigate to="/register" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return null; // Silent loading for auth pages
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
