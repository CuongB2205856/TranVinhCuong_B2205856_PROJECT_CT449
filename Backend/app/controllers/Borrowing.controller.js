// backend/app/controllers/Borrowing.controller.js

const BorrowingService = require('../services/Borrowing.service'); // Nhớ đổi tên file Service

// [GET] /api/borrowings: Get active borrowings
exports.getActiveBorrowings = async (req, res, next) => {
    try {
        const activeList = await BorrowingService.getActiveBorrowings();
        res.status(200).json(activeList);
    } catch (error) {
        next(error);
    }
};

// [POST] /api/borrowings: Create borrowing record
exports.createBorrowing = async (req, res, next) => {
    try {
        const newRecord = await BorrowingService.createBorrowing(req.body);
        res.status(201).json({ 
            message: "Borrowing record created successfully.", 
            data: newRecord 
        });
    } catch (error) {
        next(error);
    }
};

// [PUT] /api/borrowings/return/:id: Return book (Update record)
exports.returnBook = async (req, res, next) => {
    try {
        const borrowingId = req.params.id;
        const updatedRecord = await BorrowingService.returnBook(borrowingId);
        
        res.status(200).json({ 
            message: "Book returned successfully. Inventory updated.", 
            data: updatedRecord 
        });
    } catch (error) {
        next(error);
    }
};