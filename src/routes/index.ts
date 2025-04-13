import express from "express";
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController";
import { generateMessage } from "../controllers/messageController";
import campaignRoutes from "./campaignRoutes";
import accountRoutes from "./accountRoutes";

const router = express.Router();

// Campaign routes
router.get("/campaigns", getCampaigns);
router.get("/campaigns/:id", getCampaign);
router.post("/campaigns", createCampaign);
router.put("/campaigns/:id", updateCampaign);
router.delete("/campaigns/:id", deleteCampaign);

// Message generation route
router.post("/personalized-message", generateMessage);

router.use("/campaigns", campaignRoutes);
router.use("/accounts", accountRoutes);

export default router;
