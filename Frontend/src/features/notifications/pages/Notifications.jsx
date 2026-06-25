import React, { useState } from 'react';
import { Link } from 'react-router';
import { useToast } from '../../shared/hooks/useToast';
import { BellIcon, CloseIcon } from '../../shared/components/Icons';

const InitialNotifications = [
  {
    id: 'notif-1',
    type: 'follow_request',
    username: 'charlie_creative',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    text: 'requested to follow you.',
    time: '2 hours ago',
    status: 'pending' // pending, accepted, rejected
  },
  {
    id: 'notif-2',
    type: 'like',
    username: 'travel_lens',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    text: 'liked your photo.',
    time: '5 hours ago',
    postImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100'
  },
  {
    id: 'notif-3',
    type: 'follow',
    username: 'scenic_wanderer',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    text: 'started following you.',
    time: '1 day ago',
    status: 'following'
  },
  {
    id: 'notif-4',
    type: 'comment',
    username: 'pixel_artisan',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    text: 'commented: "Stunning shot! 📸"',
    time: '2 days ago',
    postImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100'
  }
];

const Notifications = () => {
  const toast = useToast();
  const [notifications, setNotifications] = useState(InitialNotifications);

  const handleAcceptRequest = (id, username) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, status: 'accepted' } : n)
    );
    toast.success(`Follow request from ${username} accepted!`);
  };

  const handleRejectRequest = (id, username) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.info(`Declined follow request from ${username}`);
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.info("Cleared all notifications");
  };

  return (
    <div className="notifications-page animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="page-title" style={{ margin: 0 }}>Notifications</h1>
        {notifications.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="list-action-btn secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state-card" style={{ marginTop: 20 }}>
          <div className="empty-state-icon-circle">
            <BellIcon size={32} />
          </div>
          <h3 className="empty-state-title">No notifications yet</h3>
          <p className="empty-state-text">
            When people like, comment, or request to follow your account, you will see them here.
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div key={notif.id} className="notification-item">
              <Link to={`/profile/${notif.username}`} className="item-left-side">
                <img 
                  className="user-avatar-circle" 
                  src={notif.profileImage} 
                  alt={notif.username} 
                />
                <div className="notification-text-box">
                  <span className="notification-desc">
                    <strong>{notif.username}</strong> {notif.text}
                  </span>
                  <span className="notification-timestamp">{notif.time}</span>
                </div>
              </Link>

              {/* Handle interactive Follow Request buttons */}
              {notif.type === 'follow_request' && notif.status === 'pending' && (
                <div className="actions-flex">
                  <button 
                    onClick={() => handleAcceptRequest(notif.id, notif.username)}
                    className="list-action-btn accept-btn"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleRejectRequest(notif.id, notif.username)}
                    className="list-action-btn reject-btn"
                  >
                    Decline
                  </button>
                </div>
              )}

              {notif.type === 'follow_request' && notif.status === 'accepted' && (
                <span className="list-action-btn secondary" style={{ cursor: 'default' }}>
                  Accepted
                </span>
              )}

              {/* Handle post thumbnails for likes/comments */}
              {notif.postImage && (
                <img 
                  src={notif.postImage} 
                  alt="Post preview" 
                  style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
