import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import campaignRoutes from "./routes/campaignRoutes";
import accountRoutes from "./routes/accountRoutes";
import corsOptions from "./config/cors";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // JSON body parsing middleware
app.use(cors(corsOptions)); // Use the CORS middleware with the configured options

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/campaigns", campaignRoutes);
app.use("/api/accounts", accountRoutes);

// Health check endpoint (for simple health verification)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware (handles unhandled errors)
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

// Export the Express app for use in Vercel
export default app;

// Only listen if we're running directly (not through Vercel, as Vercel handles the process)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
