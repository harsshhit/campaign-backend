import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: "*", // Allow all origins for development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
