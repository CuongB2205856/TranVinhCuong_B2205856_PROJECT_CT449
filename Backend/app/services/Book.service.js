// backend/app/services/Book.service.js

const Book = require('../models/Book.model'); // Import Model mới

class BookService {
    // [CREATE] Create book
    async createBook(data) {
        try {
            return await Book.create(data);
        } catch (error) {
            if (error.name === 'ValidationError' || error.code === 11000) {
                error.statusCode = 400;
            }
            throw error;
        }
    }

    // [READ] Get all books (Public - only available books)
    async getAllBooks(name) {
        // Query DB: SoQuyen > 0
        const filter = { SoQuyen: { $gt: 0 } };
        
        if (name) {
            // Query DB: TenSach
            filter.TenSach = { $regex: new RegExp(name), $options: "i" };
        }
        
        return Book.find(filter); 
    }

    // [READ] Get all books (Admin - all books)
    async getAllBooksAdmin() {
        return Book.find(); 
    }

    // [READ] Get book by ID
    async getBookById(id) {
        const book = await Book.findById(id);
        if (!book) {
            const error = new Error(`Book not found with ID: ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return book;
    }

    // [UPDATE] Update book
    async updateBook(id, updateData) {
        const updatedBook = await Book.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            const error = new Error(`Update failed: Book not found with ID ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return updatedBook;
    }

    // [DELETE] Delete book
    async deleteBook(id) {
        // Có thể thêm logic kiểm tra xem sách có đang được mượn không ở đây
        const result = await Book.findByIdAndDelete(id);
        if (!result) {
            const error = new Error(`Delete failed: Book not found with ID ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return { message: `Book with ID ${id} deleted successfully.` };
    }
}

module.exports = new BookService();