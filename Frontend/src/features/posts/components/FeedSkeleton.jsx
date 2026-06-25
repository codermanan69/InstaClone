import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="post-card skeleton-card">
      <div className="post-header">
        <div className="skeleton-avatar pulse"></div>
        <div className="post-user-info">
          <div className="skeleton-line short pulse"></div>
          <div className="skeleton-line extra-short pulse"></div>
        </div>
      </div>
      <div className="skeleton-image pulse"></div>
      <div className="post-actions" style={{ padding: '12px 0 4px 0' }}>
        <div className="skeleton-icon pulse"></div>
        <div className="skeleton-icon pulse"></div>
        <div className="skeleton-icon pulse"></div>
        <div className="skeleton-icon pulse" style={{ marginLeft: 'auto' }}></div>
      </div>
      <div className="post-details" style={{ gap: '8px', display: 'flex', flexDirection: 'column' }}>
        <div className="skeleton-line medium pulse"></div>
        <div className="skeleton-line long pulse"></div>
      </div>
    </div>
  );
};

const FeedSkeleton = () => {
  return (
    <div className="feed-skeleton-container" style={{ width: '100%' }}>
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
};

export default FeedSkeleton;
