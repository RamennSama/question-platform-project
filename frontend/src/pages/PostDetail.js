import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postAPI, commentAPI, postInteractionAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, User, Tag, ArrowLeft, Trash2, MessageCircle, 
  Send, Loader, Edit, ThumbsUp, ThumbsDown, Eye 
} from 'lucide-react';
import './PostDetail.css';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [userInteraction, setUserInteraction] = useState(null); // 'LIKE', 'DISLIKE', or null

  useEffect(() => {
    let isMounted = true;
    
    const loadPost = async () => {
      if (isMounted) {
        await fetchPostAndComments();
      }
    };
    
    loadPost();
    
    return () => {
      isMounted = false;
    };
  }, [slug]);

  const fetchPostAndComments = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        postAPI.getPostBySlug(slug),
        commentAPI.getCommentsByPost(slug)
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
      setLikesCount(postRes.data.likesCount || 0);
      setDislikesCount(postRes.data.dislikesCount || 0);
      setViewsCount(postRes.data.viewsCount || 0);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Không thể tải bài viết');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await postAPI.deletePost(post.id);
        alert('Đã xóa bài viết thành công');
        navigate('/');
      } catch (error) {
        alert('Không thể xóa bài viết');
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await commentAPI.createComment(slug, newComment);
      setNewComment('');
      await fetchPostAndComments();
    } catch (error) {
      alert('Không thể gửi bình luận');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      try {
        await commentAPI.deleteComment(commentId);
        await fetchPostAndComments();
      } catch (error) {
        alert('Không thể xóa bình luận');
      }
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thích bài viết');
      return;
    }
    try {
      const response = await postInteractionAPI.likePost(slug);
      // Cập nhật từ response backend
      setLikesCount(response.data.likesCount);
      setDislikesCount(response.data.dislikesCount);
      
      // Cập nhật trạng thái user interaction
      if (userInteraction === 'LIKE') {
        setUserInteraction(null); // Bỏ like
      } else {
        setUserInteraction('LIKE'); // Like hoặc chuyển từ dislike
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Không thể thích bài viết');
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để đánh giá bài viết');
      return;
    }
    try {
      const response = await postInteractionAPI.dislikePost(slug);
      // Cập nhật từ response backend
      setLikesCount(response.data.likesCount);
      setDislikesCount(response.data.dislikesCount);
      
      // Cập nhật trạng thái user interaction
      if (userInteraction === 'DISLIKE') {
        setUserInteraction(null); // Bỏ dislike
      } else {
        setUserInteraction('DISLIKE'); // Dislike hoặc chuyển từ like
      }
    } catch (error) {
      console.error('Error disliking post:', error);
      alert('Không thể đánh giá bài viết');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spin" size={48} />
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const canEdit = isAuthenticated && user?.email === post.authorEmail;

  return (
    <div className="post-detail-container">
      <div className="post-detail-content">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <article className="post-article">
          <div className="post-header">
            <h1>{post.title}</h1>
            
            <div className="post-meta-detail">
              <div className="meta-item">
                <User size={18} />
                <span>{post.authorEmail}</span>
              </div>
              <div className="meta-item">
                <Calendar size={18} />
                <span>{formatDate(post.createAt)}</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="post-tags-detail">
                <Tag size={18} />
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {canEdit && (
              <div className="post-actions">
                <button className="btn-delete" onClick={handleDeletePost}>
                  <Trash2 size={18} />
                  Xóa bài viết
                </button>
              </div>
            )}
          </div>

          <div 
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="post-interactions">
            <div className="interaction-stats">
              <span className="stat-item">
                <Eye size={18} />
                {viewsCount} lượt xem
              </span>
              <span className="stat-item">
                <ThumbsUp size={18} />
                {likesCount} thích
              </span>
              <span className="stat-item">
                <ThumbsDown size={18} />
                {dislikesCount}
              </span>
            </div>

            <div className="interaction-buttons">
              <button 
                className={`btn-interaction btn-like ${userInteraction === 'LIKE' ? 'active' : ''}`}
                onClick={handleLike}
                disabled={!isAuthenticated}
              >
                <ThumbsUp size={20} />
                {userInteraction === 'LIKE' ? 'Đã thích' : 'Thích'}
              </button>
              <button 
                className={`btn-interaction btn-dislike ${userInteraction === 'DISLIKE' ? 'active' : ''}`}
                onClick={handleDislike}
                disabled={!isAuthenticated}
              >
                <ThumbsDown size={20} />
                {userInteraction === 'DISLIKE' ? 'Đã đánh giá' : 'Không thích'}
              </button>
            </div>
          </div>
        </article>

        <section className="comments-section">
          <h2>
            <MessageCircle size={24} />
            Bình luận ({comments.length})
          </h2>

          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                rows={4}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader className="spin" size={18} />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Gửi bình luận
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="auth-required">
              Vui lòng <Link to="/login">đăng nhập</Link> để bình luận
            </div>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">Chưa có bình luận nào</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-author">
                      <User size={16} />
                      <strong 
                        style={{ 
                          color: '#667eea', 
                          cursor: 'pointer' 
                        }}
                        onClick={() => navigate(`/user/${comment.userId}`)}
                        title="Xem hồ sơ"
                      >
                        {comment.author}
                      </strong>
                    </div>
                    <div className="comment-meta">
                      <span className="comment-date">
                        {formatDate(comment.createAt)}
                      </span>
                      {isAuthenticated && user?.email === comment.userEmail && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="btn-delete-comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;
