import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { 
  HomeIcon, 
  SearchIcon, 
  CreateIcon, 
  ProfileIcon, 
  NotificationsIcon, 
  LogoutIcon 
} from './Icons';

const Sidebar = ({ onCreateClick }) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogoutClick = () => {
    // Clear the JWT token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Reset auth state
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const username = user?.username || 'profile';

  return (
    <aside className="sidebar">
      <div className="logo-container" onClick={() => navigate('/')}>
        <span className="logo-text">InstaClone</span>
      </div>

      <nav className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <HomeIcon />
          <span>Home</span>
        </NavLink>

        <NavLink 
          to="/search" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <SearchIcon />
          <span>Search</span>
        </NavLink>

        <button 
          onClick={onCreateClick}
          className="nav-item"
        >
          <CreateIcon />
          <span>Create Post</span>
        </button>

        <NavLink 
          to="/notifications" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <NotificationsIcon />
          <span>Notifications</span>
        </NavLink>

        <NavLink 
          to={`/profile/${username}`} 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt="Avatar" 
              style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <ProfileIcon />
          )}
          <span>Profile</span>
        </NavLink>

        <button 
          onClick={handleLogoutClick} 
          className="nav-item logout-button"
          style={{ marginTop: 'auto' }}
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
