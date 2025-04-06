const Course = require("../models/Course");
const StudentCourses = require("../models/StudentCourses");
const CourseProgress = require("../models/CourseProgress");
const paypal = require("../config/paypal");
const Order = require("../models/Order");

// const getAllStudentViewCourses = async (req, res) => {
//   try {
//     const {
//       category = [],
//       level = [],
//       primaryLanguage = [],
//       sortBy = "price-lowtohigh",
//     } = req.query;

//     console.log(req.query, "req.query");

//     let filters = {};
//     if (category.length) {
//       filters.category = { $in: category.split(",") };
//     }
//     if (level.length) {
//       filters.level = { $in: level.split(",") };
//     }
//     if (primaryLanguage.length) {
//       filters.primaryLanguage = { $in: primaryLanguage.split(",") };
//     }

//     let sortParam = {};
//     switch (sortBy) {
//       case "price-lowtohigh":
//         sortParam.pricing = 1;

//         break;
//       case "price-hightolow":
//         sortParam.pricing = -1;

//         break;
//       case "title-atoz":
//         sortParam.title = 1;

//         break;
//       case "title-ztoa":
//         sortParam.title = -1;

//         break;

//       default:
//         sortParam.pricing = 1;
//         break;
//     }

//     const coursesList = await Course.find(filters).sort(sortParam);

//     res.status(200).json({
//       success: true,
//       data: coursesList,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };
const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    let filters = {
      status: "approved", // ✅ Show only approved courses
    };

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;
      case "price-hightolow":
        sortParam.pricing = -1;
        break;
      case "title-atoz":
        sortParam.title = 1;
        break;
      case "title-ztoa":
        sortParam.title = -1;
        break;
      default:
        sortParam.pricing = 1;
        break;
    }

    const coursesList = await Course.find(filters).sort(sortParam);

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};




const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// const checkCoursePurchaseInfo = async (req, res) => {
//   try {
//     const { id, studentId } = req.params;
//     const studentCourses = await StudentCourses.findOne({
//       userId: studentId,
//     });

//     const ifStudentAlreadyBoughtCurrentCourse =
//       studentCourses.courses.findIndex((item) => item.courseId === id) > -1;
//     res.status(200).json({
//       success: true,
//       data: ifStudentAlreadyBoughtCurrentCourse,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };
const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    console.log("id ;"+id);
    console.log("studentId ;"+studentId);
    
    // Fetch student courses from the database
    const studentCourses = await StudentCourses.findOne({ userId: studentId });

    if (!studentCourses) {
      // If no student courses are found, return an appropriate message
      return res.status(404).json({
        success: false,
        message: "Student courses not found.",
      });
    }

    // Check if the student has already purchased the current course
    const ifStudentAlreadyBoughtCurrentCourse =
      studentCourses.courses.findIndex((item) => item.courseId === id) > -1;

    return res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse, // Will be true if purchased, false otherwise
    });
  } catch (e) {
    console.log("Error in checkCoursePurchaseInfo:", e);
    return res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


// const checkCoursePurchaseInfo = async (req, res) => {
//   try {
//     const { id, studentId } = req.params;
//     console.log("Received Request -> Course ID:", id, "Student ID:", studentId);

//     // Fetch the course document that includes the student ID
//     const course = await Course.findOne({ _id: id, "students.studentId": studentId });

//     if (!course) {
//       console.log(`Student ${studentId} has NOT purchased course ${id}`);
//       return res.status(404).json({
//         success: false,
//         message: "Course not found or student has not purchased it!",
//       });
//     }

//     console.log(`Student ${studentId} has purchased course ${id}`);

//     res.status(200).json({
//       success: true,
//       data: true,
//     });

//   } catch (e) {
//     console.error("Error in checkCoursePurchaseInfo:", e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occurred!",
//     });
//   }
// };




//course-progress

//mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );

      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //check all the lectures are viewed or not
    const allLecturesViewed =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);

    if (allLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();

      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//get current course progress controller
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentPurchasedCourses = await StudentCourses.findOne({ userId });

    const isCurrentCoursePurchasedByCurrentUserOrNot =
      studentPurchasedCourses?.courses?.findIndex(
        (item) => item.courseId === courseId
      ) > -1;

    if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchased: false,
        },
        message: "You need to purchase this course to access it.",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lecturesProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

//reset course progress

const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


//order-controllers
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;
    console.log(req.body, "req.body");

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        // return_url: `${process.env.CLIENT_URL}/payment-return`,
        // cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
        // CLIENTS_URI
                return_url: `${process.env.CLIENTS_URI}/payment-return`,
        cancel_url: `${process.env.CLIENTS_URI}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: coursePricing,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: coursePricing.toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment!",
        });
      } else {
        const newlyCreatedCourseOrder = new Order({
          userId,
          userName,
          userEmail,
          orderStatus,
          paymentMethod,
          paymentStatus,
          orderDate,
          paymentId,
          payerId,
          instructorId,
          instructorName,
          courseImage,
          courseTitle,
          courseId,
          coursePricing,
        });

        await newlyCreatedCourseOrder.save();

        const approveUrl = paymentInfo.links.find(
          (link) => link.rel == "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          data: {
            approveUrl,
            orderId: newlyCreatedCourseOrder._id,
          },
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    await order.save();

    //update out student course model
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });

      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }

    //update the course schema students
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


//student-courses-controller.js

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
  //course-progress
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
  //order-controllers
  createOrder,
  capturePaymentAndFinalizeOrder,
  //student-courses-controller.js
  getCoursesByStudentId
};






// const express = require("express");
// const router = express.Router();

// const {
//   getCoursesByStudentId,
// } = require("../../controllers/student/getCoursesByStudentId");
// const {
//   markCurrentLectureAsViewed,
//   getCurrentCourseProgress,
//   resetCurrentCourseProgress,
// } = require("../../controllers/student/courseProgress");
// const {
//   getAllStudentViewCourses,
//   getStudentViewCourseDetails,
//   checkCoursePurchaseInfo,
// } = require("../../controllers/student/courses");
// const {
//   createOrder,
//   capturePaymentAndFinalizeOrder,
// } = require("../../controllers/student/orders");

// // Route to get all courses bought by a student
// router.get("/student/:studentId/courses", getCoursesByStudentId);

// // Routes related to course progress
// router.post("/progress/lecture/viewed", markCurrentLectureAsViewed);
// router.get("/progress/:userId/:courseId", getCurrentCourseProgress);
// router.post("/progress/reset", resetCurrentCourseProgress);

// // Routes related to viewing and filtering courses
// router.get("/courses", getAllStudentViewCourses);
// router.get("/courses/:id", getStudentViewCourseDetails);
// router.get("/courses/:id/purchase/:studentId", checkCoursePurchaseInfo);

// // Routes related to order and payment
// router.post("/orders", createOrder);
// router.post("/orders/confirm", capturePaymentAndFinalizeOrder);

// module.exports = router;
