import React, { useEffect } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import FeedSkeleton from '../components/FeedSkeleton'
import { usePost } from '../hook/usePost'
import { CompassIcon } from '../../shared/components/Icons'

const Feed = () => {
    const { feed, handleGetFeed, loading, handleLike, handleUnLike } = usePost()

    useEffect(() => {
        handleGetFeed()
    }, [])

    if (loading || !feed) {
        return (
            <div className="feed-container">
                <FeedSkeleton />
            </div>
        )
    }

    return (
        <div className="feed-container">
            {feed.length === 0 ? (
                <div className="empty-state-card animate-fade-in">
                    <div className="empty-state-icon-circle">
                        <CompassIcon size={36} />
                    </div>
                    <h2 className="empty-state-title">Welcome to your feed</h2>
                    <p className="empty-state-text">
                        Follow creators or create your own posts to fill up your feed.
                    </p>
                </div>
            ) : (
                <div className="feed-posts-column">
                    {feed.map((post) => (
                        <Post
                            key={post._id}
                            user={post.user}
                            post={post}
                            handleLike={handleLike}
                            handleUnLike={handleUnLike}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Feed