import { Router } from "express";
import {
  postTranscription,
  getTranscriptions,
} from "../controllers/transcriptionController.js";

const router = Router();
router.post("/", postTranscription);
router.get("/", getTranscriptions);

export default router;
