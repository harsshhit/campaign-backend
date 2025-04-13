import { Request, Response } from "express";
import Campaign, { ICampaign } from "../models/Campaign";
import mongoose from "mongoose";

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    // Only return ACTIVE and INACTIVE campaigns
    const campaigns = await Campaign.find({
      status: { $in: ["active", "inactive"] }
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign || campaign.status === "deleted") {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { name, description, status, leads, accounts } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required",
        details: {
          name: !name ? "Name is required" : undefined,
          description: !description ? "Description is required" : undefined,
        },
      });
    }

    // Validate leads array
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({
        message: "At least one lead is required",
        details: { leads: "Leads array must not be empty" },
      });
    }

    // Validate each lead URL
    for (const lead of leads) {
      if (!/^https:\/\/(www\.)?linkedin\.com\/.*$/.test(lead)) {
        return res.status(400).json({
          message: "Invalid LinkedIn URL in leads array",
          details: { invalidLead: lead },
        });
      }
    }

    // Validate accounts array
    if (!Array.isArray(accounts) || accounts.length === 0) {
      return res.status(400).json({
        message: "At least one account is required",
        details: { accounts: "Accounts array must not be empty" },
      });
    }

    // Validate each account ID
    for (const accountId of accounts) {
      if (!mongoose.Types.ObjectId.isValid(accountId)) {
        return res.status(400).json({
          message: "Invalid account ID in accounts array",
          details: { invalidAccountId: accountId },
        });
      }
    }

    // Validate status
    if (status && !["active", "inactive", "deleted"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
        details: { status },
      });
    }

    // Create the campaign
    const campaign = new Campaign({
      name: name.trim(),
      description: description.trim(),
      status: status || "inactive",
      leads: leads.map((lead) => lead.trim()),
      accounts,
    });

    // Save the campaign
    const savedCampaign = await campaign.save();

    // Return the saved campaign
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);

    if ((error as any).code === 11000) {
      return res.status(400).json({
        message: "Campaign name already exists",
        details: { name: req.body.name },
      });
    }

    if ((error as any).name === "ValidationError") {
      const validationErrors = Object.entries((error as any).errors).map(
        ([field, error]: [string, any]) => ({
          field,
          message: error.message,
        })
      );

      return res.status(400).json({
        message: "Validation error",
        details: validationErrors,
      });
    }

    res.status(500).json({
      message: "Error creating campaign",
      error: (error as Error).message,
    });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    // Validate account IDs if provided
    if (req.body.accounts) {
      for (const accountId of req.body.accounts) {
        if (!mongoose.Types.ObjectId.isValid(accountId)) {
          return res
            .status(400)
            .json({ message: `Invalid account ID: ${accountId}` });
        }
      }
    }

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!campaign || campaign.status === "deleted") {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json(campaign);
  } catch (error) {
    if ((error as any).code === 11000) {
      return res.status(400).json({ message: "Campaign name already exists" });
    }
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "deleted", updatedAt: new Date() },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
