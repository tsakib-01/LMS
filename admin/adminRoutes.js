// routes/admin/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const auth = require('../../middleware/auth');   // middleware that attaches req.user
const role = require('../../middleware/role');   // role('admin') guard

// PUT /api/admin/assignstudent/:id
router.put('/assignstudent/:id', auth, role('admin'), adminController.assignStudentsToClass);

module.exports = router;
