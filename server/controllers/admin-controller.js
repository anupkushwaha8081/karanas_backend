const Course = require('../models/Course');
const User = require('../models/User');

// Get all courses with instructor and student details
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
    //   .populate('instructor', 'name email')
      .populate('students', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message,
    });
  }
};



// const getAllCourses = async (req, res) => {
//   try {
//     const coursesList = await Course.find({});

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



// Get course statistics


const getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'user' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });

    // Get courses with enrollment counts
    const courses = await Course.aggregate([
      {
        $project: {
          title: 1,
          studentsCount: { $size: '$students' },
        },
      },
      { $sort: { studentsCount: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        totalInstructors,
        popularCourses: courses,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message,
    });
  }
};

// Get all users with filtering

// Get all users with filtering
// Get all users with filtering
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    
    const users = await User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

const courseApproved = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Toggle status between 'approved' and 'pending'
    course.status = course.status === 'approved' ? 'pending' : 'approved';
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.status === 'approved' ? 'approved' : 'unapproved'} successfully`,
      status: course.status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course status',
      error: error.message,
    });
  }
};


// const suspendUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     user.isActive = false;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "User suspended successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to suspend user",
//       error: error.message,
//     });
//   }
// };
const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle isActive
    user.isActive = !user.isActive;
    user.suspendedAt = user.isActive ? null : new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "suspended"} successfully`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};





// Export all functions
module.exports = {
  getAllCourses,
  getCourseStats,
  courseApproved,
  getAllUsers,
  suspendUser
};