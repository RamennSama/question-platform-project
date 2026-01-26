import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import { Loader, AlertCircle, User, FileText, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';
import './UserPosts.css';

const UserPosts = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await postAPI.getPostsByUser(userId, 0, 50);
      const postsData = response.data.content || [];
      setPosts(postsData);
      if (postsData.length > 0) {
        setAuthorName(postsData[0].authorEmail);
      }
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('Không thể tải bài viết của người dùng này');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-posts-loading">
        <Loader className="spin" size={48} />
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-posts-error">
        <AlertCircle size={48} />
        <h2>{error}</h2>
        <Link to="/" className="btn-back">Về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="user-posts-container">
      <div className="user-posts-header">
        <User size={32} />
        <div>
          <h1>Bài viết của {authorName}</h1>
          <p>{posts.length} bài viết</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="user-posts-empty">
          <FileText size={48} />
          <p>Người dùng này chưa có bài viết nào</p>
        </div>
      ) : (
        <div className="user-posts-grid">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/posts/${post.slug}`} 
              className="user-post-card"
            >
              <div className="post-card-header">
                <h2>{post.title}</h2>
                <span className="post-date">
                  {new Date(post.createAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              
              <p className="post-excerpt">
                {post.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
              </p>

              <div className="post-tags">
                {post.tags?.slice(0, 3).map((tag) => (
                  <span key={tag.id} className="post-tag">
                    #{tag.name}
                  </span>
                ))}
              </div>

              <div className="post-stats">
                <span><Eye size={16} /> {post.viewsCount}</span>
                <span><ThumbsUp size={16} /> {post.likesCount}</span>
                <span><ThumbsDown size={16} /> {post.dislikesCount}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
