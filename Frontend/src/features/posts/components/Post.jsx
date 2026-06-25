import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { 
  HeartIcon, 
  CommentIcon, 
  ShareIcon, 
  BookmarkIcon, 
  MoreIcon 
} from '../../shared/components/Icons'
import { useToast } from '../../shared/hooks/useToast'
import { useAuth } from '../../auth/hooks/useAuth'

// Helper to extract timestamp from MongoDB ObjectId
const getRelativeTime = (objectId) => {
  try {
    if (!objectId || objectId.length !== 24) return 'Just now';
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
    const postDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - postDate;
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
};

// Helper to generate consistent base likes from postId
const getBaseLikes = (postId) => {
  if (!postId) return 12;
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    hash = postId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 200) + 15; // Between 15 and 215 likes
};

const Post = ({ user, post, handleLike, handleUnLike }) => {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Retrieve or initialize comments
  useEffect(() => {
    if (!post?._id) return;
    const storageKey = `comments_${post._id}`;
    const savedComments = localStorage.getItem(storageKey);
    
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      // Seed initial comments to make feed look rich
      const names = ['jessica_r', 'nature_coder', 'tech_guru', 'alex_wanderlust', 'charlie_creative'];
      const textPool = [
        'Wow, this is absolutely gorgeous! 😍',
        'Stunning capture, keep it up!',
        'Incredible details here 📸',
        'Love the colors and composition!',
        'Amazing! Which camera did you use?'
      ];
      
      const seedComments = [
        {
          id: 'seed-1',
          username: names[Math.abs(post._id.charCodeAt(0)) % names.length],
          profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
          text: textPool[Math.abs(post._id.charCodeAt(3)) % textPool.length],
          time: '2h'
        },
        {
          id: 'seed-2',
          username: names[(Math.abs(post._id.charCodeAt(5)) + 1) % names.length],
          profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
          text: textPool[(Math.abs(post._id.charCodeAt(7)) + 2) % textPool.length],
          time: '1h'
        }
      ];
      localStorage.setItem(storageKey, JSON.stringify(seedComments));
      setComments(seedComments);
    }

    // Check saved status
    const savedKey = `saved_posts_${currentUser?.username}`;
    const savedList = JSON.parse(localStorage.getItem(savedKey) || '[]');
    setIsSaved(savedList.includes(post._id));
  }, [post?._id, currentUser?.username]);

  const handleDoubleTap = async () => {
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);

    if (!post.isLiked) {
      try {
        await handleLike(post._id);
      } catch (err) {
        toast.error("Failed to like post");
      }
    }
  };

  const handleLikeClick = async () => {
    try {
      if (post.isLiked) {
        await handleUnLike(post._id);
      } else {
        await handleLike(post._id);
      }
    } catch (err) {
      toast.error("Failed to like post");
    }
  };

  const handleSaveClick = () => {
    const savedKey = `saved_posts_${currentUser?.username}`;
    let savedList = JSON.parse(localStorage.getItem(savedKey) || '[]');
    
    if (isSaved) {
      savedList = savedList.filter(id => id !== post._id);
      toast.info("Removed from saved items");
    } else {
      savedList.push(post._id);
      toast.success("Saved to bookmarks");
    }
    
    localStorage.setItem(savedKey, JSON.stringify(savedList));
    setIsSaved(!isSaved);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${user.username}`);
    toast.success("Profile link copied to clipboard!");
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const storageKey = `comments_${post._id}`;
    const commentObj = {
      id: Date.now().toString(),
      username: currentUser.username,
      profileImage: currentUser.profileImage || 'https://ik.imagekit.io/hnoglyswo0/avatar-gender-neutral-silhouette-vector-600nw-2470054311.webp',
      text: newComment.trim(),
      time: '1s'
    };

    const updatedComments = [...comments, commentObj];
    localStorage.setItem(storageKey, JSON.stringify(updatedComments));
    setComments(updatedComments);
    setNewComment("");
    toast.success("Comment posted");
  };

  const baseLikes = getBaseLikes(post._id);
  const totalLikes = post.isLiked ? baseLikes + 1 : baseLikes;

  const isLongCaption = post.caption && post.caption.length > 90;
  const displayedCaption = isExpanded || !isLongCaption 
    ? post.caption 
    : `${post.caption.slice(0, 90)}...`;

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <Link to={`/profile/${user.username}`} className="post-avatar-link">
          <img 
            className="post-avatar" 
            src={user.profileImage || 'https://ik.imagekit.io/hnoglyswo0/avatar-gender-neutral-silhouette-vector-600nw-2470054311.webp'} 
            alt={user.username} 
          />
        </Link>
        <div className="post-user-info">
          <Link to={`/profile/${user.username}`} className="post-username">
            {user.username}
          </Link>
          <span className="post-time">{getRelativeTime(post._id)}</span>
        </div>
        <div className="post-options-menu" style={{ position: 'relative' }}>
          <button className="post-options-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <MoreIcon size={20} />
          </button>
          {menuOpen && (
            <div className="post-dropdown-menu">
              <button onClick={() => { handleShareClick(); setMenuOpen(false); }}>Copy Link</button>
              {currentUser.username !== user.username && (
                <button 
                  onClick={() => { 
                    toast.success(`Muted ${user.username}`); 
                    setMenuOpen(false); 
                  }}
                  style={{ color: '#ef4444' }}
                >
                  Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Image */}
      <div className="post-image-container" onDoubleClick={handleDoubleTap}>
        <img className="post-image" src={post.imgUrl} alt="Post media" loading="lazy" />
        <div className={`double-tap-heart ${showHeartOverlay ? 'animate' : ''}`}>
          <HeartIcon filled size={72} />
        </div>
      </div>

      {/* Action Row */}
      <div className="post-actions">
        <button 
          onClick={handleLikeClick} 
          className={`action-btn ${post.isLiked ? 'liked animate-pop' : ''}`}
        >
          <HeartIcon filled={post.isLiked} size={26} />
        </button>
        <button 
          onClick={() => setShowAllComments(!showAllComments)} 
          className="action-btn"
        >
          <CommentIcon size={24} />
        </button>
        <button onClick={handleShareClick} className="action-btn">
          <ShareIcon size={24} />
        </button>
        <button 
          onClick={handleSaveClick} 
          className={`action-btn save-btn ${isSaved ? 'saved' : ''}`}
          style={{ marginLeft: 'auto' }}
        >
          <BookmarkIcon filled={isSaved} size={24} />
        </button>
      </div>

      {/* Post Details */}
      <div className="post-details">
        <p className="post-likes-count">{totalLikes.toLocaleString()} likes</p>
        
        {post.caption && (
          <div className="post-caption-box">
            <span className="post-caption-username">{user.username}</span>
            <span className="post-caption-text">{displayedCaption}</span>
            {isLongCaption && !isExpanded && (
              <button className="caption-more-btn" onClick={() => setIsExpanded(true)}>
                more
              </button>
            )}
          </div>
        )}

        {/* Comments Section */}
        {comments.length > 0 && (
          <div className="post-comments-preview">
            {!showAllComments && comments.length > 2 && (
              <button className="view-comments-btn" onClick={() => setShowAllComments(true)}>
                View all {comments.length} comments
              </button>
            )}
            
            <div className="comments-list">
              {(showAllComments ? comments : comments.slice(-2)).map((comment) => (
                <div key={comment.id} className="comment-item">
                  <span className="comment-username">{comment.username}</span>
                  <span className="comment-text">{comment.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Comment Input */}
        <form onSubmit={handleAddComment} className="comment-form-bar">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input-field"
          />
          {newComment.trim() && (
            <button type="submit" className="comment-submit-btn">
              Post
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Post