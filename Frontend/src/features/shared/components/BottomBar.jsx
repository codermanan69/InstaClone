import React from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { 
  HomeIcon, 
  SearchIcon, 
  CreateIcon, 
  ProfileIcon, 
  NotificationsIcon 
} from './Icons';

const BottomBar = ({ onCreateClick }) => {
  const { user } = useAuth();
  const username = user?.username || 'profile';

  return (
    <div className="bottom-bar">
      <NavLink 
        to="/" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <HomeIcon size={22} />
      </NavLink>

      <NavLink 
        to="/search" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <SearchIcon size={22} />
      </NavLink>

      <button 
        onClick={onCreateClick}
        className="nav-item"
      >
        <CreateIcon size={22} />
      </button>

      <NavLink 
        to="/notifications" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <NotificationsIcon size={22} />
      </NavLink>

      <NavLink 
        to={`/profile/${username}`} 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt="Avatar" 
            style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <ProfileIcon size={22} />
        )}
      </NavLink>
    </div>
  );
};

export default BottomBar;
