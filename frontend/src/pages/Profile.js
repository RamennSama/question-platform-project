import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { User, Mail, Calendar, Shield, Camera, Loader, Check, Upload, X } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await authAPI.getInfo();
      setUserInfo(response.data);
      setAvatarUrl(response.data.avatarUrl || '');
      setPreviewImage(response.data.avatarUrl || null);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('⚠️ Kích thước ảnh phải nhỏ hơn 2MB!');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('⚠️ Vui lòng chọn file ảnh!');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatarUrl(base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!avatarUrl.trim()) {
      alert('❌ Vui lòng chọn ảnh đại diện!');
      return;
    }

    setLoading(true);
    try {
      console.log('🔵 Sending avatar update request...');
      const response = await authAPI.updateAvatar(avatarUrl);
      console.log('✅ Response received:', response);
      console.log('✅ Response data:', response.data);
      
      setUserInfo(response.data);
      setUser(response.data);
      setIsEditing(false);
      alert('✅ Cập nhật ảnh đại diện thành công!');
      
      // Reload page to see the new avatar
      window.location.reload();
    } catch (error) {
      console.error('❌ Error updating avatar:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error message:', error.message);
      alert('❌ Không thể cập nhật ảnh đại diện! Chi tiết: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAvatarUrl(userInfo.avatarUrl || '');
    setPreviewImage(userInfo.avatarUrl || null);
  };

  if (!userInfo) {
    return (
      <div className="profile-loading">
        <Loader className="spin" size={48} />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  const isAdmin = userInfo.authorities?.some(a => a.authority === 'ROLE_ADMIN');

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-banner">
          <div className="banner-gradient"></div>
        </div>

        <div className="profile-content">
          <div className="avatar-section">
            <div className="avatar-wrapper">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Avatar" 
                  className="avatar-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="avatar-placeholder"
                style={{ display: previewImage ? 'none' : 'flex' }}
              >
                <User size={64} />
              </div>
              {!isEditing && (
                <button 
                  className="avatar-edit-btn"
                  onClick={() => setIsEditing(true)}
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera size={20} />
                </button>
              )}
            </div>

            <div className="profile-info-header">
              <h1>{userInfo.fullName}</h1>
              <p className="profile-email">{userInfo.email}</p>
              <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>
                <Shield size={16} />
                {isAdmin ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>

          {isEditing && (
            <div className="avatar-edit-section">
              <h3>
                <Upload size={20} />
                Thay đổi ảnh đại diện
              </h3>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="avatar-upload" className="file-label">
                  <Upload size={20} />
                  <span>Chọn ảnh từ máy tính</span>
                  <span className="file-hint">PNG, JPG hoặc GIF (tối đa 2MB)</span>
                </label>
              </div>
              <div className="avatar-buttons">
                <button 
                  onClick={handleUpdateAvatar} 
                  className="btn-save"
                  disabled={loading || !avatarUrl}
                >
                  {loading ? <Loader className="spin" size={18} /> : <Check size={18} />}
                  Lưu thay đổi
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="btn-cancel"
                >
                  <X size={18} />
                  Hủy
                </button>
              </div>
            </div>
          )}

          <div className="profile-details">
            <h3 className="details-title">Thông tin cá nhân</h3>
            
            <div className="detail-item">
              <div className="detail-icon">
                <User size={20} />
              </div>
              <div className="detail-content">
                <label>Họ và tên</label>
                <p>{userInfo.fullName}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Mail size={20} />
              </div>
              <div className="detail-content">
                <label>Email</label>
                <p>{userInfo.email}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Shield size={20} />
              </div>
              <div className="detail-content">
                <label>Vai trò</label>
                <p>{isAdmin ? 'Quản trị viên (Administrator)' : 'Người dùng (User)'}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Calendar size={20} />
              </div>
              <div className="detail-content">
                <label>Ngày tham gia</label>
                <p>{new Date(userInfo.createAt).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
