// backend/app/middlewares/error.js

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; 
    
    // Log lỗi ra console để debug (nếu cần)
    // console.error(err);

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error.",
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404; 
    next(error); 
};

module.exports = { errorHandler, notFound };