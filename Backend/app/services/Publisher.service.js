// backend/app/services/Publisher.service.js

const Publisher = require('../models/Publisher.model');
const Book = require('../models/Book.model'); // Cần kiểm tra ràng buộc

class PublisherService {
    // [CREATE] Create Publisher
    async createPublisher(data) {
        try {
            return await Publisher.create(data);
        } catch (error) {
            if (error.name === 'ValidationError' || error.code === 11000) {
                error.statusCode = 400; 
            }
            throw error;
        }
    }

    // [READ] Get all Publishers
    async getAllPublishers() {
        return Publisher.find({});
    }

    // [READ] Get Publisher by ID
    async getPublisherById(id) {
        const publisher = await Publisher.findById(id);
        if (!publisher) {
            const error = new Error(`Publisher not found with ID: ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return publisher;
    }

    async updatePublisher(id, data) {
        const updatedPublisher = await Publisher.findByIdAndUpdate(id, data, { new: true });
        if (!updatedPublisher) {
            const error = new Error(`Update failed: Publisher not found with ID ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return updatedPublisher;
    }

    // [DELETE] Delete Publisher
    async deletePublisher(id) {
        // Check constraints: Tìm sách có NXB.MaNXB trùng khớp
        const relatedBook = await Book.findOne({ 'NXB.MaNXB': id }); 
        
        if (relatedBook) {
            const error = new Error(`Cannot delete Publisher ${id} because it has related books: ${relatedBook.TenSach}`);
            error.statusCode = 409; // Conflict
            throw error;
        }
        
        const result = await Publisher.findByIdAndDelete(id);
        
        if (!result) {
            const error = new Error(`Delete failed: Publisher not found with ID ${id}`);
            error.statusCode = 404;
            throw error;
        }
        return { message: `Publisher with ID ${id} deleted successfully.` };
    }
}

module.exports = new PublisherService();