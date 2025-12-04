// src/services/Publisher.service.js
import api from "./api.service";

class PublisherService {
  // [GET] Lấy tất cả
  async getAllPublishers() {
    return (await api.get("/api/publishers")).data;
  }

  // [POST] Thêm mới
  async createPublisher(data) {
    return (await api.post("/api/publishers", data)).data;
  }

  // [PUT] Cập nhật
  async updatePublisher(id, data) {
    return (await api.put(`/api/publishers/${id}`, data)).data;
  }

  // [DELETE] Xóa
  async deletePublisher(id) {
    return (await api.delete(`/api/publishers/${id}`)).data;
  }
}

export default new PublisherService();