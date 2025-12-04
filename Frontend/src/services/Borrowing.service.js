import api from "./api.service";

class BorrowingService {
    // [POST] /api/borrowings
    /**
     * @param {string} bookId - ID của sách (Backend nhận BookId)
     * @param {string} readerId - ID của độc giả (Backend nhận ReaderId)
     */
    async createBorrowing(bookId, readerId) {
        return (await api.post('/api/borrowings', { 
            BookId: bookId,
            ReaderId: readerId
        })).data;
    }

    // [GET] /api/borrowings (Lấy danh sách đang mượn - Cho Admin hoặc Cá nhân)
    async getActiveBorrowings() {
        return (await api.get('/api/borrowings')).data;
    }

    // [PUT] /api/borrowings/return/:id (Trả sách)
    async returnBook(borrowingId) {
        return (await api.put(`/api/borrowings/return/${borrowingId}`)).data;
    }
    // [GET] Lấy tất cả (Dành cho Admin)
    async getAllBorrowings() {
        return (await api.get('/api/borrowings')).data;
    }

    // [GET] Lấy lịch sử cá nhân (Dành cho User)
    async getMyBorrowings() {
        return (await api.get('/api/borrowings/my-history')).data;
    }

    // [PUT] Duyệt (Giữ nguyên)
    async approveBorrowing(id) {
        return (await api.put(`/api/borrowings/approve/${id}`)).data;
    }

    // [PUT] Từ chối (Thêm mới)
    async rejectBorrowing(id) {
        return (await api.put(`/api/borrowings/reject/${id}`)).data;
    }
}

export default new BorrowingService();