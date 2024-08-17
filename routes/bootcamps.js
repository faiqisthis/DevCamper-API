import express from "express";
import courseRouter from "./courses.js";
import {
  getBootcamps,
  getBootcampByID,
  addBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcampImage
} from "../controllers/bootcamps.js";

import Bootcamp from "../models/Bootcamps.js";
import getAdvancedResults from "../middleware/advancedResults.js";

const router = express.Router();
router.use("/:bootcampId/courses", courseRouter);

router.get("/", getAdvancedResults(Bootcamp, "courses"), getBootcamps);

router.get("/:id", getBootcampByID);

router.post("/", addBootcamp);

router.put("/:id", updateBootcamp);

router.delete("/:id", deleteBootcamp);
router.put('/:id/photo',uploadBootcampImage);


export default router;
