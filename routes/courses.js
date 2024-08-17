import express from "express";
import {
  getCourses,
  getCourseByID,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courses.js";

import Course from "../models/Courses.js";
import getAdvancedResults from "../middleware/advancedResults.js";

const router = express.Router({mergeParams : true});
router.get("/", getAdvancedResults(Course,{
   path:'bootcamp',
    select:'name description'
}),getCourses);
router.get("/:id", getCourseByID);
router.post("/", createCourse);
router.delete("/:id", deleteCourse);
router.put("/:id", updateCourse);

export default router;
