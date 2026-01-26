/*
 *  * @Author: ramennsama
 *  * @Date:   2026-01-25 20:30:50
 *  * @Last Modified by:   ramennsama
 *  * @Last Modified time: 2026-01-25 20:30:50
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI, tagAPI } from '../services/api';
import { PenSquare, Save, Loader, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagAPI.getAllTags();
      setAvailableTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert tag names to tag IDs
      const tagIds = formData.tags
        .map(tagName => availableTags.find(t => t.name === tagName)?.id)
        .filter(id => id !== undefined);
      
      const postData = {
        title: formData.title,
        content: formData.content,
        tagIds: tagIds
        // Không cần gửi published, backend tự động set = false
      };
      
      await postAPI.createPost(postData);
      alert('✅ Câu hỏi đã được đăng thành công!');
      navigate('/questions');
    } catch (error) {
      setError(error.response?.data?.message || 'Không thể tạo bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagName) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName]
    }));
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="create-post-container">
      <div className="create-post-content">
        <div className="create-post-header">
          <h1>
            <PenSquare size={32} />
            Đặt câu hỏi mới
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Tiêu đề câu hỏi</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập câu hỏi của bạn..."
              required
            />
          </div>

          <div className="form-group">
            <label>Nội dung</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              modules={modules}
              placeholder="Mô tả chi tiết câu hỏi của bạn..."
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-selector">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-option ${formData.tags.includes(tag.name) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag.name)}
                >
                  {tag.name}
                  {formData.tags.includes(tag.name) && <X size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="spin" size={18} />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Đăng câu hỏi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
