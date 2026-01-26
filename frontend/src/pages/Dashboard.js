import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, postAPI, commentAPI } from '../services/api';
import { 
  Users, FileText, MessageCircle, Tag, Eye, ThumbsUp, ThumbsDown, 
  TrendingUp, Loader, CheckCircle, FileEdit, Trash2, AlertCircle, Check, X 
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    // Lấy tab từ localStorage, mặc định là 'stats'
    return localStorage.getItem('dashboardActiveTab') || 'stats';
  });
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    // Lưu activeTab vào localStorage mỗi khi thay đổi
    localStorage.setItem('dashboardActiveTab', activeTab);
    
    if (activeTab === 'posts') {
      fetchAllPosts();
    } else if (activeTab === 'comments') {
      fetchAllComments();
    } else if (activeTab === 'users') {
      fetchAllUsers();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      alert('Không thể tải thống kê. Bạn cần quyền Admin!');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllPostsForAdmin(0, 100);
      setPosts(response.data.content || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Không thể tải danh sách bài viết!');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComments = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllCommentsForAdmin();
      setComments(response.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('Không thể tải danh sách bình luận!');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId, postTitle) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài viết "${postTitle}"?`)) {
      return;
    }
    
    try {
      await postAPI.deletePost(postId);
      alert('Xóa bài viết thành công!');
      fetchAllPosts();
      fetchDashboardStats();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Không thể xóa bài viết!');
    }
  };

  const handleDeleteComment = async (commentId, postSlug) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
      return;
    }
    
    try {
      await commentAPI.deleteComment(postSlug, commentId);
      alert('Xóa bình luận thành công!');
      fetchAllComments();
      fetchDashboardStats();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Không thể xóa bình luận!');
    }
  };

  const handleApprovePost = async (postId, postTitle) => {
    if (!window.confirm(`Duyệt bài viết "${postTitle}"?`)) {
      return;
    }
    
    try {
      const response = await postAPI.approvePost(postId);
      if (response.status === 200) {
        alert('✅ Đã duyệt bài viết thành công!');
        fetchAllPosts();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error('Error approving post:', error);
      if (error.response?.status === 403) {
        alert('❌ Bạn không có quyền duyệt bài viết!');
      } else {
        alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể duyệt bài viết!'));
      }
    }
  };

  const handleUnpublishPost = async (postId, postTitle) => {
    if (!window.confirm(`Bỏ xuất bản bài viết "${postTitle}"?`)) {
      return;
    }
    
    try {
      const response = await postAPI.unpublishPost(postId);
      if (response.status === 200) {
        alert('✅ Đã bỏ xuất bản bài viết!');
        fetchAllPosts();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error('Error unpublishing post:', error);
      if (error.response?.status === 403) {
        alert('❌ Bạn không có quyền bỏ xuất bản!');
      } else {
        alert('❌ Lỗi: ' + (error.response?.data?.message || 'Không thể bỏ xuất bản!'));
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>
            <TrendingUp size={36} />
            Dashboard Admin
          </h1>
          <p>Tổng quan và quản lý hệ thống blog</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <TrendingUp size={20} />
          Thống kê
        </button>
        <button 
          className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <FileText size={20} />
          Quản lý bài viết
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Quản lý Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <MessageCircle size={20} />
          Quản lý bình luận
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && renderStatsTab()}
      {activeTab === 'posts' && renderPostsTab()}
      {activeTab === 'users' && renderUsersTab()}
      {activeTab === 'comments' && renderCommentsTab()}
    </div>
  );

  function renderStatsTab() {
    if (loading) {
      return (
        <div className="loading-container">
          <Loader className="spin" size={48} />
          <p>Đang tải dashboard...</p>
        </div>
      );
    }

    if (!stats) {
      return (
        <div className="error-message">
          <h2>Không có dữ liệu</h2>
          <p>Vui lòng thử lại sau</p>
        </div>
      );
    }

    const statCards = [
      {
        title: 'Tổng Bài Viết',
        value: stats.totalPosts,
        icon: <FileText size={32} />,
        color: '#667eea',
        bgColor: '#f0f3ff'
      },
      {
        title: 'Người Dùng',
        value: stats.totalUsers,
        icon: <Users size={32} />,
        color: '#f093fb',
        bgColor: '#fef0ff'
      },
      {
        title: 'Bình Luận',
        value: stats.totalComments,
        icon: <MessageCircle size={32} />,
        color: '#4facfe',
        bgColor: '#e8f7ff'
      },
      {
        title: 'Tags',
        value: stats.totalTags,
        icon: <Tag size={32} />,
        color: '#43e97b',
        bgColor: '#e8fff4'
      },
      {
        title: 'Đã Xuất Bản',
        value: stats.publishedPosts,
        icon: <CheckCircle size={32} />,
        color: '#38ef7d',
        bgColor: '#e8fff0'
      },
      {
        title: 'Bản Nháp',
        value: stats.draftPosts,
        icon: <FileEdit size={32} />,
        color: '#fa709a',
        bgColor: '#ffe8f0'
      },
      {
        title: 'Lượt Xem',
        value: stats.totalViews,
        icon: <Eye size={32} />,
        color: '#a8edea',
        bgColor: '#e8fffe'
      },
      {
        title: 'Lượt Thích',
        value: stats.totalLikes,
        icon: <ThumbsUp size={32} />,
        color: '#5ee7df',
        bgColor: '#e8fffd'
      },
      {
        title: 'Không Thích',
        value: stats.totalDislikes,
        icon: <ThumbsDown size={32} />,
        color: '#ff6b9d',
        bgColor: '#ffe8f0'
      }
    ];

    return (
      <>
        <div className="stats-grid">
          {statCards.map((card, index) => (
            <div 
              key={index} 
              className="stat-card"
              style={{ 
                borderLeft: `4px solid ${card.color}`,
                background: `linear-gradient(135deg, ${card.bgColor} 0%, white 100%)`
              }}
            >
              <div 
                className="stat-icon"
                style={{ color: card.color }}
              >
                {card.icon}
              </div>
              <div className="stat-content">
                <h3>{card.title}</h3>
                <p className="stat-value">{card.value?.toLocaleString() || 0}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-insights">
          <div className="insight-card">
            <h3>📊 Phân Tích Nhanh</h3>
            <ul>
              <li>
                <strong>Tỷ lệ xuất bản:</strong>{' '}
                {stats.totalPosts > 0 
                  ? ((stats.publishedPosts / stats.totalPosts) * 100).toFixed(1) 
                  : 0}%
              </li>
              <li>
                <strong>Trung bình lượt xem/bài:</strong>{' '}
                {stats.totalPosts > 0 
                  ? Math.round(stats.totalViews / stats.totalPosts) 
                  : 0} lượt
              </li>
              <li>
                <strong>Tương tác:</strong>{' '}
                {(stats.totalLikes + stats.totalDislikes).toLocaleString()} lượt
              </li>
              <li>
                <strong>Tỷ lệ thích:</strong>{' '}
                {(stats.totalLikes + stats.totalDislikes) > 0 
                  ? ((stats.totalLikes / (stats.totalLikes + stats.totalDislikes)) * 100).toFixed(1) 
                  : 0}%
              </li>
            </ul>
          </div>

          <div className="insight-card">
            <h3>🎯 Hoạt Động</h3>
            <ul>
              <li>
                <strong>Bài viết trung bình/người dùng:</strong>{' '}
                {stats.totalUsers > 0 
                  ? (stats.totalPosts / stats.totalUsers).toFixed(1) 
                  : 0} bài
              </li>
              <li>
                <strong>Bình luận trung bình/bài:</strong>{' '}
                {stats.totalPosts > 0 
                  ? (stats.totalComments / stats.totalPosts).toFixed(1) 
                  : 0} comment
              </li>
              <li>
                <strong>Tags trung bình/bài:</strong>{' '}
                {stats.totalPosts > 0 
                  ? (stats.totalTags / stats.totalPosts).toFixed(1) 
                  : 0} tags
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }

  function renderPostsTab() {
    if (loading) {
      return (
        <div className="loading-container">
          <Loader className="spin" size={48} />
          <p>Đang tải bài viết...</p>
        </div>
      );
    }

    return (
      <div className="admin-table-container">
        <div className="table-header">
          <h2><FileText size={24} /> Quản lý bài viết ({posts.length})</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>Chưa có bài viết nào</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Trạng thái</th>
                <th>Lượt xem</th>
                <th>Thích</th>
                <th>Không thích</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td className="post-title">
                    <span 
                      style={{ 
                        color: '#667eea', 
                        cursor: 'pointer', 
                        fontWeight: '600'
                      }}
                      onClick={() => navigate(`/post/${post.slug}`)}
                      title="Xem bài viết"
                    >
                      {post.title}
                    </span>
                  </td>
                  <td>{post.authorEmail}</td>
                  <td>
                    <span className={`badge ${post.published ? 'badge-success' : 'badge-draft'}`}>
                      {post.published ? 'Xuất bản' : 'Nháp'}
                    </span>
                  </td>
                  <td>{post.viewsCount}</td>
                  <td>{post.likesCount}</td>
                  <td>{post.dislikesCount}</td>
                  <td>{new Date(post.createAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      {!post.published ? (
                        <button 
                          className="btn-approve"
                          onClick={() => handleApprovePost(post.id, post.title)}
                          title="Duyệt bài viết"
                        >
                          <Check size={18} />
                        </button>
                      ) : (
                        <button 
                          className="btn-unpublish"
                          onClick={() => handleUnpublishPost(post.id, post.title)}
                          title="Bỏ xuất bản"
                        >
                          <X size={18} />
                        </button>
                      )}
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeletePost(post.id, post.title)}
                        title="Xóa bài viết"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  function renderCommentsTab() {
    if (loading) {
      return (
        <div className="loading-container">
          <Loader className="spin" size={48} />
          <p>Đang tải bình luận...</p>
        </div>
      );
    }

    return (
      <div className="admin-table-container">
        <div className="table-header">
          <h2><MessageCircle size={24} /> Quản lý bình luận ({comments.length})</h2>
        </div>
        
        {comments.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>Chưa có bình luận nào</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nội dung</th>
                <th>Tác giả</th>
                <th>Bài viết</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td className="comment-content">{comment.content}</td>
                  <td>{comment.author}</td>
                  <td className="post-title">
                    <a href={`/posts/${comment.postSlug}`} target="_blank" rel="noopener noreferrer">
                      {comment.postTitle}
                    </a>
                  </td>
                  <td>{new Date(comment.createAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteComment(comment.id, comment.postSlug)}
                      title="Xóa bình luận"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  function renderUsersTab() {
    if (loading) {
      return (
        <div className="loading-container">
          <Loader className="spin" size={48} />
          <p>Đang tải người dùng...</p>
        </div>
      );
    }

    return (
      <div className="admin-table-container">
        <div className="table-header">
          <h2><Users size={24} /> Quản lý người dùng ({users.length})</h2>
        </div>
        
        {users.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>Chưa có người dùng nào</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <span 
                      style={{ 
                        color: '#667eea', 
                        cursor: 'pointer', 
                        fontWeight: '600'
                      }}
                      onClick={() => navigate(`/user/${user.id}`)}
                      title="Xem hồ sơ"
                    >
                      {user.firstName} {user.lastName}
                    </span>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.authorities?.some(a => a.authority === 'ROLE_ADMIN') ? 'badge-success' : 'badge-draft'}`}>
                      {user.authorities?.some(a => a.authority === 'ROLE_ADMIN') ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>{new Date(user.createAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button 
                      className="btn-view"
                      onClick={() => navigate(`/user/${user.id}`)}
                      title="Xem hồ sơ"
                      style={{
                        padding: '8px 12px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#764ba2'}
                      onMouseLeave={(e) => e.target.style.background = '#667eea'}
                    >
                      <Eye size={18} style={{ verticalAlign: 'middle' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
};

export default Dashboard;
