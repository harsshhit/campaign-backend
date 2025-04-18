import mongoose, { Schema, Document } from "mongoose";

export interface IAccount extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAccount>("Account", AccountSchema);
