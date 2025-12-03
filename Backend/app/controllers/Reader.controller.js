// backend/app/controllers/Reader.controller.js

const ReaderService = require("../services/Reader.service");

// [GET] /api/readers: Get all readers
exports.getAllReaders = async (req, res, next) => {
  try {
    const readers = await ReaderService.getAllReaders(req.query.name);
    res.status(200).json(readers);
  } catch (error) {
    next(error);
  }
};

// [POST] /api/readers: Create new reader
exports.createReader = async (req, res, next) => {
  try {
    const newReader = await ReaderService.createReader(req.body);
    
    // Hide password before response
    if (newReader.Password) {
        newReader.Password = undefined; 
    }

    res.status(201).json({ 
        message: "Reader created successfully.", 
        data: newReader 
    });
  } catch (error) {
    next(error);
  }
};

// [GET] /api/readers/:id: Get reader by ID
exports.getReaderById = async (req, res, next) => {
  try {
    const reader = await ReaderService.getReaderById(req.params.id);
    res.status(200).json(reader);
  } catch (error) {
    next(error);
  }
};

// [PUT] /api/readers/:id: Update reader
exports.updateReader = async (req, res, next) => {
  try {
    const updatedReader = await ReaderService.updateReader(
      req.params.id,
      req.body
    );
    res.status(200).json({ 
        message: "Reader updated successfully.", 
        data: updatedReader 
    });
  } catch (error) {
    next(error);
  }
};

// [POST] /api/readers/login: Login
exports.login = async (req, res, next) => {
  try {
    const { Phone, Password } = req.body; // Đảm bảo Frontend gửi key là 'Phone' thay vì 'DienThoai'

    if (!Phone || !Password) {
      const error = new Error("Please provide Phone number and Password.");
      error.statusCode = 400;
      return next(error);
    }

    const { user, token } = await ReaderService.checkLogin(Phone, Password);

    res.status(200).json({
      status: "success",
      token,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};