import React from 'react';
import '../../posts/style/feed.scss'; // for .pulse and .pulse-line anims
import '../style/profile.scss';

const ProfileSkeleton = () => {
  return (
    <div className="profile-container">
      <div className="skeleton-cover pulse"></div>
      
      <div className="profile-header-wrapper">
        <div className="profile-avatar-container">
          <div className="skeleton-profile-avatar pulse"></div>
        </div>
        
        <div className="profile-meta-details">
          <div className="profile-name-row">
            <div className="skeleton-line short pulse" style={{ height: '28px', width: '180px' }}></div>
            <div className="skeleton-line short pulse" style={{ height: '36px', width: '110px', borderRadius: '10px' }}></div>
          </div>
          
          <div className="profile-stats-row">
            <div className="skeleton-line extra-short pulse" style={{ width: '60px' }}></div>
            <div className="skeleton-line extra-short pulse" style={{ width: '60px' }}></div>
            <div className="skeleton-line extra-short pulse" style={{ width: '60px' }}></div>
          </div>
          
          <div className="profile-bio-box">
            <div className="skeleton-line short pulse" style={{ width: '120px' }}></div>
            <div className="skeleton-line long pulse" style={{ width: '320px', marginTop: '6px' }}></div>
          </div>
        </div>
      </div>

      <div className="profile-posts-grid">
        <div className="skeleton-grid-item pulse"></div>
        <div className="skeleton-grid-item pulse"></div>
        <div className="skeleton-grid-item pulse"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
