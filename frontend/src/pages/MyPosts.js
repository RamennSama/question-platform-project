import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Eye, ThumbsUp, Edit, Trash2, Loader } from 'lucide-react';
import './MyPosts.css';

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await postAPI.getAllPosts(0, 100, 'createAt');
      // Lọc chỉ bài viết của user hiện tại
      const myPosts = response.data.content.filter(post => post.authorEmail === user?.email);
      setPosts(myPosts);
    } catch (error) {
      console.error('Error fetching my posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await postAPI.deletePost(postId);
        alert('Đã xóa bài viết thành công');
        fetchMyPosts();
      } catch (error) {
        alert('Không thể xóa bài viết');
      }
    }
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
      <div className="loading-container">
        <Loader className="spin" size={48} />
        <p>Đang tải bài viết của bạn...</p>
      </div>
    );
  }

  return (
    <div className="my-posts-container">
      <div className="my-posts-header">
        <h1>Bài Viết Của Tôi</h1>
        <Link to="/create-post" className="btn-create">
          <Edit size={20} />
          Viết bài mới
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <p>Bạn chưa có bài viết nào</p>
          <Link to="/create-post" className="btn-create-first">
            Viết bài đầu tiên
          </Link>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="my-post-card">
              <div className="post-card-header">
                <Link to={`/post/${post.slug}`} className="post-title">
                  {post.title}
                </Link>
                <span className={`badge ${post.published ? 'badge-published' : 'badge-draft'}`}>
                  {post.published ? 'Đã xuất bản' : 'Bản nháp'}
                </span>
              </div>

              <div className="post-card-meta">
                <span className="meta-item">
                  <Calendar size={16} />
                  {formatDate(post.createAt)}
                </span>
                <span className="meta-item">
                  <Eye size={16} />
                  {post.viewsCount || 0} lượt xem
                </span>
                <span className="meta-item">
                  <ThumbsUp size={16} />
                  {post.likesCount || 0} thích
                </span>
              </div>

              <div className="post-card-actions">
                <Link to={`/post/${post.slug}`} className="btn-view">
                  Xem bài
                </Link>
                <button onClick={() => handleDelete(post.id)} className="btn-delete-small">
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
