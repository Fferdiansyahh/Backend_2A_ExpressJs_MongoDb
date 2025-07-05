const express = require("express");
const { protect } = require("../middleware/auth.middleware");

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");
const router = express.Router();

// router.use(protect);
router.get("/", getCourses);
router.get("/:id", getCourse);

router.post("/", protect, createCourse);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

module.exports = router;
