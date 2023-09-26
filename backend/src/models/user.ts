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
    cashDesk: { type: Number, default: 0 },
    cards: { type: [Schema.Types.ObjectId], ref: "Card" },
    debts: { type: [Schema.Types.ObjectId], ref: "Debt" },
  },
  { timestamps: true }
);
const User = model("User", userSchema);
export default User;
