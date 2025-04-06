// const express = require("express");
// const {
//   addNewCourse,
//   getAllCourses,
//   getCourseDetailsByID,
//   updateCourseByID,
// } = require("../../controllers/instructor-controller/course-controller");

// const multer = require("multer");
// const {
//   uploadMediaToCloudinary,
//   deleteMediaFromCloudinary,
// } = require("../../helpers/cloudinary");

// const upload = multer({ dest: "uploads/" });

// const router = express.Router();
// //course routes
// router.post("/add", addNewCourse);
// router.get("/get", getAllCourses);
// router.get("/get/details/:id", getCourseDetailsByID);
// router.put("/update/:id", updateCourseByID);

// //media-routes
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const result = await uploadMediaToCloudinary(req.file.path);
//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (e) {
//     console.log(e);

//     res.status(500).json({ success: false, message: "Error uploading file" });
//   }
// });

// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Assest Id is required",
//       });
//     }

//     await deleteMediaFromCloudinary(id);

//     res.status(200).json({
//       success: true,
//       message: "Assest deleted successfully from cloudinary",
//     });
//   } catch (e) {
//     console.log(e);

//     res.status(500).json({ success: false, message: "Error deleting file" });
//   }
// });

// router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
//   try {
//     const uploadPromises = req.files.map((fileItem) =>
//       uploadMediaToCloudinary(fileItem.path)
//     );

//     const results = await Promise.all(uploadPromises);

//     res.status(200).json({
//       success: true,
//       data: results,
//     });
//   } catch (event) {
//     console.log(event);

//     res
//       .status(500)
//       .json({ success: false, message: "Error in bulk uploading files" });
//   }
// });

// module.exports = router;


const express = require("express");
const multer = require("multer");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  yourCoursesByInstructorID,
  updateCourseByID,
} = require("../controllers/instructor-controller");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../config/cloudinary");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Course Routes
router.post("/courses/add", addNewCourse);
router.get("/courses", getAllCourses);
router.get("/courses/:instructorId", yourCoursesByInstructorID);
router.get("/courses/details/:id", getCourseDetailsByID);
router.put("/courses/update/:id", updateCourseByID);

// Media Routes
router.post("/media/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMediaToCloudinary(req.file.path);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

router.delete("/media/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Asset ID is required",
      });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully from Cloudinary",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

router.post("/media/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error in bulk uploading files" });
  }
});

module.exports = router;
