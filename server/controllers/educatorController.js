import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

// ==============================
// Update Role To Educator
// ==============================
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth().userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({
      success: true,
      message: "You can publish a course now",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Add New Course
// ==============================
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;

    const educatorId = req.auth().userId;

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Thumbnail Not Attached",
      });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    res.json({
      success: true,
      message: "Course Added",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Educator Courses
// ==============================
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth().userId;

    const courses = await Course.find({ educator });

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

// ==============================
// Dashboard
// ==============================
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth().userId;

    const courses = await Course.find({ educator });

    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings,
        enrolledStudentsData,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Enrolled Students
// ==============================
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth().userId;

    const courses = await Course.find({ educator });

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// DEMO COURSES
// ==============================
export const demoCourses = async (req, res) => {
  try {
    const courses = await Course.find().limit(10);

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

// ==============================
// DEMO STUDENTS
// ==============================
export const demoStudents = async (req, res) => {
  try {
    const courses = await Course.find().limit(5);

    let students = [];

    courses.forEach((course) => {
      course.enrolledStudents.forEach((s, index) => {
        students.push({
          student: {
            name: `Student ${index + 1}`,
            imageUrl:
              "https://ui-avatars.com/api/?name=Student",
          },
          courseTitle: course.courseTitle,
          purchaseDate: new Date(),
        });
      });
    });

    res.json({
      success: true,
      enrolledStudents: students,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// DEMO DASHBOARD
// ==============================
export const demoDashboardData = async (req, res) => {
  try {
    const courses = await Course.find().limit(5);

    const totalCourses = courses.length;

    const enrolledStudentsData = [];

    courses.forEach((course) => {
      course.enrolledStudents.forEach((student, index) => {
        enrolledStudentsData.push({
          student: {
            name: `Student ${index + 1}`,
            imageUrl:
              "https://ui-avatars.com/api/?name=Student",
          },
          courseTitle: course.courseTitle,
        });
      });
    });

    res.json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings: 25480,

        enrolledStudentsData,

        earningsHistory: [
          { month: "Jan", earnings: 400 },
          { month: "Feb", earnings: 800 },
          { month: "Mar", earnings: 600 },
          { month: "Apr", earnings: 1200 },
        ],

        courseEnrollments: courses.map((course) => ({
          course: course.courseTitle,
          students: course.enrolledStudents.length,
        })),

        courseRevenue: courses.map((course) => ({
          course: course.courseTitle,
          revenue: Math.floor(Math.random() * 2000) + 500,
        })),
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// DEMO COURSE DETAILS
// ==============================

export const demoCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const courseData = await Course.findById(id);

    if (!courseData) {
      return res.json({
        success: false,
        message: "Course not found",
      });
    }

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
