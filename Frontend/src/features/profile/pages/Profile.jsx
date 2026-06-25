import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { getMyPosts, getFeed, likePost, unLikePost } from '../../posts/services/post.api';
import { useToast } from '../../shared/hooks/useToast';
import ProfileSkeleton from '../components/ProfileSkeleton';
import '../style/profile.scss';
import PostCard from '../../posts/components/Post';
import { 
  HeartIcon, 
  CommentIcon, 
  CloseIcon, 
  LogoutIcon 
} from '../../shared/components/Icons';
import axios from 'axios';

// Helper to generate consistent stats based on username
const getStableStats = (username) => {
  if (!username) return { followers: 150, following: 95 };
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const followers = Math.abs(hash % 800) + 120;
  const following = Math.abs(hash % 400) + 60;
  return { followers, following };
};

const ProfilePresetAvatars = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
];

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, setUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerOffset, setFollowerOffset] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Edit Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  const isOwnProfile = currentUser?.username === username;

  const loadProfileData = async () => {
    setLoading(true);
    try {
      if (isOwnProfile) {
        // Logged-in user's profile
        setProfileUser(currentUser);
        const data = await getMyPosts();
        setPosts(data.posts || []);
      } else {
        // Other user's profile - extract info from feed
        const feedData = await getFeed();
        const userPosts = (feedData.posts || []).filter(
          (p) => p.user?.username === username
        );
        setPosts(userPosts);

        if (userPosts.length > 0) {
          setProfileUser(userPosts[0].user);
        } else {
          // If no posts in global feed, fetch a default model or mock
          setProfileUser({
            username,
            profileImage: 'https://ik.imagekit.io/hnoglyswo0/avatar-gender-neutral-silhouette-vector-600nw-2470054311.webp',
            bio: 'No bio provided.'
          });
        }

        // Check follow status in local storage
        const followKey = `following_list_${currentUser?.username}`;
        const followList = JSON.parse(localStorage.getItem(followKey) || '[]');
        setIsFollowing(followList.includes(username));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
    // Reset follower offset on user change
    setFollowerOffset(0);
  }, [username, currentUser, isOwnProfile]);

  const handleFollowToggle = async () => {
    const followKey = `following_list_${currentUser?.username}`;
    let followList = JSON.parse(localStorage.getItem(followKey) || '[]');

    try {
      if (isFollowing) {
        // Unfollow
        await axios.post(`http://localhost:3000/api/users/unfollow/${username}`, {}, { withCredentials: true });
        followList = followList.filter(name => name !== username);
        setFollowerOffset(-1);
        setIsFollowing(false);
        toast.info(`Unfollowed ${username}`);
      } else {
        // Follow
        await axios.post(`http://localhost:3000/api/users/follow/${username}`, {}, { withCredentials: true });
        followList.push(username);
        setFollowerOffset(1);
        setIsFollowing(true);
        toast.success(`Following ${username}`);
      }
      localStorage.setItem(followKey, JSON.stringify(followList));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Follow request failed");
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleOpenEdit = () => {
    setEditBio(profileUser?.bio || "");
    setEditAvatar(profileUser?.profileImage || "");
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...currentUser,
      bio: editBio.trim(),
      profileImage: editAvatar
    };
    
    // Save to localStorage
    localStorage.setItem(`profile_edits_${currentUser.username}`, JSON.stringify({
      bio: editBio.trim(),
      profileImage: editAvatar
    }));

    // Update Auth State
    setUser(updatedUser);
    setProfileUser(updatedUser);
    setShowEditModal(false);
    toast.success("Profile updated successfully!");
  };

  const handlePostDetailLike = async (postId) => {
    await likePost(postId);
    
    // Refresh posts list
    if (isOwnProfile) {
      const data = await getMyPosts();
      setPosts(data.posts || []);
    } else {
      const feedData = await getFeed();
      setPosts((feedData.posts || []).filter((p) => p.user?.username === username));
    }

    // Update selected post state to reflect liked status
    setSelectedPost(prev => prev ? { ...prev, isLiked: true } : null);
  };

  const handlePostDetailUnLike = async (postId) => {
    await unLikePost(postId);

    // Refresh posts list
    if (isOwnProfile) {
      const data = await getMyPosts();
      setPosts(data.posts || []);
    } else {
      const feedData = await getFeed();
      setPosts((feedData.posts || []).filter((p) => p.user?.username === username));
    }

    // Update selected post state
    setSelectedPost(prev => prev ? { ...prev, isLiked: false } : null);
  };

  if (loading || !profileUser) {
    return <ProfileSkeleton />;
  }

  const { followers, following } = getStableStats(username);
  const displayFollowers = followers + followerOffset;

  return (
    <div className="profile-container animate-fade-in">
      {/* Cover */}
      <div className="profile-cover"></div>

      {/* Profile Info Details Card */}
      <div className="profile-header-wrapper">
        <div className="profile-avatar-container">
          <img 
            className="profile-avatar-img" 
            src={profileUser.profileImage || 'https://ik.imagekit.io/hnoglyswo0/avatar-gender-neutral-silhouette-vector-600nw-2470054311.webp'} 
            alt={profileUser.username} 
          />
        </div>

        <div className="profile-meta-details">
          <div className="profile-name-row">
            <h1 className="profile-username-text">{profileUser.username}</h1>
            
            {isOwnProfile ? (
              <>
                <button className="profile-action-btn" onClick={handleOpenEdit}>
                  Edit Profile
                </button>
                <button 
                  className="profile-action-btn logout-btn-mob" 
                  onClick={handleLogout}
                  style={{ display: 'inline-flex' }}
                >
                  <LogoutIcon size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button 
                onClick={handleFollowToggle}
                className={`profile-action-btn ${isFollowing ? 'following-btn' : 'follow-btn'}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="profile-stats-row">
            <div className="stat-item">
              <span>{posts.length}</span> posts
            </div>
            <div className="stat-item">
              <span>{displayFollowers.toLocaleString()}</span> followers
            </div>
            <div className="stat-item">
              <span>{following.toLocaleString()}</span> following
            </div>
          </div>

          <div className="profile-bio-box">
            <span className="profile-bio-name">{profileUser.username}</span>
            <p className="profile-bio-text">
              {profileUser.bio || "No bio yet. Tap 'Edit Profile' to add one."}
            </p>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      {posts.length === 0 ? (
        <div className="empty-state-card" style={{ marginTop: 12 }}>
          <div className="empty-state-icon-circle">
            <CommentIcon size={32} />
          </div>
          <h3 className="empty-state-title">No Posts Yet</h3>
          <p className="empty-state-text">
            {isOwnProfile 
              ? "Share your first photo or video using the Create Post modal!" 
              : "This user has not posted anything yet."}
          </p>
        </div>
      ) : (
        <div className="profile-posts-grid">
          {posts.map((post) => {
            const seedLikes = Math.abs(post._id.charCodeAt(post._id.length - 1)) % 100 + 5;
            const seedComments = Math.abs(post._id.charCodeAt(0)) % 12 + 1;
            return (
              <div 
                key={post._id} 
                className="grid-post-item"
                onClick={() => setSelectedPost(post)}
              >
                <img className="grid-post-img" src={post.imgUrl} alt="Post thumbnail" loading="lazy" />
                <div className="grid-post-overlay">
                  <div className="overlay-stat">
                    <HeartIcon filled size={20} />
                    <span>{seedLikes}</span>
                  </div>
                  <div className="overlay-stat">
                    <CommentIcon size={20} />
                    <span>{seedComments}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="close-modal-btn" onClick={() => setShowEditModal(false)}>
                <CloseIcon size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="post-create-form edit-profile-fields">
                {/* Avatar presets */}
                <div className="avatar-presets">
                  <span>Choose Profile Picture Preset</span>
                  <div className="presets-row">
                    {ProfilePresetAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`preset-img-btn ${editAvatar === url ? 'selected' : ''}`}
                        onClick={() => setEditAvatar(url)}
                      >
                        <img src={url} alt={`Preset ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct image url input */}
                <div className="input-group">
                  <label htmlFor="avatarUrl">Custom Image URL</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="avatarUrl"
                      placeholder="Paste image URL..."
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                    />
                  </div>
                </div>

                {/* Bio text field */}
                <div className="input-group">
                  <label htmlFor="bioEdit">Bio</label>
                  <div className="caption-input-group">
                    <textarea 
                      id="bioEdit"
                      placeholder="Write something about yourself..."
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      style={{ minHeight: '80px' }}
                    />
                  </div>
                </div>

                <button className="submit-post-btn" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div 
            className="modal-container" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 600, background: '#0b0f19' }}
          >
            <div className="modal-header" style={{ borderBottom: 'none' }}>
              <h2>Post Details</h2>
              <button className="close-modal-btn" onClick={() => setSelectedPost(null)}>
                <CloseIcon size={20} />
              </button>
            </div>
            <div style={{ padding: '0 8px 16px 8px' }}>
              <PostCard 
                user={profileUser}
                post={selectedPost}
                handleLike={handlePostDetailLike}
                handleUnLike={handlePostDetailUnLike}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
