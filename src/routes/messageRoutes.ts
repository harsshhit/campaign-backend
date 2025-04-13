import express from "express";
import { generateMessage } from "../controllers/messageController";

const router = express.Router();

// Use root path since we're mounting at /personalized-message
router.post("/", generateMessage);

export default router;
