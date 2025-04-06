// // course-progress routes
// const express = require("express");
// const {
//   getCurrentCourseProgress,
//   markCurrentLectureAsViewed,
//   resetCurrentCourseProgress,
// } = require("../../controllers/student-controller/course-progress-controller");

// const {
//   getStudentViewCourseDetails,
//   getAllStudentViewCourses,
//   checkCoursePurchaseInfo,
// } = require("../../controllers/student-controller/course-controller");

// const {
//   createOrder,
//   capturePaymentAndFinalizeOrder,
// } = require("../../controllers/student-controller/order-controller");

// const {
//     getCoursesByStudentId,
//   } = require("../../controllers/student-controller/student-courses-controller");

// const router = express.Router();

// // Course Progress Routes
// router.get("/get/:userId/:courseId", getCurrentCourseProgress);
// router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
// router.post("/reset-progress", resetCurrentCourseProgress);

// //courses routes
// router.get("/get", getAllStudentViewCourses);
// router.get("/get/details/:id", getStudentViewCourseDetails);
// router.get("/purchase-info/:id/:studentId", checkCoursePurchaseInfo);

// //order routes
// router.post("/create", createOrder);
// router.post("/capture", capturePaymentAndFinalizeOrder);


// //student-courses-r
// router.get("/get/:studentId", getCoursesByStudentId);


// module.exports = router;



const express = require("express");
const {
  getCurrentCourseProgress,
  markCurrentLectureAsViewed,
  resetCurrentCourseProgress,
} = require("../controllers/student-controller");
const {
  getStudentViewCourseDetails,
  getAllStudentViewCourses,
  checkCoursePurchaseInfo,
} = require("../controllers/student-controller");
const {
  createOrder,
  capturePaymentAndFinalizeOrder,
} = require("../controllers/student-controller");
const {
  getCoursesByStudentId,
} = require("../controllers/student-controller");

const router = express.Router();

// Course Progress Routes
router.get("/course-progress/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/course-progress/mark-lecture-viewed", markCurrentLectureAsViewed);
router.post("/course-progress/reset-progress", resetCurrentCourseProgress);

// Course Routes
router.get("/courses/get", getAllStudentViewCourses);
router.get("/courses/details/:id", getStudentViewCourseDetails);
router.get("/courses/purchase-info/:id/:studentId", checkCoursePurchaseInfo);

// Order Routes
router.post("/order/create", createOrder);
router.post("/order/capture", capturePaymentAndFinalizeOrder);

// Student Courses Routes
router.get("/bought-courses/get/:studentId", getCoursesByStudentId);

module.exports = router;
