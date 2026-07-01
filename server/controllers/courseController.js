import Course from "../models/Course.js";

// Get All Courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select("-courseContent -enrolledStudents")
      .populate("educator");

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Demo Courses (No Login Required)
export const getDemoCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .limit(10)
      .select("-courseContent")
      .populate("educator");

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get Course By Id
export const getCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    const courseData = await Course.findById(id).populate("educator");

    if (!courseData) {
      return res.json({
        success: false,
        message: "Course not found",
      });
    }

    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({
      success: true,
      courseData,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
