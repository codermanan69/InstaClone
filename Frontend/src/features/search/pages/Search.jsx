import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import { getFeed } from '../../posts/services/post.api';
import { useToast } from '../../shared/hooks/useToast';
import { SearchIcon, CloseIcon } from '../../shared/components/Icons';
import axios from 'axios';

const Search = () => {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize and load users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Load feed to extract posting users
        const feedData = await getFeed();
        const posts = feedData.posts || [];
        
        // Extract unique users
        const usersMap = {};
        posts.forEach(post => {
          if (post.user && post.user.username !== currentUser?.username) {
            usersMap[post.user.username] = {
              username: post.user.username,
              profileImage: post.user.profileImage,
              bio: post.user.bio || 'Instagram Creator',
              email: post.user.email
            };
          }
        });

        // Add a few preset mock creators to make search feel full and alive
        const mockCreators = [
          {
            username: 'scenic_wanderer',
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
            bio: 'Landscape photog | Explorer 🏔️',
            email: 'scenic@instaclone.com'
          },
          {
            username: 'travel_lens',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            bio: 'Wandering where the wifi is weak ✈️',
            email: 'lens@instaclone.com'
          },
          {
            username: 'pixel_artisan',
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
            bio: 'Digital art & visual story teller 🎨',
            email: 'artisan@instaclone.com'
          }
        ];

        mockCreators.forEach(mock => {
          if (mock.username !== currentUser?.username && !usersMap[mock.username]) {
            usersMap[mock.username] = mock;
          }
        });

        const usersList = Object.values(usersMap);
        setAllUsers(usersList);
        setFilteredUsers(usersList);

        // Load following list
        const followKey = `following_list_${currentUser?.username}`;
        setFollowingList(JSON.parse(localStorage.getItem(followKey) || '[]'));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load suggested creators");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser?.username]);

  // Apply search query filter
  useEffect(() => {
    if (!query.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const lower = query.toLowerCase();
      const filtered = allUsers.filter(
        user => 
          user.username.toLowerCase().includes(lower) || 
          user.bio.toLowerCase().includes(lower)
      );
      setFilteredUsers(filtered);
    }
  }, [query, allUsers]);

  const handleFollowToggle = async (username) => {
    const isFollowing = followingList.includes(username);
    const followKey = `following_list_${currentUser?.username}`;
    let updatedList = [...followingList];

    try {
      if (isFollowing) {
        // Unfollow call
        await axios.post(`http://localhost:3000/api/users/unfollow/${username}`, {}, { withCredentials: true });
        updatedList = updatedList.filter(name => name !== username);
        toast.info(`Unfollowed ${username}`);
      } else {
        // Follow call
        await axios.post(`http://localhost:3000/api/users/follow/${username}`, {}, { withCredentials: true });
        updatedList.push(username);
        toast.success(`Following ${username}`);
      }
      
      localStorage.setItem(followKey, JSON.stringify(updatedList));
      setFollowingList(updatedList);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="search-page animate-fade-in">
      <h1 className="page-title">Search</h1>

      {/* Search Input Bar */}
      <div className="search-bar-container">
        <SearchIcon className="search-icon-left" size={20} />
        <input
          type="text"
          className="search-input-field"
          placeholder="Search creators by username or bio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="clear-search-btn" onClick={() => setQuery("")}>
            <CloseIcon size={16} />
          </button>
        )}
      </div>

      {/* Results / Suggestions list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <span className="spinner" style={{ width: 32, height: 32, borderTopColor: '#f43f5e' }}></span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon-circle">
            <SearchIcon size={32} />
          </div>
          <h3 className="empty-state-title">No results found</h3>
          <p className="empty-state-text">
            We couldn't find any creators matching "{query}". Try checking the spelling.
          </p>
        </div>
      ) : (
        <div className="results-container">
          <h2 style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600, marginBottom: '16px' }}>
            {query ? 'Search Results' : 'Suggested Creators'}
          </h2>
          
          <div className="results-list">
            {filteredUsers.map((user) => {
              const isFollowing = followingList.includes(user.username);
              return (
                <div key={user.username} className="search-user-item">
                  <Link to={`/profile/${user.username}`} className="item-left-side">
                    <img 
                      className="user-avatar-circle" 
                      src={user.profileImage || 'https://ik.imagekit.io/hnoglyswo0/avatar-gender-neutral-silhouette-vector-600nw-2470054311.webp'} 
                      alt={user.username} 
                    />
                    <div className="user-text-details">
                      <span className="display-username">{user.username}</span>
                      <span className="display-subtext">{user.bio}</span>
                    </div>
                  </Link>
                  
                  <button
                    onClick={() => handleFollowToggle(user.username)}
                    className={`list-action-btn ${isFollowing ? 'following' : ''}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
