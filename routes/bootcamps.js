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
import {protect,authorize, authorizeOwnership} from '../middleware/auth.js'

import Bootcamp from "../models/Bootcamps.js";
import getAdvancedResults from "../middleware/advancedResults.js";

const router = express.Router();
router.use("/:bootcampId/courses", courseRouter);

router.get("/", getAdvancedResults(Bootcamp, "courses"), getBootcamps);

router.get("/:id", getBootcampByID);

router.post("/",protect,authorize('publisher','admin'),authorizeOwnership('Bootcamp'), addBootcamp);

router.put("/:id",protect,authorize('publisher','admin'),authorizeOwnership('Bootcamp'), updateBootcamp);

router.delete("/:id",protect,authorize('publisher','admin'),authorizeOwnership('Bootcamp'), deleteBootcamp);
router.put('/:id/photo',protect,authorize('publisher','admin'),authorizeOwnership('Bootcamp'),uploadBootcampImage);


export default router;
