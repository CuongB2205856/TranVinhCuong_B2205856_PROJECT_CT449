import api from "./api.service"; // Sử dụng Axios Instance đã cấu hình

class BookService {
  // Endpoint: GET /api/sach (Lấy danh sách sách còn trong kho)
  async getAllSach() {
    try {
      // Gọi endpoint đã định nghĩa trong Backend
      const response = await api.get("/api/sach");
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }
  async getBookById(id) {
    try {
      const response = await api.get(`/api/sach/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      throw error;
    }
  }

  // Bạn có thể thêm các hàm khác như getBookById, updateBook, v.v. ở đây
}

export default new BookService();
