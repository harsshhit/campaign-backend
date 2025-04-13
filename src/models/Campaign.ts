import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  name: string;
  description: string;
  status: "active" | "inactive" | "deleted";
  leads: string[];
  accounts: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deleted"],
    default: "inactive",
  },
  leads: [
    {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^https:\/\/(www\.)?linkedin\.com\/.*$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid LinkedIn URL!`,
      },
    },
  ],
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Add index for faster queries
CampaignSchema.index({ status: 1 });

export default mongoose.model<ICampaign>("Campaign", CampaignSchema);
