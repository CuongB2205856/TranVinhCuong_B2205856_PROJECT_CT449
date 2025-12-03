// backend/app/services/Borrowing.service.js

const Borrowing = require('../models/Borrowing.model');
const Reader = require('../models/Reader.model');
const Book = require('../models/Book.model');

class BorrowingService {
    
    // [READ] Get active borrowings
    async getActiveBorrowings() {
        // Lấy danh sách chưa trả (NgayTra là null hoặc chưa set)
        return Borrowing.find({ NgayTra: null })
            .populate('ReaderId', 'HoLot Ten DienThoai') // Populate thông tin Reader
            .populate('BookId', 'TenSach TacGia');       // Populate thông tin Book
    }

    // [CREATE] Create Borrowing Record (Atomic update logic)
    async createBorrowing(data) {
        // data nhận vào có keys tiếng Anh: ReaderId, BookId...
        // Nhưng logic bên dưới cần map đúng field của Model
        const { ReaderId, BookId } = data;

        // 1. Validate
        const reader = await Reader.findById(ReaderId);
        const book = await Book.findById(BookId);

        if (!reader) 
            throw Object.assign(new Error("Reader ID not found."), { statusCode: 404 });
        if (!book) 
            throw Object.assign(new Error("Book ID not found."), { statusCode: 404 });
        
        // Kiểm tra số lượng (DB field: SoQuyen)
        if (book.SoQuyen <= 0) 
            throw Object.assign(new Error(`Book '${book.TenSach}' is out of stock.`), { statusCode: 400 });

        
        // 2. Logic giảm kho & tạo phiếu
        let isStockReduced = false;
        
        try {
            // A. Giảm kho (SoQuyen - 1)
            await Book.findByIdAndUpdate(
                BookId, 
                { $inc: { SoQuyen: -1 } }
            );
            isStockReduced = true;

            // B. Tạo phiếu mượn
            const newRecord = await Borrowing.create({ 
                ReaderId,      // Khớp Schema mới
                BookId,        // Khớp Schema mới
                NgayMuon: new Date() // Schema vẫn dùng NgayMuon
            });

            return newRecord; 
        } catch (error) {
            // C. Rollback nếu lỗi
            if (isStockReduced) {
                 await Book.findByIdAndUpdate(BookId, { $inc: { SoQuyen: 1 } }); 
            }
            throw Object.assign(new Error(`System Error: ${error.message}`), { statusCode: 500 });
        }
    }
    
    // [UPDATE] Return Book
    async returnBook(borrowingId) {
        const record = await Borrowing.findById(borrowingId);
        
        if (!record) {
             throw Object.assign(new Error("Borrowing record not found."), { statusCode: 404 });
        }

        if (record.NgayTra) {
             throw Object.assign(new Error("This book has already been returned."), { statusCode: 400 });
        }

        try {
            // Tăng kho (SoQuyen + 1)
            // Lưu ý: record.BookId chứa ID sách
            await Book.findByIdAndUpdate(record.BookId, { $inc: { SoQuyen: 1 } }); 

            // Cập nhật ngày trả
            record.NgayTra = new Date();
            await record.save();

            return record;
        } catch (error) {
            throw Object.assign(new Error("System Error while returning book."), { statusCode: 500 });
        }
    }
}

module.exports = new BorrowingService();