// backend/app/controllers/Publisher.controller.js

const PublisherService = require('../services/Publisher.service'); // Nhớ đổi tên file Service

// [GET] /api/publishers: Get all publishers
exports.getAllPublishers = async (req, res, next) => {
    try {
        const publishers = await PublisherService.getAllPublishers();
        res.status(200).json(publishers);
    } catch (error) {
        next(error);
    }
};

// [POST] /api/publishers: Create new publisher
exports.createPublisher = async (req, res, next) => {
    try {
        const newPublisher = await PublisherService.createPublisher(req.body);
        res.status(201).json({ 
            message: "Publisher created successfully.", 
            data: newPublisher 
        });
    } catch (error) {
        next(error);
    }
};

// [DELETE] /api/publishers/:id: Delete publisher
exports.deletePublisher = async (req, res, next) => {
    try {
        const result = await PublisherService.deletePublisher(req.params.id);
        res.status(200).json({
            message: "Publisher deleted successfully.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};