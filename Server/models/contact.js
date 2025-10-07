import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: Number,
  company: String,
  message: String,
  submittedAt: { type: Date, default: Date.now }
});

export const Contact = mongoose.model("Contact", contactSchema);
