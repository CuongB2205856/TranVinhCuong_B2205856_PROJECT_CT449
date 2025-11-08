// backend/app/routes/Theodoimuonsach.route.js

const express = require('express');
const router = express.Router();
const muonsachController = require('../controllers/Theodoimuonsach.controller');
const authMiddleware = require('../middlewares/auth');

router.post('/', 
    authMiddleware.protect, 
    muonsachController.createMuonSach
);

router.put('/tra/:id', 
    authMiddleware.protect, 
    muonsachController.traSach
);

module.exports = router;