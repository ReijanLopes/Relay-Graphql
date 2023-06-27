import { Schema, model } from "mongoose";

const taxSchema = new Schema({
  cet: { type: Number, default: 0 },
  type: { type: String, required: [true, "Type tax is required"] },
  value: { type: Number, default: 0 },
});

export default model("Tax", taxSchema);
