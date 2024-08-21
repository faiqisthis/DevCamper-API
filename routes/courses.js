import express from "express";
import {
  getCourses,
  getCourseByID,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courses.js";

import {protect,authorize} from '../middleware/auth.js'
import Course from "../models/Courses.js";
import getAdvancedResults from "../middleware/advancedResults.js";

const router = express.Router({mergeParams : true});
router.get("/", getAdvancedResults(Course,{
   path:'bootcamp',
    select:'name description'
}),getCourses);
router.get("/:id", getCourseByID);
router.post("/",protect,authorize('publisher','admin'), createCourse);
router.delete("/:id",protect,authorize('publisher','admin'), deleteCourse);
router.put("/:id",protect,authorize('publisher','admin'), updateCourse);

export default router;
