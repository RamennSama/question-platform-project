import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postAPI } from '../services/api';
import { MessageSquare, Users, TrendingUp, Search, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ posts: 0, users: 0, comments: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Gọi API stats mới
      const statsResponse = await postAPI.getPublicStats();
      setStats({
        posts: statsResponse.data.totalPosts || 0,
        users: statsResponse.data.totalUsers || 0,
        comments: statsResponse.data.totalComments || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="home-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={16} />
            <span>Nền tảng chia sẻ kiến thức cho Developer</span>
          </div>
          <h1 className="hero-title">
            Nơi mọi bài viết <br />
            <span className="gradient-text">đều có giá trị</span>
          </h1>
          <p className="hero-description">
            Đăng bài viết, chia sẻ kiến thức và kết nối với cộng đồng developer.
            Khám phá những kiến thức bổ ích cho sự nghiệp của bạn.
          </p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <>
                <button className="btn-primary" onClick={() => navigate('/create-post')}>
                  <MessageSquare size={20} />
                  Tạo bài viết
                </button>
                <button className="btn-secondary" onClick={() => navigate('/questions')}>
                  Xem bài viết
                  <ArrowRight size={20} />
                </button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={() => navigate('/register')}>
                  Bắt đầu miễn phí
                </button>
                <button className="btn-secondary" onClick={() => navigate('/login')}>
                  Đăng nhập
                  <ArrowRight size={20} />
                </button>
              </>
            )}
          </div>
          
          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <MessageSquare size={24} />
              <div>
                <h3>{stats.posts}+</h3>
                <p>Bài viết</p>
              </div>
            </div>
            <div className="stat-item">
              <Users size={24} />
              <div>
                <h3>{stats.users}+</h3>
                <p>Thành viên</p>
              </div>
            </div>
            <div className="stat-item">
              <TrendingUp size={24} />
              <div>
                <h3>{stats.comments}+</h3>
                <p>Bình luận</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>Tại sao chọn Q&A Platform?</h2>
          <p>Nền tảng được thiết kế dành riêng cho developer Việt Nam</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <MessageSquare size={32} />
            </div>
            <h3>Chia sẻ kiến thức</h3>
            <p>Đăng bài viết và nhận phản hồi từ cộng đồng developer trong vòng vài phút</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={32} />
            </div>
            <h3>Nội dung chất lượng</h3>
            <p>Hệ thống like/dislike giúp nội dung tốt nhất luôn được hiển thị ở đầu</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Globe size={32} />
            </div>
            <h3>Cộng đồng thân thiện</h3>
            <p>Kết nối với hàng trăm developer, chia sẻ kinh nghiệm và học hỏi lẫn nhau</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Sẵn sàng tham gia cộng đồng?</h2>
          <p>Đăng ký miễn phí và bắt đầu chia sẻ kiến thức ngay hôm nay</p>
          <div className="cta-buttons">
            {isAuthenticated ? (
              <button className="btn-cta" onClick={() => navigate('/questions')}>
                Khám phá bài viết
                <ArrowRight size={20} />
              </button>
            ) : (
              <>
                <button className="btn-cta" onClick={() => navigate('/register')}>
                  Đăng ký ngay
                  <ArrowRight size={20} />
                </button>
                <button className="btn-cta-outline" onClick={() => navigate('/questions')}>
                  Xem bài viết
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
