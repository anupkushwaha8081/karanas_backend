const express = require('express');
const { authenticate } = require('../middleware/auth-middleware');
// const { 
//   getAllCourses,
//   getCourseStats,
//   getAllUsers
//   // Add other admin controller functions as needed
// } = require('../controllers/admin-controller');
const {
  getAllCourses,
  getCourseStats,
  getAllUsers,
  courseApproved,
  suspendUser
} = require('../controllers/admin-controller');
const router = express.Router();

// Admin routes
router.get('/courses',  getAllCourses);
router.get('/stats', getCourseStats);
router.get('/users',   getAllUsers);
router.post('/courses/:courseId/approve', courseApproved);
router.put("/users/:userId/suspend", suspendUser);
// Add other admin routes as needed
module.exports = router;