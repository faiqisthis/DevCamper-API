import express from "express";
import {
  getCourses,
  getCourseByID,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courses.js";

import {protect,authorize,authorizeOwnership} from '../middleware/auth.js'
import Course from "../models/Courses.js";
import getAdvancedResults from "../middleware/advancedResults.js";

const router = express.Router({mergeParams : true});
router.get("/", getAdvancedResults(Course,{
   path:'bootcamp',
    select:'name description'
}),getCourses);
router.get("/:id", getCourseByID);
router.post("/",protect,authorize('publisher','admin'),authorizeOwnership('Bootcamp'), createCourse);
router.delete("/:id",protect,authorize('publisher','admin'),authorizeOwnership('Course'), deleteCourse);
router.put("/:id",protect,authorize('publisher','admin'),authorizeOwnership('Course'), updateCourse);

export default router;
