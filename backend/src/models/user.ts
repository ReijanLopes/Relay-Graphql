import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: [true, "Email already exists"],
    },
    cards: { type: [Schema.Types.ObjectId], ref: "Card" },
    debts: { type: [Schema.Types.ObjectId], ref: "Debt" },
  },
  { timestamps: true }
);
export default model("User", userSchema);
