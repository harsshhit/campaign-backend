import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignController";

const router = express.Router();

router.post("/", createCampaign);
router.get("/", getCampaigns);
router.get("/:id", getCampaign);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

export default router;
