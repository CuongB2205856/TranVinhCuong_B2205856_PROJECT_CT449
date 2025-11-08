const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; 
    
    res.status(statusCode).json({
        success: false,
        message: err.message || "Đã xảy ra lỗi trên Server.",
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy - ${req.originalUrl}`);
    error.statusCode = 404; // Gán statusCode để errorHandler bắt
    next(error); 
};

module.exports = { errorHandler, notFound };