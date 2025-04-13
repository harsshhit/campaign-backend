import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

export const generateMessage = async (req: Request, res: Response) => {
  try {
    const profile: LinkedInProfile = req.body;

    const prompt = `Generate a personalized LinkedIn outreach message for ${profile.name}, who is a ${profile.job_title} at ${profile.company} in ${profile.location}. 
    Their summary: ${profile.summary}
    
    The message should be:
    1. Professional and friendly
    2. Reference their role and company
    3. Suggest a value proposition about how Outflo can help them
    4. End with a call to connect
    5. Keep it under 200 characters`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const message = completion.choices[0].message.content;

    res.json({ message });
  } catch (error) {
    res.status(500).json({ message: "Error generating message", error });
  }
};
