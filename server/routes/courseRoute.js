import express from "express";
import {
  getAllCourse,
  getCourseId,
  getDemoCourses,
} from "../controllers/courseController.js";

const courseRouter = express.Router();

// Normal Routes
courseRouter.get("/all", getAllCourse);
courseRouter.get("/:id", getCourseId);

// Demo Routes (No Login Required)
courseRouter.get("/demo/all", getDemoCourses);

export default courseRouter;
