import { Schema, model } from "mongoose";

const taxSchema = new Schema({
  cet: { type: Number },
  type: { type: String, required: [true, "Type tax is required"] },
  value: { type: Number },
});

const Tax = model("Tax", taxSchema);

export default Tax;
