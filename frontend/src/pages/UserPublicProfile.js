import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI, postAPI } from '../services/api';
import { User, Mail, Calendar, Shield, ArrowLeft, FileText, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import './UserPublicProfile.css';

const UserPublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setPostsLoading(true);
      
      // Fetch user info
      const userResponse = await authAPI.getUserById(userId);
      setUserInfo(userResponse.data);
      
      // Fetch user's posts
      const postsResponse = await postAPI.getPostsByUser(userId);
      setPosts(postsResponse.data.content || postsResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
      setPostsLoading(false);
    }
  };

  const handlePostClick = (slug) => {
    navigate(`/posts/${slug}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="user-public-loading">
        <div className="spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="user-public-error">
        <h2>Không tìm thấy người dùng</h2>
        <button onClick={() => navigate('/')} className="btn-back">
          <ArrowLeft size={20} />
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  const isAdmin = userInfo.authorities?.some(a => a.authority === 'ROLE_ADMIN');

  return (
    <div className="user-public-container">
      <button onClick={() => navigate(-1)} className="btn-back-floating">
        <ArrowLeft size={20} />
      </button>

      {/* User Header */}
      <div className="user-public-header">
        <div className="header-gradient"></div>
        <div className="user-public-content">
          <div className="user-avatar-large">
            {userInfo.avatarUrl ? (
              <img src={userInfo.avatarUrl} alt={userInfo.fullName} />
            ) : (
              <div className="avatar-placeholder-large">
                <User size={80} />
              </div>
            )}
          </div>
          <div className="user-info-main">
            <h1>{userInfo.fullName}</h1>
            <div className="user-badges">
              <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>
                <Shield size={16} />
                {isAdmin ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Card */}
      <div className="user-details-card">
        <h2>Thông tin người dùng</h2>
        <div className="details-grid">
          <div className="detail-item">
            <Mail className="detail-icon" size={20} />
            <div>
              <label>Email</label>
              <p>{userInfo.email}</p>
            </div>
          </div>
          <div className="detail-item">
            <Calendar className="detail-icon" size={20} />
            <div>
              <label>Tham gia</label>
              <p>{formatDate(userInfo.createAt)}</p>
            </div>
          </div>
          <div className="detail-item">
            <FileText className="detail-icon" size={20} />
            <div>
              <label>Số bài viết</label>
              <p>{posts.length} bài viết</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="user-posts-section">
        <h2>
          <FileText size={24} />
          Bài viết của {userInfo.firstName}
        </h2>
        
        {postsLoading ? (
          <div className="posts-loading">
            <div className="spinner"></div>
            <p>Đang tải bài viết...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <FileText size={48} />
            <p>Chưa có bài viết nào</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <div 
                key={post.postId} 
                className="post-card"
                onClick={() => handlePostClick(post.slug)}
              >
                <div className="post-card-header">
                  <h3>{post.title}</h3>
                </div>
                
                <div 
                  className="post-card-content" 
                  dangerouslySetInnerHTML={{ 
                    __html: post.content?.substring(0, 150) + '...' 
                  }}
                />
                
                <div className="post-card-footer">
                  <div className="post-stats">
                    <span title="Lượt xem">
                      <Eye size={16} />
                      {post.views || 0}
                    </span>
                    <span title="Lượt thích">
                      <ThumbsUp size={16} />
                      {post.likedByUsers?.length || 0}
                    </span>
                    <span title="Bình luận">
                      <MessageCircle size={16} />
                      {post.comments?.length || 0}
                    </span>
                  </div>
                  <div className="post-date">
                    <Calendar size={14} />
                    {formatDate(post.createAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPublicProfile;
