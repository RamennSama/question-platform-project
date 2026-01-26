import React, { useState, useEffect } from 'react';
import { tagAPI } from '../services/api';
import { Tag, Plus, Trash2, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Tags.css';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ROLE_ADMIN');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await tagAPI.getAllTags();
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setSubmitting(true);
    try {
      await tagAPI.createTag(newTagName.trim());
      setNewTagName('');
      await fetchTags();
      alert('Tag đã được tạo thành công!');
    } catch (error) {
      alert('Không thể tạo tag: ' + (error.response?.data?.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTag = async (tagId, tagName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tag "${tagName}"?`)) {
      try {
        await tagAPI.deleteTag(tagId);
        await fetchTags();
        alert('Tag đã được xóa thành công!');
      } catch (error) {
        alert('Không thể xóa tag');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spin" size={48} />
        <p>Đang tải tags...</p>
      </div>
    );
  }

  return (
    <div className="tags-container">
      <div className="tags-content">
        <div className="tags-header">
          <h1>
            <Tag size={36} />
            Quản lý Tags
          </h1>
          <p>Tổng cộng {tags.length} tags</p>
        </div>

        {isAdmin && (
          <div className="create-tag-section">
            <h2>Tạo tag mới</h2>
            <form onSubmit={handleCreateTag} className="create-tag-form">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Nhập tên tag..."
                required
              />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader className="spin" size={18} />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Tạo tag
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="tags-grid">
          {tags.length === 0 ? (
            <p className="no-tags">Chưa có tag nào</p>
          ) : (
            tags.map((tag) => (
              <div key={tag.id} className="tag-card">
                <div className="tag-icon">
                  <Tag size={24} />
                </div>
                <h3>{tag.name}</h3>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteTag(tag.id, tag.name)}
                    className="btn-delete-tag"
                    title="Xóa tag"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tags;
