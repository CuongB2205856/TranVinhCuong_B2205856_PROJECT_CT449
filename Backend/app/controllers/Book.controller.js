// backend/app/controllers/Book.controller.js

const BookService = require('../services/Book.service'); // Nhớ đổi tên file Service

// [GET] /api/books: Get all books
exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await BookService.getAllBooks(req.query.name);
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

// [GET] /api/books/admin: Get all books (Admin view)
exports.getAllBooksAdmin = async (req, res, next) => { 
    try {
        const allBooks = await BookService.getAllBooksAdmin(); 
        res.status(200).json(allBooks);
    } catch (error) {
        next(error);
    }
};

// [GET] /api/books/:id: Get book by ID
exports.getBookById = async (req, res, next) => {
    try {
        const book = await BookService.getBookById(req.params.id);
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

// [POST] /api/books: Create new book
exports.createBook = async (req, res, next) => {
    try {
        const newBook = await BookService.createBook(req.body);
        res.status(201).json({ 
            message: "Book created successfully.", 
            data: newBook 
        });
    } catch (error) {
        next(error);
    }
};

// [PUT] /api/books/:id: Update book
exports.updateBook = async (req, res, next) => {
    try {
        const updatedBook = await BookService.updateBook(req.params.id, req.body);
        res.status(200).json({ 
            message: "Book updated successfully.", 
            data: updatedBook 
        });
    } catch (error) {
        next(error);
    }
};

// [DELETE] /api/books/:id: Delete book
exports.deleteBook = async (req, res, next) => {
    try {
        const result = await BookService.deleteBook(req.params.id);
        res.status(200).json({
            message: "Book deleted successfully.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};