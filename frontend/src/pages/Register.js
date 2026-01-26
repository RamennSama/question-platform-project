import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, UserPlus, Loader, Upload, X } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatarUrl: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData({
        ...formData,
        avatarUrl: base64String
      });
      setPreviewImage(base64String);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      avatarUrl: ''
    });
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    const result = await register(
      formData.firstName, 
      formData.lastName, 
      formData.email, 
      formData.password,
      formData.avatarUrl
    );
    
    if (result.success) {
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <UserPlus size={48} className="auth-icon" />
          <h1>Đăng ký</h1>
          <p>Tạo tài khoản mới để bắt đầu</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group avatar-upload-section">
            <label>
              <User size={18} />
              Ảnh đại diện (tùy chọn)
            </label>
            
            {!previewImage ? (
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="avatarInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="avatarInput" className="file-label">
                  <Upload size={32} />
                  <span>Tải lên ảnh đại diện</span>
                  <span className="file-hint">PNG, JPG hoặc GIF (Tối đa 2MB)</span>
                </label>
              </div>
            ) : (
              <div className="image-preview-wrapper">
                <img src={previewImage} alt="Avatar preview" className="avatar-preview" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn-remove-image"
                  title="Xóa ảnh"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              <User size={18} />
              Họ
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Nguyễn"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <User size={18} />
              Tên
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Văn A"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Mail size={18} />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader className="spin" size={18} />
                Đang xử lý...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Đăng ký
              </>
            )}
          </button>

          <div className="auth-footer">
            Đã có tài khoản?{' '}
            <Link to="/login">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
