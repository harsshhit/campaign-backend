import { Request, Response } from "express";
import Account from "../models/Account";

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await Account.find({}, "_id name").sort({ name: 1 });
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({
      message: "Error fetching accounts",
      error: (error as Error).message,
    });
  }
};
