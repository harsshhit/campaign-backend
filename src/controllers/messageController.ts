import { Request, Response } from "express";
import OpenAI from "openai";
import { z } from "zod";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Input validation schema
const messageRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  job_title: z.string().min(1, "Job title is required").max(100),
  company: z.string().min(1, "Company is required").max(100),
  location: z.string().min(1, "Location is required").max(100),
  summary: z.string().max(500).optional(),
});

// TypeScript type for the request body
type MessageRequest = z.infer<typeof messageRequestSchema>;

// Default fallback message
const DEFAULT_MESSAGE =
  "Hi there! I noticed your impressive background in your industry. I'd love to connect and explore how our AI-powered outreach automation could help streamline your sales process.";

export const generateMessage = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = messageRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid request data",
        details: validationResult.error.issues,
      });
    }

    const profile: MessageRequest = validationResult.data;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not configured, returning default message");
      return res.json({ message: DEFAULT_MESSAGE });
    }

    try {
      const prompt = `Generate a personalized LinkedIn outreach message for ${
        profile.name
      }, who is a ${profile.job_title} at ${profile.company} in ${
        profile.location
      }. 
      ${profile.summary ? `Their summary: ${profile.summary}` : ""}
      
      The message should be:
      1. Professional and friendly
      2. Reference their role and company
      3. Suggest how Outflo can help automate their outreach to increase meetings & sales
      4. End with a call to connect
      5. Keep it under 200 characters`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        max_tokens: 150,
        temperature: 0.7,
      });

      const message = completion.choices[0].message.content || DEFAULT_MESSAGE;
      res.json({ message });
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      // Fallback to default message on OpenAI API error
      res.json({ message: DEFAULT_MESSAGE });
    }
  } catch (error) {
    console.error("Error generating message:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
