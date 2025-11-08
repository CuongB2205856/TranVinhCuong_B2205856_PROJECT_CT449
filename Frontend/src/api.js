// frontend/src/api.js
import axios from 'axios';

// baseURL là /api, sẽ được proxy chuyển tiếp đến http://localhost:3000
const apiClient = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const auth = {
  // Hàm đăng nhập
  login(msnv, password) {
    return apiClient.post('/nhanvien/login', { MSNV: msnv, Password: password });
  }
};

export const sach = {
  // Hàm lấy danh sách sách
  getAll() {
    return apiClient.get('/sach');
  }
};