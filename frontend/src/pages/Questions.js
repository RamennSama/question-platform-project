import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postAPI } from '../services/api';
import { Calendar, User, Tag, Search, ChevronLeft, ChevronRight, Eye, ThumbsUp, ThumbsDown, MessageCircle, Loader } from 'lucide-react';
import './Questions.css';

const Questions = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postAPI.getAllPosts(page, 15, 'createAt');
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spin" size={48} />
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <div className="hero-section" style={{ padding: '1.5rem 2rem 1.25rem' }}>
        <div className="hero-content">
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.35rem', fontWeight: '700', letterSpacing: '0.3px' }}>
            Tất cả bài viết
          </h1>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem', opacity: '0.95', fontWeight: '400', letterSpacing: '0.2px' }}>
            Khám phá và chia sẻ kiến thức với cộng đồng
          </p>
          <div className="search-box" style={{ maxWidth: '400px', padding: '0.5rem 0.9rem', borderRadius: '8px' }}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '0.95rem', fontWeight: '500' }}
            />
          </div>
        </div>
      </div>

      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <p>Không tìm thấy câu hỏi nào</p>
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {filteredPosts.map((post) => (
                <Link 
                  to={`/posts/${post.slug}`} 
                  key={post.postId} 
                  className="post-card"
                >
                  <div className="post-card-header">
                    <h2>{post.title}</h2>
                  </div>
                  
                  <p className="post-excerpt">
                    {truncateContent(post.content)}
                  </p>

                  <div className="post-meta">
                    <div className="meta-item">
                      <User size={16} />
                      <span 
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/user/${post.author?.id}`);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {post.author?.firstName} {post.author?.lastName}
                      </span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{formatDate(post.createAt)}</span>
                    </div>
                    <div className="meta-item">
                      <Eye size={16} />
                      <span>{post.viewsCount || 0}</span>
                    </div>
                    <div className="meta-item">
                      <ThumbsUp size={16} />
                      <span>{post.likedByUsers?.length || 0}</span>
                    </div>
                    <div className="meta-item">
                      <ThumbsDown size={16} />
                      <span>{post.dislikedByUsers?.length || 0}</span>
                    </div>
                    <div className="meta-item">
                      <MessageCircle size={16} />
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      <Tag size={14} />
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag.tagId} className="tag-badge">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="pagination-btn"
                >
                  <ChevronLeft size={20} />
                  Trước
                </button>
                
                <span className="pagination-info">
                  Trang {page + 1} / {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="pagination-btn"
                >
                  Sau
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Questions;
