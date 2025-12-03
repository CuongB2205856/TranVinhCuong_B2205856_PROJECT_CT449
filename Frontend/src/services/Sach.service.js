// src/services/Book.Service.js
import api from "./api.service";

class BookService {
  // [PUBLIC] Lấy danh sách sách (cho độc giả)
  async getAllSach() {
    return (await api.get("/api/sach")).data;
  }

  // [PUBLIC] Lấy chi tiết sách
  async getBookById(id) {
    return (await api.get(`/api/sach/${id}`)).data;
  }

  // [ADMIN] Lấy tất cả sách (bao gồm sách hết hàng)
  async getAllBooksAdmin() {
    return (await api.get("/api/sach/all")).data;
  }

  // [ADMIN] Thêm sách mới
  async createBook(data) {
    return (await api.post("/api/sach", data)).data;
  }

  // [ADMIN] Cập nhật sách
  async updateBook(id, data) {
    return (await api.put(`/api/sach/${id}`, data)).data;
  }

  // [ADMIN] Xóa sách
  async deleteBook(id) {
    return (await api.delete(`/api/sach/${id}`)).data;
  }
}

export default new BookService();
