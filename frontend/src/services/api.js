import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getInfo: () => api.get('/auth/info'),
  getUserById: (userId) => api.get(`/users/${userId}`),
  updateAvatar: (avatarUrl) => api.put('/users/avatar', { avatarUrl }),
};

// Post APIs
export const postAPI = {
  getAllPosts: (page = 0, size = 10, sort = 'createAt') => 
    api.get(`/posts?page=${page}&size=${size}&sort=${sort}`),
  getPostBySlug: (slug) => api.get(`/posts/${slug}`),
  getPostsByUser: (userId, page = 0, size = 10) => 
    api.get(`/posts/user/${userId}?page=${page}&size=${size}`),
  createPost: (data) => api.post('/posts', data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  approvePost: (id) => api.put(`/posts/${id}/approve`),
  unpublishPost: (id) => api.put(`/posts/${id}/unpublish`),
  getPublicStats: () => api.get('/posts/stats/public'),
};

// Comment APIs
export const commentAPI = {
  getCommentsByPost: (slug) => api.get(`/posts/${slug}/comments`),
  createComment: (slug, content) => api.post(`/posts/${slug}/comments`, { content }),
  deleteComment: (postSlug, commentId) => api.delete(`/posts/${postSlug}/comments/${commentId}`),
};

// Tag APIs
export const tagAPI = {
  getAllTags: () => api.get('/tags'),
  createTag: (name) => api.post(`/tags?name=${name}`),
  deleteTag: (id) => api.delete(`/tags/${id}`),
};

// Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  promoteToAdmin: (userId) => api.put(`/admin/${userId}/role`),
  deleteUser: (userId) => api.delete(`/admin/${userId}`),
  getAllPostsForAdmin: (page = 0, size = 50) => api.get(`/posts/admin/all?page=${page}&size=${size}&sort=createAt`),
  getAllCommentsForAdmin: () => api.get('/admin/comments'),
};

// Post Interactions
export const postInteractionAPI = {
  likePost: (slug) => api.post(`/posts/${slug}/like`),
  dislikePost: (slug) => api.post(`/posts/${slug}/dislike`),
};

export default api;
