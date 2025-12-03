import api from "./api.service";

class BookService {
  // [PUBLIC] GET /api/books
  async getAllBooks(params) {
    return (await api.get("/api/books", { params })).data;
  }

  // [PUBLIC] GET /api/books/:id
  async getBookById(id) {
    return (await api.get(`/api/books/${id}`)).data;
  }

  // [ADMIN] GET /api/books/admin
  async getAllBooksAdmin() {
    return (await api.get("/api/books/admin")).data;
  }

  // [ADMIN] POST /api/books
  async createBook(data) {
    return (await api.post("/api/books", data)).data;
  }

  // [ADMIN] PUT /api/books/:id
  async updateBook(id, data) {
    return (await api.put(`/api/books/${id}`, data)).data;
  }

  // [ADMIN] DELETE /api/books/:id
  async deleteBook(id) {
    return (await api.delete(`/api/books/${id}`)).data;
  }
}

export default new BookService();